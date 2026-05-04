import { AddNoteRequest, ListNotesRequest } from '../types/index.js';
import { INoteService } from './INoteService.js';
import { INoteRepository } from '../repositories/INoteRepository.js';

export class NoteService implements INoteService {
  constructor(private noteRepository: INoteRepository) {}

  async addNote(request: AddNoteRequest): Promise<string> {
    try {
      const id = await this.noteRepository.addNote(request);
      return `Not başarıyla eklendi. ID: ${id}`;
    } catch (error) {
      throw new Error(`Not eklenirken hata oluştu: ${error}`);
    }
  }

  async listNotes(request: ListNotesRequest): Promise<string> {
    try {
      const notes = await this.noteRepository.getNotes(request);
      return JSON.stringify(notes, null, 2);
    } catch (error) {
      throw new Error(`Notlar listelenirken hata oluştu: ${error}`);
    }
  }
}