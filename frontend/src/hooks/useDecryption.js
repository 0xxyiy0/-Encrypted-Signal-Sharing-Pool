/**
 * Decryption Hook
 * Polls Gateway for decryption results
 * Reference: Manual Section 4 (Gateway Decryption Workflow)
 */

import { useState, useCallback, useEffect, useRef } from 'react';
// Dynamic import for @zama-fhe/relayer-sdk/web
import { ZAMA_GATEWAY_URL, ZAMA_CHAIN_ID } from '../config/contracts';
import { useWallet } from '../contexts/WalletContext';

export function useDecryption() {
  const { signer, provider } = useWallet();
  const [status, setStatus] = useState('idle'); // idle, polling, completed, failed
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const pollingRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  /**
   * Poll Gateway for decryption result
   * @param {string} encryptedValue - The encrypted value (bytes32)
   * @param {string} contractAddress - Contract address
   * @param {Object} options - Polling options
   */
  const pollDecryption = useCallback(async (
    encryptedValue,
    contractAddress,
    options = {}
  ) => {
    const {
      maxAttempts = 60,  // 5 minutes (60 * 5 seconds)
      interval = 5000,   // 5 seconds
      onProgress = null,
    } = options;

    if (!signer || !provider) {
      throw new Error('Wallet not connected');
    }

    setStatus('polling');
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      console.log('🔐 Starting Gateway polling...', {
        encryptedValue: encryptedValue.slice(0, 20) + '...',
        contractAddress,
        estimatedTime: `${(maxAttempts * interval) / 1000}秒`,
      });

      // Dynamically import SDK (web version)
      const sdkModule = await import('@zama-fhe/relayer-sdk/web');
      const { createInstance, SepoliaConfig } = sdkModule;
      
      // Create SDK instance for public decrypt
      // Note: SDK needs both provider and signer
      const instance = await createInstance(SepoliaConfig, { provider, signer });

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        // Update progress
        const percentage = Math.round((attempt / maxAttempts) * 100);
        setProgress(percentage);

        if (onProgress) {
          onProgress({ current: attempt, total: maxAttempts, percentage });
        }

        try {
          // Try to decrypt (public decrypt)
          // publicDecrypt expects an array of handles
          // Convert hex string to Uint8Array if needed
          const handleArray = typeof encryptedValue === 'string' 
            ? [encryptedValue]  // SDK may accept hex string directly
            : [encryptedValue];  // or Uint8Array
          
          const decryptedResults = await instance.publicDecrypt(handleArray);
          
          // publicDecrypt returns DecryptedResults with decoded values
          if (decryptedResults && decryptedResults.length > 0) {
            const result = decryptedResults[0]; // First decrypted value
            console.log(`✅ Decryption completed (attempt ${attempt}/${maxAttempts})`, result);
            setStatus('completed');
            setProgress(100);
            setResult(result);
            return { success: true, result, attempts: attempt };
          }

        } catch (decryptError) {
          // If decryption fails, it might not be ready yet - continue polling
          // 404 from Gateway means not ready, other errors should be logged
          if (decryptError.message?.includes('404') || decryptError.message?.includes('not found')) {
            if (attempt < maxAttempts) {
              console.log(`⏳ Attempt ${attempt}/${maxAttempts}: Gateway not ready yet...`);
            } else {
              throw new Error('Gateway decryption timeout - result not available yet');
            }
          } else {
            // Other errors - log and continue or throw based on attempt
            console.warn(`⚠️ Decryption attempt ${attempt} error:`, decryptError.message);
            if (attempt >= maxAttempts) {
              throw decryptError;
            }
          }
        }

        // Wait before next attempt
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, interval));
        }
      }

      // Timeout
      throw new Error(`Gateway polling timeout after ${maxAttempts} attempts (${(maxAttempts * interval) / 1000} seconds)`);

    } catch (err) {
      console.error('❌ Decryption polling failed:', err);
      setStatus('failed');
      setError(err.message);
      throw err;
    }
  }, [signer]);

  /**
   * Stop polling
   */
  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setStatus('idle');
    setProgress(0);
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    stopPolling();
    setStatus('idle');
    setProgress(0);
    setError(null);
    setResult(null);
  }, [stopPolling]);

  return {
    pollDecryption,
    stopPolling,
    reset,
    status,
    progress,
    error,
    result,
    isPolling: status === 'polling',
  };
}

