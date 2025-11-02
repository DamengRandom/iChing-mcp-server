# MCP Server for 数字卦 (IChing Future Forcast Tool)

<!-- prompt: 请帮助我生成此卦和爻辞: ${guawithYao} 的详细信息, 包括: 卦辞, 爻名, 爻辞, 象辞, 彖传解释, 象转解释等. 另外, 请帮助我生成一些相关的文章帮助我更好的了解此卦，有助于我可以分析此卦来预测一下未来, 比如: 健康, 事业, 婚姻 等等. -->

## How to start local MCP server

```bash
# Ensure to configure GEMINI_API_KEY, eg:
# GEMINI_API_KEY=YOUR_GEMINI_TOKEN
npm run server # npm run build + npm run server (express server)
npm run inspect # npm run inspector in another terminal
```

## Deployed version

```bash
# Can be opened via a server URL:
https://iching-mcp-server-bmvz.onrender.com/mcp
# Then run inspect for testing ~
npm run inspect
```
