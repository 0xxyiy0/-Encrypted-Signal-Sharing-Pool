/**
 * Quick test script to verify environment variables
 * Run this in browser console: import('./utils/testEnv.js').then(m => m.testEnv())
 */

export function testEnv() {
  console.log('🧪 Testing Environment Variables');
  console.log('=' .repeat(60));
  
  // Direct environment check
  console.log('\n1. Direct import.meta.env check:');
  console.log('   VITE_CONTRACT_MOCK:', import.meta.env.VITE_CONTRACT_MOCK);
  console.log('   VITE_CONTRACT_FHE:', import.meta.env.VITE_CONTRACT_FHE);
  console.log('   VITE_FHEVM_ENABLED:', import.meta.env.VITE_FHEVM_ENABLED);
  
  // Imported values
  import('../config/contracts.js').then(contracts => {
    console.log('\n2. Imported contract addresses:');
    console.log('   CONTRACT_ADDRESS_MOCK:', contracts.CONTRACT_ADDRESS_MOCK);
    console.log('   CONTRACT_ADDRESS_FHE:', contracts.CONTRACT_ADDRESS_FHE);
    console.log('   isFHEConfigured:', contracts.CONTRACT_ADDRESS_FHE !== '0x0000000000000000000000000000000000000000');
    
    // Test isFHEAvailable
    import('../hooks/useFHEMode.js').then(hooks => {
      const available = hooks.isFHEAvailable();
      console.log('\n3. isFHEAvailable() result:');
      console.log('   Result:', available);
      console.log('   Expected: true (if FHE contract is configured)');
      
      console.log('\n' + '=' .repeat(60));
      if (available) {
        console.log('✅ FHE mode should be available! Switch should be enabled.');
      } else {
        console.log('❌ FHE mode not available. Check:');
        console.log('   1. Is VITE_CONTRACT_FHE set in .env.local?');
        console.log('   2. Did you restart the dev server?');
        console.log('   3. Current value:', contracts.CONTRACT_ADDRESS_FHE);
      }
    });
  });
}

// Auto-run
if (typeof window !== 'undefined') {
  window.testEnv = testEnv;
  console.log('💡 Run testEnv() in console to test environment variables');
}

