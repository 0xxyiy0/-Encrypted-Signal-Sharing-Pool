# 测试钱包使用说明

## ⚠️ 安全提醒

此测试钱包**仅用于本地开发和测试**：
- ✅ 可以用于测试合约交互
- ✅ 可以用于测试加密功能
- ✅ 可以用于测试 Gateway 轮询
- ❌ **不要**用于生产环境
- ❌ **不要**将助记词提交到 Git
- ❌ **不要**存储真实资产

## 📝 测试钱包信息

**助记词**: `share auto grow stay palace orange couple release near shoot life scout`

## 🔧 使用方法

### 方法 1: 导入 MetaMask（推荐）

1. 打开浏览器扩展 MetaMask
2. 点击账户图标（右上角圆形图标）
3. 选择 "导入账户" 或 "Import Account"
4. 选择 "使用助记词导入" 或 "Import with seed phrase"
5. 粘贴助记词：`share auto grow stay palace orange couple release near shoot life scout`
6. 设置密码（可选）
7. 导入完成

### 方法 2: 使用测试脚本

```bash
# 生成钱包信息（包括地址和私钥）
node scripts/test-wallet.js
```

## 💰 获取测试 ETH

测试钱包需要 Sepolia ETH 进行交易：

1. **Sepolia 水龙头**（推荐）:
   - https://sepoliafaucet.com/
   - https://faucet.quicknode.com/ethereum/sepolia
   - https://www.alchemy.com/faucets/ethereum-sepolia

2. **输入测试钱包地址**（从 MetaMask 复制）
3. **等待几分钟**，ETH 会发送到钱包

## 🧪 测试流程

1. ✅ 导入测试钱包到 MetaMask
2. ✅ 切换到 Sepolia 测试网络
3. ✅ 获取测试 ETH（从水龙头）
4. ✅ 在前端连接钱包
5. ✅ 测试加密信号上传
6. ✅ 测试聚合功能
7. ✅ 测试 Gateway 解密

## 📋 检查清单

- [ ] 测试钱包已导入 MetaMask
- [ ] 已切换到 Sepolia 测试网络
- [ ] 钱包中有测试 ETH（至少 0.01 ETH）
- [ ] 前端可以成功连接钱包
- [ ] 合约地址已配置（`.env` 文件）
- [ ] 可以成功发送交易

## 🔍 故障排除

### 问题 1: MetaMask 无法导入

**原因**: 助记词格式错误或单词拼写错误

**解决**: 
- 检查助记词是否完全正确
- 确认单词之间用空格分隔
- 确认是 12 个单词

### 问题 2: 交易失败（Gas 不足）

**原因**: 测试 ETH 余额不足

**解决**: 
- 从 Sepolia 水龙头获取更多测试 ETH
- 检查钱包余额：MetaMask 显示 ETH 数量

### 问题 3: 网络不匹配

**原因**: MetaMask 未切换到 Sepolia

**解决**: 
- 在 MetaMask 中选择网络下拉菜单
- 选择 "Sepolia" 测试网络
- 或手动添加 Sepolia 网络（Chain ID: 11155111）

## 📚 相关文件

- `.env.test.local` - 测试钱包配置（已加入 .gitignore）
- `scripts/test-wallet.js` - 钱包信息生成工具
- `frontend/.env.test.local` - 前端测试配置

---

**最后更新**: 2025-01-XX

