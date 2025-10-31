<div align="center">

# 🔐 Encrypted Signal Sharing Pool

### Privacy-Preserving Trading Signal Aggregation on Zama FHEVM

[![FHEVM](https://img.shields.io/badge/FHEVM-Enabled-purple)](https://docs.zama.ai/fhevm)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue)](https://soliditylang.org/)
[![React](https://img.shields.io/badge/React-19.1-blue)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**A decentralized platform that enables traders to share and aggregate trading signals while maintaining complete privacy using Fully Homomorphic Encryption (FHE).**

[🌐 Live Demo](#) • [📖 Documentation](./docs/NETLIFY_DEPLOYMENT.md) • [💬 Report Bug](#)

</div>

---

## 📖 项目简介

**Encrypted Signal Sharing Pool** 是一个基于 Zama FHEVM 的隐私保护交易信号聚合平台。我们允许多个交易机器人或参与者**安全地共享和聚合交易信号**，而不会泄露任何个体的策略信息。

### 🎯 核心价值

- **🔒 完全隐私保护** - 使用全同态加密（FHE）技术，信号在离开你的设备前就已加密，全程保持加密状态
- **📊 智能聚合** - 利用多个信号源的聚合结果，获得比单一信号更准确的市场预测
- **💰 公平收益分配** - 基于贡献度自动分配收益，保护策略隐私的同时激励高质量信号
- **🚀 实时监控** - 可视化仪表板，实时追踪聚合结果和收益分配

---

## ✨ 项目优势

### 1. 🔐 业界领先的隐私保护

- ✅ **端到端加密**：信号在客户端加密后才上传到区块链
- ✅ **零知识计算**：在不解密的情况下进行聚合计算
- ✅ **仅结果解密**：只有最终的聚合结果被解密，个体信号永远保持加密
- ✅ **策略不可追溯**：即使查看链上数据，也无法得知任何参与者的策略

### 2. 🎯 真实业务场景

- **交易信号聚合**：多个交易机器人的信号整合，提高预测准确度
- **去中心化信号市场**：交易者可以安全地分享有价值的信号
- **隐私保护的量化交易**：保护量化策略的核心竞争优势
- **机构级数据协作**：多个机构可以在不泄露数据的情况下协作分析

### 3. 💡 技术创新

- **双合约架构**：Mock 版本用于快速测试，FHE 版本用于生产环境
- **Gateway 集成**：完整的解密工作流，支持超时和重试机制
- **渐进式开发**：从 Mock 模式平滑过渡到 FHE 模式
- **响应式设计**：适配桌面和移动设备

---

## 🛠️ Zama 技术栈

本项目充分利用了 **Zama** 的 FHEVM 生态系统，实现了业界领先的隐私保护能力：

### 核心 Zama 技术

#### 1. **@fhevm/solidity** - FHE 智能合约库
```solidity
import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
```

**功能**：
- ✅ **FHE 加密数据类型**：`euint32`, `euint64` 等
- ✅ **同态运算**：在加密数据上进行加、减、乘、除等运算
- ✅ **公开解密机制**：`FHE.makePubliclyDecryptable()` 支持结果解密
- ✅ **网络配置**：`SepoliaConfig` 提供 Sepolia 测试网完整配置

**应用场景**：
- 存储加密的交易信号值
- 执行加密聚合计算（均值、加权平均等）
- 保护计算结果直到解密时刻

#### 2. **@fhevm/hardhat-plugin** - 开发工具集成
```javascript
require("@fhevm/hardhat-plugin");

module.exports = {
  fhevm: {
    chain: "sepolia",
    gatewayUrl: "https://gateway.sepolia.zama.ai",
    executorContract: "0x848B0066793BcC60346Da1F49049357399B8D595",
  }
};
```

**功能**：
- ✅ 自动处理 FHE 合约编译
- ✅ 网络配置管理
- ✅ 开发环境支持

#### 3. **@zama-fhe/relayer-sdk** - 前端加密 SDK
```javascript
import { createEncryptedInput } from '@zama-fhe/relayer-sdk/web';

const input = createEncryptedInput(contractAddress, signerAddress);
input.add32(BigInt(signalValue));
const { handles, inputProof } = await input.encrypt();
```

**功能**：
- ✅ **客户端加密**：在浏览器中直接加密数据
- ✅ **零知识提交**：只有加密后的数据上传到链上
- ✅ **证明生成**：自动生成加密输入证明（attestation）
- ✅ **浏览器兼容**：支持 Web 环境，使用 WASM 加速

**应用场景**：
- 在用户设备上加密交易信号
- 生成加密输入和证明
- 与智能合约交互

#### 4. **Zama Gateway** - 解密服务
```
https://gateway.sepolia.zama.ai
```

**功能**：
- ✅ **公开解密**：对使用 `makePubliclyDecryptable()` 标记的数据进行解密
- ✅ **异步处理**：支持轮询机制，避免阻塞交易
- ✅ **可靠性保证**：企业级解密服务，保证服务可用性

**应用场景**：
- 解密聚合结果供用户查看
- 支持实时数据查询
- 批量解密处理

### 技术架构优势

| 特性 | 传统方案 | 我们的方案（FHEVM） |
|------|---------|-------------------|
| **隐私保护** | ❌ 明文存储 | ✅ 端到端加密 |
| **链上计算** | ❌ 需要解密 | ✅ 加密状态计算 |
| **策略安全** | ❌ 可被查看 | ✅ 永远加密 |
| **去中心化** | ⚠️ 需要信任 | ✅ 无需信任 |
| **性能** | ✅ 快 | ✅ 优化后的 FHE 性能 |

---

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────┐
│              Frontend (React + Vite)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Signal Input │  │ Aggregation  │  │ Revenue      │  │
│  │ 🔐 Encrypted │  │ Dashboard    │  │ Distribution │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                         ↓ ↑
┌─────────────────────────────────────────────────────────┐
│         Smart Contracts (Zama FHEVM)                   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  SignalPoolFHE.sol                              │   │
│  │  • Store encrypted signals (euint32)           │   │
│  │  • FHE aggregation (mean, weighted avg)        │   │
│  │  • Revenue distribution                        │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  SignalPoolMock.sol (Testing)                   │   │
│  │  • Plaintext version for development           │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│              Zama Gateway                                │
│  • Public Decryption Service                            │
│  • Decrypt aggregation results                         │
│  • Asynchronous processing                             │
└─────────────────────────────────────────────────────────┘
```

### 数据流

1. **信号提交**：用户输入 → 客户端加密 → 链上存储（加密）
2. **聚合计算**：选择信号 → FHE 计算 → 加密结果
3. **结果解密**：Gateway 解密 → 更新合约状态 → 前端显示
4. **收益分配**：计算贡献度 → 分配收益 → 用户提取

---

## 🚀 快速开始

### 前置要求

- Node.js >= 18.x
- npm 或 yarn
- MetaMask 或 OKX Wallet（测试用）
- Sepolia 测试网 ETH（用于支付 Gas）

### 安装步骤

```bash
# 1. 克隆项目
git clone <repository-url>
cd F--007

# 2. 安装依赖
npm install

# 3. 安装前端依赖
cd frontend
npm install

# 4. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入合约地址和 RPC URL

# 5. 启动开发服务器
npm run dev
```

### 环境变量配置

创建 `frontend/.env.local`：

```env
VITE_CONTRACT_MOCK=0xFcA70e08afb3E19d4B81F55b89f8900255DbfEC0
VITE_CONTRACT_FHE=0x2ef21fa971d29D9c1A3f997350b05d142f3A0800
VITE_FHEVM_ENABLED=false
VITE_SEPOLIA_RPC_URL=https://eth-sepolia.public.blastapi.io
```

---

## 📚 功能特性

### 🔒 隐私保护

- **端到端加密**：使用 Zama Relayer SDK 在客户端加密
- **同态计算**：在不解密的情况下进行聚合
- **选择性解密**：只有聚合结果被解密

### 📊 聚合算法

- **均值聚合**：计算所有信号的平均值
- **加权平均**：根据信号权重计算加权平均值
- **信号投票**：统计符合条件的信号数量

### 💰 收益机制

- **贡献度追踪**：记录每个参与者的信号贡献
- **自动分配**：基于贡献度自动计算和分配收益
- **透明可查**：所有分配记录公开可查

### 📱 用户体验

- **实时监控**：实时显示聚合结果和收益
- **可视化图表**：使用 Echarts 展示数据趋势
- **响应式设计**：适配各种设备屏幕

---

## 🛠️ 技术栈

### 智能合约
- **Solidity** ^0.8.24
- **@fhevm/solidity** - Zama FHE 库
- **Hardhat** - 开发框架
- **OpenZeppelin** - 安全合约库

### 前端
- **React** ^19.1 - UI 框架
- **Vite** ^7.1 - 构建工具
- **Ant Design** ^5.27 - UI 组件库
- **Echarts** ^6.0 - 数据可视化
- **ethers.js** ^6.15 - 区块链交互

### 网络
- **Ethereum Sepolia Testnet** - 测试网络
- **Zama Gateway** - 解密服务

---

## 📖 文档

- 📘 [用户使用手册](./docs/USER_GUIDE.md) - 完整的使用指南
- 🎬 [演示脚本](./docs/DEMO_SCRIPT.md) - 演示视频完整脚本
- ⚡ [演示快速参考](./docs/DEMO_QUICK_REFERENCE.md) - 5分钟快速演示清单
- 🏗️ [架构文档](./docs/ARCHITECTURE.md) - 系统架构详解
- 🚀 [部署指南](./docs/NETLIFY_DEPLOYMENT.md) - 部署到 Netlify
- 🔧 [开发手册](./FHEVM_开发标准与解决方案手册.md) - 开发标准和最佳实践

---

## 🎯 使用场景

### 1. 交易信号聚合
多个交易机器人共享信号，通过聚合获得更准确的市场预测，同时保护各自策略。

### 2. 量化策略协作
量化团队可以安全地分享策略信号，进行协作分析，而不用担心策略泄露。

### 3. 机构级数据协作
金融机构可以在不泄露数据的情况下进行协作分析，发现市场机会。

### 4. 去中心化信号市场
创建一个去中心化的信号市场，交易者可以安全地购买和出售有价值的交易信号。

---

## 🏆 项目亮点

- ✅ **真实业务价值** - 解决交易信号共享中的隐私痛点
- ✅ **完整技术实现** - 从加密、计算到解密的完整流程
- ✅ **优秀用户体验** - 直观的仪表板和实时反馈
- ✅ **生产就绪** - 完整的错误处理和超时机制
- ✅ **文档完善** - 详细的开发文档和用户指南

---

## 🤝 贡献

我们欢迎任何形式的贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。

---

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

---

## 🔗 相关链接

- 🌐 **Zama 官网**: https://www.zama.ai
- 📚 **FHEVM 文档**: https://docs.zama.ai/fhevm
- 🔧 **Relayer SDK**: https://github.com/zama-ai/relayer-sdk
- 🏆 **开发者计划**: https://www.zama.ai/programs/developer-program

---

## 📞 联系方式

- 📧 Email: [Your Email]
- 💬 Discord: [Your Discord]
- 🐦 Twitter: [Your Twitter]

---

<div align="center">

**Built with ❤️ using Zama FHEVM**

Made for [Zama Developer Program](https://www.zama.ai/programs/developer-program)

</div>
