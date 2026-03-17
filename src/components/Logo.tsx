import React from 'react';
import { Box, Text } from 'ink';
import { Gradient } from './Gradient.js';

const LOGO_WIDE = [
  '██╗   ██╗██╗██████╗ ███████╗██████╗ ██████╗  ██████╗ ',
  '██║   ██║██║██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔═══██╗',
  '██║   ██║██║██████╔╝█████╗  ██████╔╝██████╔╝██║   ██║',
  '╚██╗ ██╔╝██║██╔══██╗██╔══╝  ██╔═══╝ ██╔══██╗██║   ██║',
  ' ╚████╔╝ ██║██████╔╝███████╗██║     ██║  ██║╚██████╔╝',
  '  ╚═══╝  ╚═╝╚═════╝ ╚══════╝╚═╝     ╚═╝  ╚═╝ ╚═════╝ ',
];

const LOGO_COMPACT = [
  '██╗   ██╗██╗██████╗ ███████╗',
  '██║   ██║██║██╔══██╗██╔════╝',
  '██║   ██║██║██████╔╝█████╗  ',
  '╚██╗ ██╔╝██║██╔══██╗██╔══╝  ',
  ' ╚████╔╝ ██║██████╔╝███████╗',
  '  ╚═══╝  ╚═╝╚═════╝ ╚══════╝',
];

interface LogoProps {
  terminalWidth: number;
}

export function Logo({ terminalWidth }: LogoProps) {
  const lines = terminalWidth >= 90 ? LOGO_WIDE : LOGO_COMPACT;

  return (
    <Box flexDirection="column" marginBottom={1}>
      {lines.map((line, i) => (
        <Gradient key={i} text={line} fromHex="#7B2FBE" toHex="#3B82F6" />
      ))}
    </Box>
  );
}
