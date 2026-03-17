import React from 'react';
import { render } from 'ink';
import { App } from './cli.js';

const terminalWidth = process.stdout.columns ?? 80;

render(<App terminalWidth={terminalWidth} />);
