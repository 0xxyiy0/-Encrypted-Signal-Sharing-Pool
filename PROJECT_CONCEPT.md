# 🎯 Project Concept: Encrypted Signal Sharing Pool

## 📋 Project Overview

### Project Name
**SignalSync** (or **EncryptedSignalPool** / **FHE-SignalMarketplace**)

### Core Concept
Create an industry-grade "Encrypted Signal Sharing Pool" on FHEVM that allows multiple trading bots/participants to:
- Share their private trading signals **in encrypted form**
- Aggregate signals **using FHE computation** without revealing individual signals
- Allocate revenue based on contribution while maintaining signal privacy

### Problem Statement

**Current Challenges**:
1. Trading signals are valuable but sharing them risks strategy leakage
2. Aggregated signals are more powerful than individual signals
3. No trustless way to combine signals while keeping them private
4. Difficulty in incentivizing signal sharing without revealing strategies

**Our Solution**:
- Use FHE to encrypt signals on-chain
- Perform encrypted aggregation (mean, weighted average, voting, etc.)
- Decrypt only the final aggregated result
- Keep individual signals private
- Distribute revenue based on encrypted contribution measurement

---

## 🏗️ Architecture Design

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Signal Input │  │ View Pool    │  │ Revenue      │  │
│  │ (Encrypted)  │  │ (Encrypted)  │  │ Distribution │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────────┐
        │    Smart Contracts (FHEVM)          │
        │  ┌───────────────────────────────┐  │
        │  │ SignalPoolFHE.sol             │  │
        │  │ - Store encrypted signals     │  │
        │  │ - Aggregate (FHE computation) │  │
        │  │ - Gateway decryption          │  │
        │  │ - Revenue distribution        │  │
        │  └───────────────────────────────┘  │
        │  ┌───────────────────────────────┐  │
        │  │ SignalPoolMock.sol (Fallback) │  │
        │  └───────────────────────────────┘  │
        └─────────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────────┐
        │      Zama Gateway                   │
        │  - Decrypt aggregated results       │
        └─────────────────────────────────────┘
```

### Data Flow

```
1. Participant submits signal
   └─> Frontend encrypts signal (createEncryptedInput)
       └─> Stores euint32 signal value on-chain
       
2. Aggregation request
   └─> Contract computes encrypted aggregate (TFHE operations)
       └─> Requests Gateway decryption
       
3. Decryption
   └─> Gateway decrypts aggregated result
       └─> Updates contract state with plaintext result
       
4. Revenue distribution
   └─> Calculate contribution (based on signal correlation)
       └─> Distribute revenue to participants
```

---

## 📊 Core Features

### 1. Signal Contribution
- Participants submit encrypted trading signals
- Signal metadata (timestamp, type, confidence) can be plaintext
- Signal value is encrypted (euint32/euint64)

### 2. FHE Aggregation
- **Mean Signal**: Average of all signals
- **Weighted Average**: Weight by signal confidence or historical performance
- **Median Signal**: Middle value (requires sorting, more complex)
- **Signal Voting**: Count signals above/below threshold

### 3. Result Decryption
- Only final aggregated result is decrypted
- Individual signals remain encrypted
- Gateway integration for decryption workflow

### 4. Revenue Distribution
- Track encrypted contribution (signal correlation with final result)
- Distribute revenue based on contribution
- Platform fee (e.g., 5%)

---

## 🎯 Use Cases

### Use Case 1: Signal Aggregation
**Scenario**: 10 trading bots want to share signals for better predictions
- Each bot submits encrypted signal (e.g., price prediction: 100, 105, 98, ...)
- Pool computes encrypted mean: `mean = (signal1 + signal2 + ... + signal10) / 10`
- Gateway decrypts final mean (e.g., 102.3)
- All individual signals remain private

### Use Case 2: Weighted Signal Pool
**Scenario**: Signals from different quality sources
- High-quality bot: weight = 3
- Medium-quality bot: weight = 2
- Low-quality bot: weight = 1
- Compute weighted average: `weighted = (signal1*3 + signal2*2 + ...) / sum(weights)`

### Use Case 3: Signal Voting
**Scenario**: Binary signal (buy/sell = 1/0)
- Multiple bots vote on direction
- Count "buy" votes: `count = sum(signal > 0.5)`
- Decrypted count shows consensus

---

## 💰 Revenue Model

### Fee Structure
- **Platform Fee**: 5% of revenue
- **Participant Revenue**: 95% distributed based on contribution

### Contribution Measurement
- **Option 1**: Signal correlation with final result
  - Higher correlation → higher contribution → more revenue
- **Option 2**: Fixed contribution per signal
  - Each signal receives equal share
- **Option 3**: Weighted by signal quality/history
  - Historical performance determines weight

---

## 🔐 Privacy Protection

### What is Encrypted
- ✅ **Signal Values**: Individual trading signals (euint32)
- ✅ **Aggregated Intermediate Results**: During computation
- ✅ **Contribution Scores**: Encrypted until decryption

### What is Public
- ✅ **Signal Metadata**: Timestamp, type, participant address
- ✅ **Pool Statistics**: Total signals, aggregation type
- ✅ **Final Aggregated Result**: After decryption (intended)

### Privacy Guarantees
- Individual signals never decrypted on-chain
- Only final aggregated result is revealed
- Participants cannot see others' signals
- Gateway cannot correlate signals with participants (if designed properly)

---

## 📈 Technical Implementation

### Smart Contract Structure

```solidity
contract SignalPoolFHE is GatewayCaller {
    enum SignalType {
        PRICE_PREDICTION,
        VOLATILITY_ESTIMATE,
        BUY_SELL_VOTE
    }
    
    enum AggregationType {
        MEAN,
        WEIGHTED_MEAN,
        COUNT_ABOVE,
        COUNT_BELOW
    }
    
    struct Signal {
        uint256 id;
        address contributor;
        euint32 encryptedValue;    // FHE encrypted signal
        SignalType signalType;
        uint256 timestamp;
        uint256 weight;            // For weighted aggregation
    }
    
    struct AggregationRequest {
        uint256 requestId;
        AggregationType aggType;
        euint32 encryptedResult;    // FHE computation result
        uint32 decryptedResult;     // After Gateway decryption
        uint256 totalSignals;
        uint256 timestamp;
    }
    
    // Core functions
    function contributeSignal(
        SignalType signalType,
        einput encryptedValue,
        bytes calldata inputProof,
        uint256 weight
    ) external;
    
    function aggregateSignals(
        AggregationType aggType,
        uint256[] calldata signalIds
    ) external returns (uint256 requestId);
    
    function _handleDecryptionCallback(
        uint256 requestId,
        uint32 decryptedResult
    ) public onlyGateway;
    
    function distributeRevenue(
        uint256 aggregationId
    ) external;
}
```

### Frontend Encryption

```javascript
// Contribute a signal
async function contributeSignal(signalValue, signalType) {
  // 1. Encrypt signal
  const input = createEncryptedInput(
    CONTRACT_ADDRESS,
    signerAddress
  );
  input.add32(BigInt(signalValue));
  
  const { handles, inputProof } = await input.encrypt();
  
  // 2. Submit to contract
  await contract.contributeSignal(
    signalType,
    handles[0],
    inputProof,
    weight
  );
}
```

---

## 🎯 Competition Advantages

### Innovation
- ✅ Unique application of FHE in trading analytics
- ✅ Solves real problem (signal sharing privacy)
- ✅ Industry-relevant (trading bots, DeFi analytics)

### Technical Depth
- ✅ True FHEVM usage (not Mock)
- ✅ Multiple aggregation types
- ✅ Revenue distribution mechanism
- ✅ Gateway integration

### Practical Value
- ✅ Real-world use case
- ✅ Potential commercial value
- ✅ Clear user benefit

---

## 📋 Development Phases

### Phase 1: MVP (Mock Version)
- [ ] Basic signal contribution (plaintext)
- [ ] Mean aggregation (plaintext)
- [ ] Simple revenue distribution
- [ ] Basic UI

### Phase 2: FHE Integration
- [ ] FHE signal contribution
- [ ] FHE aggregation computation
- [ ] Gateway decryption workflow
- [ ] Encrypted revenue calculation

### Phase 3: Advanced Features
- [ ] Weighted aggregation
- [ ] Signal voting
- [ ] Historical performance tracking
- [ ] Advanced revenue distribution

### Phase 4: Polish
- [ ] Error handling
- [ ] Gateway timeout handling
- [ ] UI/UX improvements
- [ ] Documentation

---

## 🔗 References

### Similar Projects (Reference)
- **Belief Protocol**: Privacy-preserving conviction markets
- **CAMM**: Confidential AMM with encrypted balances
- **Data Marketplace**: Encrypted data queries (from manual)

### Key Differences
- **Our focus**: Trading signals (time-series, continuous)
- **Aggregation**: Mean, weighted, voting (not just queries)
- **Revenue model**: Contribution-based distribution

---

**Last Updated**: 2025-01-XX  
**Status**: Concept Defined  
**Next Step**: Architecture Design & Smart Contract Development

