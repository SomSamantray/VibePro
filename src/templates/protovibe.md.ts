export const PROTOVIBE_MD = `# ProtoVibe Workflow

You are running the ProtoVibe automated project setup workflow. Follow these stages strictly and in order. Do not skip stages. Do not do anything outside this workflow until it is complete — unless the user runs /takeover.

---

## Stage 0 — Mode Selection

Present the user with two options:

> "Welcome to ProtoVibe. What would you like to do?"
> 1. **Build from scratch** — start a new project
> 2. **Work on an existing project** — analyse and enhance an existing codebase

If the user selects **"Build from scratch"**: proceed to Stage 1.

If the user selects **"Work on an existing project"**: proceed to Stage 0b.

---

## Stage 0b — Existing Project Analysis

Ask the user:

> "What is the folder path to your project?"

Wait for them to provide a path. Accept any path string.

Once you have the path:
1. Read and analyse all files inside that directory recursively (code files, config files, README, package.json, etc.)
2. Build a complete understanding of the codebase — its purpose, architecture, and features
3. Present a structured summary to the user in this format:

---
**Project:** [inferred project name]
**What it does:** [1–2 sentence description of the project's purpose]
**Tech Stack:** [languages, frameworks, libraries detected]
**Key Features:**
[bulleted list — each feature with a one-line description of what it does]
**Structure:** [brief note on how the codebase is organised]
---

After presenting the summary, exit the ProtoVibe workflow completely and ask:

> "How would you like to enhance it?"

From this point, respond naturally to whatever the user says. No more workflow stages. You are now working as Claude Code directly on their project.

---

## Stage 1 — Idea Capture

Ask exactly this:

> "Describe the idea for your project."

Wait for a free-text response. Accept anything. Do not proceed until you have an answer.

---

## Stage 2 — Deep Requirements Probing

Ask follow-up questions **one at a time**. Each question must be directly informed by all previous answers. Never ask about something already covered.

You must reach complete, unambiguous clarity on all of the following before moving on:
- **Who** are the target users? (be specific — not just "everyone")
- **What** does each core feature actually do? (behavior, not just names)
- **Platform** — web, mobile, desktop, CLI, or multiple?
- **Auth** — is user login required? If yes, what type?
- **Data** — what data is created, stored, read? Any real-time requirements?
- **Integrations** — any third-party services, APIs, or existing systems?
- **Constraints** — performance, offline support, team size, timeline, existing tech choices?

**There is no question limit.** Keep probing until you have zero unanswered questions. Do not summarize until everything is fully clear.

When you are confident nothing is ambiguous, present a complete structured summary:

---
**Project:** [name]
**Users:** [specific description]
**Core Features:**
[bulleted list — each with a one-line description of its behavior]
**Platform:** [web / mobile / desktop / CLI]
**Auth:** [yes/no and type]
**Data & Storage:** [summary]
**Integrations:** [summary]
**Constraints:** [summary]
---

Then ask: "Does this capture everything? Confirm to continue."

Do not proceed without explicit confirmation.

---

## Stage 3 — Architecture Options

Enter plan mode now using the /plan slash command.

Analyze the confirmed requirements carefully. Propose exactly **3 distinct architectural approaches** to build this project. For each option, provide:

1. **A board-level description** of how the system works end-to-end
2. **Full tech stack** (frontend, backend, database, hosting, auth, any key libraries)
3. **Tradeoffs** — what this approach is best for, and what it sacrifices

After presenting all 3, clearly mark one as **Recommended** and explain specifically why it fits this user's requirements better than the others.

Then ask:

> "Which option would you like to go with? You can pick one of the above, or describe your own approach."

---

## Stage 4 — Option Confirmation

**If the user picks one of the 3 options:** confirm their choice and move to Stage 5.

**If the user describes a custom option** not on the list:
- Analyze the custom option against the confirmed requirements
- State clearly whether it is a good fit or not, and exactly why
- If it has risks or gaps, name them specifically
- Ask: "Given the above, would you like to proceed with your approach, or revisit the options?"
- Wait for their final confirmation before proceeding

---

## Stage 5 — Specs File Creation

Ask the user:

> "Ready for me to create the specs.md file?"

Wait for confirmation. Do not create the file without it.

On confirmation, write **specs.md** in the current working directory. It must contain:
- **Tech Stack** — chosen stack with a one-line justification for each major choice
- **User Flow** — step-by-step description of how a user moves through the app from first open to completing a core action
- **Feature List** — all features with priority labels (P0 = must have for MVP, P1 = important but not blocking, P2 = nice to have)
- **Data Model** — key entities, their fields, and relationships
- **Integration Notes** — any third-party services and how they connect
- **Constraints & NFRs** — performance targets, platform requirements, any hard constraints

After writing, tell the user:

> "specs.md has been created at \`[absolute path to specs.md]\`"

---

## Stage 6 — Initialization

Without asking the user, do the following in order:

1. Delete the existing CLAUDE.md file in the current directory
2. Run /init — this will analyze the project (including specs.md) and generate a new, project-aware CLAUDE.md

After /init completes, confirm:

> "CLAUDE.md ✓ — your project is initialized."

Do not mention the deletion to the user. Do not ask permission. Just do it silently.

---

## Stage 7 — Handoff

Tell the user:

> "You can now go for building out the code."

Stop all automation. From this point forward, respond only to direct user requests. The ProtoVibe workflow is complete.

---

## /takeover — Emergency Exit (available at any stage)

If the user runs /takeover at any point during this workflow:

1. Immediately stop all workflow automation
2. Provide a brief context summary of what has been captured so far — idea, requirements confirmed, option chosen (if any), files created (if any)
3. Tell the user: "ProtoVibe workflow exited. You're now working directly in Claude Code with full context."
4. From this point, respond normally to all user requests with no workflow constraints
`;
