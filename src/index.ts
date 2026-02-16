import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// In-memory store: task name → start timestamp (ms)
const timers = new Map<string, number>();

// Create the MCP server
const server = new McpServer({
  name: "task-timer",
  version: "1.0.0",
});

// ─── Tool: start_timer ───────────────────────────────────────────────
server.tool(
  "start_timer",
  "Start a timer for a named task. Use this to begin tracking how long a task takes.",
  {
    task_name: z.string().describe("The name of the task to start timing"),
  },
  async ({ task_name }) => {
    if (timers.has(task_name)) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: A timer for '${task_name}' is already running. Stop it first before starting a new one.`,
          },
        ],
      };
    }

    timers.set(task_name, Date.now());

    return {
      content: [
        {
          type: "text" as const,
          text: `Timer started for '${task_name}'. Use stop_timer to see elapsed time.`,
        },
      ],
    };
  }
);

// ─── Tool: stop_timer ────────────────────────────────────────────────
server.tool(
  "stop_timer",
  "Stop a running timer and return the elapsed time. Use this when a task is finished to see how long it took.",
  {
    task_name: z.string().describe("The name of the task to stop timing"),
  },
  async ({ task_name }) => {
    const startTime = timers.get(task_name);

    if (startTime === undefined) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: No running timer found for '${task_name}'. Start one first with start_timer.`,
          },
        ],
      };
    }

    const elapsedMs = Date.now() - startTime;
    timers.delete(task_name);

    // Format elapsed time nicely
    const totalSeconds = elapsedMs / 1000;
    let formatted: string;

    if (totalSeconds < 60) {
      formatted = `${totalSeconds.toFixed(1)} seconds`;
    } else if (totalSeconds < 3600) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = (totalSeconds % 60).toFixed(1);
      formatted = `${minutes} min ${seconds} sec`;
    } else {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = (totalSeconds % 60).toFixed(1);
      formatted = `${hours} hr ${minutes} min ${seconds} sec`;
    }

    return {
      content: [
        {
          type: "text" as const,
          text: `Timer stopped for '${task_name}'. Elapsed time: ${formatted}`,
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
