/**
 * Debug utility for checking FHE mode configuration
 * Run this in browser console to debug mode detection
 */

export function debugFHEMode() {
  console.log('🔍 FHE Mode Debug Information');
  console.log('=' .repeat(50));
  
  // Check environment variables
  const mockFromEnv = import.meta.env.VITE_CONTRACT_MOCK;
  const fheFromEnv = import.meta.env.VITE_FHEVM_ENABLED;
  const fheContractFromEnv = import.meta.env.VITE_CONTRACT_FHE;
  
  console.log('📋 Environment Variables:');
  console.log('  VITE_CONTRACT_MOCK:', mockFromEnv);
  console.log('  VITE_CONTRACT_FHE:', fheContractFromEnv);
  console.log('  VITE_FHEVM_ENABLED:', fheFromEnv);
  
  // Check imported values
  try {
    const contracts = require('../config/contracts');
    console.log('\n📦 Imported Contract Addresses:');
    console.log('  CONTRACT_ADDRESS_MOCK:', contracts.CONTRACT_ADDRESS_MOCK);
    console.log('  CONTRACT_ADDRESS_FHE:', contracts.CONTRACT_ADDRESS_FHE);
    console.log('  FHEVM_ENABLED_DEFAULT:', contracts.FHEVM_ENABLED_DEFAULT);
    
    // Check if FHE is available
    const { isFHEAvailable } = require('../hooks/useFHEMode');
    const available = isFHEAvailable();
    console.log('\n✅ FHE Available Check:');
    console.log('  isFHEAvailable():', available);
    console.log('  Reason:', 
      available 
        ? 'FHE contract address is configured' 
        : `FHE contract address is: ${contracts.CONTRACT_ADDRESS_FHE}`);
    
    // Check localStorage
    const stored = localStorage.getItem('fhevm_mode_preference');
    console.log('\n💾 localStorage:');
    console.log('  fhevm_mode_preference:', stored);
    
    // Check current mode
    const currentMode = contracts.getFHEMode();
    const currentAddress = contracts.getCurrentContractAddress();
    console.log('\n🎯 Current Runtime State:');
    console.log('  getFHEMode():', currentMode);
    console.log('  getCurrentContractAddress():', currentAddress);
    
  } catch (err) {
    console.error('❌ Error checking configuration:', err);
  }
  
  console.log('=' .repeat(50));
}

// Auto-run in development
if (import.meta.env.DEV) {
  // Only log once when module is loaded
  setTimeout(() => {
    debugFHEMode();
  }, 1000);
}

