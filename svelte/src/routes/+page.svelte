<script>
	import { onMount } from 'svelte';

	if (!import.meta.env.SSR) {
		// Code that relies on the `window` object

		// Define MonacoEnvironment object
		window.MonacoEnvironment = {
			getWorkerUrl: function (_moduleId, label) {
				if (label === 'json') {
					return '_dist_/json.worker.js';
				}
				if (label === 'css' || label === 'scss' || label === 'less') {
					return '_dist_/css.worker.js';
				}
				if (label === 'html' || label === 'handlebars' || label === 'razor') {
					return '_dist_/html.worker.js';
				}
				if (label === 'typescript' || label === 'javascript') {
					return '_dist_/ts.worker.js';
				}
				return '_dist_/editor.worker.js';
			}
		};

		onMount(async () => {
			const monaco = await import('monaco-editor');
			const container = document.getElementById('editorContainer');
			if (container) {
				const editor = monaco.editor.create(container, {
					value: '// Your initial code here',
					language: 'javascript',
					theme: 'vs-dark'
				});
			}
		});
	}
</script>

<div id="editorContainer" style="width: 600px; height: 400px;" />
