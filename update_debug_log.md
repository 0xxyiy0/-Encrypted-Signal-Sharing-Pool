# 🔍 Debug Log

> **Purpose**: Record issues encountered during development and their solutions  
> **Update Rule**: Update immediately when encountering or resolving issues  
> **Format**: Use self.after for scheduled updates when needed

---

## 📋 Log Entries

### [2025-01-XX] - FHEVM Gateway Import Issue

**Issue Description**:
- When compiling SignalPoolFHE.sol, Hardhat cannot find `fhevm/gateway/GatewayCaller.sol`
- Error: `File fhevm/gateway/GatewayCaller.sol, imported from contracts/FHE/SignalPoolFHE.sol, not found.`
- The fhevm@0.2.2 package only contains `lib/TFHE.sol` and `lib/Impl.sol`, no gateway directory

**Error Messages**:
```
Error HH404: File fhevm/gateway/GatewayCaller.sol, imported from contracts/FHE/SignalPoolFHE.sol, not found.
```

**Investigation Steps**:
1. Checked `node_modules/fhevm` structure - only has `lib/` directory
2. Searched for Gateway-related files in fhevm package - none found
3. Reviewed manual for correct FHEVM setup

**Root Cause**:
- The fhevm npm package (v0.2.2) may not include Gateway functionality
- Gateway might be in a different package or require different setup
- Sepolia FHEVM configuration might be different from devnet

**Solution** (Pending):
- Research correct FHEVM package for Sepolia
- Check if Gateway is in a separate package (e.g., `@zama-fhe/gateway`)
- Review SepoliaZamaFHEVMConfig usage from manual
- Possibly need to use fhevmjs or different package structure

**Temporary Workaround**:
- Comment out Gateway-related imports in SignalPoolFHE.sol
- Focus on Mock version compilation first
- Research correct FHEVM setup for Sepolia

**References**:
- Manual Section 2.1-2.3: Smart Contract Development Standards
- Manual Section 12: Progressive FHEVM Development Strategy
- fhevm package: https://github.com/zama-ai/fhevm

**Solution** (Resolved):
- Use `@fhevm/solidity` package instead of `fhevm`
- Inherit `SepoliaConfig` from `@fhevm/solidity/config/ZamaConfig.sol`
- Use `FHE` library instead of `TFHE`
- Use `externalEuint32` and `FHE.fromExternal()` for encrypted inputs
- Use `FHE.makePubliclyDecryptable()` for public decryption
- Install `@fhevm/hardhat-plugin` and configure in hardhat.config.js

**Implementation**:
- ✅ Replaced `fhevm` with `@fhevm/solidity`
- ✅ Updated imports to use `FHE` instead of `TFHE`
- ✅ Inherited `SepoliaConfig` for Sepolia network configuration
- ✅ Changed `einput` to `externalEuint32`
- ✅ Updated Hardhat config with fhevm plugin
- ✅ Contracts compile successfully

**References**:
- Manual Section 2.1-2.3: Smart Contract Development Standards
- Manual Section 12: Progressive FHEVM Development Strategy
- Sepolia FHEVM Configuration Guide (provided by user)
- @fhevm/solidity package documentation

**Status**: ✅ **Resolved**

---

### [2025-01-XX] - 交易确认和事件解析问题

**Issue Description**:
- 用户报告：链上交互成功（OKX Explorer 显示交易已确认），但前端没有收到返回值
- 问题：`contributeSignal` 发送交易后没有等待确认，也没有解析事件获取 `signalId`
- 症状：前端显示"交易已发送"，但无法获取 `signalId`，用户看不到贡献成功的反馈

**Error Messages**:
```
Transaction sent successfully, but no return value (signalId) in frontend
OKX Explorer: https://web3.okx.com/zh-hans/explorer/sepolia/tx/0x136fbceb040a8ef11790accdacfde09ecf32fae72f855ca784982e8c03902a15
```

**Investigation Steps**:
1. 检查 `useSignalPool.js` 中的 `contributeSignal` 函数
2. 发现函数只发送交易，没有等待确认
3. 发现没有解析 `SignalContributed` 事件来获取 `signalId`
4. 查阅手册第6.3节：交易确认和事件解析最佳实践

**Root Cause**:
- `window.ethereum.request` 只返回 `txHash`，不会自动等待确认
- OKX 钱包的 `provider.waitForTransaction()` 可能不可靠（手册6.3节）
- 需要手动使用公共 RPC 轮询交易 receipt
- 需要从 receipt 的 logs 中解析事件以获取 `signalId`

**Solution** (Resolved):
- 实现 `waitForTransaction` 函数，使用公共 RPC 轮询交易 receipt（参考手册6.3节）
- 实现 `parseSignalContributedEvent` 函数，从 receipt logs 解析 `SignalContributed` 事件
- 在 `contributeSignal` 中集成这两个函数，等待确认并提取 `signalId`
- 修复依赖关系：确保 `waitForTransaction` 和 `parseSignalContributedEvent` 在依赖数组中

**Implementation**:
```javascript
// 1. 等待交易确认（使用公共 RPC）
const waitForTransaction = useCallback(async (txHash, maxAttempts = 60) => {
  const publicProvider = new BrowserProvider(SEPOLIA_RPC_URL);
  for (let i = 0; i < maxAttempts; i++) {
    const receipt = await publicProvider.getTransactionReceipt(txHash);
    if (receipt && receipt.blockNumber) return receipt;
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  throw new Error('Transaction confirmation timeout');
}, []);

// 2. 解析事件
const parseSignalContributedEvent = useCallback((receipt, iface) => {
  for (const log of receipt.logs) {
    const parsed = iface.parseLog({ topics: log.topics, data: log.data });
    if (parsed && parsed.name === 'SignalContributed') {
      return Number(parsed.args.signalId.toString()); // 安全转换 BigInt
    }
  }
  throw new Error('SignalContributed event not found');
}, []);

// 3. 在 contributeSignal 中使用
const receipt = await waitForTransaction(txHash);
const signalId = parseSignalContributedEvent(receipt, contract.interface);
return { txHash, signalId };
```

**Key Points**:
- ✅ 使用公共 RPC 轮询，不依赖钱包 provider（手册6.3节）
- ✅ 安全转换 BigInt：`Number(bigint.toString())`（手册6.5节）
- ✅ 修复依赖数组，确保函数可访问
- ✅ 更新 `SignalInput.jsx` 显示 `signalId`

**References**:
- Manual Section 6.3: 交易确认超时（OKX/Rabby）
- Manual Section 6.5: BigInt 解析错误
- Manual Section 6.3: 解析事件示例代码

**Status**: ✅ **Resolved**

---

### [2025-01-XX] - BrowserProvider 与 JsonRpcProvider 混用错误

**Issue Description**:
- 清除缓存刷新后，页面显示空白
- Console 错误：`Uncaught TypeError: invalid EIP-1193 provider (argument "ethereun", value="https://eth-sepolia public, blastapi.io")`
- 错误指向：`useSignalPool.js:41:28`, `AggregationDashboard.jsx:25:63`
- URL 显示为 `"https://eth-sepolia public, blastapi.io"`（格式错误，有空格）

**Error Messages**:
```
Uncaught TypeError: invalid EIP-1193 provider (argument "ethereun", 
value="https://eth-sepolia public, blastapi.io", code-INVALID_ARGUMENT, version-6.15.0)
```

**Investigation Steps**:
1. 检查 `useSignalPool.js` 中 `readContract` 和 `waitForTransaction` 的 Provider 创建
2. 发现使用了 `new BrowserProvider(SEPOLIA_RPC_URL)` - 这是错误的
3. 查阅 ethers.js v6 文档：`BrowserProvider` 只接受 EIP-1193 provider（window.ethereum），不接受 URL 字符串

**Root Cause**:
- `BrowserProvider` 构造函数只接受 EIP-1193 provider 对象（如 `window.ethereum`）
- 对于 RPC URL 字符串，应该使用 `JsonRpcProvider`
- 在 `readContract`（第41行）和 `waitForTransaction`（第282行）中错误地使用了 `BrowserProvider` 接收 URL

**Solution** (Resolved):
- 将 `readContract` 中的 `new BrowserProvider(SEPOLIA_RPC_URL)` 改为 `new JsonRpcProvider(SEPOLIA_RPC_URL)`
- 将 `waitForTransaction` 中的 `new BrowserProvider(SEPOLIA_RPC_URL)` 改为 `new JsonRpcProvider(SEPOLIA_RPC_URL)`
- 添加 `JsonRpcProvider` 导入

**Implementation**:
```javascript
// ❌ 错误：BrowserProvider 不接受 URL 字符串
const publicProvider = new BrowserProvider(SEPOLIA_RPC_URL);

// ✅ 正确：JsonRpcProvider 用于 RPC URL
import { JsonRpcProvider } from 'ethers';
const publicProvider = new JsonRpcProvider(SEPOLIA_RPC_URL);
```

**Key Points**:
- ✅ `BrowserProvider` - 用于 EIP-1193 provider（`window.ethereum`）
- ✅ `JsonRpcProvider` - 用于 RPC URL 字符串
- ✅ 读操作使用 `JsonRpcProvider`（公共 RPC）
- ✅ 写操作使用 `BrowserProvider`（钱包 provider）

**References**:
- Ethers.js v6 Documentation: BrowserProvider vs JsonRpcProvider
- Manual Section 6.4: 使用公共 RPC 进行读操作

**Status**: ✅ **Resolved**

---

### [2025-01-XX] - Temporal Dead Zone 错误（函数定义顺序）

**Issue Description**:
- 页面仍然显示空白
- Console 错误：`Uncaught ReferenceError: Cannot access 'waitForTransaction' before initialization`
- 错误指向：`useSignalPool.js:172:57`, `AggregationDashboard.jsx:25:63`
- 这是一个典型的 JavaScript TDZ (Temporal Dead Zone) 错误

**Error Messages**:
```
Uncaught ReferenceError: Cannot access 'waitForTransaction' before initialization
    at useSignalPool (useSignalPool.js:172:57)
    at AggregationDashboard (AggregationDashboard.jsx:25:63)
```

**Investigation Steps**:
1. 检查 `useSignalPool.js` 的函数定义顺序
2. 发现 `contributeSignal`（第69行）在依赖数组中引用了 `waitForTransaction` 和 `parseSignalContributedEvent`
3. 但这两个函数在第281行和第315行才定义（在 `contributeSignal` 之后）
4. `useCallback` 在创建时会立即评估依赖数组，导致 TDZ 错误

**Root Cause**:
- JavaScript 的 Temporal Dead Zone（TDZ）机制
- `contributeSignal` 的依赖数组中引用了还未定义的函数
- 在 `useCallback` 中，依赖数组在函数定义时就被评估

**Solution** (Resolved):
- 将 `waitForTransaction` 和 `parseSignalContributedEvent` 移到 `contributeSignal` 之前定义
- 确保所有被依赖的函数在使用它们的函数之前定义
- 添加注释说明为什么这些函数必须在前面定义

**Implementation**:
```javascript
// ✅ 正确顺序：辅助函数在前，主函数在后
const waitForTransaction = useCallback(...);           // 第71行
const parseSignalContributedEvent = useCallback(...);  // 第106行
const contributeSignal = useCallback(..., [            // 第138行
  account, signer, getWriteContract, encryptSignal,
  waitForTransaction, parseSignalContributedEvent        // 现在可以正确引用
]);
```

**Key Points**:
- ✅ 在 React Hooks 中，依赖函数的定义顺序很重要
- ✅ 所有被引用的函数必须在依赖它们的函数之前定义
- ✅ 使用注释标记函数顺序要求，避免未来重复错误

**References**:
- JavaScript Temporal Dead Zone (TDZ)
- React Hooks: useCallback dependencies order

**Status**: ✅ **Resolved**

---

### [2025-10-31] - 429 Too Many Requests 错误（RPC 频率限制）

**Issue Description**:
- 加载多个信号时出现 `POST https://eth-sepolia.public.blastapi.io/ 429 (Too Many Requests)` 错误
- 错误出现在 `useSignalPool.js:402`，在调用 `getSignalMetadata` 时
- 影响组件：`AggregationDashboard`、`SignalCards`、`ContributionTracking`

**Error Messages**:
```
POST https://eth-sepolia.public.blastapi.io/ 429 (Too Many Requests)
useSignalPool.js:402
```

**Investigation Steps**:
1. 检查错误日志，发现是公共 RPC 节点的频率限制
2. 分析代码，发现快速连续调用 `getSignalMetadata`（6个信号连续请求）
3. 查阅手册，确认应该使用请求延迟和重试机制

**Root Cause**:
- 公共 RPC 节点（`eth-sepolia.public.blastapi.io`）对请求频率有限制
- 快速连续请求（无延迟）触发频率限制（429 错误）
- 6 个信号在短时间内连续请求，超过 RPC 允许的频率

**Solution** (Resolved):
1. **请求延迟**: 在每个请求之间添加 200ms 延迟
   ```javascript
   // 等待 200ms 后再发送下一个请求
   if (i < signalIds.length - 1) {
     await new Promise(resolve => setTimeout(resolve, 200));
   }
   ```
2. **429 错误处理**: 检测 429 错误并自动重试
   ```javascript
   if (err.message?.includes('429') || err.message?.includes('Too Many Requests')) {
     // 等待 1 秒后重试
     await new Promise(resolve => setTimeout(resolve, 1000));
     // 重试一次
   }
   ```
3. **应用到所有组件**: 
   - `AggregationDashboard` - 加载信号元数据
   - `SignalCards` - 显示信号卡片
   - `ContributionTracking` - 计算用户贡献

**Implementation**:
- ✅ 在循环中添加延迟（200ms）
- ✅ 429 错误时等待 1 秒并重试
- ✅ 继续处理其他信号，不中断整个流程
- ✅ 添加详细的日志记录

**Key Points**:
- ✅ 公共 RPC 有频率限制，需要请求节流
- ✅ 200ms 延迟可以避免大部分 429 错误
- ✅ 自动重试机制提高成功率
- ✅ 优雅的错误处理，不中断用户体验

**References**:
- Manual Section 6.4: 使用公共 RPC 进行读操作
- Rate Limiting Best Practices

**Status**: ✅ **Resolved**

---

### [2025-10-31] - FHE Encryption Mode 开关无法打开（用户疑问）

**Issue Description**:
- 用户发现 Settings 页面中的 "FHE Encryption Mode" 开关无法打开（disabled 状态）
- 用户询问为什么开关不能操作

**Investigation Steps**:
1. 检查 `Settings.jsx` 组件代码
2. 发现开关是 `disabled` 状态（设计如此）
3. 确认模式通过环境变量 `VITE_FHEVM_ENABLED` 控制

**Root Cause**:
- 开关是 `disabled` 状态（只读）
- FHE 模式通过环境变量控制，需要在构建时确定
- 缺少清晰的说明告诉用户如何切换模式
- 用户可能期望在 UI 中直接切换

**Solution** (Resolved):
1. **添加详细说明框**:
   - 黄色提示框解释开关是环境变量控制的
   - 提供 4 步切换流程
2. **Switch Tooltip**:
   - 在 Switch 组件上添加 `title` 属性说明
3. **步骤说明**:
   ```
   1. Edit frontend/.env.local
   2. Change VITE_FHEVM_ENABLED to true (FHE) or false (Mock)
   3. Restart the frontend development server
   4. Refresh the browser page
   ```

**Implementation**:
```jsx
<Switch 
  checked={FHEVM_ENABLED} 
  disabled 
  title="Mode is controlled by environment variable..."
/>
<div style={{ padding: '8px', background: '#fff7e6', ... }}>
  ⚠️ Note: The mode switch is controlled by the VITE_FHEVM_ENABLED environment variable.
  <ol>
    <li>Edit frontend/.env.local</li>
    <li>Change VITE_FHEVM_ENABLED...</li>
    <li>Restart the frontend development server</li>
    <li>Refresh the browser page</li>
  </ol>
</div>
```

**Key Points**:
- ✅ 环境变量在构建时确定，无法在运行时切换
- ✅ 必须重启前端服务器才能加载新的环境变量
- ✅ 提供清晰的步骤说明帮助用户理解

**References**:
- Vite Environment Variables Documentation
- Manual Section 3: Frontend Development Standards

**Status**: ✅ **Resolved**

---

## 📊 Summary Statistics

- **Total Issues**: 9
- **Resolved**: 9
- **Pending**: 0
- **Last Updated**: 2025-10-31
- **Manual Updated**: ✅ 已添加 2.6 Sepolia FHEVM 正确配置章节

---

## 🎯 Common Issues Reference

### Category: Smart Contract
- Issue: FHEVM Gateway import not found → Research correct package structure

### Category: Frontend
- Issue: [Template] - [Solution reference]

### Category: Gateway
- Issue: [Template] - [Solution reference]

### Category: Wallet
- Issue: [Template] - [Solution reference]

---

**Note**: This log should be updated immediately when issues are encountered or resolved. Use the manual as the primary reference for solutions.
