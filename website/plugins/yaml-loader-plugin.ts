import type { Plugin } from "@docusaurus/types";
import path from "path";

export default function yamlLoaderPlugin(): Plugin {
  return {
    name: "yaml-loader-plugin",
    configureWebpack() {
      return {
        module: {
          rules: [
            {
              test: /\.ya?ml$/,
              use: "yaml-loader",
            },
          ],
        },
        resolve: {
          alias: {
            "@content": path.resolve(__dirname, "..", "..", "content"),
          },
        },
      };
    },
  };
}
