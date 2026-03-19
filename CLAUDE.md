# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
ProtoVibe is a globally installable Node.js CLI tool (`npm install -g protovibe`) that acts as a branded platform layer on top of Claude Code. It renders a boot screen, delegates auth to Claude Code, scaffolds a project directory, then spawns Claude Code as a subprocess and exits. ProtoVibe makes **zero AI calls** itself.

## Commands

```bash
npm install          # Install dependencies
npm run build        # Compile TypeScript → dist/ via tsup
npm run dev          # Watch mode build
node dist/index.js   # Run locally without global install
npm install -g .     # Install globally to test `protovibe` command
```

## Architecture

The app runs in a strict linear sequence — no concurrency, no background processes:

1. **Entry** (`src/index.tsx`) — detects terminal width, renders Ink app
2. **Boot screen** — Logo + InfoBox render immediately from hardcoded strings (no I/O)
3. **Auth** (`src/auth.ts`) — reads `~/.claude/.credentials.json`; if missing, spawns `claude login` and waits for exit
4. **Claude detection** (`src/spawn.ts`) — `which`/`where claude` check; exits with error if not found
5. **Scaffold** (`src/scaffold.ts`) — Clack prompts for project name + path, writes `CLAUDE.md` and `.claude/commands/protovibe.md`
6. **Handoff** (`src/spawn.ts`) — `child_process.spawn('claude', [], { stdio: 'inherit', cwd: projectPath })`, then ProtoVibe exits

## Key Design Constraints
- Boot screen must render in under 100ms — no network calls, no disk reads at render time
- Logo exists in two versions: `LOGO_WIDE` (≥90 cols) and `LOGO_COMPACT` (<90 cols), selected via `process.stdout.columns`
- Gradient is applied character-by-character using interpolated hex values between `#7B2FBE` and `#3B82F6`
- `stdio: 'inherit'` on the Claude spawn is critical — Claude Code's TUI must own the terminal fully
- ProtoVibe exits immediately after spawning Claude; no monitoring, no background process

## File Templates
The two files written into the scaffolded project live in `src/templates/`:
- `CLAUDE.md.ts` — exports a single string: instructs Claude to run `/protovibe` on boot
- `protovibe.md.ts` — exports the full 7-stage workflow prompt (idea capture → refinement → doc generation → /init → handoff confirmation)

## Build Output
tsup compiles `src/index.tsx` → `dist/index.js` (CJS, with `#!/usr/bin/env node` banner injected). The `bin.protovibe` field in `package.json` points to `dist/index.js`.
