<script>
  import { onMount, setContext, createEventDispatcher } from "svelte";
  import { key } from "./menu.js";

  export let location;
  const dispatch = createEventDispatcher();

  setContext(key, {
    dispatchClick: () => dispatch("click"),
  });

  let menuEl;
  function onPageClick(e) {
    if (e.target === menuEl || menuEl.contains(e.target)) return;
    dispatch("clickoutside");
  }
</script>

<svelte:body on:click={onPageClick} />

<div
  bind:this={menuEl}
  style="top: {location.bottom}px; left: {location.left}px;"
>
  <slot />
</div>

<style>
  div {
    position: absolute;
    display: grid;
    border: 1px solid #0003;
    box-shadow: 2px 2px 5px 0px #0002;
    background-color: #212121;
    z-index: 1;
  }
</style>
