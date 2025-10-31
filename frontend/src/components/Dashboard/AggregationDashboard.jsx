/**
 * Aggregation Dashboard Component
 * Displays aggregation results and charts
 */

import { useState, useEffect } from 'react';
import { Card, Button, Select, Space, App, Typography, Spin, InputNumber, Form } from 'antd';
import { PlusOutlined, ReloadOutlined, DollarOutlined } from '@ant-design/icons';
import AggregationChart from './AggregationChart';
import SignalCards from './SignalCards';
import DecryptionStatus from './DecryptionStatus';
import { useWallet } from '../../contexts/WalletContext';
import { useSignalPool, AGGREGATION_TYPE } from '../../hooks/useSignalPool';
import { useDecryption } from '../../hooks/useDecryption';
import { FHEVM_ENABLED } from '../../config/contracts';

const { Option } = Select;
const { Text } = Typography;

const AGGREGATION_TYPES = [
  { value: 0, label: 'Mean' },
  { value: 1, label: 'Weighted Mean' },
];

export default function AggregationDashboard() {
  const { isConnected, signer } = useWallet();
  const { message } = App.useApp(); // Use App.useApp() for message with context support
  const { 
    aggregateSignals, 
    getAggregationResult, 
    getAllSignalIds,
    getSignalMetadata,
    loading 
  } = useSignalPool();
  const { pollDecryption, status: decryptionStatus, progress: decryptionProgress } = useDecryption();
  const [aggregationType, setAggregationType] = useState(AGGREGATION_TYPE.MEAN);
  const [selectedSignals, setSelectedSignals] = useState([]);
  const [aggregations, setAggregations] = useState([]);
  const [availableSignals, setAvailableSignals] = useState([]);
  const [signalMetadata, setSignalMetadata] = useState({});
  const [loadingSignals, setLoadingSignals] = useState(false);
  const [recentAggregationId, setRecentAggregationId] = useState(null);
  const [revenueAmount, setRevenueAmount] = useState(0); // ETH amount to send as revenue

  // Load available signals on mount and when connected
  useEffect(() => {
    console.log('🔍 AggregationDashboard useEffect triggered:', {
      isConnected,
      getAllSignalIds: !!getAllSignalIds,
    });
    
    if (isConnected && getAllSignalIds) {
      console.log('🔄 Loading signals...');
      loadSignals();
    } else {
      console.log('⏸️ Cannot load signals:', { 
        isConnected, 
        getAllSignalIds: !!getAllSignalIds,
        reason: !isConnected ? 'Wallet not connected' : 'getAllSignalIds not available'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  const loadSignals = async () => {
    if (!getAllSignalIds) {
      console.error('❌ getAllSignalIds is not available');
      message.error('Signal loading function not available. Please refresh the page.');
      return;
    }

    setLoadingSignals(true);
    try {
      console.log('📡 Fetching signal IDs from contract...');
      const signalIds = await getAllSignalIds();
      console.log('✅ Fetched signal IDs:', signalIds);
      
      if (!signalIds || signalIds.length === 0) {
        console.warn('⚠️ No signals found');
        setAvailableSignals([]);
        setSignalMetadata({});
        message.info('No signals found. Contribute some signals first!');
        return;
      }

      setAvailableSignals(signalIds);
      
      // Load metadata for each signal
      // Add delay between requests to avoid 429 Too Many Requests
      console.log(`📝 Loading metadata for ${signalIds.length} signals...`);
      const metadataMap = {};
      for (let i = 0; i < signalIds.length; i++) {
        const id = signalIds[i];
        try {
          const metadata = await getSignalMetadata(id);
          metadataMap[id] = metadata;
          console.log(`✅ Loaded metadata for Signal #${id}:`, metadata);
          
          // Add delay between requests to avoid rate limiting (429 errors)
          // Wait 200ms between requests to respect RPC rate limits
          if (i < signalIds.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        } catch (err) {
          // Handle 429 errors gracefully
          if (err.message?.includes('429') || err.message?.includes('Too Many Requests')) {
            console.warn(`⚠️ Rate limit hit for signal #${id}, waiting longer...`);
            // Wait longer on rate limit (1 second)
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Retry once
            try {
              const metadata = await getSignalMetadata(id);
              metadataMap[id] = metadata;
              console.log(`✅ Retry successful for Signal #${id}:`, metadata);
            } catch (retryErr) {
              console.warn(`⚠️ Retry failed for signal #${id}:`, retryErr.message);
            }
          } else {
            console.warn(`⚠️ Failed to load metadata for signal ${id}:`, err.message);
          }
          // Continue with other signals
        }
      }
      
      setSignalMetadata(metadataMap);
      console.log('✅ Signal loading complete:', {
        signalCount: signalIds.length,
        metadataCount: Object.keys(metadataMap).length
      });
      
    } catch (err) {
      console.error('❌ Error loading signals:', err);
      message.error(`Failed to load signals: ${err.message}`);
      setAvailableSignals([]);
      setSignalMetadata({});
    } finally {
      setLoadingSignals(false);
    }
  };

  const handleCreateAggregation = async () => {
    if (!isConnected) {
      message.error('Please connect your wallet first');
      return;
    }

    if (selectedSignals.length === 0) {
      message.warning('Please select at least one signal');
      return;
    }

    try {
      message.loading('Creating aggregation...', 0);
      
      const { txHash, aggregationId } = await aggregateSignals(
        aggregationType,
        selectedSignals,
        revenueAmount // Pass ETH amount as revenue
      );

      message.destroy();
      setRecentAggregationId(aggregationId);
      
      // Show revenue info if provided
      if (revenueAmount > 0) {
        message.success({
          content: `✅ Aggregation #${aggregationId} created with ${revenueAmount} ETH revenue! You can distribute this revenue later.`,
          duration: 6,
        });
      } else {
        message.warning({
          content: `⚠️ Aggregation #${aggregationId} created without revenue. Add ETH amount when creating aggregations to generate distributable revenue.`,
          duration: 6,
        });
      }
      
      if (FHEVM_ENABLED) {
        // FHE mode: Start Gateway polling for decryption
        try {
          console.log(`🔐 FHE Mode: Starting Gateway polling for aggregation #${aggregationId}...`);
          
          message.info({
            content: `🔐 Aggregation #${aggregationId} created. Starting Gateway decryption polling...`,
            duration: 5,
          });
          
          // Start polling asynchronously (don't block UI)
          // Note: For FHE mode, we need to get the handle for the encryptedResult
          // The SDK should provide a method to get publicly decryptable handles
          // For now, we'll attempt to use the contract address and aggregationId
          
          // Alternative approach: Try to use SDK's method to get handle from contract storage
          // The handle might be retrievable via:
          // 1. instance.getPubliclyDecryptableHandle(contractAddress, aggregationId)
          // 2. Or by reading contract storage and using SDK to convert
          
          // Start polling in background
          const startPolling = async () => {
            try {
              // TODO: Get the actual handle for encryptedResult
              // For now, we'll use a workaround: try to get handle from SDK
              // or use contract storage slot if SDK provides that API
              
              // Attempt 1: Try using SDK instance to get handle
              // This is a placeholder - actual implementation depends on SDK API
              if (!signer) {
                throw new Error('Wallet not connected');
              }
              
              const sdkModule = await import('@zama-fhe/relayer-sdk/web');
              const { createInstance, SepoliaConfig } = sdkModule;
              
              const instance = await createInstance(SepoliaConfig, { signer });
              
              // TODO: Verify SDK API for getting handle
              // The handle for publicly decryptable values should be retrievable
              // Possible methods (need SDK documentation):
              // - instance.getPubliclyDecryptableHandle(contractAddress, fieldPath)
              // - instance.getHandle(contractAddress, aggregationId, 'encryptedResult')
              // - Or read from contract storage and use SDK to convert
              
              // For now, we'll show a message and log that this needs SDK API verification
              console.warn('⚠️ Gateway polling: SDK API for handle retrieval needs verification');
              console.warn('⚠️ Need to verify how to get handle for publicly decryptable encryptedResult');
              
              message.warning({
                content: `Aggregation #${aggregationId} created. Gateway decryption requires SDK API verification. The encrypted result is ready but handle retrieval needs implementation.`,
                duration: 10,
              });
              
              // Note: Once we have the handle, the polling would work like this:
              // const handle = await getHandleFromSDK(instance, CONTRACT_ADDRESS, aggregationId);
              // const { result } = await pollDecryption(handle, CONTRACT_ADDRESS, {
              //   onProgress: (progress) => {
              //     console.log(`Decryption progress: ${progress.percentage}%`);
              //   }
              // });
              // 
              // // Update aggregation in UI
              // const newAggregation = {
              //   id: aggregationId,
              //   type: aggregationType,
              //   aggType: aggregationType,
              //   signalIds: selectedSignals,
              //   result: result,
              //   timestamp: Date.now(),
              // };
              // setAggregations(prev => [...prev, newAggregation]);
              
            } catch (pollErr) {
              console.error('❌ Error in Gateway polling:', pollErr);
              message.error({
                content: `Gateway polling failed for aggregation #${aggregationId}: ${pollErr.message}`,
                duration: 6,
              });
            }
          };
          
          // Start polling asynchronously (don't await)
          startPolling().catch(err => {
            console.error('❌ Background polling error:', err);
          });
          
        } catch (err) {
          console.error('❌ Error starting Gateway polling:', err);
          message.warning('Aggregation created, but Gateway polling setup failed. You may need to manually decrypt later.');
        }
      } else {
        // Mock mode: Get result immediately
        try {
          console.log(`📊 Fetching aggregation result for ID: ${aggregationId}...`);
          const result = await getAggregationResult(aggregationId);
          console.log(`✅ Aggregation result:`, result);
          
          // Add to aggregations list
          // Note: Chart expects 'type' not 'aggType'
          const newAggregation = {
            id: aggregationId,
            type: aggregationType,  // Chart expects 'type'
            aggType: aggregationType,  // Keep for compatibility
            signalIds: selectedSignals,
            result: result,
            timestamp: Date.now(),
          };
          
          console.log('📝 Adding aggregation to list:', newAggregation);
              setAggregations(prev => {
                const updated = [...prev, newAggregation];
                console.log('✅ Updated aggregations list:', updated);
                return updated;
              });
              
              // Don't show duplicate success message if revenueAmount > 0
              if (revenueAmount === 0) {
                message.info(`Aggregation result: ${result}`);
              }
        } catch (err) {
          console.error('❌ Error getting aggregation result:', err);
          // Don't show duplicate warning if revenueAmount > 0
          if (revenueAmount === 0) {
            message.warning(`Aggregation created (ID: ${aggregationId}), but result not available: ${err.message}`);
          }
        }
      }
      
      // Reset revenue amount after successful creation
      setRevenueAmount(0);
      
    } catch (err) {
      message.destroy();
      console.error('Error creating aggregation:', err);
      message.error(`Failed to create aggregation: ${err.message}`);
    }
  };

  return (
    <div>
      {/* Control Panel */}
      <Card style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <strong>Create New Aggregation</strong>
          </div>
          
          <Space>
            <Select
              value={aggregationType}
              onChange={setAggregationType}
              style={{ width: 200 }}
            >
              <Option value={AGGREGATION_TYPE.MEAN}>Mean</Option>
              <Option value={AGGREGATION_TYPE.WEIGHTED_MEAN}>Weighted Mean</Option>
            </Select>

            <Select
              mode="multiple"
              placeholder={
                loadingSignals 
                  ? "Loading signals..." 
                  : availableSignals.length === 0 
                    ? "No signals available (click Refresh)"
                    : "Select signals"
              }
              value={selectedSignals}
              onChange={setSelectedSignals}
              style={{ width: 300 }}
              loading={loadingSignals}
              disabled={loadingSignals}
              notFoundContent={
                loadingSignals 
                  ? <Spin size="small" /> 
                  : availableSignals.length === 0 
                    ? "No signals found. Contribute signals first!"
                    : "No matching signals"
              }
            >
              {availableSignals.length > 0 ? (
                availableSignals.map((signalId) => {
                  const metadata = signalMetadata[signalId];
                  const label = metadata 
                    ? `Signal #${signalId} (Type: ${metadata.signalType}, Weight: ${metadata.weight})`
                    : `Signal #${signalId}`;
                  return (
                    <Option key={signalId} value={signalId}>
                      {label}
                    </Option>
                  );
                })
              ) : (
                !loadingSignals && (
                  <Option value={0} disabled>
                    No signals available
                  </Option>
                )
              )}
            </Select>

            <InputNumber
              prefix={<DollarOutlined />}
              placeholder="Revenue (ETH)"
              min={0}
              step={0.001}
              precision={4}
              value={revenueAmount}
              onChange={(value) => setRevenueAmount(value || 0)}
              style={{ width: 150 }}
              addonAfter="ETH"
              disabled={loading}
            />

            <Button
              icon={<ReloadOutlined />}
              onClick={loadSignals}
              loading={loadingSignals}
              disabled={!isConnected}
            >
              Refresh
            </Button>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateAggregation}
              loading={loading}
              disabled={!isConnected || loading}
            >
              Create Aggregation
            </Button>
          </Space>
        </Space>
      </Card>

      {/* Aggregation Chart */}
      <Card 
        title="📈 Aggregation Results" 
        style={{ marginBottom: '24px' }}
        extra={
          recentAggregationId && (
            <Text type="secondary">Latest: Aggregation #{recentAggregationId}</Text>
          )
        }
      >
        {aggregations.length > 0 ? (
          <AggregationChart aggregations={aggregations} />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            No aggregations yet. Create one above to see results.
          </div>
        )}
      </Card>

      {/* Decryption Status */}
      <Card title="🔐 Decryption Status" style={{ marginBottom: '24px' }}>
        <DecryptionStatus />
      </Card>

      {/* Signal Cards */}
      <Card title="🔒 Encrypted Signals">
        <SignalCards />
      </Card>
    </div>
  );
}

