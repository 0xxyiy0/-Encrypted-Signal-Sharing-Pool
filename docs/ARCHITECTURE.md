# 🏗️ System Architecture: Encrypted Signal Sharing Pool

## 📐 Architecture Overview

### System Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                         │
│  React Frontend (Vite)                                       │
│  - Signal Contribution UI                                    │
│  - Pool Analytics Dashboard                                  │
│  - Revenue Distribution View                                 │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│                    Encryption Layer                           │
│  @zama-fhe/relayer-sdk                                       │
│  - createEncryptedInput()                                    │
│  - Frontend encryption before submission                     │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│                    Smart Contract Layer                       │
│  ┌────────────────────┐  ┌────────────────────┐           │
│  │ SignalPoolFHE.sol  │  │ SignalPoolMock.sol   │           │
│  │ - FHE Operations   │  │ - Plaintext Fallback│           │
│  └────────────────────┘  └────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│                    Gateway Layer                              │
│  Zama Gateway                                                │
│  - Decrypt aggregated results                                │
│  - Public decryption endpoint                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### 1. Signal Contribution Flow

```
Participant
    │
    ├─> Input signal value (e.g., price prediction: 102.5)
    │
    ├─> Frontend: createEncryptedInput(contractAddress, signerAddress)
    │   └─> input.add32(BigInt(value * 1000)) // Scale to integer
    │
    ├─> Frontend: input.encrypt()
    │   └─> Returns: { handles: [einput], inputProof: bytes }
    │
    ├─> Contract: contributeSignal(einput, inputProof, signalType, weight)
    │   └─> TFHE.asEuint32(einput, inputProof) → stored as euint32
    │
    └─> Event: SignalContributed(signalId, contributor, timestamp)
```

### 2. Aggregation Flow

```
Request Aggregation
    │
    ├─> Contract: aggregateSignals(aggregationType, signalIds[])
    │   │
    │   ├─> FHE Computation (depending on type):
    │   │   ├─> MEAN: sum = TFHE.add(signals), result = TFHE.div(sum, count)
    │   │   ├─> WEIGHTED_MEAN: weighted_sum = Σ(signal * weight), result = weighted_sum / total_weights
    │   │   └─> COUNT_ABOVE: count = Σ(TFHE.gt(signal, threshold) ? 1 : 0)
    │   │
    │   └─> Returns: euint32 encryptedResult
    │
    ├─> Gateway: requestDecryption(encryptedResult, callback)
    │   └─> Returns: requestId
    │
    ├─> Frontend: Poll Gateway (/v1/public-decrypt)
    │   └─> Poll every 5 seconds, max 60 attempts
    │
    ├─> Gateway: Decrypt result (plaintext value)
    │   └─> Calls contract callback
    │
    ├─> Contract: _handleDecryptionCallback(requestId, decryptedResult)
    │   └─> Updates aggregation state
    │
    └─> Event: AggregationCompleted(requestId, decryptedResult)
```

### 3. Revenue Distribution Flow

```
Distribute Revenue
    │
    ├─> Calculate contribution (encrypted or plaintext):
    │   ├─> Option A: Correlation with final result (requires FHE)
    │   │   └─> correlation = TFHE operations between signal and result
    │   │
    │   └─> Option B: Equal distribution (simple)
    │       └─> Each signal gets (revenue / total_signals)
    │
    ├─> Distribute to participants:
    │   ├─> Platform fee: 5%
    │   ├─> Participant share: 95% / contributors
    │   └─> Transfer ETH
    │
    └─> Event: RevenueDistributed(aggregationId, totalAmount, perSignal)
```

---

## 📦 Contract Structure

### SignalPoolFHE.sol

```solidity
contract SignalPoolFHE is GatewayCaller, Ownable, ReentrancyGuard {
    
    // ========== Enums ==========
    enum SignalType {
        PRICE_PREDICTION,      // Continuous value
        VOLATILITY_ESTIMATE,   // Continuous value
        BUY_SELL_VOTE          // Binary (0 or 1)
    }
    
    enum AggregationType {
        MEAN,
        WEIGHTED_MEAN,
        COUNT_ABOVE,
        COUNT_BELOW,
        MEDIAN                 // More complex, requires sorting
    }
    
    enum AggregationStatus {
        PENDING,
        PROCESSING,
        COMPLETED,
        FAILED
    }
    
    // ========== Structs ==========
    struct Signal {
        uint256 id;
        address contributor;
        euint32 encryptedValue;
        SignalType signalType;
        uint256 timestamp;
        uint256 weight;                    // For weighted aggregation
        bool active;
    }
    
    struct Aggregation {
        uint256 id;
        AggregationType aggType;
        uint256[] signalIds;
        euint32 encryptedResult;           // FHE computation result
        uint32 decryptedResult;            // After Gateway decryption
        AggregationStatus status;
        uint256 requestId;                 // Gateway request ID
        uint256 timestamp;
        uint256 totalRevenue;
        bool revenueDistributed;
    }
    
    // ========== State Variables ==========
    uint256 public signalCounter;
    uint256 public aggregationCounter;
    uint256 public constant PLATFORM_FEE_PERCENT = 5;
    uint256 public constant CALLBACK_GAS_LIMIT = 500000;
    uint256 public constant DECRYPTION_TIMEOUT = 30 minutes;
    
    mapping(uint256 => Signal) public signals;
    mapping(uint256 => Aggregation) public aggregations;
    mapping(uint256 => uint256) public requestIdToAggregation;  // Gateway requestId → aggregationId
    mapping(address => uint256) public contributorRevenue;      // Total revenue per contributor
    
    // ========== Events ==========
    event SignalContributed(
        uint256 indexed signalId,
        address indexed contributor,
        SignalType signalType,
        uint256 timestamp
    );
    
    event AggregationRequested(
        uint256 indexed aggregationId,
        uint256 indexed requestId,
        AggregationType aggType,
        uint256 signalCount
    );
    
    event AggregationCompleted(
        uint256 indexed aggregationId,
        uint256 indexed requestId,
        uint32 decryptedResult
    );
    
    event RevenueDistributed(
        uint256 indexed aggregationId,
        uint256 totalAmount,
        uint256 platformFee,
        uint256 participantShare
    );
    
    // ========== Core Functions ==========
    
    /**
     * @notice Contribute an encrypted signal to the pool
     */
    function contributeSignal(
        SignalType signalType,
        einput encryptedValue,
        bytes calldata inputProof,
        uint256 weight
    ) external {
        // Implementation
    }
    
    /**
     * @notice Aggregate signals using FHE computation
     */
    function aggregateSignals(
        AggregationType aggType,
        uint256[] calldata signalIds
    ) external payable returns (uint256) {
        // Implementation
    }
    
    /**
     * @notice Gateway callback for decryption
     */
    function _handleDecryptionCallback(
        uint256 requestId,
        uint32 decryptedResult
    ) public onlyGateway {
        // Implementation
    }
    
    /**
     * @notice Distribute revenue to contributors
     */
    function distributeRevenue(
        uint256 aggregationId
    ) external nonReentrant {
        // Implementation
    }
    
    // ========== Internal FHE Operations ==========
    
    function _computeMean(uint256[] calldata signalIds) 
        internal view returns (euint32) {
        // Implementation
    }
    
    function _computeWeightedMean(uint256[] calldata signalIds)
        internal view returns (euint32) {
        // Implementation
    }
    
    function _countAbove(uint256[] calldata signalIds, euint32 threshold)
        internal view returns (euint32) {
        // Implementation
    }
}
```

---

## 🎨 Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── SignalContribution/
│   │   ├── SignalForm.jsx          # Input form
│   │   └── EncryptionProgress.jsx  # Encryption status
│   │
│   ├── PoolView/
│   │   ├── SignalList.jsx          # List of signals (metadata only)
│   │   ├── AggregationCard.jsx     # Aggregation request/result
│   │   └── Analytics.jsx           # Pool statistics
│   │
│   ├── Revenue/
│   │   ├── RevenueDistribution.jsx # Distribution UI
│   │   └── ContributorStats.jsx   # Personal revenue stats
│   │
│   └── Common/
│       ├── WalletConnect.jsx       # Wallet connection
│       └── DecryptionProgress.jsx  # Gateway polling UI
│
├── hooks/
│   ├── useSignalPool.js            # Contract interaction
│   ├── useEncryption.js            # Frontend encryption
│   ├── useDecryption.js            # Gateway polling
│   └── useContractMode.js         # FHE/Mock mode switch
│
├── utils/
│   ├── relayerClient.js            # Gateway client
│   ├── fheEncryption.js            # Encryption utilities
│   └── contractReader.js           # Safe contract reads
│
└── config/
    ├── contracts.js                # Contract addresses
    └── network.js                  # Network configuration
```

### Key Hooks

#### useSignalPool.js
```javascript
export function useSignalPool() {
  const contributeSignal = async (signalValue, signalType, weight) => {
    // 1. Encrypt signal
    const { encryptedInput, inputProof } = await encryptSignal(signalValue);
    
    // 2. Submit to contract
    const tx = await contract.contributeSignal(
      signalType,
      encryptedInput,
      inputProof,
      weight
    );
    
    // 3. Wait for confirmation
    const receipt = await waitForTransaction(tx.hash);
    
    return receipt;
  };
  
  const aggregateSignals = async (aggType, signalIds) => {
    // Request aggregation
    // Poll Gateway
    // Return result
  };
  
  return { contributeSignal, aggregateSignals, ... };
}
```

#### useEncryption.js
```javascript
export function useEncryption() {
  const encryptSignal = async (signalValue, signalType) => {
    const input = createEncryptedInput(
      CONTRACT_ADDRESS,
      signerAddress
    );
    
    // Scale signal to integer (preserve decimals)
    const scaledValue = Math.round(signalValue * 1000);
    input.add32(BigInt(scaledValue));
    
    const { handles, inputProof } = await input.encrypt();
    
    return {
      encryptedInput: handles[0],
      inputProof: inputProof
    };
  };
  
  return { encryptSignal };
}
```

---

## 🔐 Security Considerations

### Privacy Guarantees

1. **Signal Privacy**:
   - Individual signals never decrypted on-chain
   - Only aggregated result is revealed
   - Gateway cannot see individual signals (if properly designed)

2. **Contribution Privacy**:
   - Contribution scores can be computed in encrypted form
   - Reveal only after aggregation completion

3. **Gateway Trust**:
   - Gateway can decrypt, but cannot correlate with contributors
   - Consider using multiple Gateway requests to obscure patterns

### Attack Vectors

1. **Front-running**:
   - Solution: Use commit-reveal scheme or delayed aggregation

2. **Signal Manipulation**:
   - Solution: Require stake/deposit for contribution
   - Penalize bad actors (signals far from consensus)

3. **Gateway Abuse**:
   - Solution: Rate limiting, cost recovery

---

## 📊 Performance Optimization

### Optimization Strategies

1. **Batch Processing**:
   - Aggregate multiple pools simultaneously
   - Use Gateway batch decryption (if available)

2. **Caching**:
   - Cache encrypted intermediate results
   - Store decrypted results for UI

3. **Lazy Decryption**:
   - Only decrypt when user requests
   - Background decryption for analytics

---

## 🚀 Deployment Strategy

### Phase 1: Mock Deployment (Sepolia)
- Deploy Mock contract
- Test full workflow
- UI/UX refinement

### Phase 2: FHE Deployment (Sepolia)
- Deploy FHE contract
- Test Gateway integration
- Performance testing

### Phase 3: Production (Zama Devnet/Mainnet)
- Deploy to Zama network
- Public beta testing
- Monitor Gateway stability

---

**Last Updated**: 2025-01-XX  
**Status**: Architecture Design  
**Next Step**: Smart Contract Implementation

