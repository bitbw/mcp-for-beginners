import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
    name: "Demo",
    version: "1.0.0"
});


// Define calculator tools for each operation
server.tool(
    "add",
    {
        a: z.number(),
        b: z.number()
    },
    async ({ a, b }) => ({
        content: [{ type: "text", text: String(a + b) }]
    })
);

server.tool(
    "subtract",
    {
        a: z.number(),
        b: z.number()
    },
    async ({ a, b }) => ({
        content: [{ type: "text", text: String(a - b) }]
    })
);

server.tool(
    "multiply",
    {
        a: z.number(),
        b: z.number()
    },
    async ({ a, b }) => ({
        content: [{ type: "text", text: String(a * b) }]
    })
);

server.tool(
    "divide",
    {
        a: z.number(),
        b: z.number()
    },
    async ({ a, b }) => {
        if (b === 0) {
            return {
                content: [{ type: "text", text: "Error: Cannot divide by zero" }],
                isError: true
            };
        }
        return {
            content: [{ type: "text", text: String(a / b) }]
        };
    }
);

server.resource(
    "greeting",
    new ResourceTemplate("greeting://{name}", { list: undefined }),
    async (uri, { name }) => ({
        contents: [{
            uri: uri.href,
            text: `Hello, ${name}!`
        }]
    })
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);