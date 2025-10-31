# 📚 Project Reference Documentation

## FHEVM Development Standards Manual

**Location**: `c:\Users\Administrator\Desktop\ZAMA\FHEVM_开发标准与解决方案手册.md`

This project follows the standards and best practices outlined in the **FHEVM Development Standards & Solutions Manual (Version 6.1)**.

### ⭐ Latest Update (2025-01-XX)

**Important**: Manual has been updated with new **Section 2.6: Sepolia FHEVM 正确配置** containing 2025 latest API.

⚠️ **Must use new API**: `@fhevm/solidity` instead of `fhevm`  
📖 **See**: [Sepolia FHEVM Update Guide](./SEPOLIA_FHEVM_UPDATE.md)

### Key Sections Reference

When encountering issues, refer to the manual for solutions:

#### Core Development Guide
- **Section 1**: Project Architecture Standards
- **Section 2**: Smart Contract Development Standards
  - **Section 2.6**: ⭐ **Sepolia FHEVM 正确配置** (2025 Latest API) - **MUST READ**
- **Section 3**: Frontend Development Standards
  - **Section 3.5**: Frontend Encryption Creation (⭐ Important)
- **Section 4**: Gateway Decryption Workflow
- **Section 5**: Browser Environment Issues
- **Section 6**: Wallet Compatibility (OKX/MetaMask)
- **Section 7**: React State Management

#### Competition Guide
- **Section 8**: Zama Developer Program Guide (⭐ Must Read)
- **Section 9**: Mock to FHEVM Upgrade Path (⭐ Must Read)
- **Section 10**: Gateway Stability Strategies (⭐ Must Read)
- **Section 11**: Winning Project Analysis (⭐ Must Read)

#### Tools & Resources
- **Section 12**: Quick Reference (Common Issues)
- **Section 13**: Code Templates
- **Section 14**: Testing & Deployment Checklist

### Quick Access to Solutions

#### Smart Contract Issues
- **❌ GatewayCaller not found**: Section 2.6 → Use `SepoliaConfig` instead
- **❌ fhevm/gateway/GatewayCaller.sol not found**: Section 2.6 → Use `@fhevm/solidity` package
- **❌ TFHE is not defined**: Section 2.6 → Use `FHE` from `@fhevm/solidity/lib/FHE.sol`
- **❌ einput is not defined**: Section 2.6 → Use `externalEuint32` instead
- **Gas Limit = 0**: Section 7.1 → Check `CALLBACK_GAS_LIMIT` (for old Gateway API)
- **Missing Authorization**: Section 2.2 → Add `FHE.allowThis()` (new API)
- **State Errors**: Section 2.1 → Use state enum management

#### Frontend Issues
- **Gateway Offline**: Section 10 → Use hybrid mode + async processing
- **eth_call Timeout**: Section 6.3 → Use public RPC for reads
- **Wallet Popup Not Showing**: Section 6.2 → Use `window.ethereum.request`

#### Gateway Issues
- **Decryption Timeout**: Section 10.3 → Async processing strategy
- **Callback Failed**: Section 4.2 → Check gas limit and timeout
- **Polling Timeout**: Section 3.3 → Increase maxAttempts

#### Wallet Issues
- **OKX Not Popup**: Section 6.2 → Use `window.ethereum.request` with explicit `from`
- **Transaction Confirmation Timeout**: Section 6.3 → Use public RPC polling
- **BigInt Parsing Error**: Section 6.5 → Use `Number(bigint.toString())`

### Manual Updates

The manual should be consulted whenever:
- Starting a new feature
- Encountering an error
- Implementing Gateway integration
- Handling wallet compatibility
- Designing architecture

---

**Note**: The manual is located externally. Always reference the full path when needed, or copy relevant sections into the project documentation as needed.

