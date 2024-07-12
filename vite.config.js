import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { splitVendorChunkPlugin } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), splitVendorChunkPlugin()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "@modules": fileURLToPath(
                new URL("./src/modules/", import.meta.url)
            ),
            "@eco": fileURLToPath(
                new URL("./src/modules/eco", import.meta.url)
            ),
            "@admin": fileURLToPath(
                new URL("./src/modules/admin", import.meta.url)
            ),
            "@news": fileURLToPath(
                new URL("./src/modules/news", import.meta.url)
            ),
            "@ads": fileURLToPath(
                new URL("./src/modules/ads", import.meta.url)
            ),
        },
    },
});
