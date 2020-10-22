const path = require('path');

module.exports = {
  stories: ['../src/components/**/stories.tsx', '../src/components/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
  ],
  plugins: ['react-require', 'react-docgen'],
};
