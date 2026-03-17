export const TAKEOVER_MD = `# /takeover — Exit ProtoVibe Workflow

When this command is run:

1. Immediately stop all ProtoVibe workflow automation, regardless of which stage you are currently in
2. Provide a brief summary of everything captured so far:
   - The project idea (if described)
   - Requirements confirmed (if any)
   - Architecture option chosen (if selected)
   - Files created (specs.md, CLAUDE.md — if generated)
3. Tell the user:

> "ProtoVibe workflow exited. You're now working directly in Claude Code with full context."

4. From this point forward, respond normally to all user requests. No more workflow stages. No more automation. Just Claude Code.
`;
