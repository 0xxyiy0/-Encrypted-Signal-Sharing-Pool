# 部署指南

## 🚀 快速部署流程

### 前置条件

- ✅ 测试钱包已导入 MetaMask
- ✅ 已切换到 Sepolia 测试网络
- ✅ 钱包中有足够的测试 ETH（至少 0.01 ETH）
- ✅ 合约已编译（`npm run compile`）

### 步骤 1: 配置环境变量

1. **获取测试钱包私钥**:
   ```bash
   node scripts/get_wallet_info.js
   ```

2. **创建 `.env` 文件**:
   ```bash
   cp .env.example .env
   ```

3. **编辑 `.env` 文件**，填入私钥:
   ```env
   SEPOLIA_RPC_URL=https://eth-sepolia.public.blastapi.io
   PRIVATE_KEY=你的测试钱包私钥（从步骤1获取）
   ```

### 步骤 2: 检查余额

```bash
npx hardhat run scripts/check_balance.js --network sepolia
```

确保余额至少 **0.01 ETH**。

### 步骤 3: 部署合约

#### 选项 A: 部署 Mock 合约（推荐先测试）

```bash
npm run deploy:mock
```

或：

```bash
npx hardhat run scripts/deploy_mock.js --network sepolia
```

**部署成功后，记录合约地址**，例如：
```
✅ 部署成功！
合约地址: 0x1234567890123456789012345678901234567890
```

#### 选项 B: 部署 FHE 合约

```bash
npm run deploy:fhe
```

或：

```bash
npx hardhat run scripts/deploy_fhe.js --network sepolia
```

**注意**: FHE 合约部署可能需要更长时间和更多 Gas。

### 步骤 4: 更新前端配置

1. **创建 `frontend/.env.local` 文件**（如果还没有）:
   ```bash
   cd frontend
   # Windows PowerShell
   New-Item -Path .env.local -ItemType File
   ```

2. **添加合约地址**:
   ```env
   # Mock 合约地址
   VITE_CONTRACT_MOCK=0x1234567890123456789012345678901234567890
   
   # FHE 合约地址（如果已部署）
   VITE_CONTRACT_FHE=0x0987654321098765432109876543210987654321
   
   # 选择使用的合约（false = Mock, true = FHE）
   VITE_FHEVM_ENABLED=false
   
   # Sepolia RPC（可选，有默认值）
   VITE_SEPOLIA_RPC_URL=https://eth-sepolia.public.blastapi.io
   ```

3. **重启前端开发服务器**:
   ```bash
   # 停止当前服务器（Ctrl+C）
   # 重新启动
   npm run dev
   ```

### 步骤 5: 测试连接

1. 打开前端应用（通常是 `http://localhost:5173`）
2. 点击 **"Connect Wallet"**
3. 在 MetaMask 中选择测试钱包
4. 确认连接到 Sepolia 网络
5. 验证合约地址是否正确显示（如果有显示）

## 📋 部署检查清单

### Mock 合约部署
- [ ] `.env` 文件已配置私钥
- [ ] 钱包余额充足（至少 0.01 ETH）
- [ ] 合约编译成功（`npm run compile`）
- [ ] Mock 合约部署成功
- [ ] 合约地址已记录
- [ ] 前端 `.env.local` 已更新
- [ ] 前端已重启
- [ ] 可以成功连接钱包

### FHE 合约部署
- [ ] Mock 合约测试通过
- [ ] FHE 合约编译成功
- [ ] FHE 合约部署成功
- [ ] 前端 `.env.local` 已更新 `VITE_CONTRACT_FHE`
- [ ] 已设置 `VITE_FHEVM_ENABLED=true`
- [ ] 前端已重启
- [ ] 可以测试加密功能

## 🔍 验证部署

### 方法 1: Etherscan 查看

1. 访问: https://sepolia.etherscan.io/
2. 搜索合约地址
3. 确认合约已部署
4. 查看合约代码（如果已验证）

### 方法 2: 前端测试

1. 连接钱包
2. 尝试提交一个测试信号
3. 查看浏览器控制台是否有错误
4. 检查 MetaMask 交易历史

## 🐛 故障排除

### 问题 1: "insufficient funds for gas"

**原因**: 钱包余额不足

**解决**:
- 从 Sepolia 水龙头获取更多测试 ETH
- 检查是否切换到 Sepolia 网络

### 问题 2: "nonce too high"

**原因**: 交易 nonce 不匹配

**解决**:
```bash
# 重置 MetaMask 账户（仅在测试网络）
# MetaMask -> 设置 -> 高级 -> 重置账户
```

### 问题 3: 部署超时

**原因**: RPC 节点响应慢或网络问题

**解决**:
- 使用更快的 RPC（如 Alchemy 或 Infura）
- 增加 Hardhat 超时时间
- 重试部署

### 问题 4: 前端找不到合约

**原因**: 环境变量未正确配置

**解决**:
- 确认 `frontend/.env.local` 文件存在
- 确认变量名正确（`VITE_` 前缀）
- 确认重启了前端服务器
- 检查浏览器控制台是否有错误

## 📚 相关文档

- [测试钱包使用指南](./TEST_WALLET.md)
- [FHEVM 开发手册](../FHEVM_开发标准与解决方案手册.md)
- [架构设计](./ARCHITECTURE.md)

## 🔐 安全提醒

- ✅ `.env` 文件已加入 `.gitignore`，不会提交到 Git
- ✅ 测试钱包仅用于 Sepolia 测试网络
- ❌ 不要将 `.env` 文件提交到版本控制
- ❌ 不要在生产环境使用测试私钥

---

**最后更新**: 2025-01-XX

