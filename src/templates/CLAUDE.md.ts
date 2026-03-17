export const CLAUDE_MD = `# CLAUDE.md

IMMEDIATE INSTRUCTION — your very first response, regardless of what the user typed, must be exactly this (no preamble, no greeting, nothing else):

---
Welcome to ProtoVibe. What would you like to do?

1. **Build from scratch** — start a new project
2. **Work on an existing project** — analyse and enhance an existing codebase
---

Do not acknowledge what the user said. Do not greet them. Just output the above immediately as your first response.

Then continue with the /protovibe workflow from Stage 0 onwards.

At any point during the workflow, the user can type /takeover to exit ProtoVibe and work directly in Claude Code with full context preserved.
`;
