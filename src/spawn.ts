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
  const child = spawn('claude', [], {
    stdio: 'inherit',
    cwd: projectPath,
    shell: true,
  });

  child.on('error', (err) => {
    process.stderr.write(`Failed to start Claude Code: ${err.message}\n`);
    process.exit(1);
  });

  child.on('close', (code) => {
    process.exit(code ?? 0);
  });
}
