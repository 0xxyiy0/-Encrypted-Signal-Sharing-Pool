/**
 * Signal Pool Hook
 * Handles all contract interactions for Signal Pool
 * Supports both Mock and FHE contracts
 */

import { useState, useCallback, useMemo } from 'react';
import { Contract, BrowserProvider, JsonRpcProvider, ethers } from 'ethers';
import { getCurrentContractAddress, SEPOLIA_RPC_URL } from '../config/contracts';
import { getContractABI } from '../config/abi';
import { useWallet } from '../contexts/WalletContext';
import { useEncryption } from './useEncryption';
import { useFHEMode } from './useFHEMode';

// Signal types (matching contract enum)
export const SIGNAL_TYPE = {
  PRICE_PREDICTION: 0,
  VOLATILITY_ESTIMATE: 1,
  BUY_SELL_VOTE: 2,
};

// Aggregation types
export const AGGREGATION_TYPE = {
  MEAN: 0,
  WEIGHTED_MEAN: 1,
};

export function useSignalPool() {
  const { account, provider, signer } = useWallet();
  const { fheModeEnabled } = useFHEMode();
  const { encryptSignal } = useEncryption();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get current contract address and mode (reacts to runtime changes)
  const CONTRACT_ADDRESS = getCurrentContractAddress();
  const FHEVM_ENABLED = fheModeEnabled;

  // Contract instance (read-only, uses public RPC)
  // Use dynamic ABI based on mode (Manual Section 12.3 A)
  const readContract = useMemo(() => {
    console.log('📋 Creating read contract:', {
      CONTRACT_ADDRESS,
      FHEVM_ENABLED,
      isValidAddress: CONTRACT_ADDRESS && CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
    });

    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
      console.error('❌ Contract address not configured! Please check frontend/.env.local');
      console.error('Expected: VITE_CONTRACT_MOCK=0xFcA70e08afb3E19d4B81F55b89f8900255DbfEC0');
      return null;
    }

    // Use public RPC for read operations (manual Section 6.4)
    // ✅ JsonRpcProvider for RPC URL strings (not BrowserProvider)
    const publicProvider = new JsonRpcProvider(SEPOLIA_RPC_URL);
    
    try {
      const abi = getContractABI(FHEVM_ENABLED);
      const contract = new Contract(CONTRACT_ADDRESS, abi, publicProvider);
      console.log('✅ Read contract created successfully');
      return contract;
    } catch (err) {
      console.error('❌ Failed to create read contract:', err);
      return null;
    }
  }, [CONTRACT_ADDRESS, FHEVM_ENABLED, SEPOLIA_RPC_URL]);

  // Write contract (with signer)
  // Use dynamic ABI based on mode (Manual Section 12.3 A)
  const getWriteContract = useCallback(async () => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }
    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
      throw new Error('Contract address not configured');
    }
      const abi = getContractABI(FHEVM_ENABLED);
      return new Contract(CONTRACT_ADDRESS, abi, signer);
  }, [signer, CONTRACT_ADDRESS, FHEVM_ENABLED]);

  /**
   * Wait for transaction confirmation (using public RPC)
   * Reference: Manual Section 6.3 - 使用公共 RPC 轮询
   * ⚠️ Must be defined before contributeSignal to avoid TDZ error
   */
  const waitForTransaction = useCallback(async (txHash, maxAttempts = 60) => {
    // Use public RPC instead of wallet provider (Manual Section 6.3)
    // ✅ JsonRpcProvider for RPC URL strings (not BrowserProvider)
    const publicProvider = new JsonRpcProvider(SEPOLIA_RPC_URL);
    
    console.log(`⏳ Polling transaction receipt (max ${maxAttempts} attempts, 2s interval)...`);
    
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const receipt = await publicProvider.getTransactionReceipt(txHash);
        if (receipt && receipt.blockNumber) {
          console.log(`✅ Transaction confirmed at block ${receipt.blockNumber} (attempt ${i + 1}/${maxAttempts})`);
          return receipt;
        }
      } catch (err) {
        // Ignore errors, continue polling
        if (i < maxAttempts - 1) {
          console.log(`⏳ Attempt ${i + 1}/${maxAttempts}: Transaction not confirmed yet...`);
        }
      }
      
      // Wait 2 seconds before next attempt
      if (i < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    throw new Error(`Transaction confirmation timeout after ${maxAttempts} attempts (${maxAttempts * 2} seconds)`);
  }, []);

  /**
   * Parse SignalContributed event from transaction receipt
   * Reference: Manual Section 6.3 - 解析事件
   * ⚠️ Must be defined before contributeSignal to avoid TDZ error
   */
  const parseSignalContributedEvent = useCallback((receipt, iface) => {
    if (!receipt || !receipt.logs || receipt.logs.length === 0) {
      throw new Error('Transaction receipt has no logs');
    }

    // Parse all logs to find SignalContributed event
    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog({ topics: log.topics, data: log.data });
        
        if (parsed && parsed.name === 'SignalContributed') {
          const signalId = Number(parsed.args.signalId.toString());
          console.log('📝 Parsed SignalContributed event:', {
            signalId,
            contributor: parsed.args.contributor,
            signalType: parsed.args.signalType.toString(),
            timestamp: parsed.args.timestamp.toString(),
          });
          return signalId;
        }
      } catch (err) {
        // This log doesn't match, continue to next
        continue;
      }
    }

    throw new Error('SignalContributed event not found in transaction receipt');
  }, []);

  /**
   * Parse AggregationRequested event from transaction receipt
   * Reference: Manual Section 6.3 - 解析事件
   * ⚠️ Must be defined before aggregateSignals to avoid TDZ error
   */
  const parseAggregationRequestedEvent = useCallback((receipt, iface) => {
    if (!receipt || !receipt.logs || receipt.logs.length === 0) {
      throw new Error('Transaction receipt has no logs');
    }

    // Parse all logs to find AggregationRequested event
    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog({ topics: log.topics, data: log.data });
        
        if (parsed && parsed.name === 'AggregationRequested') {
          const aggregationId = Number(parsed.args.aggregationId.toString());
          console.log('📝 Parsed AggregationRequested event:', {
            aggregationId,
            aggType: parsed.args.aggType.toString(),
            signalCount: parsed.args.signalCount.toString(),
          });
          return aggregationId;
        }
      } catch (err) {
        // This log doesn't match, continue to next
        continue;
      }
    }

    throw new Error('AggregationRequested event not found in transaction receipt');
  }, []);

  /**
   * Parse RevenueDistributed event from transaction receipt
   * Reference: Manual Section 6.3 - 解析事件
   * ⚠️ Must be defined before distributeRevenue to avoid TDZ error
   */
  const parseRevenueDistributedEvent = useCallback((receipt, iface) => {
    if (!receipt || !receipt.logs || receipt.logs.length === 0) {
      throw new Error('Transaction receipt has no logs');
    }

    // Parse all logs to find RevenueDistributed event
    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog({ topics: log.topics, data: log.data });
        
        if (parsed && parsed.name === 'RevenueDistributed') {
          const aggregationId = Number(parsed.args.aggregationId.toString());
          const totalAmount = parsed.args.totalAmount.toString();
          const platformFee = parsed.args.platformFee.toString();
          const participantShare = parsed.args.participantShare.toString();
          
          console.log('📝 Parsed RevenueDistributed event:', {
            aggregationId,
            totalAmount,
            platformFee,
            participantShare,
          });
          
          return {
            aggregationId,
            totalAmount,
            platformFee,
            participantShare,
          };
        }
      } catch (err) {
        // This log doesn't match, continue to next
        continue;
      }
    }

    throw new Error('RevenueDistributed event not found in transaction receipt');
  }, []);

  /**
   * Contribute a signal (encrypted or plaintext based on mode)
   */
  const contributeSignal = useCallback(async (signalType, value, weight = 1) => {
    if (!account || !signer) {
      throw new Error('Please connect your wallet first');
    }

    setLoading(true);
    setError(null);

    try {
      const contract = await getWriteContract();

      // Use window.ethereum.request for OKX compatibility (manual Section 6.2)
      const fromAddress = await signer.getAddress();

      if (FHEVM_ENABLED) {
        // FHE mode: encrypt first
        console.log('🔐 FHE Mode: Encrypting signal...');
        const { encryptedValue, inputProof } = await encryptSignal(value, signalType);

        // Call FHE contract with encrypted parameters
        console.log('📝 Calling FHE contract...');
        
        // Use specific function signature to avoid ambiguity
        const iface = contract.interface;
        const fheFunction = iface.getFunction('contributeSignal(uint8,bytes32,bytes,uint256)');
        const txData = iface.encodeFunctionData(fheFunction, [
          signalType,        // uint8
          encryptedValue,    // bytes32 (externalEuint32)
          inputProof,        // bytes
          weight,            // uint256
        ]);

        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: fromAddress,
            to: CONTRACT_ADDRESS,
            data: txData,
            value: '0x0',
          }],
        });

        console.log('✅ Transaction sent:', txHash);
        
        // Wait for confirmation using public RPC (Manual Section 6.3)
        console.log('⏳ Waiting for transaction confirmation...');
        const receipt = await waitForTransaction(txHash);
        console.log('✅ Transaction confirmed:', receipt.blockNumber);
        
        // Parse event to get signalId (Manual Section 6.3)
        const signalId = parseSignalContributedEvent(receipt, contract.interface);
        console.log('✅ Signal ID from event:', signalId);
        
        return { txHash, signalId };

      } else {
        // Mock mode: plaintext
        console.log('📝 Mock Mode: Contributing plaintext signal...');
        
        // Mock contract: contributeSignal(SignalType signalType, uint256 weight)
        // Use msg.value scaled down as the signal value
        // Use specific function signature to avoid ambiguity (Manual Section 12.3 A)
        const iface = contract.interface;
        const mockFunction = iface.getFunction('contributeSignal(uint8,uint256)');
        const txData = iface.encodeFunctionData(mockFunction, [
          signalType,
          weight,
        ]);

        // Scale value to wei (for msg.value)
        const valueWei = BigInt(value) * BigInt(10 ** 15); // Scale for msg.value
        
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: fromAddress,
            to: CONTRACT_ADDRESS,
            data: txData,
            value: '0x' + valueWei.toString(16), // Use value field to pass signal
          }],
        });

        console.log('✅ Transaction sent:', txHash);
        
        // Wait for confirmation using public RPC (Manual Section 6.3)
        console.log('⏳ Waiting for transaction confirmation...');
        const receipt = await waitForTransaction(txHash);
        console.log('✅ Transaction confirmed:', receipt.blockNumber);
        
        // Parse event to get signalId
        const signalId = parseSignalContributedEvent(receipt, iface);
        console.log('✅ Signal ID from event:', signalId);
        
        return { txHash, signalId };
      }

    } catch (err) {
      console.error('❌ Error contributing signal:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [account, signer, getWriteContract, encryptSignal, waitForTransaction, parseSignalContributedEvent]);

  /**
   * Create aggregation request
   * @param {number} aggType - Aggregation type
   * @param {number[]} signalIds - Array of signal IDs
   * @param {string|number} ethAmount - Optional: ETH amount to send as revenue (in ETH, not wei)
   */
  const aggregateSignals = useCallback(async (aggType, signalIds, ethAmount = 0) => {
    if (!account || !signer) {
      throw new Error('Please connect your wallet first');
    }

    setLoading(true);
    setError(null);

    try {
      const contract = await getWriteContract();
      const fromAddress = await signer.getAddress();

      const txData = contract.interface.encodeFunctionData('aggregateSignals', [
        aggType,
        signalIds,
      ]);

      // Convert ETH to wei if provided
      let valueHex = '0x0';
      if (ethAmount && parseFloat(ethAmount) > 0) {
        const valueWei = ethers.parseEther(ethAmount.toString());
        valueHex = '0x' + valueWei.toString(16);
        console.log(`💰 Sending ${ethAmount} ETH (${valueWei.toString()} wei) as revenue`);
      }

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: fromAddress,
          to: CONTRACT_ADDRESS,
          data: txData,
          value: valueHex,
        }],
      });

      console.log('✅ Aggregation transaction sent:', txHash);
      
      // Wait for confirmation using public RPC (Manual Section 6.3)
      console.log('⏳ Waiting for aggregation transaction confirmation...');
      const receipt = await waitForTransaction(txHash);
      console.log('✅ Aggregation transaction confirmed:', receipt.blockNumber);
      
      // Parse event to get aggregationId (Manual Section 6.3)
      const aggregationId = parseAggregationRequestedEvent(receipt, contract.interface);
      console.log('✅ Aggregation ID from event:', aggregationId);
      
      return { txHash, aggregationId };

    } catch (err) {
      console.error('❌ Error creating aggregation:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [account, signer, getWriteContract, waitForTransaction, parseAggregationRequestedEvent]);

  /**
   * Get signal metadata
   */
  const getSignalMetadata = useCallback(async (signalId) => {
    if (!readContract) {
      throw new Error('Contract not initialized');
    }

    try {
      const result = await readContract.getSignalMetadata(signalId);
      return {
        id: Number(result[0].toString()),
        contributor: result[1],
        signalType: Number(result[2].toString()),
        timestamp: Number(result[3].toString()),
        weight: Number(result[4].toString()),
        active: result[5],
      };
    } catch (err) {
      console.error('❌ Error getting signal metadata:', err);
      throw err;
    }
  }, [readContract]);

  /**
   * Get aggregation result
   */
  const getAggregationResult = useCallback(async (aggregationId) => {
    if (!readContract) {
      throw new Error('Contract not initialized');
    }

    try {
      const result = await readContract.getAggregationResult(aggregationId);
      return Number(result.toString());
    } catch (err) {
      console.error('❌ Error getting aggregation result:', err);
      throw err;
    }
  }, [readContract]);

  /**
   * Distribute revenue for an aggregation
   */
  const distributeRevenue = useCallback(async (aggregationId) => {
    if (!account || !signer) {
      throw new Error('Please connect your wallet first');
    }

    setLoading(true);
    setError(null);

    try {
      const contract = await getWriteContract();
      const fromAddress = await signer.getAddress();

      const txData = contract.interface.encodeFunctionData('distributeRevenue', [
        aggregationId,
      ]);

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: fromAddress,
          to: CONTRACT_ADDRESS,
          data: txData,
          value: '0x0',
        }],
      });

      console.log('✅ Revenue distribution transaction sent:', txHash);
      
      // Wait for confirmation using public RPC (Manual Section 6.3)
      console.log('⏳ Waiting for revenue distribution confirmation...');
      const receipt = await waitForTransaction(txHash);
      console.log('✅ Revenue distribution confirmed:', receipt.blockNumber);
      
      // Parse RevenueDistributed event to get distribution details (Manual Section 6.3)
      let distributionDetails = null;
      try {
        distributionDetails = parseRevenueDistributedEvent(receipt, contract.interface);
        console.log('✅ Revenue distribution details:', distributionDetails);
      } catch (err) {
        console.warn('⚠️ Could not parse RevenueDistributed event:', err.message);
        // Continue even if event parsing fails
      }
      
      return { txHash, receipt, distributionDetails };

    } catch (err) {
      console.error('❌ Error distributing revenue:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [account, signer, getWriteContract, waitForTransaction, parseRevenueDistributedEvent]);

  /**
   * Get contributor revenue
   */
  const getContributorRevenue = useCallback(async (contributorAddress = account) => {
    if (!readContract) {
      throw new Error('Contract not initialized');
    }
    if (!contributorAddress) {
      throw new Error('No address provided');
    }

    try {
      const revenue = await readContract.getContributorRevenue(contributorAddress);
      return revenue.toString(); // Keep as BigInt string for display
    } catch (err) {
      console.error('❌ Error getting contributor revenue:', err);
      throw err;
    }
  }, [readContract, account]);

  /**
   * Get signal counter (total number of signals)
   */
  const getSignalCounter = useCallback(async () => {
    if (!readContract) {
      throw new Error('Contract not initialized');
    }

    try {
      const counter = await readContract.signalCounter();
      return Number(counter.toString());
    } catch (err) {
      console.error('❌ Error getting signal counter:', err);
      throw err;
    }
  }, [readContract]);

  /**
   * Get aggregation counter (total number of aggregations)
   */
  const getAggregationCounter = useCallback(async () => {
    if (!readContract) {
      console.error('❌ getAggregationCounter: readContract is null');
      throw new Error('Contract not initialized');
    }

    try {
      console.log('📊 Getting aggregation counter...');
      const counter = await readContract.aggregationCounter();
      return Number(counter.toString());
    } catch (err) {
      console.error('❌ Error getting aggregation counter:', err);
      throw err;
    }
  }, [readContract]);

  /**
   * Get list of all signal IDs (from 1 to signalCounter)
   */
  const getAllSignalIds = useCallback(async () => {
    if (!readContract) {
      console.error('❌ getAllSignalIds: readContract is null');
      throw new Error('Contract not initialized');
    }

    try {
      console.log('📊 Getting signal counter...');
      const counter = await getSignalCounter();
      console.log('✅ Signal counter:', counter);
      
      if (counter === 0) {
        console.log('ℹ️ No signals in contract yet');
        return [];
      }

      const signalIds = [];
      
      // Fetch metadata for all signals to check if they exist and are active
      console.log(`🔍 Checking ${counter} signals...`);
      for (let i = 1; i <= counter; i++) {
        try {
          const metadata = await getSignalMetadata(i);
          if (metadata && metadata.active) {
            signalIds.push(i);
            console.log(`✅ Signal #${i} is active`);
          } else {
            console.log(`⏸️ Signal #${i} is inactive or null`);
          }
        } catch (err) {
          // Signal might not exist yet, skip it
          console.log(`⏭️ Signal #${i} doesn't exist or error:`, err.message);
          continue;
        }
      }
      
      console.log(`✅ Found ${signalIds.length} active signals:`, signalIds);
      return signalIds;
    } catch (err) {
      console.error('❌ Error getting all signal IDs:', err);
      throw err;
    }
  }, [readContract, getSignalCounter, getSignalMetadata]);

  /**
   * Get publicly decryptable handle for an aggregation
   * This is used in FHE mode to get the handle for Gateway polling
   * @param {number} aggregationId - Aggregation ID
   * @returns {Promise<string>} Handle (hex string) for publicDecrypt
   */
  const getPubliclyDecryptableHandle = useCallback(async (aggregationId) => {
    if (!FHEVM_ENABLED) {
      throw new Error('This function is only available in FHE mode');
    }
    
    // Note: The SDK should provide a method to get the handle for publicly decryptable values
    // For now, we'll use a workaround by calling the SDK instance
    // The actual implementation may vary based on SDK API
    
    try {
      // Dynamically import SDK
      const sdkModule = await import('@zama-fhe/relayer-sdk/web');
      const { createInstance, SepoliaConfig } = sdkModule;
      
      if (!signer) {
        throw new Error('Wallet not connected');
      }
      
      // Create SDK instance
      const instance = await createInstance(SepoliaConfig, { signer });
      
      // TODO: Implement handle retrieval
      // The SDK should provide a method like:
      // instance.getPubliclyDecryptableHandle(contractAddress, aggregationId, fieldName)
      // or similar API
      
      // For now, return a placeholder - this needs to be implemented based on actual SDK API
      console.warn('⚠️ getPubliclyDecryptableHandle: SDK API needs to be verified');
      
      // Alternative approach: The handle might be retrievable from contract storage
      // or through a contract function. We'll need to check the SDK documentation.
      
      throw new Error('Handle retrieval not yet implemented - SDK API needs verification');
      
    } catch (err) {
      console.error('❌ Error getting publicly decryptable handle:', err);
      throw err;
    }
  }, [FHEVM_ENABLED, signer]);

  return {
    // Write operations
    contributeSignal,
    aggregateSignals,
    distributeRevenue,
    
    // Read operations
    getSignalMetadata,
    getAggregationResult,
    getContributorRevenue,
    getSignalCounter,
    getAllSignalIds,
    getAggregationCounter,
    getPubliclyDecryptableHandle,
    
    // Utilities
    waitForTransaction,
    readContract,
    
    // State
    loading,
    error,
    isFHEMode: FHEVM_ENABLED,
  };
}

