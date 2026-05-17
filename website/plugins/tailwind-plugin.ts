import type { Plugin } from "@docusaurus/types";

/**
 * Wires Tailwind v4 into Docusaurus' PostCSS pipeline so utility
 * classes work inside our React components without ejecting the
 * Webpack config.
 */
export default function tailwindPlugin(): Plugin {
  return {
    name: "tailwind-plugin",
    configurePostCss(postcssOptions) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
      postcssOptions.plugins.push(require("@tailwindcss/postcss"));
      return postcssOptions;
    },
  };
}
