import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  {
    ignores: ["dist", "node_modules"],
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // Vite + React 18 use the automatic JSX runtime - no import needed.
      "react/react-in-jsx-scope": "off",
      // This codebase uses plain function props, not PropTypes.
      "react/prop-types": "off",

      // Allow the common `useEffect(() => {...}, [])` fetch-on-mount pattern.
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
