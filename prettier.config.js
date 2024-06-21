/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-sort-imports", "prettier-plugin-packagejson", "prettier-plugin-nextjs", "prettier-plugin-typescript"],
};

export default config;
