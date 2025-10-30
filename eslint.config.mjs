import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginImport from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Global rules and plugins
  {
    plugins: {
      import: pluginImport,
    },
    rules: {
      // Prevent sneaky CommonJS in our TS/ESM codebase
      "@typescript-eslint/no-var-requires": "error",
      "import/no-commonjs": "error",
    },
  },
  {
    languageOptions: {
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      // Accessibility: tighten rules
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/label-has-associated-control": [
        "error",
        { assert: "either" }
      ],
      "jsx-a11y/no-redundant-roles": "warn",
    },
  },
  // Prevent regressions: tailwind config should use ESM imports (no require())
  {
    files: ["tailwind.config.ts", "tailwind.config.js"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.name='require']",
          message: "Use ESM import in Tailwind config (e.g., import animate from 'tailwindcss-animate')",
        },
      ],
    },
  },
];

export default eslintConfig;
