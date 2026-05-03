import Database from "better-sqlite3";
import { join } from "path";

// Veritabanı dosyasını proje kökünde oluşturur
const db = new Database(join(process.cwd(), "mcp_data.db"));

// Başlangıçta tabloyu oluşturalım
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;