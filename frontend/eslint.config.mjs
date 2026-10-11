import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import pluginQuery from "@tanstack/eslint-plugin-query";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  ...nextVitals,
  ...nextTs,
  ...pluginQuery.configs["flat/recommended"],

  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // Force every HTTP call through the configured axios instance, and
      // every internal link through the locale-aware wrapper — a bare
      // `next/link` would drop the /fr or /ar prefix and reset the language.
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "axios",
              importNames: ["default"],
              message:
                "Import the configured instance from '@/lib/api/client' instead.",
            },
            {
              name: "next/link",
              message: "Import { Link } from '@/i18n/navigation' instead.",
            },
          ],
        },
      ],
    },
  },

  // The two wrappers are the one place each allowed to import the real thing.
  {
    files: ["src/lib/api/**", "src/i18n/navigation.tsx"],
    rules: { "no-restricted-imports": "off" },
  },

  // Must stay last: disables rules that conflict with Prettier.
  prettier,
]);

export default eslintConfig;
