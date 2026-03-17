import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

// Known credential file locations across Claude Code versions
const CREDENTIAL_PATHS = [
  join(homedir(), '.claude', '.credentials.json'),
  join(homedir(), '.claude', 'auth.json'),
];

export function isAuthenticated(): boolean {
  // Check known credential file locations
  for (const credPath of CREDENTIAL_PATHS) {
    if (!existsSync(credPath)) continue;
    try {
      const content = readFileSync(credPath, 'utf-8').trim();
      if (!content) continue;
      const parsed = JSON.parse(content);
      if (Object.keys(parsed).length > 0) return true;
    } catch {
      continue;
    }
  }

  // Fallback: newer Claude Code versions may store auth in the OS keychain.
  // If ~/.claude/settings.json exists, Claude Code has been set up and the
  // user is considered authenticated.
  return existsSync(join(homedir(), '.claude', 'settings.json'));
}
