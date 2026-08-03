/** Shared ESLint config for all MVBB apps and packages. */
module.exports = {
  root: true,
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  env: { es2022: true, node: true, browser: true },
  ignorePatterns: ["dist/", ".next/", "node_modules/"],
  rules: {
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
};
