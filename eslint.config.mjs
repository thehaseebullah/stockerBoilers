import boundaries from "eslint-plugin-boundaries";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
      "**/.turbo/**",
      "**/*.config.*",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.mjs"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      boundaries: boundaries,
    },
    settings: {
      "boundaries/elements": [
        { type: "app", pattern: "apps/web/**", mode: "full" },
        { type: "contracts", pattern: "packages/contracts/**", mode: "full" },
        { type: "domain", pattern: "packages/domain/**", mode: "full" },
        { type: "db", pattern: "packages/db/**", mode: "full" },
        { type: "ui", pattern: "packages/ui/**", mode: "full" },
        { type: "field-sync", pattern: "packages/field-sync/**", mode: "full" },
        { type: "simulator", pattern: "packages/simulator/**", mode: "full" },
        { type: "config", pattern: "packages/config/**", mode: "full" },
      ],
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: "app",
              allow: ["app", "contracts", "domain", "ui", "db", "field-sync", "simulator", "config"],
            },
            {
              from: "domain",
              allow: ["contracts", "db", "domain"],
            },
            {
              from: "contracts",
              allow: ["config"],
            },
            {
              from: "ui",
              allow: ["config"],
            },
            {
              from: "field-sync",
              allow: ["contracts"],
            },
            {
              from: "simulator",
              allow: ["contracts", "domain", "field-sync"],
            },
            {
              from: "db",
              allow: ["contracts"],
            },
          ],
        },
      ],
    },
  },
];
