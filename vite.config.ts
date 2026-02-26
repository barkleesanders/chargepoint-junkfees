import pages from "@hono/vite-cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    pages({
      entry: "src/index.tsx",
      outputDir: "dist",
    }),
    devServer({ entry: "src/index.tsx" }),
  ],
});
