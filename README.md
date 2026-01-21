# IndxNodeLoader

**Version 1.0** - Compatible with IndxCloudApi 1.0.2 (using IndxSearchLib 4.1.2)

A Node.js TypeScript application for loading and configuring datasets in **IndxCloudApi**, the search server. This helper tool streamlines the process of importing data, configuring search fields, and setting up filters for optimal search performance.

## Related Projects

- **[IndxCloudApi](https://github.com/indxSearch/IndxCloudApi)** - The search server API that this loader connects to
- **[indx-interface](https://github.com/indxSearch/indx-interface)** - React UI for interacting with the search server

## Features

- Automatic dataset import and indexing
- Pre-configured field settings (searchable, filterable, facetable, sortable)
- Support for multiple datasets
- Field weight configuration for search relevance
- Real-time status monitoring during import
- Example search queries to verify data loading

## Project Structure

```
IndxNodeLoader/
├── src/
│   ├── index.ts                # Entry point with CLI args and interactive menu
│   ├── api/
│   │   └── load-api.ts         # Main data loading logic with API calls
│   ├── config/
│   │   └── dataset-config.ts   # Dataset configurations (tmdb, pokedex)
│   └── utils/
│       ├── console-helper.ts   # Console output formatting utilities
│       └── auth.ts             # Authentication helpers
├── data/                       # Dataset JSON files
│   ├── tmdb_top10k.json
│   └── pokedex.json
├── package.json                # Node.js dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── .env.local.example          # Environment configuration template
```

**Key Files:**
- **src/config/dataset-config.ts** - Add new datasets here by defining searchable, filterable, facetable, and sortable fields.
- **src/api/load-api.ts** - The main workflow with comprehensive inline comments explaining each step.

## Included Datasets

### TMDB Top 10,000 Movies

The project includes a pre-configured dataset of 10,000 top movies from The Movie Database (TMDB). Data sourced from [TMDB](https://www.themoviedb.org/).

### Pokedex Dataset

Includes a Pokemon dataset for testing purposes. Pokemon data is property of Nintendo/Game Freak.

## Prerequisites

- Node.js 18.0 or later
- pnpm (recommended) or npm
- Running instance of IndxCloudApi (local or Azure-deployed)
- Valid authentication credentials for IndxCloudApi

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/indxSearch/IndxCloudLoader.git
   cd IndxCloudLoader
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Create your configuration file:
   ```bash
   cp .env.local.example .env.local
   ```

   Then edit `.env.local` with your configuration:
   ```env
   API_URI=https://localhost:5001/

   # Choose ONE authentication method:
   BEARER_TOKEN=your-bearer-token-here
   # OR
   # USER_EMAIL=your-email@example.com
   # USER_PASSWORD=your-password
   ```

   **Authentication Options:**

   You only need **ONE** of these authentication methods:

   1. **Bearer Token (Recommended):** Most secure option
      - Navigate to your IndxCloudApi instance (e.g., `https://localhost:5001`)
      - Log in to the search API
      - Click "API Key" to generate and copy your bearer token
      - Paste the token into the `BEARER_TOKEN` field in `.env.local`

   2. **Email/Password (Alternative):** The loader will login and obtain a token automatically
      - Use `USER_EMAIL` and `USER_PASSWORD` instead of `BEARER_TOKEN`

   **For local development:** Use `https://localhost:5001` as the API_URI
   **For Azure deployment:** Replace with your Azure API URL

4. You're ready! No code changes needed - dataset selection is now done via command-line or interactive menu.

## Usage

### Interactive Mode (Recommended for First Time)

Simply run without arguments to see an interactive menu:

```bash
pnpm dev
# or
npm run dev
```

You'll see:
```
━━━ Dataset Selection ━━━

? Select dataset: (Use arrow keys)
❯ 1. tmdb
  2. pokedex
  0. Exit
```

### Command-Line Mode

Specify the dataset directly:

```bash
# Load TMDB dataset
pnpm dev -- --dataset tmdb

# Or use short form
pnpm dev -- -d pokedex
```

### Production Build

To build and run the compiled version:

```bash
# Build TypeScript to JavaScript
pnpm build

# Run the compiled version
pnpm start -- --dataset tmdb
```

### Get Help

```bash
pnpm dev -- --help
```

### What Happens

The loader will:
1. ✓ Validate data file exists
2. ✓ Connect to IndxCloudApi and verify authentication
3. ✓ Create or open the dataset
4. ✓ Analyze the JSON data structure
5. ✓ Configure searchable, filterable, facetable, and sortable fields
6. ✓ Stream and load the data
7. ✓ Build the search index
8. ✓ Run a test search query
9. ✓ Display a summary with statistics

## API Endpoints

The loader interacts with the following IndxCloudApi endpoints:
- `/api/CreateOrOpen/{dataSetName}` - Initialize dataset session
- `/api/AnalyzeString/{dataSetName}` - Analyze data structure
- `/api/SetSearchableFields/{dataSetName}` - Configure searchable fields with weights
- `/api/SetFilterableFields/{dataSetName}` - Configure filterable fields
- `/api/SetFacetableFields/{dataSetName}` - Configure facetable fields
- `/api/SetSortableFields/{dataSetName}` - Configure sortable fields
- `/api/SetWordIndexingFields/{dataSetName}` - Configure word-level indexing fields
- `/api/LoadStream/{dataSetName}` - Stream load data from file
- `/api/IndexDataSet/{dataSetName}` - Build search index
- `/api/GetStatus/{dataSetName}` - Get dataset status
- `/api/Search/{dataSetName}` - Execute search queries

For complete API documentation, visit: `https://localhost:5001/swagger`

## Dataset Configuration

To add your own dataset:

1. Place your JSON file in the `data/` directory
2. Add a new configuration case in `src/config/dataset-config.ts` in the `getConfig()` function
3. Define your searchable, filterable, facetable, and sortable fields
4. Add the dataset name to the `getAvailableDatasets()` function

**Example - Adding a Products Dataset:**

Edit `src/config/dataset-config.ts` and add:

```typescript
case 'products':
  return {
    name: 'products',
    filePath: 'data/products.json',
    searchableFields: [
      { name: 'name', weight: Weight.High },
      { name: 'description', weight: Weight.Med },
      { name: 'tags', weight: Weight.Low }
    ],
    wordIndexingFields: ['name'],
    filterableFields: ['price', 'category', 'in_stock'],
    facetableFields: ['category', 'brand'],
    sortableFields: ['price', 'name'],
    testQuery: 'laptop'
  };
```

Then add `'products'` to the `getAvailableDatasets()` function.

**Field Types Explained:**
- **searchableFields** - Full-text searchable with weighted relevance (High/Med/Low)
- **wordIndexingFields** - Fields with word-level prefix matching (e.g., "lapt" matches "laptop")
- **filterableFields** - Fields you can filter by (e.g., price > 100)
- **facetableFields** - Fields shown as facet counts in search results
- **sortableFields** - Fields you can sort results by
- **testQuery** - Example search to verify the dataset loaded correctly

## Extending Type Definitions

The TypeScript types in `src/types/indx-search-lib.ts` are based on the IndxCloudApi Swagger/OpenAPI specification.

**To add or update types:**

1. **Check the API documentation:**
   ```
   https://localhost:5001/swagger
   ```

2. **Find the schema definition** for the type you need (e.g., `CloudQuery`, `SystemStatus`)

3. **Update or add the interface** in `src/types/indx-search-lib.ts`

**Example:** If the API adds a new filter type, you would:
- Check `/swagger` for the schema definition
- Add the interface to `indx-search-lib.ts`
- Add corresponding API method to `src/api/load-api.ts`

The current types are complete for IndxSearchLib 4.1.2 but can be extended as the API evolves.

## Troubleshooting

### "Data file not found"
- Ensure the JSON file exists in the `data/` directory
- Check that the filename matches exactly (case-sensitive)
- Verify the path in `src/config/dataset-config.ts` is correct

### "Network error: Cannot connect"
- Verify IndxCloudApi is running
- Check the API_URI in `.env.local`
- For localhost, ensure you're using HTTPS: `https://localhost:5001`
- Check your firewall settings

### "Failed to create or open dataset"
- Verify API_URI in .env.local is correct
- Ensure IndxCloudApi is running
- Check that BEARER_TOKEN is valid (not expired)
- Verify your user account has permission to create datasets

### "Failed to analyze data file"
- Ensure the data file is valid JSON
- Check that the file is not corrupted
- Verify the file is not empty

### Authentication Issues
- Your bearer token may have expired - generate a new one by logging into IndxCloudApi and clicking "API Key"
- Verify the BEARER_TOKEN in `.env.local` is correct and complete
- Ensure you're authenticated to the API with valid credentials

### "Self-signed certificate" Error
- This is normal for local development with `https://localhost:5001`
- The loader automatically disables certificate verification for localhost
- For production, use a valid SSL certificate

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
