# Frontend Fixes & Notes

## ✅ Fixed Issues

### 1. `process is not defined` Error
**Problem**: Vite doesn't support `process.env` directly  
**Solution**: Changed to `import.meta.env.VITE_*` in `config/contracts.js`

### 2. `@zama-fhe/relayer-sdk` Package Resolution Error
**Problem**: Package uses `exports` field without default export  
**Solution**: Removed from `optimizeDeps` temporarily since not yet imported

**Important**: When using `@zama-fhe/relayer-sdk`, import from:
```javascript
// ✅ Correct (for browser/web)
import { createInstance } from '@zama-fhe/relayer-sdk/web';

// ❌ Wrong
// import { createInstance } from '@zama-fhe/relayer-sdk';
```

## 🔧 Vite Configuration

Current `vite.config.js`:
- Removed `@zama-fhe/relayer-sdk` from `optimizeDeps` (not used yet)
- Added `define` for `process.env` compatibility
- Ready for SDK integration when needed

## 📝 Next Steps

1. ✅ UI components created
2. ✅ Wallet connection working
3. ⏳ Implement encryption hooks (use `@zama-fhe/relayer-sdk/web`)
4. ⏳ Connect to smart contracts
5. ⏳ Implement Gateway polling

