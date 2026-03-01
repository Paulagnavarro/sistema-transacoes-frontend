module.exports = {
    env: {
      browser: true,
      es2021: true,
      'vue/setup-compiler-macros': true
    },
    extends: [
      'plugin:vue/vue3-essential',
      'eslint:recommended'
    ],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module'
    },
    rules: {}
  }