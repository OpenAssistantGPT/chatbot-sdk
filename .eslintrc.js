module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-vercel-ai`
  extends: ['vercel-ai'],
  settings: {
    next: {
      rootDir: ['apps/*/'],
    },
  },
  rules: {
    '@next/next/no-html-link-for-pages': ['error', 'website/sdk'],
    '@next/next/no-html-link-for-pages': [
      'error',
      '@openassistantgpt/assistant',
    ],
  },
};
