import { z } from "zod";
import db from "../db.js";

// Not ekleme şeması
export const AddNoteSchema = z.object({
  title: z.string().min(1).describe("Notun başlığı"),
  content: z.string().describe("Notun detaylı içeriği")
});

// Notları listeleme şeması (Opsiyonel arama parametresi ile)
export const ListNotesSchema = z.object({
  search: z.string().optional().describe("Başlıkta aranacak kelime")
});

// Handler Fonksiyonları
export async function addNote(args: z.infer<typeof AddNoteSchema>) {
  const stmt = db.prepare("INSERT INTO notes (title, content) VALUES (?, ?)");
  const info = stmt.run(args.title, args.content);
  return `Not başarıyla eklendi. ID: ${info.lastInsertRowid}`;
}

export async function listNotes(args: z.infer<typeof ListNotesSchema>) {
  let query = "SELECT * FROM notes";
  const params: any[] = [];

  if (args.search) {
    query += " WHERE title LIKE ?";
    params.push(`%${args.search}%`);
  }

  const notes = db.prepare(query).all(...params);
  return JSON.stringify(notes, null, 2);
}