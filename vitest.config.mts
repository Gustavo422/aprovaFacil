import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      enabled: true,
      provider: 'istanbul',
      clean: true,
      reporter: ['text', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      include: [
        'app/**/*.{ts,tsx}',
        'components/**/*.{ts,tsx}',
        'contexts/**/*.{ts,tsx}',
        'lib/**/*.{ts,tsx}',
        'src/**/*.{ts,tsx}',
        'middleware.ts',
      ],
      exclude: [
        'node_modules/',
        'coverage/',
        '.next/',
        '*.config.js',
        '*.config.ts',
        'components/ui/',
        'app/api/',
      ],
    },
    include: [
      'src/**/*.test.ts',
      'src/**/*.test.tsx',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './'),
    },
  },
}); 
