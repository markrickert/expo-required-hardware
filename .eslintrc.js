module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    project: "tsconfig.json",
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
};
