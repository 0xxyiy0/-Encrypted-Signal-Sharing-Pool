/**
 * Contract ABIs
 * Dynamic ABI based on contract mode (Mock vs FHE)
 * Reference: Manual Section 12.3 A - 动态 ABI
 */

import { FHEVM_ENABLED } from './contracts';

// Common ABI (shared by both Mock and FHE)
const COMMON_ABI = [
  // Aggregation
  "function aggregateSignals(uint8 aggType, uint256[] calldata signalIds) external payable returns (uint256 aggregationId)",
  
  // View functions
  "function getSignalMetadata(uint256 signalId) external view returns (tuple(uint256 id, address contributor, uint8 signalType, uint256 timestamp, uint256 weight, bool active))",
  "function getAggregationResult(uint256 aggregationId) external view returns (uint32 result)",
  "function getContributorRevenue(address contributor) external view returns (uint256 totalRevenue)",
  "function signalCounter() external view returns (uint256)",
  "function aggregationCounter() external view returns (uint256)",
  "function aggregations(uint256) external view returns (uint256 id, uint8 aggType, uint32 result, uint256 timestamp, uint256 totalRevenue, bool revenueDistributed)",
  
  // Revenue
  "function distributeRevenue(uint256 aggregationId) external",
  
  // Events
  "event SignalContributed(uint256 indexed signalId, address indexed contributor, uint8 signalType, uint256 timestamp)",
  "event AggregationRequested(uint256 indexed aggregationId, uint8 aggType, uint256 signalCount)",
  "event AggregationCompleted(uint256 indexed aggregationId, uint32 result)",
  "event RevenueDistributed(uint256 indexed aggregationId, uint256 totalAmount, uint256 platformFee, uint256 participantShare)",
];

// Mock version ABI
const MOCK_ABI = [
  // Mock version: contributeSignal(uint8 signalType, uint256 weight)
  "function contributeSignal(uint8 signalType, uint256 weight) external payable returns (uint256 signalId)",
  ...COMMON_ABI,
];

// FHE version ABI
const FHE_ABI = [
  // FHE version: contributeSignal(uint8 signalType, bytes32 encryptedValue, bytes calldata inputProof, uint256 weight)
  // Note: externalEuint32 is bytes32 in ABI
  "function contributeSignal(uint8 signalType, bytes32 encryptedValue, bytes calldata inputProof, uint256 weight) external payable returns (uint256 signalId)",
  ...COMMON_ABI,
];

/**
 * Get contract ABI based on mode
 * Reference: Manual Section 12.3 A - 动态 ABI
 * @param {boolean} isFHE - Whether to use FHE mode
 * @returns {Array} Contract ABI
 */
export function getContractABI(isFHE = false) {
  return isFHE ? FHE_ABI : MOCK_ABI;
}

// Export default ABI (based on current mode)
export const SIGNAL_POOL_ABI = getContractABI(FHEVM_ENABLED);

