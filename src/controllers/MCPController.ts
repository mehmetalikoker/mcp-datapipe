import { z } from 'zod';
import { INoteService } from '../services/INoteService.js';
import { ISystemService } from '../services/ISystemService.js';
import { AddNoteRequest, ListNotesRequest, SystemInfoRequest } from '../types/index.js';

// Schema'lar
export const AddNoteSchema = z.object({
  title: z.string().min(1).describe('Notun başlığı'),
  content: z.string().describe('Notun detaylı içeriği')
});

export const ListNotesSchema = z.object({
  search: z.string().optional().describe('Başlıkta aranacak kelime')
});

export const GetSystemInfoSchema = z.object({
  topic: z.enum(['cpu', 'memory', 'platform']).optional()
});

export class MCPController {
  constructor(
    private noteService: INoteService,
    private systemService: ISystemService
  ) {}

  async handleAddNote(args: z.infer<typeof AddNoteSchema>): Promise<string> {
    const request: AddNoteRequest = {
      title: args.title,
      content: args.content
    };
    return await this.noteService.addNote(request);
  }

  async handleListNotes(args: z.infer<typeof ListNotesSchema>): Promise<string> {
    const request: ListNotesRequest = {
      search: args.search
    };
    return await this.noteService.listNotes(request);
  }

  async handleSystemInfo(args: z.infer<typeof GetSystemInfoSchema>): Promise<string> {
    const request: SystemInfoRequest = {
      topic: args.topic
    };
    return await this.systemService.getSystemInfo(request);
  }
}