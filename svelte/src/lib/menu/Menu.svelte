<script>
  import { onMount, setContext, createEventDispatcher } from "svelte";
  import { key } from "./menu.js";

  export let location;
  export let fileMenu;
  const dispatch = createEventDispatcher();

  setContext(key, {
    dispatchClick: () => dispatch("click"),
  });

  let menu;
  function onPageClick(e) {
    if (
      e.target === menu ||
      menu.contains(e.target) ||
      e.target === fileMenu ||
      fileMenu.contains(e.target)
    )
      return;
    dispatch("clickoutside");
  }
</script>

<svelte:body on:click={onPageClick} />

<div
  bind:this={menu}
  style="top: {location.bottom}px; left: {location.left}px;"
>
  <slot />
</div>

<style>
  div {
    position: absolute;
    display: grid;
    border: 1px solid #333;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.2);
    background-color: #212121;
    z-index: 1;
  }
</style>
