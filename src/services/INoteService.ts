import { AddNoteRequest, ListNotesRequest } from '../types/index.js';

export interface INoteService {
  addNote(request: AddNoteRequest): Promise<string>;
  listNotes(request: ListNotesRequest): Promise<string>;
}