import React from 'react';
import { render } from 'ink';
import { App } from './cli.js';
import { createRequire } from 'module';
import updateNotifier from 'update-notifier';

const require = createRequire(import.meta.url);
const pkg = require('../package.json') as { name: string; version: string };
updateNotifier({ pkg }).notify();

const terminalWidth = process.stdout.columns ?? 80;

render(<App terminalWidth={terminalWidth} />);
