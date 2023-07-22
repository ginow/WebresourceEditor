<script>
  import Menu from "./Menu.svelte";
  import MenuOption from "./MenuOption.svelte";
  import { getContext } from "svelte";
  let showMenu = false;
  let fileMenu;
  let location;
  const { openPopup } = getContext("app");
  function onMenuClick() {
    location = fileMenu.getBoundingClientRect();
    showMenu = !showMenu;
  }

  function closeMenu() {
    showMenu = false;
  }

  function save() {
    if (focusEditor) {
      focusEditor();
    }
    var event = new KeyboardEvent("keydown", {
      key: "p",
      code: "KeyP",
      ctrlKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
  }
</script>

{#if showMenu}
  <Menu {location} on:click={closeMenu} on:clickoutside={closeMenu} {fileMenu}>
    <MenuOption on:click={openPopup} text="Open (Ctrl+O)" />
    <MenuOption on:click={save} text="Save (Ctrl+S)" />
    <MenuOption on:click={console.log} text="Publish (Ctrl+P)" />
    <MenuOption on:click={console.log} text="Save and Publish (Ctrl+Shift+P)" />
  </Menu>
{/if}

<button class="menu-button" bind:this={fileMenu} on:click={onMenuClick}
  >File</button
>

<style>
  .menu-button {
    background-color: #212121;
    border: none;
    color: #a4a4a4;
  }
  .menu-button:hover {
    background-color: #333;
    border-radius: 5px;
  }
</style>
