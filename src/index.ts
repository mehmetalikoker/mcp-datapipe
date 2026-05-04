import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// Services and Repositories
import { DatabaseConfig } from './config/DatabaseConfig.js';
import { SQLiteNoteRepository } from './repositories/SQLiteNoteRepository.js';
import { NoteService } from './services/NoteService.js';
import { SystemService } from './services/SystemService.js';
import { MCPController, AddNoteSchema, ListNotesSchema, GetSystemInfoSchema } from './controllers/MCPController.js';

// Dependency Injection Setup
const db = DatabaseConfig.getInstance();
const noteRepository = new SQLiteNoteRepository(db);
const noteService = new NoteService(noteRepository);
const systemService = new SystemService();
const controller = new MCPController(noteService, systemService);

// Server Setup
const server = new Server(
  { name: 'my-modular-server', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

// Tool List Handler
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_system_info',
      description: 'Sistem kaynakları hakkında bilgi verir',
      inputSchema: GetSystemInfoSchema
    },
    {
      name: 'add_note',
      description: 'Yerel veritabanına yeni bir not kaydeder',
      inputSchema: AddNoteSchema
    },
    {
      name: 'list_notes',
      description: 'Kaydedilmiş notları listeler veya arama yapar',
      inputSchema: ListNotesSchema
    }
  ]
}));

// Tool Call Handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: string;

    switch (name) {
      case 'get_system_info': {
        const parsed = GetSystemInfoSchema.parse(args);
        result = await controller.handleSystemInfo(parsed);
        break;
      }
      case 'add_note': {
        const parsed = AddNoteSchema.parse(args);
        result = await controller.handleAddNote(parsed);
        break;
      }
      case 'list_notes': {
        const parsed = ListNotesSchema.parse(args);
        result = await controller.handleListNotes(parsed);
        break;
      }
      default:
        throw new Error(`Araç bulunamadı: ${name}`);
    }

    return { content: [{ type: 'text', text: result }] };
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Hata: ${error?.message ?? 'Bilinmeyen hata'}` }],
      isError: true
    };
  }
});

// Connect to transport
const transport = new StdioServerTransport();
await server.connect(transport);
