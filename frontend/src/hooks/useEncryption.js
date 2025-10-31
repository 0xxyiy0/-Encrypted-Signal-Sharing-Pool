/**
 * Encryption Hook
 * Uses @zama-fhe/relayer-sdk to encrypt signal values
 * Reference: Manual Section 3.5
 */

import { useState, useCallback } from 'react';
// ⚠️ Note: @zama-fhe/relayer-sdk v0.2.0 uses exports field
// Must import from '@zama-fhe/relayer-sdk/web' for browser environment
import { getCurrentContractAddress } from '../config/contracts';
import { useWallet } from '../contexts/WalletContext';

export function useEncryption() {
  const { signer, account, provider } = useWallet();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  /**
   * Create encrypted input for signal value
   * @param {number} value - Signal value to encrypt
   * @param {number} type - Signal type (0=Price, 1=Volatility, 2=Vote)
   * @returns {Promise<{encryptedValue: string, inputProof: string}>}
   */
  const encryptSignal = useCallback(async (value, type = 0) => {
    if (!signer || !account || !provider) {
      throw new Error('Wallet not connected');
    }

    const CONTRACT_ADDRESS = getCurrentContractAddress();
    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
      throw new Error('Contract address not configured');
    }

    setIsEncrypting(true);
    setError(null);
    setProgress(10);

    try {
      console.log('🔐 Starting encryption...', { value, type, contractAddress: CONTRACT_ADDRESS });

      // Step 1: Dynamically import SDK (web version)
      // Reference: Manual Section 3.5.2 - 直接使用 createEncryptedInput 函数
      setProgress(20);
      const sdkModule = await import('@zama-fhe/relayer-sdk/web');
      const { createEncryptedInput } = sdkModule;
      
      // Step 2: Create encrypted input directly
      // Reference: Manual Section 3.5.5 - createEncryptedInput(contractAddress, signerAddress)
      setProgress(30);
      console.log('🔧 Creating encrypted input with:', {
        contractAddress: CONTRACT_ADDRESS,
        signerAddress: account,
      });
      
      const input = createEncryptedInput(CONTRACT_ADDRESS, account);
      
      // Step 4: Add value (using add32 for uint32 signal values)
      // Note: Signal values are typically in uint32 range
      const valueBigInt = BigInt(value);
      input.add32(valueBigInt);
      console.log('✅ Value added to encryption input:', valueBigInt.toString());

      // Step 5: Encrypt and generate proof
      setProgress(60);
      const { handles, inputProof } = await input.encrypt();
      
      if (!handles || handles.length === 0) {
        throw new Error('Encryption failed: handles array is empty');
      }

      if (!inputProof) {
        throw new Error('Encryption failed: inputProof is missing');
      }

      // Convert Uint8Array to hex string (bytes32)
      // handles[0] is a Uint8Array (32 bytes for euint32)
      const handleBytes = handles[0];
      let encryptedValueHex = '0x';
      for (let i = 0; i < handleBytes.length; i++) {
        encryptedValueHex += handleBytes[i].toString(16).padStart(2, '0');
      }

      // Convert inputProof to hex string (bytes)
      let inputProofHex = '0x';
      for (let i = 0; i < inputProof.length; i++) {
        inputProofHex += inputProof[i].toString(16).padStart(2, '0');
      }

      setProgress(100);
      console.log('✅ Encryption successful:', {
        encryptedValue: encryptedValueHex.slice(0, 20) + '...',
        proofLength: inputProof.length,
      });

      return {
        encryptedValue: encryptedValueHex,  // bytes32 (externalEuint32)
        inputProof: inputProofHex,         // bytes (attestation)
      };

    } catch (err) {
      console.error('❌ Encryption error:', err);
      setError(err.message || 'Encryption failed');
      throw err;
    } finally {
      setIsEncrypting(false);
      setProgress(0);
    }
  }, [signer, account, provider]);

  /**
   * Encrypt multiple signals at once
   * @param {Array<{value: number, type: number}>} signals
   * @returns {Promise<Array<{encryptedValue: string, inputProof: string}>>}
   */
  const encryptSignals = useCallback(async (signals) => {
    if (!signer || !account || !provider) {
      throw new Error('Wallet not connected');
    }

    setIsEncrypting(true);
    setError(null);

    try {
      const results = [];
      const total = signals.length;

      for (let i = 0; i < signals.length; i++) {
        setProgress((i / total) * 100);
        console.log(`🔐 Encrypting signal ${i + 1}/${total}...`);
        
        const result = await encryptSignal(signals[i].value, signals[i].type);
        results.push(result);
        
        // Small delay to avoid overwhelming
        if (i < signals.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      setProgress(100);
      return results;

    } catch (err) {
      console.error('❌ Batch encryption error:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsEncrypting(false);
      setProgress(0);
    }
  }, [signer, account, provider, encryptSignal]);

  return {
    encryptSignal,
    encryptSignals,
    isEncrypting,
    error,
    progress,
  };
}

