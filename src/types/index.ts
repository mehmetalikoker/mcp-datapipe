export interface Note {
  id: number;
  title: string;
  content: string;
}

export interface AddNoteRequest {
  title: string;
  content: string;
}

export interface ListNotesRequest {
  search?: string;
}

export interface SystemInfoRequest {
  topic?: 'cpu' | 'memory' | 'platform';
}