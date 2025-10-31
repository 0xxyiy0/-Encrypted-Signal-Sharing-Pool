// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ISignalPool
 * @notice Interface for Signal Pool contracts (both Mock and FHE versions)
 */
interface ISignalPool {
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
    
    struct SignalMetadata {
        uint256 id;
        address contributor;
        SignalType signalType;
        uint256 timestamp;
        uint256 weight;
        bool active;
    }
    
    /**
     * @notice Contribute a signal to the pool
     * @param signalType Type of signal
     * @param weight Weight for weighted aggregation
     * @return signalId The ID of the created signal
     * 
     * Note: Mock version uses plaintext value, FHE version uses encryptedValue + inputProof
     * This is a simplified interface - actual implementations may have different signatures
     */
    function contributeSignal(
        SignalType signalType,
        uint256 weight
    ) external payable returns (uint256 signalId);
    
    /**
     * @notice Aggregate signals
     * @param aggType Aggregation type
     * @param signalIds Array of signal IDs to aggregate
     * @return aggregationId The ID of the aggregation request
     */
    function aggregateSignals(
        AggregationType aggType,
        uint256[] calldata signalIds
    ) external payable returns (uint256 aggregationId);
    
    /**
     * @notice Get signal metadata
     * @param signalId Signal ID
     * @return metadata Signal metadata
     */
    function getSignalMetadata(uint256 signalId) external view returns (SignalMetadata memory metadata);
    
    /**
     * @notice Get aggregated result
     * @param aggregationId Aggregation ID
     * @return result Decrypted aggregated result
     */
    function getAggregationResult(uint256 aggregationId) external view returns (uint32 result);
    
    /**
     * @notice Distribute revenue to contributors
     * @param aggregationId Aggregation ID
     */
    function distributeRevenue(uint256 aggregationId) external;
    
    /**
     * @notice Get total revenue for a contributor
     * @param contributor Contributor address
     * @return totalRevenue Total revenue earned
     */
    function getContributorRevenue(address contributor) external view returns (uint256 totalRevenue);
    
    // Events
    event SignalContributed(
        uint256 indexed signalId,
        address indexed contributor,
        SignalType signalType,
        uint256 timestamp
    );
    
    event AggregationRequested(
        uint256 indexed aggregationId,
        AggregationType aggType,
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
}

