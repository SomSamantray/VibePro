import React from 'react';
import { render } from 'ink';
import { App } from './cli.js';
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
        let size = 0;
        const MAX_BYTES = 65536; // 64 KB — registry /latest is always < 5 KB
        res.on('data', (chunk: Buffer) => {
          size += chunk.length;
          if (size > MAX_BYTES) {
            req.destroy();
            resolve(null);
            return;
          }
          data += chunk;
        });
        res.on('end', () => {
          try {
            const version = JSON.parse(data).version;
            if (typeof version === 'string' && /^\d+\.\d+\.\d+$/.test(version)) {
              resolve(version);
            } else {
              resolve(null);
            }
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

  const latest = await fetchLatestVersion();
  if (latest && isNewerVersion(pkg.version, latest)) {
    process.stdout.write(
      `\n  A new version of ProtoVibe is available: ${pkg.version} → ${latest}\n` +
      `  Run \`npm update -g protovibe\` to update.\n\n`
    );
  }

  const terminalWidth = process.stdout.columns ?? 80;
  render(<App terminalWidth={terminalWidth} version={pkg.version} />);
}

main().catch(() => {
  const terminalWidth = process.stdout.columns ?? 80;
  render(<App terminalWidth={terminalWidth} version={pkg.version} />);
});
