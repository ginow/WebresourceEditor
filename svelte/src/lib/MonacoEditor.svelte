<script>
  import { onMount, onDestroy } from "svelte";

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
            value: "",
            language: "javascript",
            theme: "vs-dark",
          }
        );
        handleResize();
        window.addEventListener("resize", handleResize);
      });
    };
    document.body.appendChild(loaderScript);
  });
  onDestroy(() => {
    window.removeEventListener("resize", handleResize);
  });
  function handleResize() {
    editor.layout();
    console.log("resized");
  }
</script>

<div id="monaco-editor" />

<style>
  #monaco-editor {
    height: 100vh;
  }
</style>
