import Database from "better-sqlite3";
import { join, dirname } from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Veritabanını build klasörü yerine proje kökünde tutmak için bir üst klasöre çıkalım
const dbPath = join(__dirname, "..", "mcp_data.db");

const db = new Database(dbPath, { 
    verbose: console.error 
});

export default db;

