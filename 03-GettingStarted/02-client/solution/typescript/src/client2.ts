import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "node",
  args: ["./build/index.js"],
});

const client = new Client({
  name: "example-client",
  version: "1.0.0",
});

await client.connect(transport);

// List prompts
const prompts = await client.listPrompts();
console.log("[BOWEN_LOG] 🚀 ~~ prompts:", prompts);

// List resources
const resources = await client.listResources();
console.log("[BOWEN_LOG] 🚀 ~~ resources:", resources);

// list tools
const tools = await client.listTools();
console.log("[BOWEN_LOG] 🚀 ~~ tools:", tools);

// Read a resource
const resource = await client.readResource({
  uri: "file:///example.txt",
});
console.log("[BOWEN_LOG] 🚀 ~~ resource:", resource);

// Call a tool
const result = await client.callTool({
    name: "add",
    arguments: {
      a: 1,
      b: 8
    }
  });
console.log("[BOWEN_LOG] 🚀 ~~ result:", result);

// call prompt
const promptResult = await client.getPrompt({
  name: "review-code",
  arguments: {
    code: 'console.log("Hello world")',
  },
});
console.log("[BOWEN_LOG] 🚀 ~~ promptResult:", promptResult);
