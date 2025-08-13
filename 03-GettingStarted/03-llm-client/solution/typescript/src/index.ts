import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "Demo",
  version: "1.0.0"
});

// Add an addition tool
server.tool("add",  "一个简单的加法工具，接受两个数字参数 a 和 b，返回它们的和。",
  { a: z.number(), b: z.number() },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }]
  })
);



server.tool(
  "fibonacci",
  "计算斐波那契数列的工具，接受数列的索引（index），返回对应的斐波那契数值。",
  {
    index: z.number().int().nonnegative().describe("The index (n) in the Fibonacci sequence to calculate (0-based)"),
  },
  async ({ index }) => {
    console.log("[BOWEN_LOG] 🚀 ~~ index:", index);
    function fib(n: number): number {
      if (n === 0) return 0;
      if (n === 1) return 1;
      let a = 0, b = 1;
      for (let i = 2; i <= n; i++) {
        [a, b] = [b, a + b];
      }
      return b;
    }
    return {
      content: [
        {
          type: "text",
          text: String(fib(index)),
        },
      ],
      description: "计算斐波那契数列的工具，接受数列的索引（index），返回对应的斐波那契数值。",
    };
  },
  
);

// Add a dynamic greeting resource
server.resource(
  "file",
  new ResourceTemplate("file:///{path}", { list: undefined }),
  async (uri, { path }) => ({
    contents: [{
      uri: uri.href,
      text: `File, ${path}!`
    }]
  })
);

server.prompt(
  "review-code",
  { code: z.string() },
  ({ code }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Please review this code:\n\n${code}`
      }
    }]
  })
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);