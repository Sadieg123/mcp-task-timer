## Implementation Plan: `list_timers` tool

**Context:** The server uses a single `Map<string, number>` (`timers`) where values are start timestamps in ms. `stop_timer` contains inline elapsed-formatting logic you'll reuse.

---

### Step 1 — Extract `formatElapsed` as a shared helper function
**What:** Move the `if/else` time-formatting block out of `stop_timer` into a standalone function above both tools.

**Why first:** Both `stop_timer` and `list_timers` need the same formatting. Extracting now keeps the logic in one place and makes Step 4 trivial.

**Test:** Rebuild and call `stop_timer` — output should be identical to before.

---

### Step 2 — Register `list_timers` as a stub tool
**What:** Add `server.tool("list_timers", ...)` with no input parameters (`{}`) and a hardcoded placeholder response like `"list_timers called"`.

**Test:** Rebuild and start the server. Confirm Claude can see `list_timers` listed as an available tool and that calling it returns the placeholder without crashing.

---

### Step 3 — Handle the empty-map case
**What:** Replace the placeholder with a real check: if `timers.size === 0`, return `"No timers are currently running."`.

**Test:** Call `list_timers` with no timers started. Confirm the correct message appears.

---

### Step 4 — Implement the active-timers list
**What:** Iterate over `timers`, compute `Date.now() - startTime` for each entry, call `formatElapsed`, and build a formatted string like:

```
2 timers are running:
- "write tests": 1 min 23.4 sec
- "deploy": 45.2 seconds
```

Return the full string as the tool response.

**Test:** Start 2–3 timers, call `list_timers`, verify all names and plausible elapsed times appear.

---

### Step 5 — Verify `list_timers` is non-destructive
**What:** No code changes. This is a manual verification step.

**Test:** Start a timer → call `list_timers` → call `stop_timer` on the same timer. Confirm `stop_timer` still reports a valid elapsed time, proving `list_timers` never mutated the map.

---

**Total: 5 steps.** Steps 1–2 are structural/setup, steps 3–4 are the core logic split by case, and step 5 is a contract verification. Each builds directly on the last.
