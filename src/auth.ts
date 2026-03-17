import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

// Claude Code stores credentials at ~/.claude/.credentials.json
function getClaudeCredentialsPath(): string {
  return join(homedir(), '.claude', '.credentials.json');
}

export function isAuthenticated(): boolean {
  const credPath = getClaudeCredentialsPath();
  if (!existsSync(credPath)) return false;
  try {
    const content = readFileSync(credPath, 'utf-8').trim();
    if (!content) return false;
    const parsed = JSON.parse(content);
    return Object.keys(parsed).length > 0;
  } catch {
    return false;
  }
}
