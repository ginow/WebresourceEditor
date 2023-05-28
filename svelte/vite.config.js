import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: "dist",
    assetsDir: "",
    sourcemap: true, // generate source maps
    cssCodeSplit: false, // generate a single CSS file
    target: "esnext", // disable code splitting
    rollupOptions: {
      output: {
        entryFileNames: "WebResources/web_editorv2.js", // Rename the JS file
        // chunkFileNames: "sveltepowerapps.js", // Rename the chunks
        assetFileNames: "WebResources/web_editorv2.css", // Rename the CSS file
      },
    },
    // chunkSizeWarningLimit: 7000, // disable chunk splitting
  },
})
