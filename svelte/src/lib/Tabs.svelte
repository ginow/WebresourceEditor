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
    border-right: 1px solid #333;
    border-top: 1px solid #333;
    border-bottom: 1px solid #333;
    cursor: pointer;
    color: #a4a4a4;
    position: relative; /* Add relative positioning */
  }

  .tab.active {
    border-bottom: none;
    background-color: #1e1e1e;
    border-top: 2px solid #00aaff;
  }
  .tab:hover {
    background-color: #1e1e1e;
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
