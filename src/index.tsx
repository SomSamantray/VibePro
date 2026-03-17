import React from 'react';
import { render } from 'ink';
import { App } from './cli.js';
import { execSync, spawnSync } from 'child_process';
import { createRequire } from 'module';
import { get } from 'https';

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

function fetchLatestVersion(): Promise<string | null> {
  return new Promise((resolve) => {
    const req = get(
      'https://registry.npmjs.org/protovibe/latest',
      { timeout: 3000 },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data).version ?? null);
          } catch {
            resolve(null);
          }
        });
      }
    );
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

async function main() {
  // Guard: detect local install via node_modules in the binary path
  if (process.argv[1]?.includes('node_modules')) {
    process.stderr.write(
      '\n  \u2717 protovibe was installed locally.\n\n' +
      '  Option 1 \u2014 run it right now:\n' +
      '    npx protovibe\n\n' +
      '  Option 2 \u2014 install globally (recommended):\n' +
      '    npm install -g protovibe\n\n'
    );
    process.exit(1);
  }

  if (process.env.PROTOVIBE_UPDATED !== '1') {
    const latest = await fetchLatestVersion();
    if (latest && isNewerVersion(pkg.version, latest)) {
      process.stdout.write(`\n  Updating ProtoVibe ${pkg.version} → ${latest}...\n\n`);
      execSync('npm install -g protovibe@latest', { stdio: 'inherit' });
      spawnSync('protovibe', process.argv.slice(2), {
        stdio: 'inherit',
        shell: true,
        env: { ...process.env, PROTOVIBE_UPDATED: '1' },
      });
      process.exit(0);
    }
  }

  const terminalWidth = process.stdout.columns ?? 80;
  render(<App terminalWidth={terminalWidth} version={pkg.version} />);
}

main().catch(() => {
  const terminalWidth = process.stdout.columns ?? 80;
  render(<App terminalWidth={terminalWidth} version={pkg.version} />);
});
