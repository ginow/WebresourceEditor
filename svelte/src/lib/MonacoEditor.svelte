<script>
  import { onMount, onDestroy, afterUpdate } from "svelte";

  export let tab;
  let editor;

  onMount(() => {
    const loaderScript = document.createElement("script");
    loaderScript.src =
      "https://unpkg.com/monaco-editor@latest/min/vs/loader.js";
    loaderScript.async = true;
    loaderScript.onload = () => {
      // Initialize the editor
      // @ts-ignore
      window.require.config({
        paths: { vs: "https://unpkg.com/monaco-editor@latest/min/vs" },
      });
      // @ts-ignore
      window.require(["vs/editor/editor.main"], () => {
        // @ts-ignore
        editor = monaco.editor.create(
          document.getElementById("monaco-editor"),
          {
            value: tab.content,
            language: tab.type,
            theme: "vs-dark",
            automaticLayout: true,
          }
        );
      });
    };
    document.body.appendChild(loaderScript);
  });

  afterUpdate(() => {
    // Update the editor's content when tab changes
    if (editor && tab) {
      const model = editor.getModel();
      model.setValue(tab.content);
    }
  });

  onDestroy(() => {
    if (editor) {
      editor.dispose();
    }
  });
</script>

<div id="monaco-editor" />

<style>
  #monaco-editor {
    height: calc(100vh - 30px); /*30px is height of tabs*/
  }
</style>
