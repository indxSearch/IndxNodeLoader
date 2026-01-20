/**
 * Type definitions for IndxSearchLib / IndxCloudApi
 *
 * These types mirror the C# IndxSearchLib types used by the IndxCloudApi.
 * Completed based on Swagger/OpenAPI documentation (IndxSearchLib 4.1.2).
 *
 * ## Usage
 *
 * This file can be used for:
 * - **Dataset Loading** (this project) - Configure and load datasets
 * - **Search Client Applications** - Build search features using the API
 *
 * Most types (~85%) are for search operations (CloudQuery, Result, FilterProxy, etc.)
 * and can be copied directly into search client projects.
 *
 * ## Updating Types
 *
 * To add or update types, check the Swagger documentation at:
 * https://localhost:5001/swagger
 */

// Enums

/**
 * Dataset system state
 * Check this before performing operations (should be Ready = 4 for searching)
 */
export enum SystemState {
  Hibernated = -1,
  Created = 0,
  Loading = 1,
  Loaded = 2,
  Indexing = 3,
  Ready = 4,      // Dataset is ready for searching
  Error = 255
}

/**
 * Search field weight (importance in search results)
 * Lower number = higher priority in search ranking
 */
export enum Weight {
  High = 0,   // Highest priority (e.g., title)
  Med = 1,    // Medium priority (e.g., description)
  Low = 2     // Lowest priority (e.g., tags)
}

/**
 * Boost strength for search result boosting
 */
export enum BoostStrength {
  Low = 1,
  Medium = 2,
  High = 3
}

// Core Interfaces
export interface SystemStatus {
  documentCount: number;
  errorMessage: string | null;
  invalidArgument: boolean;
  invalidDataSetName: boolean;
  invalidState: boolean;
  licenseInfo: LicenseInfo;
  reIndexRequired: boolean;
  searchCounter: number;
  secondsToIndex: number;
  systemState: SystemState;
  timeOfInstanceCreation: string;
  timeOfLastIndexBuild: string;
  tooLongClientText: boolean;
  tooLongSearchText: boolean;
  unknownConfigurationError: boolean;
  version: string | null;
}

export interface LicenseInfo {
  description: string | null;
  documentLimit: number;
  documentLimitExceeded: boolean;
  expirationDate: string;
  licensed: boolean;
  licensedTo: string | null;
  licenseFileName: string | null;
  type: string | null;
  validLicense: boolean;
}

/**
 * CloudQuery - Search query parameters
 *
 * Note: Property names match Swagger (filter, boosts) not C# parameter names (filterProxy, boostProxy)
 * This is the correct format for the API
 */
export interface CloudQuery {
  text: string | null;
  maxNumberOfRecordsToReturn?: number;
  sortBy?: string | null;
  sortAscending?: boolean;
  filter?: FilterProxy | null;
  boosts?: BoostProxy[] | null;
  enableBoost?: boolean;
  enableCoverage?: boolean;
  enableFacets?: boolean;
  coverageDepth?: number;
  coverageSetup?: CoverageSetup | null;
  removeDuplicates?: boolean;
  logPrefix?: string | null;
  timeOutLimitMilliseconds?: number;
}

export interface CoverageSetup {
  // Coverage setup properties (if needed in future)
  [key: string]: any;
}

export interface Result {
  records: SearchRecord[] | null;
  facets: { [key: string]: StringInt32KeyValuePair[] } | null;
  didTimeOut: boolean;
  truncationIndex: number;
  truncationScore: number;
}

export interface SearchRecord {
  documentKey: number;
  score: number;
}

export interface StringInt32KeyValuePair {
  key: string;
  value: number;
}

// Filter Interfaces

/**
 * Filter proxy reference (returned from CreateRangeFilter/CreateValueFilter)
 * Use this in CloudQuery.filter or when combining filters
 */
export interface FilterProxy {
  id: string;
  fieldName: string;
}

/**
 * Range filter input (e.g., price between 10 and 100)
 * Create via: PUT /api/CreateRangeFilter/{dataSetName}
 */
export interface RangeFilterProxy {
  fieldName: string;
  lowerLimit: number;
  upperLimit: number;
}

/**
 * Value filter input (e.g., genre equals "Action")
 * Create via: PUT /api/CreateValueFilter/{dataSetName}
 */
export interface ValueFilterProxy {
  fieldName: string;
  value: any;
}

/**
 * Combine two filters with AND/OR logic
 * Create via: PUT /api/CombineFilters/{dataSetName}
 */
export interface CombinedFilterProxy {
  filter1: FilterProxy;
  filter2: FilterProxy;
  useAnd: boolean;  // true = AND, false = OR
}

// Boost Interface

/**
 * Boost search results matching a filter
 * Create via: PUT /api/CreateBoost/{dataSetName}
 */
export interface BoostProxy {
  filterProxy: FilterProxy;
  boostStrength: BoostStrength;
}
