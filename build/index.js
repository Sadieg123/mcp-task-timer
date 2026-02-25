import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
// In-memory store: task name → start timestamp (ms)
const timers = new Map();
// ─── Helper: formatElapsed ────────────────────────────────────────────
function formatElapsed(elapsedMs) {
    const totalSeconds = elapsedMs / 1000;
    if (totalSeconds < 60) {
        return `${totalSeconds.toFixed(1)} seconds`;
    }
    else if (totalSeconds < 3600) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = (totalSeconds % 60).toFixed(1);
        return `${minutes} min ${seconds} sec`;
    }
    else {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = (totalSeconds % 60).toFixed(1);
        return `${hours} hr ${minutes} min ${seconds} sec`;
    }
}
// Create the MCP server
const server = new McpServer({
    name: "task-timer",
    version: "1.0.0",
});
// ─── Tool: start_timer ───────────────────────────────────────────────
server.tool("start_timer", "Start a timer for a named task. Use this to begin tracking how long a task takes.", {
    task_name: z.string().describe("The name of the task to start timing"),
}, async ({ task_name }) => {
    if (timers.has(task_name)) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error: A timer for '${task_name}' is already running. Stop it first before starting a new one.`,
                },
            ],
        };
    }
    timers.set(task_name, Date.now());
    return {
        content: [
            {
                type: "text",
                text: `Timer started for '${task_name}'. Use stop_timer to see elapsed time.`,
            },
        ],
    };
});
// ─── Tool: stop_timer ────────────────────────────────────────────────
server.tool("stop_timer", "Stop a running timer and return the elapsed time. Use this when a task is finished to see how long it took.", {
    task_name: z.string().describe("The name of the task to stop timing"),
}, async ({ task_name }) => {
    const startTime = timers.get(task_name);
    if (startTime === undefined) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error: No running timer found for '${task_name}'. Start one first with start_timer.`,
                },
            ],
        };
    }
    const elapsedMs = Date.now() - startTime;
    timers.delete(task_name);
    const formatted = formatElapsed(elapsedMs);
    return {
        content: [
            {
                type: "text",
                text: `Timer stopped for '${task_name}'. Elapsed time: ${formatted}`,
            },
        ],
    };
});
// ─── Tool: list_timers ───────────────────────────────────────────────
server.tool(
    "list_timers",
    "Show all currently running timers and their elapsed time without stopping them.",
    {},
    async () => {
      if (timers.size === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No timers are currently running.",
            },
          ],
        };
      }
  

      const now = Date.now();
      let message = `${timers.size} timer${timers.size > 1 ? 's' : ''} are running:\n`;
  
      for (const [taskName, startTime] of timers.entries()) {
        const elapsedMs = now - startTime;
        const formatted = formatElapsed(elapsedMs); // use your existing helper
        message += `- "${taskName}": ${formatted}\n`;
      }
  
      return {
        content: [
          {
            type: "text",
            text: message,
          },
        ],
      };
    }
  );
// ─── Start the server ────────────────────────────────────────────────
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Task Timer MCP server is running on stdio");
}
main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
