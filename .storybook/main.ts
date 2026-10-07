import type { StorybookConfig } from '@storybook/react-vite';
import type { Plugin } from 'vite';
import { basename, dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');

// react-docgen-typescript writes each component's absolute `filePath` and, per prop,
// `declarations`/`parent` `fileName`s prefixed with the checkout folder's name into its
// `__docgenInfo`, which would put local paths into every built bundle. Rewrite them to
// repo-relative paths after the docgen transform has run.
const checkoutPrefixes = [...new Set([basename(repoRoot), basename(process.cwd())])].map((n) => `${n}/`);
const repoRelative = (file: string): string => {
  if (isAbsolute(file)) return relative(repoRoot, file).replace(/\\/g, '/');
  const posix = file.replace(/\\/g, '/');
  const prefix = checkoutPrefixes.find((p) => posix.startsWith(p));
  return prefix ? posix.slice(prefix.length) : posix;
};
const relativeDocgenPaths = (): Plugin => ({
  name: 'zone-docgen-relative-paths',
  enforce: 'post',
  transform(code) {
    if (!code.includes('__docgenInfo')) return null;
    return {
      code: code.replace(
        /"(filePath|fileName)":"((?:[^"\\]|\\.)*)"/g,
        (_m, key: string, file: string) => `"${key}":${JSON.stringify(repoRelative(JSON.parse(`"${file}"`)))}`
      ),
      map: null,
    };
  },
});

// No game art is served or bundled here. Stories and examples load it BY URL at runtime
// (examples/art: the committed art-manifest.json lists remote static.nanoka.cc / Enka.Network
// image URLs), so neither `storybook dev` nor a static build (storybook-static/) contains any
// HoYoverse image file. There is no static folder.

const config: StorybookConfig = {
  stories: [
    '../docs/storybook/**/*.mdx',
    '../src/**/*.mdx',
    '../src/**/*.stories.@(ts|tsx)',
    '../examples/**/*.stories.@(ts|tsx)',
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  // Hide Storybook's own onboarding "Level up" checklist in the sidebar and its "what's new" toasts.
  features: { sidebarOnboardingChecklist: false },
  core: { disableWhatsNewNotifications: true },
  typescript: { reactDocgen: 'react-docgen-typescript' },
  async viteFinal(config) {
    // Drop the library-only plugin that copies tokens into dist/.
    config.plugins = (config.plugins ?? [])
      .flat()
      .filter((p) => !(p && typeof p === 'object' && 'name' in p && p.name === 'zzz-copy-tokens'));
    config.plugins.push(relativeDocgenPaths());
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias as Record<string, string>),
      '@angel1254mc/zone-ui': resolve(here, '../src/index.ts'),
    };
    return config;
  },
};

export default config;
