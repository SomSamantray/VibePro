# ProtoVibe CLI — Implementation Specs

## Context
ProtoVibe is a globally installable Node.js CLI tool that acts as a branded platform layer on top of Claude Code. It renders a boot screen, handles auth by delegating to Claude Code's own login flow, scaffolds a project directory, and then hands full control to Claude Code via subprocess. ProtoVibe makes zero AI calls itself.

---

## Project Structure

```
VibePro-CLI/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── src/
│   ├── index.tsx              ← entry point (bin)
│   ├── cli.tsx                ← main Ink app orchestrator
│   ├── components/
│   │   ├── Logo.tsx           ← ANSI Shadow logo with gradient
│   │   ├── InfoBox.tsx        ← unicode box with version/author info
│   │   └── Gradient.tsx       ← character-by-character hex gradient component
│   ├── auth.ts                ← Claude Code auth check + claude login subprocess
│   ├── scaffold.ts            ← project directory + file creation
│   ├── spawn.ts               ← claude binary detection + subprocess spawn
│   └── templates/
│       ├── CLAUDE.md.ts       ← boot instruction file template (string)
│       └── protovibe.md.ts    ← master workflow slash command template (string)
└── dist/                      ← compiled output (tsup)
```

---

## Tech Stack

| Concern | Tool | Notes |
|---|---|---|
| Language | TypeScript | Strict mode |
| Build | tsup | ESBuild-based, fast, outputs CJS to dist/ |
| Terminal UI | Ink 4 + React 18 | React for terminals |
| Prompts | Clack (@clack/prompts) | Project name + directory questions |
| Gradient coloring | Custom Ink component | chalk hex applied char-by-char |
| Auth | claude login subprocess | Delegated entirely to Claude Code |
| Claude detection | `which claude` / `where claude` | Checks PATH before spawning |
| Subprocess spawn | child_process.spawn | stdio: inherit so Claude TUI takes over |
| Distribution | npm (global install) | bin: protovibe in package.json |

---

## Implementation Flow

### 1. Entry Point (`src/index.tsx`)
- Shebang: `#!/usr/bin/env node`
- Registered as `bin.protovibe` in package.json → maps to `dist/index.js`
- Detects terminal width via `process.stdout.columns`
- Renders Ink app (`cli.tsx`)

### 2. Boot Screen — under 100ms, no network
**Logo (`src/components/Logo.tsx`)**
- Two hardcoded multiline strings: `LOGO_WIDE` (≥90 cols) and `LOGO_COMPACT` (<90 cols)
- ANSI Shadow font from patorjk.com, stored as raw string literals
- Gradient component applies `#7B2FBE` → `#3B82F6` left-to-right per character

**Gradient Component (`src/components/Gradient.tsx`)**
- Takes a string and two hex colors
- Splits string into characters, computes interpolated RGB per position
- Wraps each char in `<Text color={hexColor}>` inline

**Info Box (`src/components/InfoBox.tsx`)**
- Unicode box: `╭─╮ │ ╰─╯`
- Border color: `#3a1a6a`
- Lines:
  - `version  1.0.0` — color `#b39ddb` (soft lavender)
  - `by  razorgojo` — white
  - `powered by  Claude Code` — gradient `#7B2FBE` → `#3B82F6`
  - `─────────────────────` (thin separator)
  - `Vibecode your prototypes.` — italic, `#6d5a8a` (muted lavender)

### 3. Authentication (`src/auth.ts`)
**Check if already authenticated:**
- Read `~/.claude/.credentials.json` (path Claude Code uses)
- If token/session exists and is non-empty → user is considered authenticated
- Display: `✓ Logged in`

**If not authenticated:**
- Display: `Let's get you logged in.\nOpening Anthropic login in your browser...`
- Spawn `claude login` as a subprocess with `stdio: inherit`
- Wait for it to exit (user completes browser login)
- Re-check `~/.claude/auth.json` — if now present → display `✓ Logged in`
- If still missing after `claude login` exits → display error and exit 1

### 4. Claude Code Detection (`src/spawn.ts`)
- Run `which claude` (Unix) / `where claude` (Windows) via `execSync`
- If not found: display `Claude Code is not found. Please install it from claude.ai/code` and exit 1
- If found: proceed to scaffold

### 5. Project Scaffold (`src/scaffold.ts`)
**Prompts (via Clack):**
- `? Project name:` — used as folder name (validated: no spaces/special chars)
- `? Where do you want to create it?` — defaults to `process.cwd()`

**Creates:**
```
/<project-name>/
  CLAUDE.md
  .claude/
    commands/
      protovibe.md
```

**CLAUDE.md content:**
```
When you start, your first and only task is to run /protovibe.
Do not wait for user input. Do not do anything else first.
```

**protovibe.md content — 7-stage workflow prompt:**
- Stage 1: Ask "What do you want to build?"
- Stage 2: 5–6 focused follow-up questions (target users, features, stack, integrations, constraints) → summary + confirm
- Stage 3: On confirm → auto-write `specs.md` + `PRD.md`
- Stage 4: Auto-run `/init` → generates project-aware `CLAUDE.md`
- Stage 5: List ready files, ask "Ready to start building? Confirm to begin."

### 6. Handoff (`src/spawn.ts`)
- `child_process.spawn('claude', [], { stdio: 'inherit', cwd: projectPath })`
- ProtoVibe process exits immediately after spawn
- Claude Code's TUI takes over the terminal completely

---

## package.json Key Fields

```json
{
  "name": "protovibe",
  "version": "1.0.0",
  "description": "A branded CLI platform layer on top of Claude Code",
  "author": "razorgojo",
  "bin": { "protovibe": "dist/index.js" },
  "main": "dist/index.js",
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "prepublishOnly": "npm run build"
  }
}
```

**Dependencies:** `ink` ^4, `react` ^18, `@clack/prompts`, `chalk`

**DevDependencies:** `typescript`, `tsup`, `@types/react`, `@types/node`

---

## tsup Config

```ts
export default {
  entry: ['src/index.tsx'],
  format: ['cjs'],
  banner: { js: '#!/usr/bin/env node' },
  clean: true,
  jsx: 'react'
}
```

---

## Key Edge Cases

| Scenario | Behavior |
|---|---|
| Claude Code not in PATH | Error message + exit 1 |
| Not authenticated, `claude login` fails | Error + exit 1 |
| Terminal width < 90 cols | Compact logo selected |
| Project directory already exists | Clack error — re-ask |
| User Ctrl+C at any prompt | Clack handles gracefully, exit 0 |

---

## Verification

1. `npm run build` → `dist/index.js` exists
2. `node dist/index.js` → boot screen renders with gradient logo + info box
3. Auth: delete `~/.claude/auth.json` → `claude login` launches
4. Auth: restore auth file → skips login, shows `✓ Logged in`
5. `which claude` absent → correct error message shown
6. Full run → project folder created with correct `CLAUDE.md` + `protovibe.md`
7. Claude Code spawns in project directory with stdio inherited
8. `npm install -g .` then `protovibe` works from any directory
