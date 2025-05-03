module.exports = {
  parser: '@typescript-eslint/parser',
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    'cypress/globals': true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:cypress/recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['cypress', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { args: 'after-used', ignoreRestSiblings: true }],
    // Custom rules can be added here
  }
}; 