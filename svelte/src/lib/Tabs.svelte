<script>
  import { onMount } from "svelte";

  let activeTabIndex = 0;
  let tabs = [
    { id: 1, title: "File 1" },
    { id: 2, title: "File 2" },
    { id: 3, title: "File 3" },
    { id: 4, title: "File 4" },
    { id: 5, title: "File 5" },
    { id: 6, title: "File 6" },
    { id: 7, title: "File 7" },
    { id: 8, title: "File 8" },
    { id: 9, title: "File 9" },
    { id: 10, title: "File 10" },
    { id: 11, title: "File 11" },
  ];

  function switchTab(index) {
    activeTabIndex = index;
  }

  function closeTab(index) {
    tabs.splice(index, 1);
    if (activeTabIndex >= tabs.length) {
      activeTabIndex = tabs.length - 1;
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
    {#each tabs as tab, index (tab.id)}
      <div
        class="tab {index === activeTabIndex && 'active'}"
        on:click={() => switchTab(index)}
      >
        {tab.title}
        <span
          class="close-btn"
          tabindex="0"
          on:click={() => closeTab(index)}
          on:keydown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              closeTab(index);
            }
          }}
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
            width="50px"
            height="50px"
            ><path
              d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"
            /></svg
          >
        </span>
      </div>
    {/each}
  </div>

  <div class="content">
    {#if tabs[activeTabIndex]}
      <p>{tabs[activeTabIndex].title} content goes here.</p>
    {/if}
  </div>
</main>

<style>
  .tabs {
    display: flex;
    overflow-x: auto;
    background-color: #333;
    padding: 0; /* Remove padding */
    margin-bottom: -2px; /* Remove negative margin to remove space between tabs */
    scrollbar-width: thin; /* Add thin scrollbar */
    scrollbar-color: #ccc #f5f5f5; /* Set scrollbar colors */
  }

  .tab {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background-color: #444;
    cursor: pointer;
    color: #fff;
    transition: background-color 0.3s ease;
  }

  .tab.active {
    background-color: #212121;
    border-bottom: 1px solid #ccc;
    color: #6f6f6f;
  }

  .content {
    padding: 16px;
    border: 1px solid #ccc;
    border-top: none;
    background-color: #333;
    color: #fff;
  }

  .close-btn {
    margin-left: 5px;
    cursor: pointer;
  }

  .close-btn svg {
    width: 12px;
    height: 12px;
    fill: #fff;
  }

  /* Customize scroll bar */
  ::-webkit-scrollbar {
    height: 2px; /* Set the height of the scrollbar */
    width: 20px;
    background-color: #f5f5f5; /* Light grey background color */
  }

  ::-webkit-scrollbar-thumb {
    background-color: #ccc; /* Light grey thumb color */
  }
</style>
