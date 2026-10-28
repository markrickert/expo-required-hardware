const { defineConfig, globalIgnores } = require('eslint/config');

const baseConfig = require('expo-module-scripts/eslint.config.base');

module.exports = defineConfig([globalIgnores(['build/**']), baseConfig]);
