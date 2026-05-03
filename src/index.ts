import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { GetSystemInfoSchema, handleSystemInfo } from "./tools/systemTools.js";
import { AddNoteSchema, ListNotesSchema, addNote, listNotes } from "./tools/noteTools.js";

const server = new Server(
  { name: "my-modular-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_system_info",
      description: "Sistem kaynakları hakkında bilgi verir",
      inputSchema: GetSystemInfoSchema
    },
    {
      name: "add_note",
      description: "Yerel veritabanına yeni bir not kaydeder",
      inputSchema: AddNoteSchema
    },
    {
      name: "list_notes",
      description: "Kaydedilmiş notları listeler veya arama yapar",
      inputSchema: ListNotesSchema
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "get_system_info": {
        const parsed = GetSystemInfoSchema.parse(args);
        const result = await handleSystemInfo(parsed);
        return { content: [{ type: "text", text: result }] };
      }

      case "add_note": {
        const parsed = AddNoteSchema.parse(args);
        const result = await addNote(parsed);
        return { content: [{ type: "text", text: result }] };
      }

      case "list_notes": {
        const parsed = ListNotesSchema.parse(args);
        const result = await listNotes(parsed);
        return { content: [{ type: "text", text: result }] };
      }

      default:
        throw new Error("Araç bulunamadı");
    }
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `Hata: ${error?.message ?? "Bilinmeyen hata"}` }],
      isError: true
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
