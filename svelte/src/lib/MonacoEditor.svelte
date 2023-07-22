<script>
  import { onMount, onDestroy, afterUpdate } from "svelte";
  import { getContext } from "svelte";
  export let tab;
  let editor;
  export const focusEditor = () => {
    if (editor) editor.focus();
  };
  const { openPopup } = getContext("app");
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
        // Define the command to execute when Ctrl+S is pressed (Save the webresource)
        editor.addCommand(
          // @ts-ignore
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
          function () {
            // updateWebresource(editor.getValue(), webResource.webresourceid);
            alert("save");
          }
        );
        // Define the command to execute when Ctrl+P is pressed (Publish the webresource)
        editor.addCommand(
          // @ts-ignore
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP,
          function () {
            // publishWebResource(webResource.webresourceid);
            alert("Publish");
          }
        );
        // Define the command to execute when Ctrl+O is pressed (Open the webresource)
        editor.addCommand(
          // @ts-ignore
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyO,
          function () {
            // openWebResource(webResource.name);
            openPopup();
          }
        );
        // Define the command to execute when Ctrl+Shift+P is pressed (Update and Publish the webresource)
        editor.addCommand(
          // @ts-ignore
          monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP,
          function () {
            // updateAndPublish(editor.getValue(), webResource.webresourceid);
            alert("sava dn publish");
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
    height: calc(
      100vh - 48px
    ); /*30px is height of tabs, 18px is height of menu button*/
  }
</style>
