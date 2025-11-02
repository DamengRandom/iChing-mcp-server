import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { askLLM } from "./llm";
import { IYiChing } from "../types";
import { getGua } from "./iChing";

export function createMCPServer() {
  const server = new McpServer({
    name: "bu-gua-mcp",
    version: "1.0.0",
  });

  server.registerTool(
    "post_bu_gua",
    {
      title: "Post Bu Gua",
      description: "Ask for 3 random (3 digit only) numbers to generate (Bu) a Gua",
      inputSchema: {
        xia: z.number().int().gte(100).lte(999),
        shang: z.number().int().gte(100).lte(999),
        yao: z.number().int().gte(100).lte(999),
      },
      outputSchema: {
        gua: z.string().min(1),
        result: z.string().min(1),
      },
    },
    async ({ xia, shang, yao }: IYiChing, extra) => {
      const gua = getGua({ xia, shang, yao });
      const progressToken = extra?._meta?.progressToken;

      const reportProgress = async (progress: number, message: string) => {
        if (!progressToken) return;

        try {
          await extra.sendNotification({
            method: "notifications/progress",
            params: { progressToken, progress, message },
          });
        } catch {
          throw new Error('抱歉, 系统暂时无法预测, 请稍后在尝试, 非常感谢.');
        }
      };

      if (!gua) {
        throw new Error("抱歉, 系统暂时无法预测, 请稍后在尝试, 非常感谢.");
      }

      await reportProgress(0.25, `已生成卦象 ${gua}，正在请求模型`);
      
      const result = await askLLM(gua);
      
      await reportProgress(0.9, "模型响应已返回，正在整理结果");

      await reportProgress(1, "卦象解读完成");

      return {
        content: [{ type: "text", text: JSON.stringify({ gua, result }) }],
        structuredContent: { gua, result },
      };
    }
  );

  return server;
}
