/** @type {import("prettier").Config} */
const config = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  printWidth: 80,
  tabWidth: 2,
  arrowParens: "always",
  bracketSpacing: true,
  endOfLine: "lf",

  // Sorts Tailwind classes. Must come last if other plugins are added.
  plugins: ["prettier-plugin-tailwindcss"],
  // Tailwind v4 reads the theme from CSS, not a JS config.
  tailwindStylesheet: "./src/app/globals.css",
  // Also sort classes passed through these helpers.
  tailwindFunctions: ["cn", "cva", "clsx", "twMerge"],
};

export default config;
