import { preprocessMeltUI } from "@melt-ui/pp";
import { vitePreprocess } from "@sveltejs/kit/vite";
import adapter from "svelte-kit-sst";
import sequence from "svelte-sequential-preprocessor";

/** @type {import("@sveltejs/kit").Config} */
const config = {
  preprocess: sequence([vitePreprocess(), preprocessMeltUI()]),
  kit: {
    adapter: adapter(),
    alias: {
      $api: "src/routes/api",
    },
  },
};

export default config;
