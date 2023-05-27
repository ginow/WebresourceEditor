import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import workerPlugin from 'worker-plugin';
export default defineConfig({
	plugins: [sveltekit(), workerPlugin()],
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
	}
});
