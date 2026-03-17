import React from 'react';
import { render } from 'ink';
import { App } from './cli.js';
import { createRequire } from 'module';
import { execSync, spawnSync } from 'child_process';

const require = createRequire(import.meta.url);
const pkg = require('../package.json') as { name: string; version: string };

function isNewerVersion(current: string, latest: string): boolean {
  const parse = (v: string) => v.split('.').map(Number);
  const [cMaj, cMin, cPatch] = parse(current);
  const [lMaj, lMin, lPatch] = parse(latest);
  if (lMaj !== cMaj) return lMaj > cMaj;
  if (lMin !== cMin) return lMin > cMin;
  return lPatch > cPatch;
}

if (process.env.PROTOVIBE_UPDATED !== '1') {
  try {
    const latest = execSync('npm show protovibe version', {
      timeout: 4000,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();

    if (isNewerVersion(pkg.version, latest)) {
      process.stdout.write(`\n  Updating ProtoVibe ${pkg.version} → ${latest}...\n\n`);
      execSync('npm install -g protovibe@latest', { stdio: 'inherit' });
      spawnSync('protovibe', process.argv.slice(2), {
        stdio: 'inherit',
        shell: true,
        env: { ...process.env, PROTOVIBE_UPDATED: '1' },
      });
      process.exit(0);
    }
  } catch {
    // Network unavailable or npm error — continue silently
  }
}

const terminalWidth = process.stdout.columns ?? 80;

render(<App terminalWidth={terminalWidth} version={pkg.version} />);
