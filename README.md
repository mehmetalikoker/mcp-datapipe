# My MCP Server

Node.js ve TypeScript ile geliştirilmiş, **Model Context Protocol (MCP)** standardını uygulayan bir araç sunucusudur. Claude gibi yapay zeka asistanlarına not yönetimi ve sistem bilgisi sorgulama yetenekleri kazandırır.

---

## Nedir Bu Proje?

MCP (Model Context Protocol), yapay zeka modellerinin dış araçlara ve veri kaynaklarına standart bir protokol üzerinden erişmesini sağlar. Bu sunucu, üç farklı araç sunarak Claude'un:

- Yerel bir SQLite veritabanına **not kaydetmesini ve aramasını**
- Çalıştığı makinenin **CPU, bellek ve platform bilgilerini okumasını**

mümkün kılar.

---

## Özellikler

### Araçlar (Tools)

| Araç | Açıklama |
|------|----------|
| `add_note` | Başlık ve içerikle yeni bir not kaydeder |
| `list_notes` | Tüm notları listeler; isteğe bağlı başlık araması destekler |
| `get_system_info` | CPU, bellek veya platform bilgilerini döner |

### `add_note`

```json
{
  "title": "Alışveriş Listesi",
  "content": "Ekmek, süt, yumurta"
}
```

Dönen yanıt: `Not başarıyla eklendi. ID: 3`

---

### `list_notes`

```json
{ "search": "Alışveriş" }
```

`search` alanı opsiyoneldir; verilmezse tüm notlar listelenir. Başlık üzerinden `LIKE` araması yapar.

---

### `get_system_info`

```json
{ "topic": "cpu" }
```

`topic` değerleri: `cpu` | `memory` | `platform` (varsayılan: `platform`)

**cpu** örnek çıktısı:
```json
{
  "model": "Intel(R) Core(TM) i7-...",
  "cores": 8,
  "speed": "2400 MHz"
}
```

**memory** örnek çıktısı:
```json
{
  "total": "16.00 GB",
  "used": "9.43 GB",
  "free": "6.57 GB"
}
```

**platform** örnek çıktısı:
```json
{
  "platform": "win32",
  "arch": "x64",
  "release": "10.0.26200",
  "hostname": "DESKTOP-ABC"
}
```

---

## Proje Yapısı

```
my-mcp-server/
├── src/
│   ├── index.ts                        # Sunucu giriş noktası, MCP bağlantısı
│   ├── config/
│   │   └── DatabaseConfig.ts           # SQLite singleton bağlantısı
│   ├── controllers/
│   │   └── MCPController.ts            # Araç şemaları ve istek yönlendirme
│   ├── services/
│   │   ├── INoteService.ts             # Not servisi arayüzü
│   │   ├── NoteService.ts              # Not iş mantığı
│   │   ├── ISystemService.ts           # Sistem servisi arayüzü
│   │   └── SystemService.ts            # os modülü ile sistem bilgisi
│   ├── repositories/
│   │   ├── INoteRepository.ts          # Repository arayüzü
│   │   └── SQLiteNoteRepository.ts     # SQLite CRUD işlemleri
│   └── types/
│       └── index.ts                    # Ortak tip tanımları
├── tests/
│   ├── systemTools.test.ts             # SystemService birim testleri
│   └── noteTools.test.js               # NoteTools birim testleri
├── build/                              # Derlenmiş JS çıktısı (tsc)
├── mcp_data.db                         # SQLite veritabanı dosyası
├── package.json
└── tsconfig.json
```

---

## Mimari

Proje, katmanlı bir mimari kullanır:

```
MCP İsteği
    ↓
MCPController      ← Zod şema doğrulaması, yönlendirme
    ↓
Service Layer      ← İş mantığı (NoteService, SystemService)
    ↓
Repository Layer   ← Veri erişimi (SQLiteNoteRepository)
    ↓
SQLite Veritabanı  ← mcp_data.db
```

Her katman bir arayüz (`interface`) üzerinden bağlandığından bağımlılıklar kolayca değiştirilebilir ve test edilebilir.

---

## Kurulum

### Gereksinimler

- Node.js 18+
- npm

### Adımlar

```bash
# Bağımlılıkları yükle
npm install

# TypeScript'i derle
npm run build

# Sunucuyu çalıştır
npm start
```

---

## Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run build` | TypeScript'i `build/` dizinine derler |
| `npm run watch` | TypeScript'i izleme modunda derler |
| `npm start` | Derlenmiş sunucuyu çalıştırır |
| `npm run inspector` | MCP Inspector arayüzünü açar (`localhost:6274`) |
| `npm test` | Tüm birim testlerini çalıştırır |

---

## MCP Inspector ile Test

```bash
npm run inspector
```

Tarayıcıda `http://localhost:6274` adresine giderek araçları görsel arayüzden çağırabilirsin. Inspector, proxy sunucusunu `localhost:6277` üzerinde çalıştırır.

---

## Claude Desktop ile Entegrasyon

`claude_desktop_config.json` dosyasına aşağıdaki ayarı ekle:

```json
{
  "mcpServers": {
    "my-mcp-server": {
      "command": "node",
      "args": ["C:/Users/Mehmet/my-mcp-server/build/index.js"]
    }
  }
}
```

Ayar dosyasının konumu:
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

---

## Kullanılan Teknolojiler

| Teknoloji | Amaç |
|-----------|------|
| `@modelcontextprotocol/sdk` | MCP sunucu altyapısı |
| `better-sqlite3` | Senkron SQLite erişimi |
| `zod` | Çalışma zamanı şema doğrulaması |
| TypeScript | Tip güvenliği |
| Jest | Birim testleri |
