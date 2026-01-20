#!/usr/bin/env node
/**
 * IndxNodeLoader - Entry point
 * Converts C# Program.cs to TypeScript
 */
import dotenv from 'dotenv';
import { Command } from 'commander';
import inquirer from 'inquirer';
import axios from 'axios';
import https from 'https';
import { ConsoleHelper } from './utils/console-helper.js';
import { setBearerToken, login } from './utils/auth.js';
import { getConfig, getAvailableDatasets } from './config/dataset-config.js';
import { loadDataset } from './api/load-api.js';

// Load environment variables from .env.local file
dotenv.config({ path: '.env.local' });

// Get configuration from environment variables
const uri = process.env.API_URI || 'https://localhost:5001/';
const bearerToken = process.env.BEARER_TOKEN || '';
const userEmail = process.env.USER_EMAIL || '';
const userPassword = process.env.USER_PASSWORD || '';

/**
 * Show interactive dataset selection menu
 */
async function showInteractiveMenu(): Promise<string | null> {
  ConsoleHelper.writeHeader('Dataset Selection');
  console.log();

  const datasets = getAvailableDatasets();

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'dataset',
      message: 'Select dataset:',
      choices: [
        ...datasets.map((ds, idx) => ({ name: `${idx + 1}. ${ds}`, value: ds })),
        { name: '0. Exit', value: null }
      ]
    }
  ]);

  return answer.dataset;
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  // Create root command
  const program = new Command();

  program
    .name('indx-node-loader')
    .description('IndxNodeLoader - Load and configure datasets for IndxCloudApi')
    .version('1.0.0');

  // Add dataset option
  program
    .option('-d, --dataset <name>', 'Dataset to load (tmdb or pokedex). If not provided, interactive mode will prompt for selection.');

  program.parse(process.argv);

  const options = program.opts();

  try {
    // Determine dataset
    let dataset = options.dataset;

    // If no dataset provided, show interactive menu
    if (!dataset) {
      dataset = await showInteractiveMenu();
      if (dataset === null) {
        ConsoleHelper.writeWarning('No dataset selected. Exiting.');
        return;
      }
    }

    // Get configuration
    const config = getConfig(dataset);
    if (config === null) {
      ConsoleHelper.writeError(`Unknown dataset: ${dataset}`);
      ConsoleHelper.writeInfo(`Available datasets: ${getAvailableDatasets().join(', ')}`);
      return;
    }

    // Initialize HTTP client
    // For localhost development with self-signed certificates, disable SSL verification
    const httpsAgent = new https.Agent({
      rejectUnauthorized: uri.includes('localhost') ? false : true
    });

    const client = axios.create({
      timeout: 5 * 60 * 1000, // 5 minutes timeout
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      httpsAgent: httpsAgent
    });

    // Set authentication
    if (bearerToken) {
      setBearerToken(client, bearerToken, uri);
    } else if (userEmail && userPassword) {
      ConsoleHelper.writeInfo('Authenticating with email and password...');
      const token = await login(client, userEmail, userPassword, uri);
      if (!token) {
        ConsoleHelper.writeError('Login failed');
        return;
      }
      ConsoleHelper.writeSuccess('Authentication successful');
    } else {
      ConsoleHelper.writeError('No authentication credentials provided');
      ConsoleHelper.writeInfo('Please set BEARER_TOKEN or USER_EMAIL and USER_PASSWORD in .env.local');
      return;
    }

    // Load the dataset
    await loadDataset(dataset, config, client, uri);
  } catch (error: any) {
    ConsoleHelper.writeError(`Fatal error: ${error.message}`);
    if (error.cause) {
      ConsoleHelper.writeError(`  Inner exception: ${error.cause}`);
    }
    process.exit(-1);
  }
}

// Run main function
main().catch((error) => {
  ConsoleHelper.writeError(`Unhandled error: ${error.message}`);
  process.exit(-1);
});
