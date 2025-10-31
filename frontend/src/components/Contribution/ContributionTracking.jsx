/**
 * Contribution Tracking Component
 * Radar chart showing personal vs total contribution
 */

import { useState, useEffect } from 'react';
import { Card, Space, Spin, Statistic, Button } from 'antd';
import { ReloadOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import ContributionRadar from './ContributionRadar';
import ContributionBar from './ContributionBar';
import { useWallet } from '../../contexts/WalletContext';
import { useSignalPool } from '../../hooks/useSignalPool';
import { ethers } from 'ethers';

export default function ContributionTracking() {
  const { account, isConnected } = useWallet();
  const { 
    getAllSignalIds, 
    getSignalCounter, 
    getContributorRevenue,
    getSignalMetadata,
    getAggregationCounter,
    readContract
  } = useSignalPool();
  
  const [loading, setLoading] = useState(false);
  const [personalData, setPersonalData] = useState({
    signalCount: 0,
    contributionPercentage: 0,
    revenue: 0,
  });
  const [totalData, setTotalData] = useState({
    signalCount: 0,
    totalRevenue: 0, // This is an estimate - we'd need to sum all contributor revenues
  });

  // Load contribution data
  useEffect(() => {
    if (isConnected && account) {
      loadContributionData();
    }
  }, [isConnected, account]);

  const loadContributionData = async () => {
    if (!isConnected || !account) {
      return;
    }

    setLoading(true);
    try {
      console.log('📊 Loading contribution data...');

      // 1. Get personal signal count
      let personalSignalCount = 0;
      if (getAllSignalIds) {
        const allSignalIds = await getAllSignalIds();
        console.log('📝 All signal IDs:', allSignalIds);
        
        // Count signals contributed by current user
        // Add delay between requests to avoid 429 Too Many Requests
        if (getSignalMetadata && allSignalIds.length > 0) {
          const userSignals = [];
          for (let i = 0; i < allSignalIds.length; i++) {
            const signalId = allSignalIds[i];
            try {
              const metadata = await getSignalMetadata(signalId);
              if (metadata.contributor.toLowerCase() === account.toLowerCase()) {
                userSignals.push(signalId);
              }
              
              // Add delay between requests to avoid rate limiting (429 errors)
              if (i < allSignalIds.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 200));
              }
            } catch (err) {
              // Handle 429 errors gracefully
              if (err.message?.includes('429') || err.message?.includes('Too Many Requests')) {
                console.warn(`⚠️ Rate limit hit for signal #${signalId}, waiting longer...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Retry once
                try {
                  const metadata = await getSignalMetadata(signalId);
                  if (metadata.contributor.toLowerCase() === account.toLowerCase()) {
                    userSignals.push(signalId);
                  }
                } catch (retryErr) {
                  console.warn(`⚠️ Retry failed for signal #${signalId}:`, retryErr.message);
                }
              } else {
                console.warn(`⚠️ Failed to get metadata for signal #${signalId}:`, err.message);
              }
            }
          }
          personalSignalCount = userSignals.length;
          console.log(`✅ User ${account} has ${personalSignalCount} signals:`, userSignals);
        }
      }

      // 2. Get total signal count
      let totalSignalCount = 0;
      if (getSignalCounter) {
        totalSignalCount = await getSignalCounter();
        console.log('📊 Total signals in pool:', totalSignalCount);
      }

      // 3. Get personal revenue
      let personalRevenue = 0;
      if (getContributorRevenue) {
        const revenue = await getContributorRevenue(account);
        personalRevenue = parseFloat(ethers.formatEther(revenue || '0'));
        console.log(`💰 User revenue: ${personalRevenue} ETH`);
      }

      // 4. Calculate contribution percentage
      const contributionPercentage = totalSignalCount > 0 
        ? (personalSignalCount / totalSignalCount) * 100 
        : 0;

      // 5. Get total revenue (estimate - sum of all aggregation revenues)
      // Note: This is an approximation. For exact total, we'd need to sum all aggregation.totalRevenue
      let totalRevenue = 0;
      if (getAggregationCounter && readContract) {
        try {
          const aggCounter = await getAggregationCounter();
          console.log(`📊 Found ${aggCounter} aggregations, calculating total revenue...`);
          
          let sumRevenue = BigInt(0);
          for (let i = 1; i <= aggCounter; i++) {
            try {
              const aggInfo = await readContract.aggregations(i);
              if (aggInfo && aggInfo.totalRevenue) {
                sumRevenue += BigInt(aggInfo.totalRevenue.toString());
              }
            } catch (err) {
              // Aggregation might not exist, skip
              continue;
            }
          }
          totalRevenue = parseFloat(ethers.formatEther(sumRevenue.toString()));
          console.log(`💰 Total revenue in pool: ${totalRevenue} ETH`);
        } catch (err) {
          console.warn('⚠️ Could not calculate total revenue:', err.message);
        }
      }

      // Update state
      setPersonalData({
        signalCount: personalSignalCount,
        contributionPercentage: contributionPercentage,
        revenue: personalRevenue,
        accuracy: 0, // Accuracy would require tracking signal outcomes - not implemented yet
      });

      setTotalData({
        signalCount: totalSignalCount,
        totalRevenue: totalRevenue,
      });

      console.log('✅ Contribution data loaded:', {
        personal: { signalCount: personalSignalCount, revenue: personalRevenue },
        total: { signalCount: totalSignalCount, totalRevenue: totalRevenue }
      });

    } catch (err) {
      console.error('❌ Error loading contribution data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      {/* Summary Statistics */}
      <Card>
        <Space size="large" wrap>
          <Statistic
            title="Your Signals"
            value={personalData.signalCount}
            prefix={<UserOutlined />}
            suffix={`/ ${totalData.signalCount} total`}
            valueStyle={{ color: '#722ed1' }}
          />
          <Statistic
            title="Contribution"
            value={personalData.contributionPercentage.toFixed(1)}
            suffix="%"
            valueStyle={{ color: '#52c41a' }}
          />
          <Statistic
            title="Your Revenue"
            value={personalData.revenue.toFixed(4)}
            suffix="ETH"
            prefix={<UserOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
          <Statistic
            title="Total Pool Revenue"
            value={totalData.totalRevenue.toFixed(4)}
            suffix="ETH"
            prefix={<TeamOutlined />}
          />
        </Space>
        <div style={{ marginTop: '16px' }}>
          <Button
            icon={<ReloadOutlined />}
            onClick={loadContributionData}
            loading={loading}
            disabled={!isConnected}
          >
            Refresh Data
          </Button>
        </div>
      </Card>

      {/* Charts */}
      {!isConnected ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            Please connect your wallet to view contribution data
          </div>
        </Card>
      ) : loading ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
            <p style={{ marginTop: '16px', color: '#999' }}>Loading contribution data...</p>
          </div>
        </Card>
      ) : (
        <>
          <Card title="📊 Contribution Analysis">
            <ContributionRadar personal={personalData} total={totalData} />
          </Card>

          <Card title="📈 Contribution Comparison">
            <ContributionBar personal={personalData} total={totalData} />
          </Card>
        </>
      )}
    </Space>
  );
}

