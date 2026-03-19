import { mkdirSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { homedir } from 'os';
import * as clack from '@clack/prompts';
import { CLAUDE_MD } from './templates/CLAUDE.md.js';
import { PROTOVIBE_MD } from './templates/protovibe.md.js';
import { TAKEOVER_MD } from './templates/takeover.md.js';
import { SUMMARISE_MD } from './templates/summarise.md.js';
import { CLAUDE_ANALYSE_MD } from './templates/CLAUDE-analyse.md.js';
import { ANALYSE_MD } from './templates/analyse.md.js';

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
      { value: '__exit__', label: '⎋  Exit ProtoVibe' },
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

    if (choice === '__exit__') {
      clack.cancel('Exiting ProtoVibe. See you next time.');
      process.exit(0);
    } else if (choice === '__select__') {
      return currentPath;
    } else if (choice === '__up__') {
      currentPath = dirname(currentPath);
    } else {
      currentPath = choice as string;
    }
  }
}

function writeProtovibeTemplates(targetDir: string): void {
  mkdirSync(join(targetDir, '.claude', 'commands'), { recursive: true });
  writeFileSync(join(targetDir, 'CLAUDE.md'), CLAUDE_MD, 'utf-8');
  writeFileSync(join(targetDir, '.claude', 'commands', 'protovibe.md'), PROTOVIBE_MD, 'utf-8');
  writeFileSync(join(targetDir, '.claude', 'commands', 'takeover.md'), TAKEOVER_MD, 'utf-8');
  writeFileSync(join(targetDir, '.claude', 'commands', 'summarise.md'), SUMMARISE_MD, 'utf-8');
}

function writeAnalyseTemplates(targetDir: string): void {
  mkdirSync(join(targetDir, '.claude', 'commands'), { recursive: true });
  writeFileSync(join(targetDir, 'CLAUDE.md'), CLAUDE_ANALYSE_MD, 'utf-8');
  writeFileSync(join(targetDir, '.claude', 'commands', 'analyse.md'), ANALYSE_MD, 'utf-8');
}

async function handleExistingProject(): Promise<string> {
  const rawPath = await clack.text({
    message: 'Path to your existing project:',
    placeholder: '/Users/you/my-project',
    validate(value) {
      if (!value.trim()) return 'Path is required.';
      const resolved = resolve(value.trim().replace(/^~/, homedir()));
      if (!existsSync(resolved)) return 'That path does not exist.';
      try {
        if (!statSync(resolved).isDirectory()) return 'That path is not a directory.';
      } catch {
        return 'Could not read that path.';
      }
    },
  });

  if (clack.isCancel(rawPath)) {
    clack.cancel('Exiting ProtoVibe. See you next time.');
    process.exit(0);
  }

  const existingPath = resolve(String(rawPath).trim().replace(/^~/, homedir()));

  const claudeMdPath = join(existingPath, 'CLAUDE.md');
  if (existsSync(claudeMdPath)) {
    const overwrite = await clack.confirm({
      message: 'This project already has a CLAUDE.md. ProtoVibe will replace it to inject its workflow. Overwrite?',
    });
    if (clack.isCancel(overwrite) || !overwrite) {
      clack.cancel('Exiting ProtoVibe. Your CLAUDE.md was not changed.');
      process.exit(0);
    }
  }

  writeAnalyseTemplates(existingPath);
  clack.outro(`✓ Ready to analyse ${existingPath}`);
  return existingPath;
}

async function handleNewProject(): Promise<string> {
  let parentDir: string | null = null;

  while (true) {
    const nameInput = await clack.text({
      message: 'Project name:',
      placeholder: 'my-project',
      validate(value) {
        if (value.trim() === '/exit') return undefined;
        if (!value.trim()) return 'Project name is required.';
        if (/[^a-zA-Z0-9\-_]/.test(value)) return 'Use only letters, numbers, hyphens, and underscores.';
      },
    });

    if (clack.isCancel(nameInput) || String(nameInput).trim() === '/exit') {
      clack.cancel('Exiting ProtoVibe. See you next time.');
      process.exit(0);
    }

    if (parentDir === null) {
      clack.log.info('Select where to create your project:');
      parentDir = await browseForDirectory();
    }

    const targetDir = join(parentDir, String(nameInput).trim());

    if (!existsSync(targetDir)) {
      writeProtovibeTemplates(targetDir);
      clack.outro(`✓ Project created at ${targetDir}`);
      return targetDir;
    }

    clack.log.error(`A project named '${String(nameInput).trim()}' already exists at this location.`);

    const conflictChoice = await clack.select({
      message: 'What would you like to do?',
      options: [
        { value: 'rename', label: 'Choose a different name for my new project' },
        { value: 'continue', label: 'Continue with the existing project' },
      ],
    });

    if (clack.isCancel(conflictChoice)) {
      clack.cancel('Exiting ProtoVibe. See you next time.');
      process.exit(0);
    }

    if (conflictChoice === 'continue') {
      const claudeMdPath = join(targetDir, 'CLAUDE.md');
      if (existsSync(claudeMdPath)) {
        const overwrite = await clack.confirm({
          message: 'This project already has a CLAUDE.md. Overwrite it with the ProtoVibe configuration?',
        });
        if (clack.isCancel(overwrite) || !overwrite) {
          clack.cancel('Exiting ProtoVibe. Your CLAUDE.md was not changed.');
          process.exit(0);
        }
      }
      writeProtovibeTemplates(targetDir);
      clack.outro(`✓ Ready to continue at ${targetDir}`);
      return targetDir;
    }
    // 'rename' → loop, re-ask name, keep parentDir
  }
}

export async function scaffoldProject(): Promise<string> {
  const modeChoice = await clack.select({
    message: 'What would you like to do?',
    options: [
      { value: 'new', label: 'Start a new project' },
      { value: 'existing', label: 'Continue with an existing project' },
    ],
  });

  if (clack.isCancel(modeChoice)) {
    clack.cancel('Exiting ProtoVibe. See you next time.');
    process.exit(0);
  }

  if (modeChoice === 'existing') {
    return handleExistingProject();
  }

  return handleNewProject();
}
