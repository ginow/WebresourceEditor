<script>
	import { onMount } from 'svelte';

	onMount(async () => {
		const monaco = await import('monaco-editor');
		const container = document.getElementById('editorContainer');
		if (container) {
			const editor = monaco.editor.create(container, {
				value: '// Your initial code here',
				language: 'javascript'
			});
		}
	});
</script>

<div id="editorContainer" style="width: 600px; height: 400px;" />
