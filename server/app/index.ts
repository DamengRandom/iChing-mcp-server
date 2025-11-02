// MCP Express Server
import express from "express";
import type { Request, Response } from 'express';
import cors from "cors";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMCPServer } from '../utils/mcp';

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*", // tighten for production
    exposedHeaders: ["Mcp-Session-Id"],
  })
);

app.post("/mcp", async (req: Request, res: Response) => {
  const server = createMCPServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Error handling MCP request:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      });
    }
  } finally {
    res.on("close", async () => {
      await transport.close();
      await server.close();
    });
  }
});

const PORT = Number(process.env.PORT || 8321);

app.listen(PORT, () => {
  console.log(`MCP HTTP server listening on http://localhost:${PORT}/mcp`);
});
