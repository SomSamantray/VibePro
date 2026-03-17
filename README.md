# ProtoVibe

A branded CLI that wraps Claude Code with a polished onboarding experience — gradient boot screen, auth check, project scaffolding, then hands off to Claude Code.

## Prerequisites

- [Node.js](https://nodejs.org) v18+
- [Claude Code](https://claude.ai/code) installed and accessible as `claude` in your PATH

## Install

```bash
npm install -g protovibe
```

## Usage

```bash
protovibe
```

ProtoVibe will:

1. Display a boot screen
2. Verify Claude Code credentials (runs `claude login` if needed)
3. Prompt for a project name and location
4. Scaffold a new project directory with a 7-stage workflow prompt
5. Launch Claude Code inside the project and exit

## What gets scaffolded

```
<your-project>/
├── CLAUDE.md                    # Instructs Claude to run /protovibe on boot
└── .claude/commands/
    ├── protovibe.md             # 7-stage workflow: idea → refinement → docs → build
    └── takeover.md              # Escape hatch to work directly in Claude
```

## Development

```bash
git clone https://github.com/SomSamantray/VibePro-CLI
cd VibePro-CLI
npm install
npm run build
node dist/index.mjs
```

## License

MIT
