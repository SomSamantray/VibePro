import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm'],
  banner: { js: '#!/usr/bin/env node' },
  clean: true,
  jsx: 'transform',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  outExtension: () => ({ js: '.mjs' }),
});
