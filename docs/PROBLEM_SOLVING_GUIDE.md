# 🔍 问题解决指南

## 优先级规则

当遇到任何技术问题时，请**严格按照以下优先级**查找解决方案：

### 1️⃣ 第一优先级：项目手册 ⭐ **最重要**

**文件**: `FHEVM_开发标准与解决方案手册.md`

**使用方法**:
1. 使用代码搜索工具在手册中搜索相关关键词
2. 查找对应的章节（通常在目录中）
3. 阅读完整的解决方案
4. 按照手册中的步骤操作

**手册包含的主要内容**:
- **2.6 节**: Sepolia FHEVM 正确配置（API变更、包版本、常见错误）
- **第3节**: 前端开发规范（加密、解密、Gateway 轮询）
- **12.2 节**: 双合约架构设计
- **12.3 节**: 关键实现要点（动态ABI、模式切换）
- **12.4 节**: 常见问题速查表
- **12.5 节**: 部署检查清单

**示例问题**:
- ❓ "GatewayCaller not found" → 查看 **2.6.5 常见错误**
- ❓ "ambiguous function description" → 查看 **12.3 A - 动态 ABI**
- ❓ "Contract address not configured" → 查看 **12.5 部署检查清单**
- ❓ "OKX 钱包不弹窗" → 查看 **12.4 常见问题速查**

### 2️⃣ 第二优先级：项目文档

**相关文档**:
- `docs/REFERENCE.md` - 快速参考（常见错误速查）
- `docs/DEPLOYMENT.md` - 部署指南
- `docs/TEST_WALLET.md` - 测试钱包使用指南
- `docs/ARCHITECTURE.md` - 架构设计文档

**使用场景**: 当手册中未直接找到解决方案时，查看相关文档

### 3️⃣ 第三优先级：调试日志和自查日志

**文件**:
- `update_debug_log.md` - 记录项目开发过程中遇到的具体问题
- `自查日志.md` - 记录操作历史和已解决的问题

**使用场景**: 查看项目中已遇到并解决过的类似问题

### 4️⃣ 最后手段：外部资源

仅当前面所有资源都无法解决问题时：
1. 查看代码注释和配置文件
2. 搜索官方文档（Zama、Hardhat、ethers.js等）
3. 询问用户或提供临时解决方案

## 🔍 搜索技巧

### 在手册中搜索关键词

**常见搜索关键词**:
- **配置问题**: "配置", "Config", "Sepolia", "hardhat.config"
- **ABI问题**: "ABI", "ambiguous", "function signature", "动态ABI"
- **加密问题**: "加密", "encrypt", "createEncryptedInput", "relayer-sdk"
- **解密问题**: "解密", "decrypt", "Gateway", "publicDecrypt", "轮询"
- **部署问题**: "部署", "deploy", "contract address", "环境变量"
- **钱包问题**: "钱包", "wallet", "OKX", "MetaMask", "window.ethereum"
- **合约问题**: "合约", "contract", "Compilation", "TypeError"

### 搜索命令示例

使用 `codebase_search` 工具：
```javascript
// 示例1: 搜索 ABI 相关
codebase_search(
  query: "How to handle ambiguous function description in ABI?",
  target_directories: ["FHEVM_开发标准与解决方案手册.md"]
)

// 示例2: 搜索配置问题
codebase_search(
  query: "Sepolia FHEVM configuration errors and solutions",
  target_directories: []
)
```

## 📋 问题报告模板

如果手册中未找到解决方案，请在解决问题后：

1. **更新手册**（如果问题是通用的）:
   - 在对应章节添加解决方案
   - 更新常见问题速查表

2. **更新调试日志**:
   - 在 `update_debug_log.md` 中记录
   - 包含：问题描述、错误信息、解决方案、相关文件

## ⚠️ 重要提醒

- ✅ **必须**先查阅手册，再提供解决方案
- ✅ 引用手册的具体章节号
- ✅ 如果手册中没有，解决后**更新手册**
- ❌ **不要**跳过手册直接猜测
- ❌ **不要**重复解决已知问题（先查日志）

---

**最后更新**: 2025-01-XX  
**维护者**: 开发团队

