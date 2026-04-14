# CLAUDE.md — GHL-MCP

## What This Is

A TypeScript MCP (Model Context Protocol) server that exposes GoHighLevel (GHL) CRM functionality to Claude Desktop and other MCP clients. Allows Claude to read/write GHL contacts, conversations, pipelines, and more via natural language.

- **Package:** `@mastanley13/ghl-mcp-server`
- **Modes:** stdio (MCP protocol) + HTTP (REST API for testing)
- **Hosting:** Railway (production) / Vercel (alternative)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript (Node.js 18+) |
| Build | `tsc` → `dist/` |
| MCP SDK | `@modelcontextprotocol/sdk` |
| GHL API | GoHighLevel v2 REST API |
| HTTP server | Express (for non-MCP usage) |
| Testing | Jest |

---

## Dev Commands

```bash
npm run build        # tsc → dist/
npm run dev          # nodemon ts-node src/http-server.ts (HTTP mode)
npm run start:stdio  # MCP stdio mode (used by Claude Desktop)
npm run test         # Jest
```

---

## Project Structure

```
GHL-MCP/
├── src/
│   ├── server.ts          # MCP stdio entry point
│   ├── http-server.ts     # HTTP/REST entry point
│   ├── tools/             # MCP tool definitions (contacts, conversations, etc.)
│   └── api/               # GHL API client wrappers
├── dist/                  # Compiled output (gitignored)
├── tests/                 # Jest tests
├── Dockerfile             # Docker build
├── railway.json           # Railway deployment config
└── vercel.json            # Vercel deployment config
```

---

## Key Rules

- Never commit GHL API keys — use env vars (`GHL_API_KEY`, `GHL_LOCATION_ID`)
- Build before testing stdio mode (`npm run build` first)
- MCP tools must return valid JSON-serializable responses
- This server is used by Claude Desktop — breaking changes affect live usage

---

*Last updated: April 2026*
