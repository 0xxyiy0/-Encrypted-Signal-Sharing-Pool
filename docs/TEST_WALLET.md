# 测试钱包使用指南

## ⚠️ 安全提醒

**此测试钱包仅用于本地开发和测试**，请遵守以下安全规则：

- ✅ **可以用于**：本地开发测试、合约交互测试、功能验证
- ❌ **禁止用于**：生产环境、真实资产存储、公开演示
- ❌ **禁止提交**：助记词、私钥等敏感信息到 Git

## 📝 测试钱包信息

**助记词**: 
```
share auto grow stay palace orange couple release near shoot life scout
```

**用途**: 仅用于 Sepolia 测试网络开发

## 🔧 快速导入 MetaMask

### 步骤 1: 打开 MetaMask

1. 点击浏览器右上角的 MetaMask 扩展图标
2. 确保已登录 MetaMask

### 步骤 2: 导入账户

1. 点击 MetaMask 右上角的账户图标（圆形头像）
2. 选择 **"导入账户"** 或 **"Import Account"**
3. 选择 **"使用助记词导入"** 或 **"Import with seed phrase"**

### 步骤 3: 输入助记词

在输入框中粘贴以下助记词（12 个单词，用空格分隔）：

```
share auto grow stay palace orange couple release near shoot life scout
```

### 步骤 4: 设置密码（可选）

设置账户密码或使用现有密码。

### 步骤 5: 完成导入

点击 **"导入"** 完成。现在你应该能看到测试钱包地址。

## 🌐 切换到 Sepolia 测试网络

1. 在 MetaMask 中，点击网络下拉菜单（通常显示 "Ethereum Mainnet"）
2. 如果看到 **"Sepolia"**，直接选择它
3. 如果没有，点击 **"显示测试网络"** 或手动添加：
   - 网络名称: `Sepolia Test Network`
   - RPC URL: `https://eth-sepolia.public.blastapi.io`
   - Chain ID: `11155111`
   - 货币符号: `ETH`

## 💰 获取测试 ETH

测试钱包需要 Sepolia ETH 来支付 Gas 费用。获取方法：

### 方法 1: Alchemy Sepolia Faucet（推荐）

1. 访问: https://www.alchemy.com/faucets/ethereum-sepolia
2. 连接钱包或输入钱包地址
3. 完成验证（可能需要 Twitter/Google 登录）
4. 等待几分钟，ETH 会自动发送到钱包

### 方法 2: QuickNode Faucet

1. 访问: https://faucet.quicknode.com/ethereum/sepolia
2. 输入钱包地址
3. 等待确认

### 方法 3: SepoliaFaucet

1. 访问: https://sepoliafaucet.com/
2. 输入钱包地址
3. 完成验证码
4. 等待发送

**建议**: 获取至少 **0.01 ETH** 用于测试（足够多次交易）

## 🧪 测试流程

### 1. 准备阶段

- [ ] 测试钱包已导入 MetaMask
- [ ] 已切换到 Sepolia 测试网络
- [ ] 钱包中有足够的测试 ETH（至少 0.01 ETH）
- [ ] 前端开发服务器正在运行（`npm run dev`）

### 2. 连接钱包

1. 打开前端应用（通常是 `http://localhost:5173`）
2. 点击 **"Connect Wallet"** 按钮
3. 在 MetaMask 中确认连接
4. 验证钱包地址显示正确

### 3. 测试加密信号上传

1. 导航到 **"Signal Input"** 页面
2. 填写信号表单：
   - Signal Type: 选择类型（Price Prediction / Volatility / Vote）
   - Signal Value: 输入数值（例如：100）
   - Weight: 输入权重（例如：1）
3. 点击 **"Contribute Encrypted Signal"**
4. 在 MetaMask 中确认交易
5. 等待交易确认（查看控制台日志）

### 4. 测试聚合功能

1. 导航到 **"Aggregation Dashboard"** 页面
2. 选择聚合类型（Mean / Weighted Mean）
3. 选择要聚合的信号
4. 点击 **"Create Aggregation"**
5. 观察 Gateway 轮询进度

### 5. 验证结果

- 检查浏览器控制台是否有错误
- 检查 MetaMask 交易历史
- 检查前端 UI 是否正确更新
- 验证加密/解密功能是否正常

## 🔍 故障排除

### 问题 1: "User rejected the request"

**原因**: 用户在 MetaMask 中拒绝了交易

**解决**: 在 MetaMask 中点击 "确认" 批准交易

### 问题 2: "insufficient funds for gas"

**原因**: 钱包 ETH 余额不足

**解决**: 
- 从 Sepolia 水龙头获取更多测试 ETH
- 检查网络是否切换到 Sepolia

### 问题 3: "network mismatch"

**原因**: MetaMask 网络与前端配置不匹配

**解决**: 
- 确保 MetaMask 选择 Sepolia 测试网络
- 检查前端 `.env` 中的 `SEPOLIA_CHAIN_ID` 配置

### 问题 4: 交易一直 "Pending"

**原因**: 网络拥堵或 Gas 设置过低

**解决**: 
- 等待几分钟，Sepolia 网络有时较慢
- 在 MetaMask 中尝试加速交易（增加 Gas Price）

## 📋 测试检查清单

### 基础功能
- [ ] 钱包连接正常
- [ ] 网络切换正常（Sepolia）
- [ ] 余额显示正确

### 加密功能
- [ ] 信号加密成功
- [ ] 加密进度显示正常
- [ ] 错误处理正确

### 合约交互
- [ ] 信号上传成功
- [ ] 交易确认正常
- [ ] 事件监听正确

### Gateway 轮询
- [ ] 解密请求正常
- [ ] 轮询进度显示
- [ ] 解密结果正确显示

## 📚 相关文档

- `scripts/README_TEST_WALLET.md` - 测试钱包脚本说明
- `scripts/test-wallet.js` - 钱包信息生成工具
- `.env.test.local` - 测试配置（已加入 .gitignore）

## 🔐 安全最佳实践

1. **不要提交敏感信息**
   - 确保 `.env.test.local` 在 `.gitignore` 中
   - 不要在代码中硬编码助记词或私钥

2. **使用环境变量**
   - 敏感配置通过环境变量管理
   - 使用 `import.meta.env`（Vite）访问

3. **定期轮换测试钱包**
   - 定期更换测试助记词
   - 不要长期使用同一测试钱包

4. **生产环境隔离**
   - 测试钱包和生产钱包完全分离
   - 不要将测试助记词用于生产

---

**最后更新**: 2025-01-XX  
**维护者**: 开发团队

