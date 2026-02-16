# mcp-task-timer

## Overview
This is a **Complete Tier MCP server** that provides two tools — `start_timer` and `stop_timer` — to track the time spent on named tasks.  
It is built in **TypeScript** using the official **@modelcontextprotocol/sdk** and communicates via **stdio** with Claude Code.  

The server allows you to:

- Start a timer for a specific task
- Stop the timer and see elapsed time
- Handle errors like starting an existing timer or stopping a timer that doesn’t exist

---

## Project Structure
week 4 exercise/
├── src/
│ └── index.ts # MCP server code
├── build/
│ └── index.js # Compiled output
├── .claude/ # Optional Claude configuration
├── .mcp.json # MCP server configuration
├── package.json
├── package-lock.json
├── tsconfig.json
├── README.md
└── screenshots/ # Part 4 screenshots


> See `screenshots/project-structure.png` for a Terminal view of this structure.

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Sadieg123/mcp-task-timer.git
cd mcp-task-timer


