<script>
  import Menu from "./Menu.svelte";
  import MenuOption from "./MenuOption.svelte";
  import MenuDivider from "./MenuDivider.svelte";
  import { tick } from "svelte";

  let showMenu = false;

  function onRightClick(e) {
    debugger;
    if (showMenu) {
      showMenu = true;
    }
    showMenu = true;
  }

  function closeMenu() {
    showMenu = false;
  }
</script>

{#if showMenu}
  <div style="color: aqua;">sdfsfd</div>
  <Menu on:click={closeMenu} on:clickoutside={closeMenu}>
    <MenuOption on:click={console.log} text="Do nothing" />
    <MenuOption on:click={console.log} text="Do notsdfsdfhing, but twice" />
    <MenuDivider />
    <MenuOption
      isDisabled={true}
      on:click={console.log}
      text="Whoops, disabled!"
    />
    <MenuOption on:click={console.log}>
      <span>Look! An icon!</span>
    </MenuOption>
  </Menu>
{/if}

<button on:click={onRightClick}>File</button>
