/**
 * Signal Cards Component
 * Displays encrypted signal cards with lock icon
 */

import { useState, useEffect } from 'react';
import { Card, Tag, Space, Spin, Button, Empty } from 'antd';
import { LockOutlined, UserOutlined, ClockCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useWallet } from '../../contexts/WalletContext';
import { useSignalPool, SIGNAL_TYPE } from '../../hooks/useSignalPool';

const SIGNAL_TYPE_LABELS = {
  [SIGNAL_TYPE.PRICE_PREDICTION]: 'Price Prediction',
  [SIGNAL_TYPE.VOLATILITY_ESTIMATE]: 'Volatility Estimate',
  [SIGNAL_TYPE.BUY_SELL_VOTE]: 'Buy/Sell Vote',
};

const SIGNAL_TYPE_COLORS = {
  [SIGNAL_TYPE.PRICE_PREDICTION]: 'blue',
  [SIGNAL_TYPE.VOLATILITY_ESTIMATE]: 'orange',
  [SIGNAL_TYPE.BUY_SELL_VOTE]: 'green',
};

export default function SignalCards() {
  const { isConnected, account } = useWallet();
  const { getAllSignalIds, getSignalMetadata } = useSignalPool();
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load signals on mount and when connected
  useEffect(() => {
    if (isConnected && getAllSignalIds) {
      loadSignals();
    } else {
      setSignals([]);
    }
  }, [isConnected, getAllSignalIds]);

  const loadSignals = async () => {
    if (!getAllSignalIds || !getSignalMetadata) {
      return;
    }

    setLoading(true);
    try {
      console.log('📡 Loading signals for SignalCards...');
      const signalIds = await getAllSignalIds();
      console.log('✅ Fetched signal IDs:', signalIds);

      if (!signalIds || signalIds.length === 0) {
        setSignals([]);
        return;
      }

      // Load metadata for each signal
      // Add delay between requests to avoid 429 Too Many Requests
      const signalList = [];
      for (let i = 0; i < signalIds.length; i++) {
        const signalId = signalIds[i];
        try {
          const metadata = await getSignalMetadata(signalId);
          if (metadata && metadata.active) {
            signalList.push({
              id: Number(metadata.id.toString()),
              contributor: metadata.contributor,
              signalType: Number(metadata.signalType.toString()),
              timestamp: Number(metadata.timestamp.toString()) * 1000, // Convert to milliseconds
              weight: Number(metadata.weight.toString()),
              encrypted: true,
            });
          }
          
          // Add delay between requests to avoid rate limiting (429 errors)
          // Wait 200ms between requests to respect RPC rate limits
          if (i < signalIds.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        } catch (err) {
          // Handle 429 errors gracefully
          if (err.message?.includes('429') || err.message?.includes('Too Many Requests')) {
            console.warn(`⚠️ Rate limit hit for signal #${signalId}, waiting longer...`);
            // Wait longer on rate limit (1 second)
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Retry once
            try {
              const metadata = await getSignalMetadata(signalId);
              if (metadata && metadata.active) {
                signalList.push({
                  id: Number(metadata.id.toString()),
                  contributor: metadata.contributor,
                  signalType: Number(metadata.signalType.toString()),
                  timestamp: Number(metadata.timestamp.toString()) * 1000,
                  weight: Number(metadata.weight.toString()),
                  encrypted: true,
                });
              }
            } catch (retryErr) {
              console.warn(`⚠️ Retry failed for signal #${signalId}:`, retryErr.message);
            }
          } else {
            console.warn(`⚠️ Failed to load metadata for signal #${signalId}:`, err.message);
          }
          // Continue with other signals
        }
      }

      // Sort by timestamp (newest first)
      signalList.sort((a, b) => b.timestamp - a.timestamp);

      setSignals(signalList);
      console.log(`✅ Loaded ${signalList.length} signals for display`);
    } catch (err) {
      console.error('❌ Error loading signals:', err);
      setSignals([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatAddress = (address) => {
    if (!address) return 'Unknown';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isCurrentUserSignal = (contributor) => {
    return account && contributor.toLowerCase() === account.toLowerCase();
  };

  if (!isConnected) {
    return (
      <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
        Please connect your wallet to view encrypted signals
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" />
        <p style={{ marginTop: '16px', color: '#999' }}>Loading encrypted signals...</p>
      </div>
    );
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '14px', color: '#666' }}>
          Showing {signals.length} encrypted signal{signals.length !== 1 ? 's' : ''}
        </span>
        <Button
          icon={<ReloadOutlined />}
          onClick={loadSignals}
          loading={loading}
          size="small"
        >
          Refresh
        </Button>
      </div>

      {signals.length === 0 ? (
        <Empty
          description="No signals contributed yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <span style={{ color: '#999' }}>
            Start by contributing your first encrypted signal!
          </span>
        </Empty>
      ) : (
        signals.map(signal => {
          const signalTypeLabel = SIGNAL_TYPE_LABELS[signal.signalType] || `Type ${signal.signalType}`;
          const signalTypeColor = SIGNAL_TYPE_COLORS[signal.signalType] || 'default';
          const isOwner = isCurrentUserSignal(signal.contributor);

          return (
            <Card
              key={signal.id}
              style={{
                border: isOwner ? '2px solid #722ed1' : '1px solid #e8e8e8',
                borderRadius: '8px',
                backgroundColor: isOwner ? '#f9f0ff' : 'white',
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <LockOutlined style={{ fontSize: '24px', color: '#722ed1', marginRight: '8px' }} />
                    <strong>Signal #{signal.id}</strong>
                    <Tag color={signalTypeColor} style={{ marginLeft: '8px' }}>
                      {signalTypeLabel}
                    </Tag>
                    {isOwner && (
                      <Tag color="purple" style={{ marginLeft: '8px' }}>
                        Your Signal
                      </Tag>
                    )}
                  </div>
                  <div style={{ color: '#999', fontSize: '12px' }}>
                    <ClockCircleOutlined /> {formatTime(signal.timestamp)}
                  </div>
                </div>
                
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div>
                    <UserOutlined style={{ marginRight: '4px' }} />
                    <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                      {formatAddress(signal.contributor)}
                    </span>
                  </div>
                  <Tag color="default" style={{ fontSize: '11px' }}>
                    Weight: {signal.weight}
                  </Tag>
                </div>
                
                <div style={{ marginTop: '8px', color: '#722ed1', fontWeight: 'bold', fontSize: '14px' }}>
                  🔒 Encrypted (Value Hidden)
                </div>
              </Space>
            </Card>
          );
        })
      )}
    </Space>
  );
}

