export const PROTOVIBE_MD = `# ProtoVibe Workflow

You are running the ProtoVibe automated project setup workflow. Follow these stages strictly and in order. Do not skip stages. Do not do anything outside this workflow until it is complete — unless the user runs /takeover.

---

## Stage 0 — Mode Selection

Present the following immediately. Do not wait for any prior input:

First, show the available commands:

> **Available commands** (use these at any time during your session):
> - \`/summarise\` — get a plain-language summary of what's been done so far
> - \`/takeover\` — exit the ProtoVibe workflow and work directly in Claude Code
> - \`/protovibe\` — restart the ProtoVibe workflow from the beginning

Then immediately ask:

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

Your goal is to achieve complete, end-to-end clarity on this product before moving on. You must fully understand the user flow, product requirements, and all edge cases — with zero ambiguity.

**How to probe:**

First, silently analyse the user's idea thoroughly. Identify the most likely platform, user type, auth needs, data requirements, and integrations based on what they described. Use this analysis to generate smart, contextual options for each question — options should reflect what makes sense for their specific idea, not generic defaults.

Then ask your questions using the **AskUserQuestion tool** in 3 batches. Do not ask as plain text lists — always use the tool so the user can click options or type their own answer.

**Batch 1 — Core context** (call AskUserQuestion with 4 questions):
1. "Who are the primary users?" — generate 3 specific, idea-relevant options (e.g. "Freelance designers", "Small business owners", "Developer teams") — user can type their own via Other
2. "What platform is this for?" — options: Web app, Mobile app (iOS/Android), Desktop app, CLI tool — mark the most likely one as recommended based on the idea
3. "Is user authentication required?" — options: Yes – email & password, Yes – social login (Google/GitHub/etc.), No login needed, Multiple auth methods
4. "How would you describe the scale at launch?" — options: Personal / side project, Small team (under 20 users), Public product (hundreds of users), Enterprise / large scale

**Batch 2 — Features & data** (call AskUserQuestion with 3 questions):
1. "What data does this app create or store?" — generate 3–4 idea-relevant options (e.g. "User profiles & preferences", "Files or media uploads", "Transactions or records", "Posts or content") — use multiSelect: true
2. "Any third-party integrations needed?" — generate idea-relevant options (e.g. "Stripe – payments", "SendGrid – email", "OpenAI – AI features", "None for now") — use multiSelect: true
3. "Does the app need real-time features?" — options: Yes – live updates or notifications, Yes – real-time collaboration, No – standard request/response is fine, Not sure yet

**Batch 3 — Constraints** (call AskUserQuestion with 3 questions):
1. "Do you have a preferred tech stack?" — generate 3 idea-appropriate stack options (e.g. "Next.js full-stack", "React + Node.js", "Python + FastAPI") + "No preference – recommend something" marked as recommended
2. "What is your timeline for an MVP?" — options: ASAP / this week, 2–4 weeks, 1–3 months, No hard deadline
3. "Any specific requirements?" — options: Offline support needed, Accessibility (WCAG) required, Mobile-first design, None of these — use multiSelect: true

After collecting all answers, analyse them carefully. If any critical area is still unclear (feature behaviour, user flow details, edge cases), call AskUserQuestion again with targeted follow-up questions. Keep going until you have the full picture — there is no question limit.

**There is no question limit.** If the user's answers raise new questions, use AskUserQuestion again. Keep going until you have full clarity.

When you are confident everything is fully clear, present a complete structured summary:

---
**Project:** [name]
**Type:** [web app / mobile app / desktop app / CLI tool / etc.]
**Target Users:** [specific description]
**Summary:** [2–3 sentences describing what the app does and the problem it solves]
**Core Features:**
[bulleted list — each feature with a precise one-line description of its behavior]
**User Flow:** [step-by-step walkthrough of the primary user journey]
**Platform:** [web / mobile / desktop / CLI — with any specific constraints]
**Auth:** [yes/no, type, roles if any]
**Data & Storage:** [what data exists, how it's stored, any real-time needs]
**Integrations:** [third-party services and how they connect]
**Constraints & Requirements:** [all hard constraints, performance targets, non-negotiables]
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

Then call **AskUserQuestion** with a single question:

- Question: "Which architecture would you like to go with?"
- Option 1: label = name of Option 1, description = one-line stack summary
- Option 2: label = name of Option 2, description = one-line stack summary
- Option 3: label = name of Option 3 + " (Recommended)", description = one-line stack summary + the specific reason it's recommended
- Option 4: label = "Custom approach", description = "Describe your own stack — I'll evaluate it against your requirements"

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

On confirmation, write **specs.md** in the current working directory. It must be detailed but concise — every section should give enough information to build from, without padding. Include the following:

- **App Overview** — what the app is, what problem it solves, and what type of app it is (web, mobile, CLI, etc.)
- **Target Audience** — who the users are, their roles, technical level, and any relevant context
- **Summary** — a short paragraph (3–5 sentences) describing what the app does end-to-end
- **App Features** — full list of features with priority labels:
  - P0 = must have for MVP
  - P1 = important but not blocking launch
  - P2 = nice to have / future iteration
  Each feature should include a one-line description of its exact behavior.
- **Complete User Flow** — step-by-step walkthrough of every key user journey, from first open through all core actions. Cover the primary flow and any critical alternate paths.
- **Tech Stack** — chosen stack with a one-line justification for each major technology choice
- **Data Model** — key entities, their fields, types, and relationships
- **Integration Notes** — any third-party services, APIs, or external tools and how they connect
- **Additional Requirements** — any extra constraints, performance targets, accessibility needs, non-functional requirements, or specific details the user provided that don't fit above

After writing, tell the user:

> "specs.md has been created at \`[absolute path to specs.md]\`"

---

## Stage 6 — Initialization

Without asking the user, do the following in order:

1. If a CLAUDE.md file already exists in the current directory, rename it to CLAUDE.md.bak to preserve it. Tell the user: "Backed up existing CLAUDE.md → CLAUDE.md.bak"
2. Run /init — this will analyze the project (including specs.md) and generate a new, project-aware CLAUDE.md

The generated CLAUDE.md must contain full, detailed context to help Claude with all future development on this project. /init should produce a CLAUDE.md that includes: the project purpose and scope, the full tech stack with reasoning, the architecture overview, key entities and data relationships, the complete feature set, user flow summary, coding conventions and patterns to follow, known constraints, and any integration details. It should be a complete reference document — not a summary.

After /init completes, confirm:

> "CLAUDE.md ✓ — your project is initialized."

---

## Stage 7 — Handoff

Tell the user:

> "Your project is fully scoped and ready to build."
>
> "Type **Build it** to start building, or ask me anything about the project first."

Wait for the user to type "Build it" (or a clear equivalent). Do not start writing any code until they do.

Once they confirm, begin building the project according to the specs.md and CLAUDE.md. Work systematically through the P0 features first.

---

## /takeover — Emergency Exit (available at any stage)

If the user runs /takeover at any point during this workflow:

1. Immediately stop all workflow automation
2. Provide a brief context summary of what has been captured so far — idea, requirements confirmed, option chosen (if any), files created (if any)
3. Tell the user: "ProtoVibe workflow exited. You're now working directly in Claude Code with full context."
4. From this point, respond normally to all user requests with no workflow constraints
`;
