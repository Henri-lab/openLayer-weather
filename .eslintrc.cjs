/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    "no-console": "off",  // 关闭 no-console 规则
    "no-unused-vars": 0,  // 将 no-unused-vars 设置为 0 表示关闭
    // "semi": ["error", "always"]  // 使用分号的规则保持启用
  }
}
