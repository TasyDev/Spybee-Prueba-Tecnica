import * as path from 'path';
import { fileURLToPath } from 'url';
import type { StorybookConfig } from "@storybook/react-vite";

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [],
  framework: "@storybook/react-vite",
  viteFinal: async (config) => {
    // Remove 'use client' / 'use server' directives so Vite doesn't choke
    const plugins = Array.isArray(config.plugins) ? config.plugins : [];
    config.plugins = [...plugins, {
      name: 'strip-use-client',
      transform(code: string, id: string) {
        // Vite ids may include query params like ?v=123 or ?import
        if (/\.tsx?(?:\?|$)/.test(id)) {
          return code.replace(/['"]use (client|server)['"];?\s*/g, '');
        }
        return code;
      },
    }];

    // Resolve @/ alias (tsconfig paths)
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, '../src'),
    };

    return config;
  },
};

export default config;
