import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import { GetSystemInfoSchema, handleSystemInfo } from "./tools/systemTools.js";

const server = new Server(
  { name: "my-modular-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Araçları Listeleme
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_system_info",
      description: "Sistem kaynakları hakkında bilgi verir",
      inputSchema: zodToJsonSchema(GetSystemInfoSchema)
    }
  ]
}));

// Araç Çağrılarını Dağıtma (Routing)
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "get_system_info": {
      const args = GetSystemInfoSchema.parse(request.params.arguments);
      const result = await handleSystemInfo(args);
      return {
        content: [{ type: "text", text: result }]
      };
    }
    default:
      throw new Error("Araç bulunamadı");
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);



import { zodToJsonSchema } from "zod-to-json-schema";
import { AddNoteSchema, ListNotesSchema, addNote, listNotes } from "./tools/noteTools.js";

// ... (Server tanımlama kısımları)

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "add_note",
      description: "Yerel veritabanına yeni bir not kaydeder",
      inputSchema: zodToJsonSchema(AddNoteSchema)
    },
    {
      name: "list_notes",
      description: "Kaydedilmiş notları listeler veya arama yapar",
      inputSchema: zodToJsonSchema(ListNotesSchema)
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "add_note":
        return { content: [{ type: "text", text: await addNote(AddNoteSchema.parse(args)) }] };
      
      case "list_notes":
        return { content: [{ type: "text", text: await listNotes(ListNotesSchema.parse(args)) }] };

      default:
        throw new Error("Araç bulunamadı");
    }
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `Hata: ${error.message}` }],
      isError: true
    };
  }
});