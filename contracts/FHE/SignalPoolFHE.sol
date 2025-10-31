// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/ISignalPool.sol";
import "../interfaces/ISignalPoolFHE.sol";

/**
 * @title SignalPoolFHE
 * @notice FHE version of Signal Pool with encrypted signals and Gateway decryption
 * @dev Implements FHEVM operations for privacy-preserving signal aggregation
 * Inherits SepoliaConfig for correct Sepolia network configuration
 */
contract SignalPoolFHE is ISignalPoolFHE, SepoliaConfig, Ownable, ReentrancyGuard {
    
    // ========== State Variables ==========
    uint256 public signalCounter;
    uint256 public aggregationCounter;
    uint256 public constant PLATFORM_FEE_PERCENT = 5;
    
    enum AggregationStatus {
        PENDING,
        PROCESSING,
        COMPLETED,
        FAILED
    }
    
    struct Signal {
        uint256 id;
        address contributor;
        euint32 encryptedValue;    // FHE encrypted signal
        ISignalPoolFHE.SignalType signalType;  // Use enum from interface
        uint256 timestamp;
        uint256 weight;
        bool active;
    }
    
    struct Aggregation {
        uint256 id;
        ISignalPoolFHE.AggregationType aggType;  // Use enum from interface
        uint256[] signalIds;
        euint32 encryptedResult;    // FHE computation result
        uint32 decryptedResult;     // After public decryption
        AggregationStatus status;
        uint256 timestamp;
        uint256 totalRevenue;
        bool revenueDistributed;
    }
    
    mapping(uint256 => Signal) public signals;
    mapping(uint256 => Aggregation) public aggregations;
    mapping(address => uint256) public contributorRevenue;
    
    // ========== Constructor ==========
    constructor() Ownable(msg.sender) {}
    
    // ========== Events ==========
    // Re-declare events for compatibility
    event SignalContributed(
        uint256 indexed signalId,
        address indexed contributor,
        ISignalPoolFHE.SignalType signalType,
        uint256 timestamp
    );
    
    event AggregationRequested(
        uint256 indexed aggregationId,
        ISignalPoolFHE.AggregationType aggType,
        uint256 signalCount
    );
    
    event AggregationCompleted(
        uint256 indexed aggregationId,
        uint32 result
    );
    
    event RevenueDistributed(
        uint256 indexed aggregationId,
        uint256 totalAmount,
        uint256 platformFee,
        uint256 participantShare
    );
    
    // ========== Core Functions ==========
    
    /**
     * @notice Contribute an encrypted signal to the pool (FHE version)
     * @param signalType Type of signal
     * @param encryptedValue Encrypted signal value (externalEuint32)
     * @param inputProof Encryption proof (bytes)
     * @param weight Weight for weighted aggregation
     * @return signalId The ID of the created signal
     */
    function contributeSignal(
        ISignalPoolFHE.SignalType signalType,
        externalEuint32 encryptedValue,
        bytes calldata inputProof,
        uint256 weight
    ) external payable returns (uint256 signalId) {
        require(weight > 0, "Weight must be positive");
        
        signalCounter++;
        signalId = signalCounter;
        
        // Convert externalEuint32 to euint32
        euint32 encryptedSignal = FHE.fromExternal(encryptedValue, inputProof);
        
        // Allow contract to use this encrypted value
        FHE.allowThis(encryptedSignal);
        
        signals[signalId] = Signal({
            id: signalId,
            contributor: msg.sender,
            encryptedValue: encryptedSignal,
            signalType: signalType,
            timestamp: block.timestamp,
            weight: weight,
            active: true
        });
        
        emit SignalContributed(signalId, msg.sender, signalType, block.timestamp);
        
        return signalId;
    }
    
    /**
     * @notice Aggregate signals using FHE computation
     * @param aggType Aggregation type
     * @param signalIds Array of signal IDs to aggregate
     * @return aggregationId The ID of the aggregation request
     */
    function aggregateSignals(
        ISignalPoolFHE.AggregationType aggType,
        uint256[] calldata signalIds
    ) external payable returns (uint256 aggregationId) {
        require(signalIds.length > 0, "No signals provided");
        
        aggregationCounter++;
        aggregationId = aggregationCounter;
        
        // Compute encrypted aggregation
        euint32 encryptedResult = _computeEncryptedAggregation(aggType, signalIds);
        
        // Make result publicly decryptable (can be decrypted via Gateway)
        FHE.makePubliclyDecryptable(encryptedResult);
        
        aggregations[aggregationId] = Aggregation({
            id: aggregationId,
            aggType: aggType,
            signalIds: signalIds,
            encryptedResult: encryptedResult,
            decryptedResult: 0, // Will be set after public decryption
            status: AggregationStatus.PENDING,
            timestamp: block.timestamp,
            totalRevenue: msg.value,
            revenueDistributed: false
        });
        
        emit AggregationRequested(aggregationId, aggType, signalIds.length);
        
        return aggregationId;
    }
    
    /**
     * @notice Update aggregation result after public decryption
     * @param aggregationId Aggregation ID
     * @param decryptedResult Decrypted result (from frontend publicDecrypt)
     */
    function updateAggregationResult(
        uint256 aggregationId,
        uint32 decryptedResult
    ) external {
        Aggregation storage agg = aggregations[aggregationId];
        require(agg.id > 0, "Invalid aggregation");
        require(agg.status == AggregationStatus.PENDING, "Already processed");
        
        agg.decryptedResult = decryptedResult;
        agg.status = AggregationStatus.COMPLETED;
        
        emit AggregationCompleted(aggregationId, decryptedResult);
    }
    
    /**
     * @notice Distribute revenue to contributors
     * @param aggregationId Aggregation ID
     */
    function distributeRevenue(
        uint256 aggregationId
    ) external nonReentrant {
        Aggregation storage agg = aggregations[aggregationId];
        require(agg.id > 0, "Invalid aggregation");
        require(agg.status == AggregationStatus.COMPLETED, "Aggregation not completed");
        require(!agg.revenueDistributed, "Already distributed");
        
        uint256 totalRevenue = agg.totalRevenue;
        uint256 platformFee = (totalRevenue * PLATFORM_FEE_PERCENT) / 100;
        uint256 participantShare = totalRevenue - platformFee;
        
        // Equal distribution (can be improved with contribution-based)
        uint256 perSignal = participantShare / agg.signalIds.length;
        
        for (uint256 i = 0; i < agg.signalIds.length; i++) {
            Signal storage signal = signals[agg.signalIds[i]];
            if (signal.active) {
                contributorRevenue[signal.contributor] += perSignal;
                payable(signal.contributor).transfer(perSignal);
            }
        }
        
        // Transfer platform fee
        if (platformFee > 0) {
            payable(owner()).transfer(platformFee);
        }
        
        agg.revenueDistributed = true;
        
        emit RevenueDistributed(aggregationId, totalRevenue, platformFee, participantShare);
    }
    
    // ========== View Functions ==========
    
    function getSignalMetadata(uint256 signalId) external view returns (ISignalPool.SignalMetadata memory) {
        Signal storage signal = signals[signalId];
        return ISignalPool.SignalMetadata({
            id: signal.id,
            contributor: signal.contributor,
            signalType: ISignalPool.SignalType(uint8(signal.signalType)),
            timestamp: signal.timestamp,
            weight: signal.weight,
            active: signal.active
        });
    }
    
    function getAggregationResult(uint256 aggregationId) external view returns (uint32) {
        Aggregation storage agg = aggregations[aggregationId];
        require(agg.status == AggregationStatus.COMPLETED, "Aggregation not completed");
        return agg.decryptedResult;
    }
    
    function getContributorRevenue(address contributor) external view returns (uint256) {
        return contributorRevenue[contributor];
    }
    
    // ========== Internal FHE Operations ==========
    
    function _computeEncryptedAggregation(
        AggregationType aggType,
        uint256[] calldata signalIds
    ) internal returns (euint32) {
        if (aggType == AggregationType.MEAN) {
            return _computeMean(signalIds);
        } else if (aggType == AggregationType.WEIGHTED_MEAN) {
            return _computeWeightedMean(signalIds);
        } else {
            // COUNT_ABOVE and COUNT_BELOW require threshold parameter
            // Simplified: return sum for now
            return _computeMean(signalIds);
        }
    }
    
    function _computeMean(uint256[] calldata signalIds) internal returns (euint32) {
        if (signalIds.length == 0) {
            return FHE.asEuint32(0);
        }
        
        euint32 sum = signals[signalIds[0]].encryptedValue;
        
        for (uint256 i = 1; i < signalIds.length; i++) {
            Signal storage signal = signals[signalIds[i]];
            require(signal.active, "Signal not active");
            sum = FHE.add(sum, signal.encryptedValue);
        }
        
        return FHE.div(sum, uint32(signalIds.length));
    }
    
    function _computeWeightedMean(uint256[] calldata signalIds) internal returns (euint32) {
        require(signalIds.length > 0, "No signals");
        
        Signal storage firstSignal = signals[signalIds[0]];
        require(firstSignal.active, "Signal not active");
        
        uint256 totalWeight = firstSignal.weight;
        euint32 weightedSum = FHE.mul(firstSignal.encryptedValue, uint32(firstSignal.weight));
        
        for (uint256 i = 1; i < signalIds.length; i++) {
            Signal storage signal = signals[signalIds[i]];
            require(signal.active, "Signal not active");
            
            // Multiply encrypted value by weight (plaintext)
            euint32 weightedValue = FHE.mul(signal.encryptedValue, uint32(signal.weight));
            weightedSum = FHE.add(weightedSum, weightedValue);
            totalWeight += signal.weight;
        }
        
        require(totalWeight > 0, "Total weight must be positive");
        return FHE.div(weightedSum, uint32(totalWeight));
    }
    
    // ========== Owner Functions ==========
    
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}

