/**
 * Contract Configuration
 * Update these addresses after deploying contracts to Sepolia
 */

// Contract addresses (to be updated after deployment)
// ⚠️ Vite uses import.meta.env, not process.env
export const CONTRACT_ADDRESS_MOCK = import.meta.env.VITE_CONTRACT_MOCK || "0x0000000000000000000000000000000000000000";
export const CONTRACT_ADDRESS_FHE = import.meta.env.VITE_CONTRACT_FHE || "0x0000000000000000000000000000000000000000";

// Debug logging in development (commented out to reduce console noise)
// if (import.meta.env.DEV) {
//   console.log('📋 Contract Configuration:', {
//     VITE_CONTRACT_MOCK: import.meta.env.VITE_CONTRACT_MOCK,
//     VITE_CONTRACT_FHE: import.meta.env.VITE_CONTRACT_FHE,
//     CONTRACT_ADDRESS_MOCK,
//     CONTRACT_ADDRESS_FHE,
//     isFHEConfigured: CONTRACT_ADDRESS_FHE !== '0x0000000000000000000000000000000000',
//   });
// }

// Network configuration
export const SEPOLIA_CHAIN_ID = 11155111;
export const SEPOLIA_RPC_URL = import.meta.env.VITE_SEPOLIA_RPC_URL || "https://eth-sepolia.public.blastapi.io";

// Zama Gateway configuration
export const ZAMA_GATEWAY_URL = "https://gateway.sepolia.zama.ai";
export const ZAMA_CHAIN_ID = 11155111;

// Feature flags
// Note: This is the default from environment variable
// Runtime mode is managed by useFHEMode hook (see frontend/src/hooks/useFHEMode.js)
export const FHEVM_ENABLED_DEFAULT = import.meta.env.VITE_FHEVM_ENABLED === "true" || false;

/**
 * Get current FHE mode
 * This function should be used in components that need to know the current mode
 * For runtime switching, use useFHEMode hook instead
 */
export function getFHEMode() {
  // Check localStorage for user preference
  try {
    const stored = localStorage.getItem('fhevm_mode_preference');
    if (stored !== null) {
      return stored === 'true';
    }
  } catch (err) {
    // Ignore localStorage errors, fall back to default
  }
  return FHEVM_ENABLED_DEFAULT;
}

/**
 * Get current contract address based on runtime mode
 * This will check localStorage for user preference first
 */
export function getCurrentContractAddress() {
  const isFHE = getFHEMode();
  return isFHE ? CONTRACT_ADDRESS_FHE : CONTRACT_ADDRESS_MOCK;
}

// Current contract address (based on mode)
// For backward compatibility, use getCurrentContractAddress() in new code
export const CONTRACT_ADDRESS = getCurrentContractAddress();
export const FHEVM_ENABLED = getFHEMode(); // For backward compatibility

