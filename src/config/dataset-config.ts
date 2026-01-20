/**
 * Dataset configuration definitions
 * Converts C# DatasetConfig.cs to TypeScript
 */

/**
 * Search field weight (importance in search results)
 * Lower number = higher priority in search ranking
 */
export enum Weight {
  High = 0,   // Highest priority (e.g., title)
  Med = 1,    // Medium priority (e.g., description)
  Low = 2     // Lowest priority (e.g., tags)
}

export interface SearchableField {
  name: string;
  weight: number;
}

export interface DatasetConfig {
  name: string;
  filePath: string;
  searchableFields: SearchableField[];
  wordIndexingFields: string[];
  filterableFields: string[];
  facetableFields: string[];
  sortableFields: string[];
  testQuery: string;
}

/**
 * Get configuration for a specific dataset
 */
export function getConfig(datasetName: string): DatasetConfig | null {
  const lowerName = datasetName.toLowerCase();

  switch (lowerName) {
    case 'tmdb':
      return {
        name: 'tmdb',
        filePath: 'data/tmdb_top10k.json',
        searchableFields: [
          { name: 'title', weight: Weight.High },
          { name: 'original_title', weight: Weight.Med },
          { name: 'description', weight: Weight.Med },
          { name: 'actors', weight: Weight.Low }
        ],
        wordIndexingFields: ['title'],
        filterableFields: ['release_year', 'vote_average', 'vote_count_tier', 'genres', 'decade', 'actors', 'language'],
        facetableFields: ['release_year', 'vote_average', 'vote_count_tier', 'genres', 'decade', 'actors', 'language'],
        sortableFields: ['popularity', 'vote_average'],
        testQuery: 'titanic'
      };

    case 'pokedex':
      return {
        name: 'pokedex',
        filePath: 'data/pokedex.json',
        searchableFields: [
          { name: 'name', weight: Weight.High },
          { name: 'type1', weight: Weight.Med },
          { name: 'type2', weight: Weight.Low }
        ],
        wordIndexingFields: ['name', 'type1', 'type2'],
        filterableFields: ['speed', 'attack', 'hp', 'type1', 'type2', 'is_legendary'],
        facetableFields: ['speed', 'attack', 'hp', 'type1', 'type2', 'is_legendary'],
        sortableFields: ['name', 'speed'],
        testQuery: 'raic'
      };

    default:
      return null;
  }
}

/**
 * Get list of all available datasets
 */
export function getAvailableDatasets(): string[] {
  return ['tmdb', 'pokedex'];
}
