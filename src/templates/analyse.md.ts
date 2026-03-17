export const ANALYSE_MD = `# /analyse — Project Analysis

When this command is run:

1. Read every source file, configuration file, and documentation file in the current working directory, recursively. Include: all code files, package.json / pyproject.toml / Cargo.toml or equivalent, README files, config files.

2. Build a complete understanding of the codebase. Do not ask the user any questions during this step.

3. Present a structured summary in exactly this format:

---
**Project:** [inferred project name from package.json, directory name, or equivalent]
**What it does:** [1–2 sentences describing the project's purpose and who it is for]
**Tech Stack:** [comma-separated list of languages, frameworks, and major libraries]
**Key Features:**
[bulleted list — one sentence per feature]
**Project Structure:** [2–3 sentences on key directories, entry points, and separation of concerns]
**Current State:** [one sentence: scaffold, early prototype, partially built, or mature codebase — based on file count, TODOs, and feature completeness]
---

4. After presenting the summary, say exactly:

> "I've analysed your project. I'm ready to help — what would you like to work on?"

5. STOP. Do not suggest tasks. Do not ask questions. Wait for the user.
`;
