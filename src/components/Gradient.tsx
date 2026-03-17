import React from 'react';
import { Text } from 'ink';

interface GradientProps {
  text: string;
  fromHex: string;
  toHex: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
}

function interpolate(from: [number, number, number], to: [number, number, number], t: number): string {
  return rgbToHex(
    from[0] + (to[0] - from[0]) * t,
    from[1] + (to[1] - from[1]) * t,
    from[2] + (to[2] - from[2]) * t,
  );
}

export function Gradient({ text, fromHex, toHex }: GradientProps) {
  const from = hexToRgb(fromHex);
  const to = hexToRgb(toHex);
  const chars = text.split('');
  const len = chars.length - 1 || 1;

  return (
    <Text>
      {chars.map((char, i) => (
        <Text key={i} color={interpolate(from, to, i / len)}>
          {char}
        </Text>
      ))}
    </Text>
  );
}
