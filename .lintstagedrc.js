/* eslint-env node */
module.exports = {
  '*.{js,jsx}': [
    'eslint --ignore-pattern "**/__tests__/**" --ignore-pattern "**/*.test.*" --ignore-pattern "**/*.spec.*" --ignore-pattern ".eslintrc.js" --ignore-pattern ".lintstagedrc.js" --ignore-pattern "babel.config.js" --ignore-pattern "jest.config.js" --ignore-pattern "jest.setup.js" --ignore-pattern "setupTests.js" --ignore-pattern "src/mocks/**" --ignore-pattern "src/setupTests.js" --fix',
    'prettier --write',
  ],
  '*.{json,css,md}': ['prettier --write'],
};
