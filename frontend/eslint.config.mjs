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
      // Force every HTTP call through the configured axios instance.
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
          ],
        },
      ],
    },
  },

  // The axios instance itself is the one place allowed to import axios.
  {
    files: ["src/lib/api/**"],
    rules: { "no-restricted-imports": "off" },
  },

  // Must stay last: disables rules that conflict with Prettier.
  prettier,
]);

export default eslintConfig;
