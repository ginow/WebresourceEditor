<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import CloseIcon from "../assets/CloseIcon.svelte";
  let activeTabIndex = 0;
  export let tabs;

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

  onMount(() => {
    // Automatically scroll to the active tab on mount
    const activeTabElement = document.querySelector(".tab.active");
    if (activeTabElement) {
      activeTabElement.scrollIntoView({ inline: "center" });
    }
  });
</script>

<main>
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
</main>

<style>
  .tabs {
    display: flex;
    overflow-x: auto;
    background-color: #333;
    padding: 0;
    scrollbar-width: thin;
    scrollbar-color: #ccc #f5f5f5;
    height: 30px;
  }

  .tab {
    display: flex;
    flex-shrink: 0; /* Prevent shrinking of tabs */
    align-items: center;
    padding: 8px 30px 8px 12px;
    background-color: #454545;
    cursor: pointer;
    color: #a4a4a4;
    position: relative; /* Add relative positioning */
  }

  .tab.active {
    background-color: #212121;
    color: #a4a4a4;
  }

  .close-btn {
    display: none; /* Hide the close button by default */
    position: absolute; /* Position the close button */
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
    cursor: pointer;
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
