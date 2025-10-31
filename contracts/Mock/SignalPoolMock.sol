// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/ISignalPool.sol";

/**
 * @title SignalPoolMock
 * @notice Mock version of Signal Pool for testing and demonstration
 * @dev Uses plaintext values instead of FHE encryption
 */
contract SignalPoolMock is ISignalPool, Ownable, ReentrancyGuard {
    
    // ========== State Variables ==========
    uint256 public signalCounter;
    uint256 public aggregationCounter;
    uint256 public constant PLATFORM_FEE_PERCENT = 5;
    
    struct Signal {
        uint256 id;
        address contributor;
        uint32 value;           // Plaintext value (Mock)
        SignalType signalType;
        uint256 timestamp;
        uint256 weight;
        bool active;
    }
    
    struct Aggregation {
        uint256 id;
        AggregationType aggType;
        uint256[] signalIds;
        uint32 result;          // Plaintext result (Mock)
        uint256 timestamp;
        uint256 totalRevenue;
        bool revenueDistributed;
    }
    
    mapping(uint256 => Signal) public signals;
    mapping(uint256 => Aggregation) public aggregations;
    mapping(address => uint256) public contributorRevenue;
    
    // ========== Constructor ==========
    constructor() Ownable(msg.sender) {}
    
    // Note: Events are defined in ISignalPool interface
    
    // ========== Core Functions ==========
    
    /**
     * @notice Contribute a signal (Mock version - plaintext)
     * @param signalType Type of signal
     * @param weight Weight for weighted aggregation
     * @return signalId The ID of the created signal
     * 
     * Note: This is a simplified version. For actual implementation,
     * you may want to accept value as a separate parameter or via msg.value
     */
    function contributeSignal(
        SignalType signalType,
        uint256 weight
    ) external payable returns (uint256 signalId) {
        // For Mock version, we'll use msg.value as the signal value (scaled)
        // In real implementation, you might accept value as parameter
        uint32 value = uint32(msg.value / 1e15); // Scale down if needed
        require(weight > 0, "Weight must be positive");
        
        signalCounter++;
        signalId = signalCounter;
        
        signals[signalId] = Signal({
            id: signalId,
            contributor: msg.sender,
            value: value, // Using scaled msg.value
            signalType: signalType,
            timestamp: block.timestamp,
            weight: weight,
            active: true
        });
        
        emit SignalContributed(signalId, msg.sender, signalType, block.timestamp);
        
        return signalId;
    }
    
    /**
     * @notice Aggregate signals (Mock version - plaintext computation)
     * @param aggType Aggregation type
     * @param signalIds Array of signal IDs to aggregate
     * @return aggregationId The ID of the aggregation
     */
    function aggregateSignals(
        AggregationType aggType,
        uint256[] calldata signalIds
    ) external payable returns (uint256 aggregationId) {
        require(signalIds.length > 0, "No signals provided");
        
        aggregationCounter++;
        aggregationId = aggregationCounter;
        
        // Compute aggregation (plaintext)
        uint32 result = _computeAggregation(aggType, signalIds);
        
        aggregations[aggregationId] = Aggregation({
            id: aggregationId,
            aggType: aggType,
            signalIds: signalIds,
            result: result,
            timestamp: block.timestamp,
            totalRevenue: msg.value,
            revenueDistributed: false
        });
        
        emit AggregationRequested(aggregationId, aggType, signalIds.length);
        emit AggregationCompleted(aggregationId, result);
        
        return aggregationId;
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
    
    function getSignalMetadata(uint256 signalId) external view returns (SignalMetadata memory) {
        Signal storage signal = signals[signalId];
        return SignalMetadata({
            id: signal.id,
            contributor: signal.contributor,
            signalType: signal.signalType,
            timestamp: signal.timestamp,
            weight: signal.weight,
            active: signal.active
        });
    }
    
    function getAggregationResult(uint256 aggregationId) external view returns (uint32) {
        return aggregations[aggregationId].result;
    }
    
    function getContributorRevenue(address contributor) external view returns (uint256) {
        return contributorRevenue[contributor];
    }
    
    // ========== Internal Functions ==========
    
    function _computeAggregation(
        AggregationType aggType,
        uint256[] calldata signalIds
    ) internal view returns (uint32) {
        if (aggType == AggregationType.MEAN) {
            return _computeMean(signalIds);
        } else if (aggType == AggregationType.WEIGHTED_MEAN) {
            return _computeWeightedMean(signalIds);
        } else if (aggType == AggregationType.COUNT_ABOVE) {
            // For mock, we need a threshold parameter - simplified
            return uint32(signalIds.length);
        } else {
            return uint32(signalIds.length);
        }
    }
    
    function _computeMean(uint256[] calldata signalIds) internal view returns (uint32) {
        uint256 sum = 0;
        for (uint256 i = 0; i < signalIds.length; i++) {
            sum += signals[signalIds[i]].value;
        }
        return uint32(sum / signalIds.length);
    }
    
    function _computeWeightedMean(uint256[] calldata signalIds) internal view returns (uint32) {
        uint256 weightedSum = 0;
        uint256 totalWeight = 0;
        
        for (uint256 i = 0; i < signalIds.length; i++) {
            Signal storage signal = signals[signalIds[i]];
            weightedSum += signal.value * signal.weight;
            totalWeight += signal.weight;
        }
        
        require(totalWeight > 0, "Total weight must be positive");
        return uint32(weightedSum / totalWeight);
    }
    
    // ========== Owner Functions ==========
    
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}

