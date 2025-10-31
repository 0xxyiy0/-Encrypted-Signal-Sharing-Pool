/**
 * FHE Mode Management Hook
 * Allows runtime switching between Mock and FHE modes
 * Uses localStorage to persist user preference
 * Reference: Manual Section 12.3 - 双合约架构设计
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { CONTRACT_ADDRESS_MOCK, CONTRACT_ADDRESS_FHE } from '../config/contracts';

const STORAGE_KEY = 'fhevm_mode_preference';
const DEFAULT_MODE = false; // Default to Mock mode

/**
 * Check if FHE mode is available
 * FHE mode is available when FHE contract address is configured
 */
export function isFHEAvailable() {
  const isAvailable = CONTRACT_ADDRESS_FHE && CONTRACT_ADDRESS_FHE !== '0x0000000000000000000000000000000000000000';
  
  // Debug logging (commented out to reduce console noise)
  // if (import.meta.env.DEV) {
  //   console.log('🔍 isFHEAvailable check:', {
  //     CONTRACT_ADDRESS_FHE,
  //     isValid: CONTRACT_ADDRESS_FHE !== '0x0000000000000000000000000000000000000000',
  //     isAvailable,
  //     fromEnv: import.meta.env.VITE_CONTRACT_FHE,
  //   });
  // }
  
  return isAvailable;
}

/**
 * Get FHE mode from localStorage
 */
function getStoredMode() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) {
      return DEFAULT_MODE;
    }
    return stored === 'true';
  } catch (err) {
    console.warn('⚠️ Failed to read FHE mode from localStorage:', err);
    return DEFAULT_MODE;
  }
}

/**
 * Save FHE mode to localStorage
 */
function saveModeToStorage(enabled) {
  try {
    localStorage.setItem(STORAGE_KEY, enabled.toString());
  } catch (err) {
    console.warn('⚠️ Failed to save FHE mode to localStorage:', err);
  }
}

/**
 * FHE Mode Management Hook
 * 
 * @returns {Object} {
 *   fheModeEnabled: boolean,
 *   isFHEAvailable: boolean,
 *   setFHEMode: (enabled: boolean) => void,
 *   toggleFHEMode: () => void
 * }
 */
export function useFHEMode() {
  const [fheModeEnabled, setFheModeEnabledState] = useState(() => {
    // Initialize from localStorage
    return getStoredMode();
  });

  // Check FHE availability (use useMemo to ensure it's calculated correctly)
  const isAvailable = useMemo(() => {
    const available = isFHEAvailable();
    // Debug logging (commented out to reduce console noise)
    // console.log('🔍 useFHEMode: isAvailable calculated:', available);
    return available;
  }, []); // Empty deps - CONTRACT_ADDRESS_FHE should be constant

  // Set FHE mode (with validation and persistence)
  const setFHEMode = useCallback((enabled) => {
    if (!isAvailable && enabled) {
      console.warn('⚠️ FHE mode is not available. FHE contract not deployed.');
      return false;
    }
    
    setFheModeEnabledState(enabled);
    saveModeToStorage(enabled);
    console.log(`✅ FHE mode ${enabled ? 'enabled' : 'disabled'}`);
    return true;
  }, [isAvailable]);

  // Toggle FHE mode
  const toggleFHEMode = useCallback(() => {
    const newMode = !fheModeEnabled;
    return setFHEMode(newMode);
  }, [fheModeEnabled, setFHEMode]);

  // Sync with localStorage on mount
  useEffect(() => {
    const stored = getStoredMode();
    if (stored !== fheModeEnabled) {
      setFheModeEnabledState(stored);
    }
  }, []);

  return {
    fheModeEnabled,
    isFHEAvailable: isAvailable,
    setFHEMode,
    toggleFHEMode,
  };
}

