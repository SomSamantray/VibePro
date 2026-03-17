import { mkdirSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import * as clack from '@clack/prompts';
import { CLAUDE_MD } from './templates/CLAUDE.md.js';
import { PROTOVIBE_MD } from './templates/protovibe.md.js';
import { TAKEOVER_MD } from './templates/takeover.md.js';

function getSubdirectories(dirPath: string): string[] {
  try {
    return readdirSync(dirPath)
      .filter(name => {
        if (name.startsWith('.')) return false;
        try {
          return statSync(join(dirPath, name)).isDirectory();
        } catch {
          return false;
        }
      })
      .sort();
  } catch {
    return [];
  }
}

async function browseForDirectory(): Promise<string> {
  let currentPath = homedir();

  while (true) {
    const subdirs = getSubdirectories(currentPath);
    const isRoot = dirname(currentPath) === currentPath;

    const options: { value: string; label: string }[] = [
      { value: '__select__', label: `✓  Use this folder — ${currentPath}` },
      ...(!isRoot ? [{ value: '__up__', label: '↑  Go up' }] : []),
      ...subdirs.map(dir => ({ value: join(currentPath, dir), label: `📁  ${dir}` })),
    ];

    const choice = await clack.select({
      message: `📂 ${currentPath}`,
      options,
    });

    if (clack.isCancel(choice)) {
      clack.cancel('Cancelled.');
      process.exit(0);
    }

    if (choice === '__select__') {
      return currentPath;
    } else if (choice === '__up__') {
      currentPath = dirname(currentPath);
    } else {
      currentPath = choice as string;
    }
  }
}

export async function scaffoldProject(): Promise<string> {
  const projectName = await clack.text({
    message: 'Project name:',
    placeholder: 'my-project',
    validate(value) {
      if (!value.trim()) return 'Project name is required.';
      if (/[^a-zA-Z0-9\-_]/.test(value)) return 'Use only letters, numbers, hyphens, and underscores.';
    },
  });

  if (clack.isCancel(projectName)) {
    clack.cancel('Cancelled.');
    process.exit(0);
  }

  clack.log.info('Select where to create your project:');
  const parentDir = await browseForDirectory();
  const targetDir = join(parentDir, String(projectName));

  if (existsSync(targetDir)) {
    clack.cancel(`Directory already exists: ${targetDir}`);
    process.exit(1);
  }

  // Create directory structure
  mkdirSync(join(targetDir, '.claude', 'commands'), { recursive: true });

  // Write files
  writeFileSync(join(targetDir, 'CLAUDE.md'), CLAUDE_MD, 'utf-8');
  writeFileSync(join(targetDir, '.claude', 'commands', 'protovibe.md'), PROTOVIBE_MD, 'utf-8');
  writeFileSync(join(targetDir, '.claude', 'commands', 'takeover.md'), TAKEOVER_MD, 'utf-8');

  clack.outro(`✓ Project created at ${targetDir}`);

  return targetDir;
}
