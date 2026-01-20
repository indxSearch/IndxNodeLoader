/**
 * API layer for IndxCloudApi
 * Converts C# LoadAPI.cs to TypeScript with axios
 */
import { AxiosInstance } from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { ConsoleHelper } from '../utils/console-helper.js';
import { DatasetConfig, SearchableField } from '../config/dataset-config.js';
import {
  SystemStatus,
  SystemState,
  CloudQuery,
  Result,
  FilterProxy,
  RangeFilterProxy,
  ValueFilterProxy,
  CombinedFilterProxy,
  BoostProxy,
  BoostStrength
} from '@indxsearch/indx-types';

const SEARCH_CONTROLLER_ROUTE = 'api';

// ━━━ API Methods ━━━

/**
 * Analyze data structure from string content
 */
export async function analyze(dataSetName: string, fileName: string, client: AxiosInstance): Promise<SystemStatus | null> {
  try {
    const fullFile = fs.readFileSync(fileName, 'utf-8');
    const response = await client.post(
      `${SEARCH_CONTROLLER_ROUTE}/AnalyzeString/${dataSetName}`,
      fullFile,
      { headers: { 'Content-Type': 'text/plain' } }
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data as SystemStatus;
    }
    return null;
  } catch (error) {
    console.error('Analyze error:', error);
    return null;
  }
}

/**
 * Analyze data structure from file stream
 */
export async function analyzeStreamAsync(dataSetName: string, fileName: string, client: AxiosInstance): Promise<SystemStatus | null> {
  try {
    const fileStream = fs.createReadStream(fileName);
    const response = await client.post(
      `${SEARCH_CONTROLLER_ROUTE}/AnalyzeStreamAsync/${dataSetName}`,
      fileStream,
      { headers: { 'Content-Type': 'text/plain' } }
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data as SystemStatus;
    }
    return null;
  } catch (error) {
    console.error('AnalyzeStreamAsync error:', error);
    return null;
  }
}

/**
 * Clear field settings
 */
export async function clearFields(dataSetName: string, fields: string[], client: AxiosInstance): Promise<boolean> {
  try {
    const response = await client.put(`${SEARCH_CONTROLLER_ROUTE}/ClearFieldSettings/${dataSetName}`, fields);
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    return false;
  }
}

/**
 * Combine two filters into one
 */
export async function combineFilters(dataSetName: string, combinedFilter: CombinedFilterProxy, client: AxiosInstance): Promise<FilterProxy | null> {
  try {
    const response = await client.put<FilterProxy>(
      `${SEARCH_CONTROLLER_ROUTE}/CombineFilters/${dataSetName}`,
      combinedFilter
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Create a boost proxy
 */
export async function createBoost(dataSetName: string, boost: BoostProxy, client: AxiosInstance): Promise<BoostProxy | null> {
  try {
    const response = await client.put<BoostProxy>(
      `${SEARCH_CONTROLLER_ROUTE}/CreateBoost/${dataSetName}`,
      boost
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Create or open a dataset
 */
export async function createOrOpenDataSet(route: string, dataSetName: string, client: AxiosInstance): Promise<boolean> {
  try {
    const response = await client.put(`${route}/CreateOrOpen/${dataSetName}`, '');
    if (response.status < 200 || response.status >= 300) {
      console.log('CreateOrOpenDataSet response error:', response.statusText);
    }
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    console.error('CreateOrOpenDataSet error:', error);
    return false;
  }
}

/**
 * Create a range filter
 */
export async function createRangeFilter(dataSetName: string, rangeFilter: RangeFilterProxy, client: AxiosInstance): Promise<FilterProxy | null> {
  try {
    const response = await client.put<FilterProxy>(
      `${SEARCH_CONTROLLER_ROUTE}/CreateRangeFilter/${dataSetName}`,
      rangeFilter
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Create a value filter
 */
export async function createValueFilter(dataSetName: string, valueFilter: ValueFilterProxy, client: AxiosInstance): Promise<FilterProxy | null> {
  try {
    const response = await client.put<FilterProxy>(
      `${SEARCH_CONTROLLER_ROUTE}/CreateValueFilter/${dataSetName}`,
      valueFilter
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Delete a dataset
 */
export async function deleteDataSet(route: string, dataSetName: string, client: AxiosInstance): Promise<boolean> {
  try {
    const response = await client.delete(`${route}/DeleteDataSet/${dataSetName}`);
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    return false;
  }
}

/**
 * Delete a document by key
 */
export async function deleteDocument(dataSetName: string, documentKey: number, client: AxiosInstance): Promise<boolean> {
  try {
    const response = await client.delete(`${SEARCH_CONTROLLER_ROUTE}/${dataSetName}/${documentKey}`);
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    return false;
  }
}

/**
 * Get all fields in a dataset
 */
export async function getAllFields(dataSetName: string, client: AxiosInstance): Promise<string[]> {
  try {
    const response = await client.get<string[]>(`${SEARCH_CONTROLLER_ROUTE}/GetAllFields/${dataSetName}`);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      console.log('System status request failed, type any char to exit');
      process.exit(-1);
    }
  } catch (error) {
    console.log('GetAllFields request failed');
    process.exit(-1);
  }
  return [];
}

/**
 * Get facetable fields
 */
export async function getFacetableFields(dataSetName: string, client: AxiosInstance): Promise<string[]> {
  try {
    const response = await client.get<string[]>(`${SEARCH_CONTROLLER_ROUTE}/GetFacetableFields/${dataSetName}`);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      console.log('GetFacetableFields failed, type any char to exit');
      process.exit(-1);
    }
  } catch (error) {
    console.log('GetFacetableFields request failed');
    process.exit(-1);
  }
  return [];
}

/**
 * Get filterable fields
 */
export async function getFilterableFields(dataSetName: string, client: AxiosInstance): Promise<string[]> {
  try {
    const response = await client.get<string[]>(`${SEARCH_CONTROLLER_ROUTE}/GetFilterableFields/${dataSetName}`);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      console.log('GetFilterableFields failed, type any char to exit');
      process.exit(-1);
    }
  } catch (error) {
    console.log('GetFilterableFields request failed');
    process.exit(-1);
  }
  return [];
}

/**
 * Get searchable fields
 */
export async function getSearchableFields(dataSetName: string, client: AxiosInstance): Promise<string[]> {
  try {
    const response = await client.get<string[]>(`${SEARCH_CONTROLLER_ROUTE}/GetSearchableFields/${dataSetName}`);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      console.log('System status request failed, type any char to exit');
      process.exit(-1);
    }
  } catch (error) {
    console.log('GetSearchableFields request failed');
    process.exit(-1);
  }
  return [];
}

/**
 * Get JSON records by keys
 */
export async function getJson(dataSetName: string, keys: number[], client: AxiosInstance): Promise<string[]> {
  try {
    const response = await client.post<string[]>(`${SEARCH_CONTROLLER_ROUTE}/GetJson/${dataSetName}`, keys);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      console.log('GetUserDataSets request failed, type any char to exit');
      process.exit(-1);
    }
  } catch (error) {
    console.log('GetJson request failed');
    process.exit(-1);
  }
  return [];
}

/**
 * Get sortable fields
 */
export async function getSortableFields(dataSetName: string, client: AxiosInstance): Promise<string[]> {
  try {
    const response = await client.get<string[]>(`${SEARCH_CONTROLLER_ROUTE}/GetSortableFields/${dataSetName}`);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      console.log('System status request failed, type any char to exit');
      process.exit(-1);
    }
  } catch (error) {
    console.log('GetSortableFields request failed');
    process.exit(-1);
  }
  return [];
}

/**
 * Get word indexing fields
 */
export async function getWordIndexingFields(dataSetName: string, client: AxiosInstance): Promise<string[]> {
  try {
    const response = await client.get<string[]>(`${SEARCH_CONTROLLER_ROUTE}/GetWordIndexingFields/${dataSetName}`);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      console.log('GetWordIndexingFields failed, type any char to exit');
      process.exit(-1);
    }
  } catch (error) {
    console.log('GetWordIndexingFields request failed');
    process.exit(-1);
  }
  return [];
}

/**
 * Get number of JSON records in database
 */
export async function getNumberOfJsonRecordsInDb(dataSetName: string, client: AxiosInstance): Promise<number> {
  try {
    const response = await client.get<number>(`${SEARCH_CONTROLLER_ROUTE}/GetNumberOfJsonRecordsInDb/${dataSetName}`);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      return 0;
    }
  } catch (error) {
    return 0;
  }
}

/**
 * Get system status
 */
export async function getStatus(dataSetName: string, client: AxiosInstance): Promise<SystemStatus | null> {
  try {
    const response = await client.get<SystemStatus>(`${SEARCH_CONTROLLER_ROUTE}/GetStatus/${dataSetName}`);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      console.log('System status request failed, type any char to exit');
      process.exit(-1);
    }
  } catch (error) {
    console.log('GetStatus request failed');
    process.exit(-1);
  }
  return null;
}

/**
 * Get user datasets
 */
export async function getUserDataSets(client: AxiosInstance): Promise<string[]> {
  try {
    const response = await client.get<string[]>(`${SEARCH_CONTROLLER_ROUTE}/GetUserDataSets`);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      console.log('GetUserDataSets request failed, type any char to exit');
      process.exit(-1);
    }
  } catch (error) {
    console.log('GetUserDataSets request failed');
    process.exit(-1);
  }
  return [];
}

/**
 * Index a dataset
 */
export async function indexDataSet(dataSetName: string, client: AxiosInstance): Promise<boolean> {
  try {
    const response = await client.get(`${SEARCH_CONTROLLER_ROUTE}/IndexDataSet/${dataSetName}`);
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    return false;
  }
}

/**
 * Load dataset from database
 */
export async function loadFromDatabaseAsync(dataSetName: string, client: AxiosInstance): Promise<boolean> {
  try {
    const response = await client.get(`${SEARCH_CONTROLLER_ROUTE}/LoadFromDatabase/${dataSetName}`);
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    return false;
  }
}

/**
 * Load data from file stream
 */
export async function loadStreamAsync(dataSetName: string, fileName: string, client: AxiosInstance): Promise<boolean> {
  try {
    const fileStats = fs.statSync(fileName);
    const fileStream = fs.createReadStream(fileName);

    const response = await client.put(
      `${SEARCH_CONTROLLER_ROUTE}/LoadStream/${dataSetName}`,
      fileStream,
      {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Length': fileStats.size.toString()
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      }
    );
    return response.status >= 200 && response.status < 300;
  } catch (error: any) {
    console.error('LoadStreamAsync error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Load data from string
 */
export async function loadString(dataSetName: string, fileNameAndPath: string, client: AxiosInstance): Promise<boolean> {
  try {
    const fc = fs.readFileSync(fileNameAndPath, 'utf-8');
    const response = await client.put(
      `${SEARCH_CONTROLLER_ROUTE}/LoadString/${dataSetName}`,
      fc,
      { headers: { 'Content-Type': 'text/plain' } }
    );
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    return false;
  }
}

/**
 * Search for records
 */
export async function search(q: CloudQuery, dataSetName: string, client: AxiosInstance): Promise<Result | null> {
  try {
    const response = await client.post<Result>(`${SEARCH_CONTROLLER_ROUTE}/Search/${dataSetName}`, q);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Search error:', error);
    return null;
  }
}

/**
 * Set facetable fields
 */
export async function setFacetableFields(dataSetName: string, fields: string[], client: AxiosInstance): Promise<boolean> {
  try {
    const response = await client.put(`${SEARCH_CONTROLLER_ROUTE}/SetFacetableFields/${dataSetName}`, fields);
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    return false;
  }
}

/**
 * Set filterable fields
 */
export async function setFilterableFields(dataSetName: string, fields: string[], client: AxiosInstance): Promise<boolean> {
  try {
    const response = await client.put(`${SEARCH_CONTROLLER_ROUTE}/SetFilterableFields/${dataSetName}`, fields);
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    return false;
  }
}

/**
 * Set searchable fields with weights
 *
 * The C# API endpoint signature is: SetSearchableFields(string dataSetName, ValueTuple<string, int>[] fields)
 *
 * When C# ValueTuple is serialized to JSON, it uses Item1, Item2, etc. properties.
 * So we must send:
 * [
 *   { "Item1": "title", "Item2": 0 },
 *   { "Item1": "description", "Item2": 1 }
 * ]
 *
 * NOT:
 * [
 *   { "name": "title", "weight": 0 },
 *   { "name": "description", "weight": 1 }
 * ]
 *
 * Weight values:
 * - 0 = High
 * - 1 = Med
 * - 2 = Low
 */
export async function setSearchableFields(dataSetName: string, fields: SearchableField[], client: AxiosInstance): Promise<boolean> {
  // Convert to C# ValueTuple format with Item1 (name) and Item2 (weight)
  const tuples = fields.map(f => ({ Item1: f.name, Item2: f.weight }));

  try {
    const response = await client.put(`${SEARCH_CONTROLLER_ROUTE}/SetSearchableFields/${dataSetName}`, tuples);
    return response.status >= 200 && response.status < 300;
  } catch (error: any) {
    console.error('SetSearchableFields error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Set sortable fields
 */
export async function setSortableFields(dataSetName: string, fields: string[], client: AxiosInstance): Promise<boolean> {
  try {
    const response = await client.put(`${SEARCH_CONTROLLER_ROUTE}/SetSortableFields/${dataSetName}`, fields);
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    return false;
  }
}

/**
 * Set word indexing fields
 */
export async function setWordIndexingFields(dataSetName: string, fields: string[], client: AxiosInstance): Promise<boolean> {
  try {
    const response = await client.put(`${SEARCH_CONTROLLER_ROUTE}/SetWordIndexingFields/${dataSetName}`, fields);
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    return false;
  }
}

/**
 * Loads and configures a dataset in the IndxCloudApi search server.
 *
 * Process Overview:
 * 1. Validation - Check file existence and API connectivity
 * 2. Create/Open Dataset - Initialize or open existing dataset
 * 3. Analyze Data - Parse JSON structure and identify fields
 * 4. Configure Fields - Set searchable, word indexing, filterable, facetable, and sortable properties
 * 5. Load Data - Stream JSON data to the search server
 * 6. Index Dataset - Build search indexes for fast querying
 * 7. Test Search - Verify dataset with a sample query
 *
 * Field Types Explained:
 * - Searchable: Fields that can be queried with full-text search (e.g., title, description)
 * - Word Indexing: Fields that use word-level indexing for enhanced search capabilities
 * - Filterable: Fields that can be used to filter results (e.g., genre, year)
 * - Facetable: Fields that can be aggregated for faceted navigation (e.g., category counts)
 * - Sortable: Fields that can be used to sort results (e.g., popularity, date)
 */
export async function loadDataset(datasetName: string, config: DatasetConfig, client: AxiosInstance, uri: string): Promise<void> {
  // ━━━ Step 0: Load and Validate Configuration ━━━
  if (config === null) {
    ConsoleHelper.writeError(`Unknown dataset: ${datasetName}`);
    ConsoleHelper.writeInfo(`Available datasets: ${['tmdb', 'pokedex'].join(', ')}`);
    return;
  }

  // Validate data file exists
  if (!fs.existsSync(config.filePath)) {
    ConsoleHelper.writeError(`Data file not found: ${config.filePath}`);
    ConsoleHelper.writeInfo('Please ensure the data file exists in the correct location.');
    ConsoleHelper.writeInfo(`Expected path: ${path.resolve(config.filePath)}`);
    return;
  }

  ConsoleHelper.writeHeader(`Loading Dataset: ${config.name}`);
  ConsoleHelper.writeInfo(`Data file: ${config.filePath}`);
  const fileStats = fs.statSync(config.filePath);
  ConsoleHelper.writeInfo(`File size: ${(fileStats.size / 1024 / 1024).toFixed(2)} MB`);
  console.log();

  // ━━━ Step 2: Create or Open Dataset ━━━
  ConsoleHelper.writeInfo('Creating or opening dataset...');
  try {
    const createSuccess = await createOrOpenDataSet(SEARCH_CONTROLLER_ROUTE, config.name, client);
    if (!createSuccess) {
      ConsoleHelper.writeError('Failed to create or open dataset.');
      ConsoleHelper.writeInfo('Troubleshooting:');
      ConsoleHelper.writeInfo('  1. Verify API_URI in .env.local is correct');
      ConsoleHelper.writeInfo('  2. Ensure IndxCloudApi is running');
      ConsoleHelper.writeInfo('  3. Check that BEARER_TOKEN is valid (not expired)');
      return;
    }
    ConsoleHelper.writeSuccess('Dataset opened successfully');
  } catch (error: any) {
    ConsoleHelper.writeError(`Network error: ${error.message}`);
    ConsoleHelper.writeInfo('Troubleshooting:');
    ConsoleHelper.writeInfo(`  - Cannot connect to: ${uri}`);
    ConsoleHelper.writeInfo('  - Is IndxCloudApi running?');
    ConsoleHelper.writeInfo('  - Check your firewall settings');
    return;
  }

  // ━━━ Step 3: Analyze Data Structure ━━━
  ConsoleHelper.writeInfo('Analyzing data structure...');
  const status0 = await analyze(config.name, config.filePath, client);
  if (status0 === null) {
    ConsoleHelper.writeError('Failed to analyze data file');
    return;
  }
  ConsoleHelper.writeSuccess('Data structure analyzed');

  // Get initial status (for verification)
  await getStatus(config.name, client);

  // ━━━ Step 4: Discover and Display All Fields ━━━
  ConsoleHelper.writeInfo('Discovering fields in dataset...');
  const list = await getAllFields(config.name, client);
  ConsoleHelper.writeSuccess(`Found ${list.length} fields`);
  ConsoleHelper.writeInfo(`Fields: ${list.join(', ')}`);
  console.log();

  // ━━━ Step 5: Configure Searchable Fields ━━━
  // Searchable fields are used for full-text search queries.
  // Weight determines relevance (High > Med > Low) in search results.
  ConsoleHelper.writeInfo('Configuring searchable fields...');
  const myres = await setSearchableFields(config.name, config.searchableFields, client);
  if (!myres) {
    ConsoleHelper.writeError('Failed to set searchable fields');
    return;
  }
  ConsoleHelper.writeSuccess(`Configured ${config.searchableFields.length} searchable fields`);
  for (const field of config.searchableFields) {
    ConsoleHelper.writeInfo(`  - ${field.name} (weight: ${field.weight})`);
  }

  // ━━━ Step 6: Configure Filterable Fields ━━━
  // Filterable fields can be used in filter expressions (e.g., year > 2020).
  ConsoleHelper.writeInfo('Configuring filterable fields...');
  const myres2 = await setFilterableFields(config.name, config.filterableFields, client);
  if (!myres2) {
    ConsoleHelper.writeError('Failed to set filterable fields');
    return;
  }
  ConsoleHelper.writeSuccess(`Configured ${config.filterableFields.length} filterable fields`);

  // ━━━ Step 7: Configure Facetable Fields ━━━
  // Facetable fields enable aggregated counts for filtering UI (e.g., Genre: Action (42)).
  ConsoleHelper.writeInfo('Configuring facetable fields...');
  const facetsResult = await setFacetableFields(config.name, config.facetableFields, client);
  if (!facetsResult) {
    ConsoleHelper.writeError('Failed to set facetable fields');
    return;
  }
  ConsoleHelper.writeSuccess(`Configured ${config.facetableFields.length} facetable fields`);

  // ━━━ Step 8: Configure Sortable Fields ━━━
  // Sortable fields allow results to be ordered (e.g., sort by popularity desc).
  ConsoleHelper.writeInfo('Configuring sortable fields...');
  const sortres = await setSortableFields(config.name, config.sortableFields, client);
  if (!sortres) {
    ConsoleHelper.writeError('Failed to set sortable fields');
    return;
  }
  ConsoleHelper.writeSuccess(`Configured ${config.sortableFields.length} sortable fields`);

  // ━━━ Step 9: Configure Word Indexing Fields ━━━
  // Word indexing fields enable word-level indexing for specific fields.
  ConsoleHelper.writeInfo('Configuring word indexing fields...');
  const wordIndexRes = await setWordIndexingFields(config.name, config.wordIndexingFields, client);
  if (!wordIndexRes) {
    ConsoleHelper.writeError('Failed to set word indexing fields');
    return;
  }
  ConsoleHelper.writeSuccess(`Configured ${config.wordIndexingFields.length} word indexing fields`);
  for (const field of config.wordIndexingFields) {
    ConsoleHelper.writeInfo(`  - ${field}`);
  }
  console.log();

  // ━━━ Step 10: Verify Field Configuration ━━━
  ConsoleHelper.writeInfo('Verifying field configuration...');
  await getSearchableFields(config.name, client);
  await getSortableFields(config.name, client);
  await getFacetableFields(config.name, client);
  await getFilterableFields(config.name, client);
  await getWordIndexingFields(config.name, client);
  ConsoleHelper.writeSuccess('Field configuration verified');
  console.log();

  // Create filters (optional - dataset specific examples)
  if (config.name === 'pokedex') {
    const filter: RangeFilterProxy = {
      fieldName: 'speed',
      lowerLimit: 10.5,
      upperLimit: 50.0
    };

    const filt1 = await createRangeFilter(config.name, filter, client);

    const vf: ValueFilterProxy = {
      fieldName: 'speed',
      value: 50
    };

    const filt2 = await createValueFilter(config.name, vf, client);

    if (filt1 && filt2) {
      const cf: CombinedFilterProxy = {
        a: filt1,
        b: filt2,
        useAndOperation: true
      };
      const combFilt = await combineFilters(config.name, cf, client);

      if (combFilt) {
        const bp: BoostProxy = {
          filterProxy: combFilt,
          boostStrength: BoostStrength.High
        };

        await createBoost(config.name, bp, client);
      }
    }
  }

  // ━━━ Step 11: Load Data from File ━━━
  ConsoleHelper.writeHeader('Loading Data');
  ConsoleHelper.writeInfo(`Streaming data from ${config.filePath}...`);

  const loadFromDb = false;
  let result2: boolean;
  if (!loadFromDb) {
    result2 = await loadStreamAsync(config.name, config.filePath, client);
    if (!result2) {
      ConsoleHelper.writeError('Failed to load data');
      return;
    }
  }

  // Monitor loading progress
  let proceed = true;
  const loadingStartTime = new Date();
  let dotCount = 0;
  let status = await getStatus(config.name, client);

  do {
    dotCount++;
    ConsoleHelper.writeProgress(`Loading data${'.'.repeat(dotCount % 4)}   `);

    status = await getStatus(config.name, client);
    if (status !== null) {
      proceed = status.systemState === SystemState.Loading;
    } else {
      proceed = false;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  } while (proceed);

  console.log(); // New line after progress
  const loadingDuration = (new Date().getTime() - loadingStartTime.getTime()) / 1000;
  ConsoleHelper.writeSuccess(`Data loaded in ${loadingDuration.toFixed(1)} seconds`);

  // Get record count
  const numberOfRecords = await getNumberOfJsonRecordsInDb(config.name, client);
  ConsoleHelper.writeInfo(`Total records: ${numberOfRecords.toLocaleString()}`);
  console.log();

  // ━━━ Step 12: Build Search Index ━━━
  ConsoleHelper.writeHeader('Building Search Index');
  ConsoleHelper.writeInfo('Indexing dataset (this may take a moment)...');

  const success = await indexDataSet(config.name, client);
  if (!success) {
    ConsoleHelper.writeError('Failed to start indexing');
    return;
  }

  // Monitor indexing progress
  proceed = true;
  const indexingStartTime = new Date();
  dotCount = 0;
  do {
    dotCount++;
    ConsoleHelper.writeProgress(`Indexing${'.'.repeat(dotCount % 4)}   `);

    status = await getStatus(config.name, client);
    if (status !== null) {
      proceed = status.systemState !== SystemState.Ready;
    } else {
      proceed = false;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  } while (proceed);

  console.log(); // New line after progress
  const indexingDuration = (new Date().getTime() - indexingStartTime.getTime()) / 1000;
  ConsoleHelper.writeSuccess(`Index built in ${indexingDuration.toFixed(1)} seconds`);
  console.log();

  // ━━━ Step 13: Run Test Search ━━━
  ConsoleHelper.writeHeader('Running Test Search');
  ConsoleHelper.writeInfo(`Search query: "${config.testQuery}"`);

  const query: CloudQuery = {
    text: config.testQuery,
    maxNumberOfRecordsToReturn: 5,
    sortBy: config.sortableFields[0] || '',
    enableFacets: false,
    enableBoost: false
  };

  const res = await search(query, config.name, client);
  if (res === null || !res.records || res.records.length === 0) {
    ConsoleHelper.writeError('Search returned no results');
    return;
  }

  const resultsCount = res.records.length;
  ConsoleHelper.writeSuccess(`Found ${resultsCount} results`);
  console.log();

  // Display top results
  let resultNum = 1;
  for (const item of res.records) {
    const rec = await getJson(config.name, [item.documentKey], client);
    console.log(`Result ${resultNum}:`);
    ConsoleHelper.writeInfo(`  Score: ${item.score.toFixed(2)}`);
    ConsoleHelper.writeInfo(`  Document Key: ${item.documentKey}`);
    ConsoleHelper.writeInfo(`  Data: ${rec[0]}`);
    console.log();
    resultNum++;
  }

  // ━━━ Final Summary ━━━
  ConsoleHelper.writeSummary('Dataset Load Complete', {
    'Dataset': config.name,
    'Total Records': numberOfRecords.toLocaleString(),
    'Searchable Fields': config.searchableFields.length,
    'Word Indexing Fields': config.wordIndexingFields.length,
    'Filterable Fields': config.filterableFields.length,
    'Facetable Fields': config.facetableFields.length,
    'Sortable Fields': config.sortableFields.length,
    'Loading Time': `${loadingDuration.toFixed(1)}s`,
    'Indexing Time': `${indexingDuration.toFixed(1)}s`,
    'Test Query Results': resultsCount
  });

  ConsoleHelper.writeSuccess('Dataset is ready for use!');
  console.log();
}
