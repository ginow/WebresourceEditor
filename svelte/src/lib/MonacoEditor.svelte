<script>
  import { onMount, onDestroy, afterUpdate } from "svelte";

  export let selectedTab;
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
            value: selectedTab.content,
            language: selectedTab.type,
            theme: "vs-dark",
          }
        );
        handleResize();
        window.addEventListener("resize", handleResize);
      });
    };
    document.body.appendChild(loaderScript);
  });

  afterUpdate(() => {
    // Update the editor's content when selectedTab changes
    if (editor && selectedTab) {
      const model = editor.getModel();
      model.setValue(selectedTab.content);
    }
  });

  onDestroy(() => {
    if (editor) {
      editor.dispose();
      window.removeEventListener("resize", handleResize);
    }
  });

  function handleResize() {
    editor.layout();
  }
</script>

<div id="monaco-editor" />

<style>
  #monaco-editor {
    height: 100vh;
  }
</style>
