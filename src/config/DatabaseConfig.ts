import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class DatabaseConfig {
  private static instance: Database.Database;

  static getInstance(): Database.Database {
    if (!DatabaseConfig.instance) {
      const dbPath = join(__dirname, '..', '..', 'mcp_data.db');
      DatabaseConfig.instance = new Database(dbPath, {
        verbose: console.error
      });
    }
    return DatabaseConfig.instance;
  }
}