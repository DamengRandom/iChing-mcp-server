// MCP Server
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { getGua } from '../utils/yiChing';
import { IYiChing } from '../types';
import { askLLM } from '../utils/llm';

const mcpServer = new McpServer({
  name: 'bu-gua-mcp',
  version: '1.0.0'
});

async function runServer() {  
  mcpServer.registerTool('post_bu_gua',
    {
      title: "Post Bu Gua",
      description: "Ask for 3 random (3 digit only) numbers to generate (Bu) a Gua",
      inputSchema: {
        xia: z.number()
          .int()
          .gte(99, "Must be larger than 99")
          .lte(1000, "Must be lesser than 1000"),
        shang: z.number()
          .int()
          .gte(99, "Must be larger than 99")
          .lte(1000, "Must be lesser than 1000"),
        yao: z.number()
          .int()
          .gte(99, "Must be larger than 99")
          .lte(1000, "Must be lesser than 1000")
      },
      outputSchema: {
        guaWithYao: z.any(),  // or z.object({...}) if you know its shape
        result: z.any()
      }      
    },
    async ({ xia, shang, yao }: IYiChing) => {
      // calculate which gua it is
      const guaYao = { xia, shang, yao };
      const guaWithYao = getGua(guaYao);
      
      // ask for LLM to generate result answer
      if (guaWithYao) {
        const result = await askLLM(guaWithYao);

        return {
          content: [{ type: 'text', text: JSON.stringify({ guaWithYao, result }) }],
          structuredContent: {
            guaWithYao: JSON.stringify(guaWithYao),
            result,
          },
        };        
      } else {
        throw new Error('抱歉, 系统暂时无法预测, 请稍后在尝试, 非常感谢.');
      }
    }
  );
  
  // Start MCP server over stdio
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
}

runServer();
