<script>
  import { onMount, onDestroy } from "svelte";
  import { createEventDispatcher } from "svelte";
  import { resize } from "./stores";
  import { writable } from "svelte/store";
  import CloseIcon from "../assets/CloseIcon.svelte";
  let activeTabIndex = 0;
  export let tabs;
  const dispatch = createEventDispatcher();
  let containerWidth = 300; // Initial width of the resizable container

  let isDragging = false;
  let startX = 0;
  let startWidth = 0;

  let resizableContainer;

  function handleMouseDown(event) {
    // Check if the mouse is near the right edge of the container
    const isNearRightEdge =
      event.clientX >= resizableContainer.getBoundingClientRect().right - 10;
    if (!isNearRightEdge) {
      return;
    }

    isDragging = true;
    startX = event.clientX;
    startWidth = resizableContainer.offsetWidth;
  }

  function handleMouseMove(event) {
    if (!isDragging) {
      // Check if the mouse is hovering over the right edge of the container
      const isHoveringRightEdge =
        event.clientX >= resizableContainer.getBoundingClientRect().right - 5;
      resizableContainer.style.cursor = isHoveringRightEdge
        ? "col-resize"
        : "default";
      return;
    }

    const dx = event.clientX - startX;
    containerWidth = Math.max(0, startWidth + dx); // Set a minimum width if needed by replacing 0
  }

  function handleMouseUp() {
    if (isDragging) {
      isDragging = false;
      dispatch("resize");
      resize.set(Date.now()); // Update the store value to trigger the event
    }
  }
  onMount(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });
  const reactiveTabs = writable(tabs);
  function switchTab(index) {
    activeTabIndex = index;
    const event = new CustomEvent("tabSelected", {
      detail: {
        selectedTab: tabs[activeTabIndex].id,
      },
    });
    dispatchEvent(event);
  }

  function closeTab(index) {
    const wasActiveTab = index === activeTabIndex;
    if (wasActiveTab && index > 0) {
      switchTab(index - 1);
    } else if (wasActiveTab && index === 0 && tabs.length > 0) {
      switchTab(0);
    }
    reactiveTabs.update((tabs) => {
      tabs.splice(index, 1);
      return tabs;
    });
    if (tabs.length === 0) {
      dispatchEvent(
        new CustomEvent("tabSelected", {
          detail: {
            selectedTab: null,
          },
        })
      );
    }
  }
</script>

<div
  class="resizable-container"
  on:mousedown={handleMouseDown}
  bind:this={resizableContainer}
>
  <p style="font-weight: bold; margin:5px">OPEN EDITORS</p>
  <div class="tabs">
    {#each $reactiveTabs as tab, index (tab.id)}
      <div
        class="tab {index === activeTabIndex && 'active'}"
        on:click={() => switchTab(index)}
        on:keydown={() => {
          /*TODO*/
        }}
      >
        {tab.title}
        {#if index === activeTabIndex}
          <span
            class="close-btn"
            on:click={() => closeTab(index)}
            on:keydown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                closeTab(index);
              }
            }}
          >
            <CloseIcon />
          </span>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .resizable-container {
    position: relative;
    overflow: hidden;
    border-top: 1px solid #333;
    border-bottom: 1px solid #333;
  }
  .tabs {
    display: flex;
    flex-direction: column;
    overflow-x: auto;
    padding: 0;
    scrollbar-width: thin;
    scrollbar-color: #ccc #f5f5f5;
  }

  .tab {
    display: flex;
    flex-shrink: 0; /* Prevent shrinking of tabs */
    align-items: center;
    padding: 5px;
    cursor: pointer;
    color: #a4a4a4;
    position: relative; /* Add relative positioning */
  }

  .tab.active {
    background-color: #333;
  }
  .tab:hover {
    background-color: #333;
  }

  .close-btn {
    display: none; /* Hide the close button by default */
    position: absolute; /* Position the close button */
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
    cursor: pointer;
    width: 12px;
    height: 12px;
  }

  .tab:hover .close-btn {
    display: inline-block; /* Show the close button on hover */
  }

  /* Customize scroll bar */
  ::-webkit-scrollbar {
    height: 2px;
    width: 20px;
    background-color: #f5f5f5;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #ccc;
  }
</style>
