# 🔐 Encrypted Signal Sharing Pool
<img width="2560" height="1279" alt="image" src="https://github.com/user-attachments/assets/27ad17ff-58eb-49b7-8c39-d84a220fb440" />


### Privacy-Preserving Trading Signal Aggregation on Zama FHEVM

[![FHEVM](https://img.shields.io/badge/FHEVM-Enabled-purple)](https://docs.zama.ai/fhevm)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue)](https://soliditylang.org/)
[![React](https://img.shields.io/badge/React-19.1-blue)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**A decentralized platform that enables traders to share and aggregate trading signals while maintaining complete privacy using Fully Homomorphic Encryption (FHE).**

[🌐 Live Demo](https://encrypted-signal-sharing-pool.netlify.app/) • [📖 Documentation](https://github.com/0xxyiy0/-Encrypted-Signal-Sharing-Pool/blob/main/USER_GUIDE.md) • [💬 Report Bug](#)
Video：https://youtu.be/pYMvIgvuH5k

</div>

---

## 📖 Project Overview

**Encrypted Signal Sharing Pool** is a privacy-preserving trading signal aggregation platform built on Zama FHEVM. We enable multiple trading bots or participants to **securely share and aggregate trading signals** without revealing any individual strategy information.

### 🎯 Core Value

- **🔒 Complete Privacy Protection** - Using Fully Homomorphic Encryption (FHE) technology, signals are encrypted before leaving your device and remain encrypted throughout
- **📊 Smart Aggregation** - Leveraging aggregated results from multiple signal sources for more accurate market predictions than single signals
- **💰 Fair Revenue Distribution** - Automatic revenue distribution based on contribution, incentivizing high-quality signals while protecting strategy privacy
- **🚀 Real-time Monitoring** - Visual dashboard with real-time tracking of aggregation results and revenue distribution

---

## ✨ Project Advantages

### 1. 🔐 Industry-Leading Privacy Protection

- ✅ **End-to-End Encryption**: Signals are encrypted on the client side before uploading to the blockchain
- ✅ **Zero-Knowledge Computation**: Aggregation calculations performed without decryption
- ✅ **Result-Only Decryption**: Only the final aggregation result is decrypted, individual signals remain encrypted forever
- ✅ **Strategy Untraceability**: Even when viewing on-chain data, no participant's strategy can be determined

### 2. 🎯 Real Business Scenarios

- **Trading Signal Aggregation**: Integration of signals from multiple trading bots, improving prediction accuracy
- **Decentralized Signal Market**: Traders can securely share valuable signals
- **Privacy-Preserving Quantitative Trading**: Protecting the core competitive advantage of quantitative strategies
- **Institutional Data Collaboration**: Multiple institutions can collaborate on analysis without revealing data

### 3. 💡 Technical Innovation

- **Dual Contract Architecture**: Mock version for rapid testing, FHE version for production
- **Gateway Integration**: Complete decryption workflow with timeout and retry mechanisms
- **Progressive Development**: Smooth transition from Mock mode to FHE mode
- **Responsive Design**: Adapted for desktop and mobile devices

---

## 🛠️ Zama Technology Stack

This project fully leverages **Zama's** FHEVM ecosystem, achieving industry-leading privacy protection capabilities:

### Core Zama Technologies

#### 1. **@fhevm/solidity** - FHE Smart Contract Library
```solidity
import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
```

**Features**:
- ✅ **FHE Encrypted Data Types**: `euint32`, `euint64`, etc.
- ✅ **Homomorphic Operations**: Addition, subtraction, multiplication, division on encrypted data
- ✅ **Public Decryption Mechanism**: `FHE.makePubliclyDecryptable()` supports result decryption
- ✅ **Network Configuration**: `SepoliaConfig` provides complete Sepolia testnet configuration

**Use Cases**:
- Store encrypted trading signal values
- Perform encrypted aggregation calculations (mean, weighted average, etc.)
- Protect calculation results until decryption time

#### 2. **@fhevm/hardhat-plugin** - Development Tool Integration
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

**Features**:
- ✅ Automatic FHE contract compilation
- ✅ Network configuration management
- ✅ Development environment support

#### 3. **@zama-fhe/relayer-sdk** - Frontend Encryption SDK
```javascript
import { createEncryptedInput } from '@zama-fhe/relayer-sdk/web';

const input = createEncryptedInput(contractAddress, signerAddress);
input.add32(BigInt(signalValue));
const { handles, inputProof } = await input.encrypt();
```

**Features**:
- ✅ **Client-Side Encryption**: Directly encrypt data in the browser
- ✅ **Zero-Knowledge Submission**: Only encrypted data uploaded to the chain
- ✅ **Proof Generation**: Automatically generates encrypted input proofs (attestations)
- ✅ **Browser Compatibility**: Supports Web environment with WASM acceleration

**Use Cases**:
- Encrypt trading signals on user devices
- Generate encrypted inputs and proofs
- Interact with smart contracts

#### 4. **Zama Gateway** - Decryption Service
```
https://gateway.sepolia.zama.ai
```

**Features**:
- ✅ **Public Decryption**: Decrypts data marked with `makePubliclyDecryptable()`
- ✅ **Asynchronous Processing**: Supports polling mechanism to avoid blocking transactions
- ✅ **Reliability Guarantee**: Enterprise-grade decryption service with guaranteed availability

**Use Cases**:
- Decrypt aggregation results for user viewing
- Support real-time data queries
- Batch decryption processing

### Technical Architecture Advantages

| Feature | Traditional Solution | Our Solution (FHEVM) |
|---------|---------------------|---------------------|
| **Privacy Protection** | ❌ Plaintext storage | ✅ End-to-end encryption |
| **On-Chain Computation** | ❌ Requires decryption | ✅ Computation in encrypted state |
| **Strategy Security** | ❌ Can be viewed | ✅ Always encrypted |
| **Decentralization** | ⚠️ Requires trust | ✅ Trustless |
| **Performance** | ✅ Fast | ✅ Optimized FHE performance |

---

## 🏗️ System Architecture

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

### Data Flow

1. **Signal Submission**: User input → Client encryption → On-chain storage (encrypted)
2. **Aggregation Calculation**: Select signals → FHE computation → Encrypted result
3. **Result Decryption**: Gateway decryption → Update contract state → Frontend display
4. **Revenue Distribution**: Calculate contribution → Distribute revenue → User withdrawal

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.x
- npm or yarn
- MetaMask or OKX Wallet (for testing)
- Sepolia Testnet ETH (for paying Gas)

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/0xxyiy0/-Encrypted-Signal-Sharing-Pool.git
cd -Encrypted-Signal-Sharing-Pool

# 2. Install dependencies
npm install

# 3. Install frontend dependencies
cd frontend
npm install

# 4. Configure environment variables
cp .env.example .env.local
# Edit .env.local and fill in contract addresses and RPC URL

# 5. Start development server
npm run dev
```

### Environment Variables Configuration

Create `frontend/.env.local`:

```env
VITE_CONTRACT_MOCK=YOUR_MOCK_CONTRACT_ADDRESS
VITE_CONTRACT_FHE=YOUR_FHE_CONTRACT_ADDRESS
VITE_FHEVM_ENABLED=false
VITE_SEPOLIA_RPC_URL=https://eth-sepolia.public.blastapi.io
```

**Note**: For production, set `VITE_FHEVM_ENABLED=true` after deploying FHE contracts.

---

## 📚 Features

### 🔒 Privacy Protection

- **End-to-End Encryption**: Use Zama Relayer SDK for client-side encryption
- **Homomorphic Computation**: Aggregation without decryption
- **Selective Decryption**: Only aggregation results are decrypted

### 📊 Aggregation Algorithms

- **Mean Aggregation**: Calculate the average of all signals
- **Weighted Average**: Calculate weighted average based on signal weights
- **Signal Voting**: Count signals meeting specific conditions

### 💰 Revenue Mechanism

- **Contribution Tracking**: Record each participant's signal contributions
- **Automatic Distribution**: Automatically calculate and distribute revenue based on contribution
- **Transparent and Verifiable**: All distribution records are publicly verifiable

### 📱 User Experience

- **Real-time Monitoring**: Real-time display of aggregation results and revenue
- **Visual Charts**: Use Echarts to display data trends
- **Responsive Design**: Adapted for various device screens

---

## 🛠️ Technology Stack

### Smart Contracts
- **Solidity** ^0.8.24
- **@fhevm/solidity** - Zama FHE library
- **Hardhat** - Development framework
- **OpenZeppelin** - Security contract library

### Frontend
- **React** ^19.1 - UI framework
- **Vite** ^7.1 - Build tool
- **Ant Design** ^5.27 - UI component library
- **Echarts** ^6.0 - Data visualization
- **ethers.js** ^6.15 - Blockchain interaction

### Network
- **Ethereum Sepolia Testnet** - Test network
- **Zama Gateway** - Decryption service

---

## 📖 Documentation

- 📘 [User Guide](./docs/USER_GUIDE.md) - Complete user manual
- 🎬 [Demo Script](./docs/DEMO_SCRIPT.md) - Complete demo video script
- ⚡ [Demo Quick Reference](./docs/DEMO_QUICK_REFERENCE.md) - 5-minute quick demo checklist
- 🏗️ [Architecture Documentation](./docs/ARCHITECTURE.md) - Detailed system architecture
- 🚀 [Deployment Guide](./docs/NETLIFY_DEPLOYMENT.md) - Deploy to Netlify
- 🔧 [Development Manual](./FHEVM_开发标准与解决方案手册.md) - Development standards and best practices

---

## 🎯 Use Cases

### 1. Trading Signal Aggregation
Multiple trading bots share signals, obtaining more accurate market predictions through aggregation while protecting their respective strategies.

### 2. Quantitative Strategy Collaboration
Quantitative teams can securely share strategy signals for collaborative analysis without worrying about strategy leaks.

### 3. Institutional Data Collaboration
Financial institutions can collaborate on analysis without revealing data to discover market opportunities.

### 4. Decentralized Signal Market
Create a decentralized signal market where traders can securely buy and sell valuable trading signals.

---

## 🏆 Project Highlights

- ✅ **Real Business Value** - Solves privacy pain points in trading signal sharing
- ✅ **Complete Technical Implementation** - Complete workflow from encryption, computation to decryption
- ✅ **Excellent User Experience** - Intuitive dashboard with real-time feedback
- ✅ **Production Ready** - Complete error handling and timeout mechanisms
- ✅ **Well-Documented** - Detailed development documentation and user guides

---

## 🤝 Contributing

We welcome contributions of all kinds! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🔗 Related Links

- 🌐 **Zama Official Website**: https://www.zama.ai
- 📚 **FHEVM Documentation**: https://docs.zama.ai/fhevm
- 🔧 **Relayer SDK**: https://github.com/zama-ai/relayer-sdk
- 🏆 **Developer Program**: https://www.zama.ai/programs/developer-program

---

## 📞 Contact

- 📧 Email: [Your Email]
- 💬 Discord: [0xxyiy0x]
- 🐦 Twitter: [Your Twitter]

---

<div align="center">

**Built with ❤️ using Zama FHEVM**

Made for [Zama Developer Program](https://www.zama.ai/programs/developer-program)

</div>

