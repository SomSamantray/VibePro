import React from 'react';
import { Box, Text } from 'ink';
import { Gradient } from './Gradient.js';

const WIDTH = 42;

function pad(content: string): string {
  const visible = content.replace(/\x1b\[[0-9;]*m/g, '');
  const padding = WIDTH - visible.length - 2;
  return ' ' + content + ' '.repeat(Math.max(0, padding)) + ' ';
}

function BorderLine({ char }: { char: string }) {
  return (
    <Text color="#3a1a6a">{'─'.repeat(WIDTH)}</Text>
  );
}

export function InfoBox({ version }: { version: string }) {
  const separator = '─'.repeat(WIDTH);

  return (
    <Box flexDirection="column">
      <Text color="#3a1a6a">{'╭' + '─'.repeat(WIDTH) + '╮'}</Text>

      {/* version */}
      <Text color="#3a1a6a">│<Text color="#b39ddb">  version  </Text><Text color="#ffffff">{version}</Text>{' '.repeat(WIDTH - 12 - version.length)}│</Text>

      {/* by */}
      <Text color="#3a1a6a">│<Text color="#b39ddb">  by  </Text><Text color="#ffffff">razorgojo</Text>{' '.repeat(WIDTH - 15)}│</Text>

      {/* powered by */}
      <Text color="#3a1a6a">{'│  '}<Text color="#b39ddb">powered by  </Text><Gradient text="Claude Code" fromHex="#7B2FBE" toHex="#3B82F6" />{' '.repeat(WIDTH - 25)}{'│'}</Text>

      {/* separator */}
      <Text color="#3a1a6a">{'├' + separator + '┤'}</Text>

      {/* tagline */}
      <Text color="#3a1a6a">│<Text color="#6d5a8a" italic>  Vibecode your prototypes.</Text>{' '.repeat(WIDTH - 28)}│</Text>

      {/* commands separator */}
      <Text color="#3a1a6a">{'├' + separator + '┤'}</Text>

      {/* commands label */}
      <Text color="#3a1a6a">│<Text color="#b39ddb">  commands</Text>{' '.repeat(WIDTH - 11)}│</Text>

      {/* /exit command */}
      <Text color="#3a1a6a">│<Text color="#ffffff">  /exit</Text><Text color="#6d5a8a">  —  quit ProtoVibe at any time</Text>{' '.repeat(WIDTH - 37)}│</Text>

      <Text color="#3a1a6a">{'╰' + '─'.repeat(WIDTH) + '╯'}</Text>
    </Box>
  );
}
