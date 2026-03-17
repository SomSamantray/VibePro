# ProtoVibe

> Vibecode your prototypes.

ProtoVibe is a CLI launchpad built on top of [Claude Code](https://claude.ai/code). It gives you a **structured, guided workflow** for turning a rough idea into a fully scoped, spec'd, and initialized project — before a single line of code is written.

Instead of opening Claude to a blank slate and figuring out what to ask, ProtoVibe walks you step-by-step through idea capture, deep requirements probing, architecture planning, and spec generation. Then it hands off to Claude Code with full context to build.

It makes **zero AI calls itself**. All intelligence comes from Claude Code, which ProtoVibe launches and drives through a 7-stage workflow prompt.

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
  Then run `claude` once and log in. ProtoVibe will check for credentials automatically.

---

## Install

```bash
npm install -g protovibe
```

Verify the install:

```bash
protovibe --version
```

---

## How to use it

Simply run:

```bash
protovibe
```

You will be asked two things:

1. **Project name** — this becomes the folder name (letters, numbers, hyphens, underscores)
2. **Where to create it** — browse and select a parent directory

That's all. ProtoVibe creates the project folder and launches Claude Code inside it. The 7-stage workflow starts automatically.

---

## What it looks like

When you run `protovibe`, you'll see this boot screen instantly:

```
██╗   ██╗██╗██████╗ ███████╗██████╗ ██████╗  ██████╗
██║   ██║██║██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔═══██╗
██║   ██║██║██████╔╝█████╗  ██████╔╝██████╔╝██║   ██║
╚██╗ ██╔╝██║██╔══██╗██╔══╝  ██╔═══╝ ██╔══██╗██║   ██║
 ╚████╔╝ ██║██████╔╝███████╗██║     ██║  ██║╚██████╔╝
  ╚═══╝  ╚═╝╚═════╝ ╚══════╝╚═╝     ╚═╝  ╚═╝ ╚═════╝
```
*(rendered in a purple → blue gradient in your terminal)*

```
╭──────────────────────────────────────────╮
│  version   1.0.0                         │
│  by   razorgojo                          │
│  powered by   Claude Code                │
├──────────────────────────────────────────┤
│  Vibecode your prototypes.               │
╰──────────────────────────────────────────╯
```

The logo automatically switches to a compact version on narrower terminals (under 90 columns).

After the boot screen:

```
✔ Claude Code detected
? Project name › my-app
? Parent directory › /Users/you/projects

Launching Claude Code...
```

Claude Code opens and the workflow begins immediately.

---

## The 7-Stage Workflow

Once Claude Code launches, it runs the ProtoVibe workflow automatically. Here's what each stage does:

### Stage 0 — Mode Selection
Claude asks whether you want to start from scratch or work on an existing project.

### Stage 0b — Existing Project Analysis *(if chosen)*
Paste a folder path. Claude reads the entire codebase, summarises what it does, the tech stack, and key features — then asks how you'd like to enhance it. The workflow ends here and Claude works normally from this point.

### Stage 1 — Idea Capture
Claude asks: *"Describe the idea for your project."*
Just speak naturally. No format required.

### Stage 2 — Deep Requirements Probing
Claude asks follow-up questions **one at a time** — covering users, features, platform, auth, data, integrations, and constraints. It keeps going until everything is fully clear. No question limit.

When done, it presents a structured summary and asks you to confirm before moving on.

### Stage 3 — Architecture Options
Claude proposes **3 distinct architectural approaches**, each with:
- A full tech stack (frontend, backend, database, auth, hosting)
- How the system works end-to-end
- Tradeoffs — what it's best for and what it sacrifices
- One option marked as **Recommended** with a clear reason

### Stage 4 — Option Confirmation
Pick one of the 3 options, or describe your own. If you go custom, Claude evaluates it against your requirements and flags any risks before proceeding.

### Stage 5 — Specs File Creation
Claude writes `specs.md` in your project folder containing:
- Tech stack with justifications
- User flow (step-by-step)
- Feature list with priority labels: **P0** (MVP must-have), **P1** (important), **P2** (nice to have)
- Data model with entities and relationships
- Integration notes
- Constraints and non-functional requirements

### Stage 6 — Initialization
Claude silently replaces the placeholder `CLAUDE.md` with a project-specific one using `/init`, so it has full context about your project going forward.

### Stage 7 — Handoff
Workflow ends. Claude tells you: *"You can now go for building out the code."*
From here, Claude Code works normally on your project.

---

## Commands

### `/takeover`
Exit the ProtoVibe workflow at any point. Run this inside Claude Code at any stage if you want to skip ahead and work directly.

Claude will summarise everything captured so far — idea, requirements, chosen architecture, files created — and then operate normally with no workflow constraints.

---

## What gets created in your project folder

```
<your-project>/
├── CLAUDE.md                        # Boots Claude into the /protovibe workflow
└── .claude/
    └── commands/
        ├── protovibe.md             # The full 7-stage workflow instructions
        └── takeover.md              # The /takeover escape hatch definition
```

After Stage 6, `CLAUDE.md` is replaced with a project-specific version generated by `/init`.
After Stage 5, `specs.md` is added to the root.

---

## Example session

```
$ protovibe

# Boot screen renders instantly

✔ Claude Code detected
? Project name › client-portal
? Parent directory › ~/projects

Launching Claude Code...

────────────────────────────────────────
Claude Code v1.x — client-portal

Welcome to ProtoVibe. What would you like to do?
1. Build from scratch
2. Work on an existing project

> 1

Describe the idea for your project.

> A portal where my agency clients can view project status,
  leave feedback, and approve deliverables without emailing me.

Who are the target users — your clients, your team, or both?

> Primarily clients. I'll have one admin view for myself.

What does "approve deliverables" mean exactly — sign off on files,
mark a task complete, something else?

> They should be able to view uploaded files and click Approve or
  Request Changes, which notifies me.

...
```

Claude continues probing until requirements are complete, then presents architecture options and writes the specs.

---

## Development

```bash
git clone https://github.com/SomSamantray/VibePro
cd VibePro
npm install
npm run build
node dist/index.mjs          # run locally without global install
npm install -g .             # install globally to test the protovibe command
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript → `dist/` via tsup |
| `npm run dev` | Watch mode — rebuilds on every file change |

---

## License

MIT — see [LICENSE](./LICENSE)
