import Database from 'better-sqlite3';
import { Note, AddNoteRequest, ListNotesRequest } from '../types/index.js';
import { INoteRepository } from './INoteRepository.js';

export class SQLiteNoteRepository implements INoteRepository {
  constructor(private db: Database.Database) {
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT
      )
    `);
  }

  async addNote(note: AddNoteRequest): Promise<number> {
    const stmt = this.db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)');
    const info = stmt.run(note.title, note.content);
    return info.lastInsertRowid as number;
  }

  async getNotes(request: ListNotesRequest): Promise<Note[]> {
    let query = 'SELECT * FROM notes';
    const params: any[] = [];

    if (request.search) {
      query += ' WHERE title LIKE ?';
      params.push(`%${request.search}%`);
    }

    const stmt = this.db.prepare(query);
    return stmt.all(...params) as Note[];
  }
}