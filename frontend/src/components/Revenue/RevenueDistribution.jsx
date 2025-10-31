/**
 * Revenue Distribution Component
 * Shows revenue breakdown and distribution
 */

import { useState, useEffect } from 'react';
import { Card, Statistic, Space, Button, Table, App, Select, Modal } from 'antd';
import { DollarOutlined, TrophyOutlined, ReloadOutlined } from '@ant-design/icons';
import { useWallet } from '../../contexts/WalletContext';
import { useSignalPool } from '../../hooks/useSignalPool';
import { ethers } from 'ethers';

const { Option } = Select;

export default function RevenueDistribution() {
  const { account, isConnected } = useWallet();
  const { message, modal } = App.useApp(); // Use App.useApp() for message and modal with context support
  const { getContributorRevenue, distributeRevenue, readContract, getAggregationCounter, loading } = useSignalPool();
  const [totalRevenue, setTotalRevenue] = useState('0');
  const [revenueHistory, setRevenueHistory] = useState([]);
  const [loadingRevenue, setLoadingRevenue] = useState(false);
  const [availableAggregations, setAvailableAggregations] = useState([]);
  const [aggregationInfo, setAggregationInfo] = useState({}); // { id: { revenue, distributed, etc } }
  const [selectedAggregation, setSelectedAggregation] = useState(null);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [loadingAggregationInfo, setLoadingAggregationInfo] = useState(false);

  // Load revenue data
  useEffect(() => {
    if (isConnected && account && getContributorRevenue) {
      loadRevenueData();
    }
  }, [isConnected, account, getContributorRevenue]);

  const loadRevenueData = async () => {
    if (!account || !getContributorRevenue) return;

    setLoadingRevenue(true);
    try {
      const revenue = await getContributorRevenue(account);
      setTotalRevenue(revenue);
      
      // TODO: Load actual revenue history from events
      // For now, we'll use mock data structure but prepare for real data
      console.log('✅ Loaded revenue:', revenue);
    } catch (err) {
      console.error('❌ Error loading revenue:', err);
      message.error('Failed to load revenue data');
    } finally {
      setLoadingRevenue(false);
    }
  };

  // Load aggregation info when modal opens
  const loadAggregationInfo = async (aggregationIds) => {
    if (!readContract || !aggregationIds || aggregationIds.length === 0) return;
    
    setLoadingAggregationInfo(true);
    const infoMap = {};
    
    try {
      for (const id of aggregationIds) {
        try {
          // Get aggregation info from contract (public mapping)
          const aggInfo = await readContract.aggregations(id);
          const totalRevenue = aggInfo.totalRevenue?.toString() || '0';
          const revenueDistributed = aggInfo.revenueDistributed || false;
          const revenueEth = parseFloat(ethers.formatEther(totalRevenue));
          
          infoMap[id] = {
            totalRevenue: revenueEth,
            revenueDistributed,
            canDistribute: revenueEth > 0 && !revenueDistributed,
          };
          
          console.log(`📊 Aggregation #${id} info:`, infoMap[id]);
        } catch (err) {
          console.warn(`⚠️ Failed to load info for aggregation #${id}:`, err.message);
          // Aggregation might not exist, mark as invalid
          infoMap[id] = {
            totalRevenue: 0,
            revenueDistributed: false,
            canDistribute: false,
            exists: false,
          };
        }
      }
      
      setAggregationInfo(infoMap);
    } catch (err) {
      console.error('❌ Error loading aggregation info:', err);
    } finally {
      setLoadingAggregationInfo(false);
    }
  };

  const handleWithdraw = async () => {
    if (!isConnected || !account) {
      message.error('Please connect your wallet first');
      return;
    }

    // Show modal to select aggregation
    setWithdrawModalVisible(true);
    
    // Get actual aggregation counter and load info for all existing aggregations
    try {
      if (getAggregationCounter) {
        const counter = await getAggregationCounter();
        console.log(`📊 Found ${counter} aggregations in contract`);
        
        if (counter > 0) {
          // Load info for all aggregations (from 1 to counter)
          const aggregationIds = [];
          for (let i = 1; i <= counter; i++) {
            aggregationIds.push(i);
          }
          await loadAggregationInfo(aggregationIds);
        } else {
          message.info('No aggregations found. Create some aggregations first!');
          setAggregationInfo({});
        }
      } else {
        // Fallback: load info for aggregations 1-20 if counter not available
        console.warn('⚠️ getAggregationCounter not available, using fallback (1-20)');
        const aggregationIds = Array.from({ length: 20 }, (_, i) => i + 1);
        await loadAggregationInfo(aggregationIds);
      }
    } catch (err) {
      console.error('❌ Error getting aggregation counter:', err);
      message.warning('Could not load aggregation counter. Using fallback list.');
      // Fallback: load info for aggregations 1-20
      const aggregationIds = Array.from({ length: 20 }, (_, i) => i + 1);
      await loadAggregationInfo(aggregationIds);
    }
  };

  const handleDistributeRevenue = async (aggregationId) => {
    if (!isConnected || !account || !aggregationId) {
      message.error('Missing required data');
      return;
    }

    if (!distributeRevenue) {
      message.error('distributeRevenue function not available');
      return;
    }

    try {
      const hideLoading = message.loading('Distributing revenue...', 0);
      
      console.log(`💰 Distributing revenue for aggregation #${aggregationId}...`);
      const { txHash, distributionDetails } = await distributeRevenue(aggregationId);
      
      hideLoading();
      
      // Close modal on success
      setWithdrawModalVisible(false);
      setSelectedAggregation(null);
      
      // Show detailed success message
      if (distributionDetails) {
        const totalAmount = parseFloat(ethers.formatEther(distributionDetails.totalAmount || '0'));
        const participantShare = parseFloat(ethers.formatEther(distributionDetails.participantShare || '0'));
        const platformFee = parseFloat(ethers.formatEther(distributionDetails.platformFee || '0'));
        
        console.log('📊 Distribution details:', {
          totalAmount,
          participantShare,
          platformFee,
          aggregationId,
        });
        
        if (totalAmount > 0) {
          message.success({
            content: `✅ Revenue distributed successfully! Total: ${totalAmount.toFixed(4)} ETH (Participants: ${participantShare.toFixed(4)} ETH, Platform: ${platformFee.toFixed(4)} ETH)`,
            duration: 8,
          });
        } else {
          // Show more prominent warning
          message.warning({
            content: `⚠️ Distribution completed for Aggregation #${aggregationId}, but it had no revenue (0 ETH). This aggregation was created without sending ETH. To generate revenue, create new aggregations and send ETH when creating them.`,
            duration: 10, // Show longer
          });
          
          // Also log to console for debugging
          console.warn('⚠️ Aggregation has no revenue:', {
            aggregationId,
            totalAmount,
            message: 'This aggregation was created with value: 0. Create new aggregations with ETH to generate revenue.',
          });
        }
      } else {
        message.success({
          content: `✅ Revenue distributed successfully! Transaction: ${txHash.slice(0, 10)}...`,
          duration: 6,
        });
      }
      
      // Reload revenue data after distribution
      setTimeout(() => {
        loadRevenueData();
      }, 2000);
      
    } catch (err) {
      console.error('❌ Error distributing revenue:', err);
      
      // Handle user rejection (error code 4001)
      if (err.code === 4001 || err.message?.includes('denied') || err.message?.includes('User rejected')) {
        message.warning({
          content: 'Transaction cancelled by user. If you want to distribute revenue, please approve the transaction in your wallet.',
          duration: 5,
        });
        return; // Don't show error, just return
      }
      
      // Show detailed error message for other errors
      let errorMsg = err.message || 'Unknown error';
      if (errorMsg.includes('Invalid aggregation')) {
        errorMsg = 'Invalid aggregation ID. The aggregation does not exist.';
      } else if (errorMsg.includes('Already distributed')) {
        errorMsg = 'Revenue for this aggregation has already been distributed.';
      } else if (errorMsg.includes('Aggregation not completed')) {
        errorMsg = 'Aggregation is not completed yet. Wait for completion before distributing revenue.';
      } else if (errorMsg.includes('no revenue')) {
        errorMsg = 'This aggregation has no revenue. Create aggregations with ETH (msg.value > 0) to generate revenue.';
      } else if (errorMsg.includes('execution reverted')) {
        // Extract the revert reason if possible
        const revertMatch = errorMsg.match(/execution reverted: (.+)/);
        if (revertMatch) {
          errorMsg = `Contract error: ${revertMatch[1]}`;
        } else {
          errorMsg = 'Contract execution failed. Please check if the aggregation is valid and has revenue.';
        }
      }
      
      message.error({
        content: `Failed to distribute revenue: ${errorMsg}`,
        duration: 6,
      });
    }
  };

  // Calculate display values
  const totalRevenueEth = parseFloat(ethers.formatEther(totalRevenue || '0'));
  const platformFee = totalRevenueEth * 0.05; // 5%
  const participantShare = totalRevenueEth - platformFee;

  // Mock history for now (will be replaced with real data)
  const mockHistory = [
    { id: 1, revenue: 0.04, timestamp: Date.now() - 86400000 },
    { id: 2, revenue: 0.03, timestamp: Date.now() - 172800000 },
    { id: 3, revenue: 0.05, timestamp: Date.now() - 259200000 },
  ];

  const columns = [
    {
      title: 'Signal ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value) => `${value.toFixed(4)} ETH`,
    },
    {
      title: 'Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => new Date(timestamp).toLocaleDateString(),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card>
        <Space size="large" wrap>
          <Statistic
            title="Total Revenue Earned"
            value={totalRevenueEth.toFixed(4)}
            prefix={<TrophyOutlined />}
            suffix="ETH"
            valueStyle={{ color: '#52c41a' }}
            loading={loadingRevenue}
          />
          <Statistic
            title="Participant Share"
            value={participantShare.toFixed(4)}
            prefix={<DollarOutlined />}
            suffix="ETH"
            loading={loadingRevenue}
          />
          <Statistic
            title="Platform Fee"
            value={platformFee.toFixed(4)}
            suffix="ETH"
            valueStyle={{ color: '#999' }}
            loading={loadingRevenue}
          />
        </Space>
        <div style={{ marginTop: '16px' }}>
          <Button
            icon={<ReloadOutlined />}
            onClick={loadRevenueData}
            loading={loadingRevenue}
            disabled={!isConnected}
          >
            Refresh Revenue
          </Button>
        </div>
      </Card>

      <Card
        title="Revenue History"
        extra={
          <Button 
            type="primary" 
            onClick={handleWithdraw}
            disabled={!isConnected || loadingRevenue || loading}
          >
            Distribute Revenue
          </Button>
        }
      >
        {!isConnected ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            Please connect your wallet to view revenue
          </div>
        ) : (
          <>
            {totalRevenueEth === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#999', marginBottom: '16px' }}>
                No revenue earned yet. Create aggregations with value to earn revenue!
              </div>
            ) : (
              <Table
                columns={columns}
                dataSource={mockHistory}
                rowKey="id"
                pagination={false}
                loading={loadingRevenue}
                style={{ marginBottom: '16px' }}
              />
            )}
            <div style={{ textAlign: 'center', padding: '16px', background: '#f5f5f5', borderRadius: '4px' }}>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                💡 <strong>Tip:</strong> Select an aggregation ID to distribute revenue. Revenue comes from aggregations that received ETH when created.
              </p>
            </div>
          </>
        )}
      </Card>

      {/* Distribute Revenue Modal */}
      <Modal
        title="Distribute Revenue"
        open={withdrawModalVisible}
        onOk={() => {
          if (selectedAggregation && selectedAggregation > 0) {
            handleDistributeRevenue(selectedAggregation);
            // Don't close modal immediately - let user see the transaction
            // setWithdrawModalVisible(false);
            // setSelectedAggregation(null);
          } else {
            message.warning('Please enter a valid aggregation ID');
          }
        }}
        onCancel={() => {
          setWithdrawModalVisible(false);
          setSelectedAggregation(null);
        }}
        okText="Distribute Revenue"
        cancelText="Cancel"
        okButtonProps={{ 
          loading: loading, 
          disabled: !selectedAggregation || 
                    selectedAggregation <= 0 || 
                    (aggregationInfo[selectedAggregation] && !aggregationInfo[selectedAggregation].canDistribute)
        }}
        width={500}
      >
        <div style={{ marginBottom: '16px' }}>
          <p style={{ marginBottom: '8px', fontWeight: 500 }}>Select aggregation to distribute revenue:</p>
          <Select
            showSearch
            placeholder={
              loadingAggregationInfo 
                ? "Loading aggregation info..." 
                : "Enter or select aggregation ID"
            }
            style={{ width: '100%' }}
            value={selectedAggregation}
            onChange={(value) => setSelectedAggregation(value)}
            filterOption={(input, option) =>
              (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
            }
            notFoundContent={loadingAggregationInfo ? "Loading..." : "No aggregations found"}
            disabled={loading || loadingAggregationInfo}
            loading={loadingAggregationInfo}
          >
            {/* Show all available aggregations with status */}
            {Object.keys(aggregationInfo).length > 0 ? (
              Object.keys(aggregationInfo)
                .map(id => parseInt(id))
                .sort((a, b) => a - b)
                .map(id => {
              const info = aggregationInfo[id];
              let label = `Aggregation #${id}`;
              let disabled = false;
              
              if (info) {
                if (info.revenueDistributed) {
                  label += ' (Already Distributed)';
                  disabled = true;
                } else if (info.totalRevenue > 0) {
                  label += ` (${info.totalRevenue.toFixed(4)} ETH available)`;
                } else {
                  label += ' (No revenue)';
                }
              }
              
              return (
                <Option 
                  key={id} 
                  value={id} 
                  label={label}
                  disabled={disabled}
                  style={{ color: disabled ? '#999' : info?.canDistribute ? '#52c41a' : 'inherit' }}
                >
                  {label}
                </Option>
              );
                })
            ) : (
              <Option value={0} disabled>
                {loadingAggregationInfo ? 'Loading...' : 'No aggregations found'}
              </Option>
            )}
          </Select>
          
          {/* Show info for selected aggregation */}
          {selectedAggregation && aggregationInfo[selectedAggregation] && (
            <div style={{ 
              marginTop: '12px', 
              padding: '8px', 
              background: aggregationInfo[selectedAggregation].canDistribute ? '#f6ffed' : '#fff7e6',
              border: `1px solid ${aggregationInfo[selectedAggregation].canDistribute ? '#b7eb8f' : '#ffe58f'}`,
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              {aggregationInfo[selectedAggregation].revenueDistributed ? (
                <span style={{ color: '#999' }}>❌ This aggregation's revenue has already been distributed.</span>
              ) : aggregationInfo[selectedAggregation].totalRevenue > 0 ? (
                <span style={{ color: '#52c41a' }}>
                  ✅ This aggregation has {aggregationInfo[selectedAggregation].totalRevenue.toFixed(4)} ETH available for distribution.
                </span>
              ) : (
                <span style={{ color: '#faad14' }}>
                  ⚠️ This aggregation has no revenue (0 ETH). It was created without sending ETH.
                </span>
              )}
            </div>
          )}
        </div>
        
        <div style={{ 
          padding: '12px', 
          background: '#f0f7ff', 
          borderRadius: '4px', 
          marginTop: '16px',
          border: '1px solid #d4edff'
        }}>
          <p style={{ margin: 0, color: '#1890ff', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>
            💡 What happens next:
          </p>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#666', fontSize: '12px' }}>
            <li>Revenue will be distributed to all contributors of this aggregation</li>
            <li>The transaction is safe and only calls the contract's distributeRevenue function</li>
            <li>Your wallet may show "Unknown transaction type" - this is normal for custom contracts</li>
            <li>Please approve the transaction in your wallet to proceed</li>
          </ul>
        </div>
        
        <div style={{ marginTop: '12px' }}>
          <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>
            ⚠️ <strong>Requirements:</strong> The aggregation must be completed and have revenue (ETH) to distribute.
          </p>
        </div>
      </Modal>
    </Space>
  );
}

