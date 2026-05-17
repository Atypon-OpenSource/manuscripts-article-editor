/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE.
 */

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    clearMocks: true,
    include: ['src/**/__tests__/**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    css: false,
    env: {
      TZ: 'UTC',
    },
    snapshotFormat: {
      printBasicPrototype: true,
      escapeString: true,
    },
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.d.ts',
        'src/**/__tests__/**',
        'src/**/__mocks__/**',
        'src/**/__fixtures__/**',
        'src/data/*.tsx',
        'src/lib/fonts.ts',
        'src/lib/service-worker.ts',
      ],
      thresholds: {
        branches: 20,
        functions: 25,
        lines: 30,
      },
    },
    server: {
      deps: {
        inline: ['lodash-es', /@manuscripts\/.*/, 'pdfjs-dist'],
      },
    },
  },
  resolve: {
    alias: {
      'dnd-core': 'dnd-core/dist/cjs',
      'react-dnd': 'react-dnd/dist/cjs',
      'react-dnd-html5-backend': 'react-dnd-test-backend/dist/cjs',
      'react-dnd-test-utils': 'react-dnd-test-utils/dist/cjs',
    },
  },
  plugins: [
    {
      name: 'asset-file-mock',
      transform(_, id) {
        if (/\.(jpg|jpeg|png|gif|eot|otf|svg|ttf|woff|woff2)$/.test(id)) {
          return { code: 'export default "test-file-stub"' }
        }
        if (/\.xml$/.test(id)) {
          return { code: 'export default ""' }
        }
      },
    },
  ],
})
