import { execSync, spawn } from 'child_process';

export function isClaudeInstalled(): boolean {
  try {
    const cmd = process.platform === 'win32' ? 'where claude' : 'which claude';
    execSync(cmd, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

export function spawnClaude(projectPath: string): void {
  const claudeCmd = process.platform === 'win32' ? 'claude.cmd' : 'claude';
  const child = spawn(claudeCmd, [], {
    stdio: 'inherit',
    cwd: projectPath,
  });

  child.on('error', (err) => {
    process.stderr.write(`Failed to start Claude Code: ${err.message}\n`);
    process.exit(1);
  });

  child.on('close', (code) => {
    process.exit(code ?? 0);
  });
}
