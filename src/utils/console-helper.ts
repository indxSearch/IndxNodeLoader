/**
 * Console helper utilities for formatted output
 * Converts C# Console.ForegroundColor to chalk colored output
 */
import chalk from 'chalk';

export class ConsoleHelper {
  static writeHeader(message: string): void {
    console.log(chalk.cyan(`\n━━━ ${message} ━━━`));
  }

  static writeSuccess(message: string): void {
    console.log(chalk.green(`✓ ${message}`));
  }

  static writeInfo(message: string): void {
    console.log(`  ${message}`);
  }

  static writeWarning(message: string): void {
    console.log(chalk.yellow(`⚠ ${message}`));
  }

  static writeError(message: string): void {
    console.log(chalk.red(`✗ ${message}`));
  }

  static writeProgress(message: string): void {
    process.stdout.write(`\r${message}`);
  }

  static writeSummary(title: string, items: Record<string, any>): void {
    this.writeHeader(title);
    for (const [key, value] of Object.entries(items)) {
      console.log(`  ${key}: ${value}`);
    }
  }
}
