// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import "./ISignalPool.sol";

/**
 * @title ISignalPoolFHE
 * @notice Extended interface for FHE version with encrypted input parameters
 * 
 * Note: FHE contract implements both ISignalPool and ISignalPoolFHE
 * by providing the FHE version of contributeSignal
 */
interface ISignalPoolFHE {
    // Re-export enums (must redeclare, can't use type alias in Solidity)
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
    
    /**
     * @notice Contribute an encrypted signal to the pool (FHE version)
     * @param signalType Type of signal
     * @param encryptedValue Encrypted signal value (externalEuint32)
     * @param inputProof Encryption proof (bytes)
     * @param weight Weight for weighted aggregation
     * @return signalId The ID of the created signal
     */
    function contributeSignal(
        SignalType signalType,
        externalEuint32 encryptedValue,
        bytes calldata inputProof,
        uint256 weight
    ) external payable returns (uint256 signalId);
    
    /**
     * @notice Aggregate signals
     */
    function aggregateSignals(
        AggregationType aggType,
        uint256[] calldata signalIds
    ) external payable returns (uint256 aggregationId);
    
    /**
     * @notice Get signal metadata
     */
    function getSignalMetadata(uint256 signalId) external view returns (ISignalPool.SignalMetadata memory metadata);
    
    /**
     * @notice Get aggregated result
     */
    function getAggregationResult(uint256 aggregationId) external view returns (uint32 result);
    
    /**
     * @notice Distribute revenue
     */
    function distributeRevenue(uint256 aggregationId) external;
    
    /**
     * @notice Get contributor revenue
     */
    function getContributorRevenue(address contributor) external view returns (uint256 totalRevenue);
    
    /**
     * @notice Update aggregation result after public decryption
     * @param aggregationId Aggregation ID
     * @param decryptedResult Decrypted result (from frontend publicDecrypt)
     */
    function updateAggregationResult(
        uint256 aggregationId,
        uint32 decryptedResult
    ) external;
}
