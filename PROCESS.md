What I Built

I built a Complete Tier MCP server called the Task Timer, which provides two tools: start_timer and stop_timer. The server is written in TypeScript and uses the official @modelcontextprotocol/sdk to communicate with Claude Code via stdio. The server stores active timers in an in-memory Map and formats elapsed time intelligently, handling errors like starting a timer that already exists or stopping one that hasn’t been started. I structured the project with a src folder for source code, a build folder for compiled JavaScript, and a screenshots folder to document functionality.

How Claude Code Helped

Claude Code assisted me at several stages. First, I asked it to generate the initial server with both tools, including TypeScript typing and request handlers. Second, I used prompts to clarify error handling and formatting elapsed time for various durations. Third, I asked Claude to draft usage examples for the README and troubleshoot npm run build issues when compiling TypeScript to JavaScript.

Debugging Journey

The main challenges were ensuring the MCP server appeared in Claude Code and dealing with git push conflicts. Initially, the /mcp add command didn’t register the server, but running node build/index.js manually confirmed the server was running. On GitHub, I encountered rejected pushes due to remote changes; using git pull origin main --rebase resolved it. Timer logic edge cases, like stopping a nonexistent timer, required additional conditional checks to prevent errors.

How MCP Works

The Model Context Protocol (MCP) allows Claude Code to interact with external tools via a server. Each tool defines input parameters and output responses. The server listens on stdio, handles requests from Claude, executes the tool logic, and returns structured responses. This architecture enables Claude to use multiple tools concurrently, providing an extendable way to enhance AI capabilities.

What I’d Do Differently

Next time, I would implement persistent storage for timers, so they survive server restarts. I would also add more user-friendly error messages and create automated tests for the tools. Overall, the project taught me how to integrate AI tools with external servers and handle asynchronous tool execution effectively.
