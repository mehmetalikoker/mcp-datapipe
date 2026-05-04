import { Note, AddNoteRequest, ListNotesRequest } from '../types/index.js';

export interface INoteRepository {
  addNote(note: AddNoteRequest): Promise<number>;
  getNotes(request: ListNotesRequest): Promise<Note[]>;
}