<script>
  import Menu from "./Menu.svelte";
  import MenuOption from "./MenuOption.svelte";

  let showMenu = false;
  let fileMenu;
  let location;
  function onMenuClick() {
    location = fileMenu.getBoundingClientRect();
    showMenu = !showMenu;
  }

  function closeMenu() {
    // showMenu = false;
  }
</script>

{#if showMenu}
  <Menu {location} on:click={closeMenu} on:clickoutside={closeMenu}>
    <MenuOption on:click={console.log} text="Save (Ctrl+S)" />
    <MenuOption on:click={console.log} text="Publish (Ctrl+P)" />
    <MenuOption on:click={console.log} text="Save and Publish (Ctrl+Shift+P)" />
  </Menu>
{/if}

<button class="menu-button" bind:this={fileMenu} on:click={onMenuClick}
  >File</button
>

<style>
  .menu-button {
    background-color: #333;
    border: none;
    color: #a4a4a4;
  }
  .menu-button:hover {
    background-color: #222;
  }
</style>
