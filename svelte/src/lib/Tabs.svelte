<script>
  import { onMount } from "svelte";
  let activeTabIndex = 0;
  export let tabs;

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
    tabs.splice(index, 1);
    if (wasActiveTab && index > 0) {
      activeTabIndex = index - 1;
    } else if (wasActiveTab && index === 0 && tabs.length > 0) {
      activeTabIndex = 1;
    }
  }

  onMount(() => {
    // Automatically scroll to the active tab on mount
    const activeTabElement = document.querySelector(".tab.active");
    if (activeTabElement) {
      activeTabElement.scrollIntoView({ inline: "center" });
    }
  });
  let activeFile = tabs[activeTabIndex].id;
</script>

<main>
  <div class="tabs">
    {#each tabs as tab, index (tab.id)}
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
            ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"
              ><path
                d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"
              /></svg
            >
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
    align-items: center;
    padding: 8px 30px 8px 12px;
    background-color: #454545;
    cursor: pointer;
    color: #a4a4a4;
    transition: background-color 0.3s ease;
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

  .close-btn svg {
    width: 12px;
    height: 12px;
    fill: #fff;
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
