# ProtoVibe

> Vibecode your prototypes.

ProtoVibe is a globally installable CLI launchpad built on top of [Claude Code](https://claude.ai/code). It gives you a **structured, guided workflow** for turning a rough idea into a fully scoped, spec'd, and initialized project — before a single line of code is written.

It makes **zero AI calls itself**. All intelligence comes from Claude Code, which ProtoVibe launches and drives through a 7-stage workflow. ProtoVibe also **auto-updates itself** every time you run it — you never need to reinstall manually.

---

## Who is this for?

- Developers who want to **go from idea to structured specs** before building
- Anyone who finds it hard to **think through requirements** clearly on their own
- Builders who want Claude Code to have a **complete understanding of the project** before writing code
- Teams who want a **repeatable, consistent project kickoff** process

---

## Prerequisites

Before installing ProtoVibe, make sure you have:

- **Node.js v18+** — [nodejs.org](https://nodejs.org)
- **Claude Code** — install it with:
  ```bash
  npm install -g @anthropic-ai/claude-code
  ```
  Then run `claude` once and log in. ProtoVibe checks your credentials automatically.

---

## Install

```bash
npm install -g protovibe
```

ProtoVibe checks for newer versions on every run and updates itself automatically. You only ever need to install it once.

---

## How to use it

```bash
protovibe
```

The boot screen renders instantly. Auth is verified automatically. Then you choose your mode:

```
◆  What would you like to do?
│  ● Start a new project
│  ○ Continue with an existing project
```

---

## Path A — New project

1. **Enter a project name** — letters, numbers, hyphens, underscores only
2. **Browse to a parent directory** — interactive folder browser starting from your home directory
3. ProtoVibe creates the project folder and writes the workflow files into it
4. A launch prompt appears:

```
╭──────────────────────────────────────────╮
│                                          │
│  Claude Code is loading your project.    │
│                                          │
│  Type "Hello" or "What's up?" to begin.  │
│                                          │
╰──────────────────────────────────────────╯
```

5. Claude Code opens. Type anything — the ProtoVibe workflow starts immediately.

### If the project name already exists

```
✗ A project named 'my-app' already exists at this location.
◆  What would you like to do?
│  ● Choose a different name for my new project
│  ○ Continue with the existing project
```

- **Choose a different name** — re-enter the name, same folder stays selected
- **Continue with the existing project** — ProtoVibe writes the workflow files to the existing folder, Claude opens and starts the workflow fresh

---

## Path B — Existing project

1. **Enter the full path** to your existing project folder (supports `~` shorthand)
2. ProtoVibe writes an `/analyse` command into the project
3. Claude Code opens, silently reads all files, and presents a structured summary:

```
Project: my-app
What it does: A client portal for agencies to manage deliverables and feedback.
Tech Stack: Next.js, TypeScript, Supabase, Tailwind CSS
Key Features:
- Client login and dashboard
- File upload and approval workflow
- Comment threads per deliverable
- Email notifications on status change
Project Structure: App router in src/app/, shared components in src/components/,
  Supabase client in src/lib/. API routes handle upload and notification logic.
Current State: Partially built — auth and dashboard complete, approval flow in progress.
```

4. Claude says: *"I've analysed your project. I'm ready to help — what would you like to work on?"*
5. You drive from here. No workflow constraints — Claude works normally.

---

## The 7-Stage Workflow (new project path)

After Claude opens, type anything. Claude's first response is always:

```
Welcome to ProtoVibe. What would you like to do?

1. Build from scratch — start a new project
2. Work on an existing project — analyse and enhance an existing codebase
```

Choose **1** to begin:

### Stage 1 — Idea Capture
Claude asks: *"Describe the idea for your project."*
Speak naturally. No format required.

### Stage 2 — Deep Requirements Probing
Claude asks grouped questions covering:
- Who are the target users?
- What does each feature do exactly?
- Step-by-step user flow
- Platform (web, mobile, desktop, CLI)?
- Authentication — required? What type?
- Data — what's created, stored, deleted? Real-time?
- Third-party integrations?
- Constraints — performance, offline, accessibility, timeline?

Claude keeps probing until everything is clear. Then it presents a full structured summary and asks you to confirm before moving on.

### Stage 3 — Architecture Options
Claude proposes **3 distinct architectural approaches**, each with:
- Full tech stack (frontend, backend, database, auth, hosting)
- How the system works end-to-end
- Tradeoffs — what it's best for and what it sacrifices
- One option marked **Recommended** with a specific reason

### Stage 4 — Option Confirmation
Pick one of the 3 options, or describe your own. If you go custom, Claude evaluates it against your requirements and flags any risks before proceeding.

### Stage 5 — Specs File
Claude asks for confirmation, then writes `specs.md` in your project root containing:
- App overview and target audience
- Feature list with priority labels: **P0** (MVP must-have), **P1** (important), **P2** (nice to have)
- Complete user flow — every journey, primary and alternate paths
- Tech stack with one-line justification per technology
- Data model — entities, fields, relationships
- Integration notes
- Constraints and non-functional requirements

### Stage 6 — Initialization
Claude silently replaces the placeholder `CLAUDE.md` with a project-specific one generated by `/init`, so it carries full project context going forward. Nothing is asked — it just happens.

### Stage 7 — Handoff
Claude says: *"Your project is fully scoped and ready to build. Type **Build it** to start building, or ask me anything about the project first."*

From here, Claude Code builds your project according to `specs.md`, starting with P0 features.

---

## Commands

These are available at any time inside Claude Code during or after the workflow:

| Command | What it does |
|---|---|
| `/takeover` | Exit the ProtoVibe workflow. Claude summarises everything captured so far (idea, requirements, architecture, files created) and then works normally with no constraints. |
| `/summarise` | Plain-language summary of progress — what's been decided, what's been done, and what comes next. Capped at 10 bullets. |
| `/protovibe` | Restart the workflow from Stage 0. |

---

## Auto-update

Every time you run `protovibe`, it silently checks the npm registry. If a newer version is available, it:
1. Prints: `Updating ProtoVibe x.x.x → x.x.x...`
2. Installs the latest version globally
3. Re-launches itself automatically

If you're offline, it skips the check and boots normally.

---

## What gets written to your project

### New project
```
<your-project>/
├── CLAUDE.md                        # Instructs Claude to run the ProtoVibe workflow on first message
└── .claude/
    └── commands/
        ├── protovibe.md             # Full 7-stage workflow definition
        ├── takeover.md              # /takeover command definition
        └── summarise.md             # /summarise command definition
```

After Stage 5: `specs.md` is added to the root.
After Stage 6: `CLAUDE.md` is replaced with a project-specific version by `/init`.

### Existing project
```
<your-project>/
├── CLAUDE.md                        # Instructs Claude to run /analyse on startup
└── .claude/
    └── commands/
        └── analyse.md               # /analyse command — reads all files and presents a summary
```

---

## What it looks like

Boot screen (renders in under 100ms):

```
██╗   ██╗██╗██████╗ ███████╗██████╗ ██████╗  ██████╗
██║   ██║██║██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔═══██╗
██║   ██║██║██████╔╝█████╗  ██████╔╝██████╔╝██║   ██║
╚██╗ ██╔╝██║██╔══██╗██╔══╝  ██╔═══╝ ██╔══██╗██║   ██║
 ╚████╔╝ ██║██████╔╝███████╗██║     ██║  ██║╚██████╔╝
  ╚═══╝  ╚═╝╚═════╝ ╚══════╝╚═╝     ╚═╝  ╚═╝ ╚═════╝
```
*(rendered in a purple → blue gradient)*

```
╭──────────────────────────────────────────╮
│  version  1.1.x                          │
│  by  razorgojo                           │
│  powered by  Claude Code                 │
├──────────────────────────────────────────┤
│  Vibecode your prototypes.               │
├──────────────────────────────────────────┤
│  commands                                │
│  /exit  —  quit ProtoVibe at any time    │
╰──────────────────────────────────────────╯
```

The logo automatically switches to a compact version on terminals narrower than 90 columns.

---

## Development

```bash
git clone https://github.com/SomSamantray/VibePro-CLI.git
cd VibePro-CLI
npm install
npm run build
node dist/index.mjs     # run locally without global install
npm install -g .        # install globally to test the protovibe command
```

| Command | Description |
|---|---|
| `npm run build` | Compile TypeScript → `dist/` via tsup |
| `npm run dev` | Watch mode — rebuilds on every file change |

---

## License

MIT — see [LICENSE](./LICENSE)
