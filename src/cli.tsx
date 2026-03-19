import React, { useEffect, useState } from 'react';
import { Box, Text, useApp } from 'ink';
import { Logo } from './components/Logo.js';
import { InfoBox } from './components/InfoBox.js';
import { isAuthenticated } from './auth.js';
import { isClaudeInstalled, spawnClaude } from './spawn.js';
import { scaffoldProject } from './scaffold.js';
import { confirm } from '@clack/prompts';
import { spawnSync } from 'child_process';
import chalk from 'chalk';

function printLaunchBox(): void {
  const W = 42;
  const border = (s: string) => chalk.hex('#3a1a6a')(s);
  const accent = (s: string) => chalk.hex('#b39ddb')(s);

  const row = (text: string, visibleLen: number) =>
    border('│') + text + ' '.repeat(Math.max(0, W - visibleLen)) + border('│');

  const lines = [
    '',
    border('╭' + '─'.repeat(W) + '╮'),
    row('', 0),
    row('  ' + chalk.white('Claude Code is loading your project.'), 38),
    row('', 0),
    row(
      '  Type ' + accent('"Hello"') + ' or ' + accent('"What\'s up?"') + ' to begin.',
      40
    ),
    row('', 0),
    border('╰' + '─'.repeat(W) + '╯'),
    '',
  ];

  process.stdout.write(lines.join('\n') + '\n');
}

type Stage =
  | 'boot'
  | 'auth-check'
  | 'auth-prompt'
  | 'auth-done'
  | 'claude-check'
  | 'scaffold';

interface AppProps {
  terminalWidth: number;
  version: string;
}

export function App({ terminalWidth, version }: AppProps) {
  const { exit } = useApp();
  const [stage, setStage] = useState<Stage>('boot');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (stage !== 'boot') return;
    const timer = setTimeout(() => setStage('auth-check'), 80);
    return () => clearTimeout(timer);
  }, [stage]);

  useEffect(() => {
    if (stage !== 'auth-check') return;
    if (isAuthenticated()) {
      setStage('auth-done');
    } else {
      setStage('auth-prompt');
    }
  }, [stage]);

  useEffect(() => {
    if (stage !== 'auth-prompt') return;

    exit(); // Release Ink so Clack can take over stdin

    (async () => {
      const shouldLogin = await confirm({
        message: 'This requires a Claude Code account. Do you want to log in now?',
      });

      if (!shouldLogin) {
        process.stdout.write('\nLogin cancelled. Run protovibe again when ready.\n');
        process.exit(0);
      }

      process.stdout.write('\n  Opening browser to log you in to Claude Code...\n\n');
      const claudeCmd = process.platform === 'win32' ? 'claude.cmd' : 'claude';
      const loginResult = spawnSync(claudeCmd, ['auth', 'login'], { stdio: 'inherit' });

      // Fallback: if auth login subcommand not recognised, open full TUI
      if (loginResult.status !== 0 && loginResult.status !== null) {
        process.stdout.write(
          '\n  Opening Claude Code to log you in.\n  Once logged in, type /exit to return to ProtoVibe.\n\n'
        );
        spawnSync(claudeCmd, [], { stdio: 'inherit' });
      }

      // Re-check after claude exits
      if (!isAuthenticated()) {
        process.stderr.write('\n✗ Not logged in. Run protovibe again after logging in.\n');
        process.exit(1);
      }

      // Re-render Ink with auth-done state
      setStage('auth-done');
    })();
  }, [stage]);

  useEffect(() => {
    if (stage !== 'auth-done') return;
    setStage('claude-check');
  }, [stage]);

  useEffect(() => {
    if (stage !== 'claude-check') return;
    if (!isClaudeInstalled()) {
      setError('Claude Code is not found. Please install it from claude.ai/code');
      return;
    }
    setStage('scaffold');
  }, [stage]);

  useEffect(() => {
    if (stage !== 'scaffold') return;
    exit();
    scaffoldProject().then((projectPath) => {
      printLaunchBox();
      spawnClaude(projectPath);
    });
  }, [stage]);

  if (error) {
    return (
      <Box flexDirection="column" paddingTop={1}>
        <Logo terminalWidth={terminalWidth} />
        <InfoBox version={version} />
        <Box marginTop={1}>
          <Text color="red">✗ {error}</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" paddingTop={1}>
      <Logo terminalWidth={terminalWidth} />
      <InfoBox version={version} />

      {(stage === 'auth-done' || stage === 'claude-check' || stage === 'scaffold') && (
        <Box marginTop={1}>
          <Text color="#7B2FBE">✓ </Text>
          <Text color="white">Logged in to Claude Code</Text>
        </Box>
      )}
    </Box>
  );
}
