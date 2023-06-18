<script>
  import MonacoEditor from "./lib/MonacoEditor.svelte";
  import { onMount } from "svelte";
  import Tabs from "./lib/Tabs.svelte";
  import { data as tabs } from "./assets/sampledata";
  import SidePanel from "./lib/SidePanel.svelte";
  import FileMenu from "./lib/menu/FileMenu.svelte";
  import Search from "./lib/Search.svelte";
  import { setContext } from "svelte";
  let isPopupOpen = false;
  setContext("app", {
    openPopup,
  });

  function openPopup() {
    isPopupOpen = true;
  }

  function closePopup() {
    isPopupOpen = false;
  }
  let width = 300;
  // TODO: remove this if not required
  function handleResize(event) {
    width = event.detail;
  }
  let selectedTab;
  function handleTabSelected(event) {
    selectedTab = tabs.find((tab) => tab.id === event.detail.selectedTab);
    console.log(selectedTab);
  }

  onMount(() => {
    selectedTab = tabs[0];
    addEventListener("tabSelected", handleTabSelected);
    return () => {
      removeEventListener("tabSelected", handleTabSelected);
    };
  });
</script>

<main>
  <Search isOpen={isPopupOpen} onClose={closePopup} />
  <FileMenu />
  <div class="container">
    <div class="side-panel">
      <SidePanel {tabs} on:resize={handleResize} />
    </div>

    <div class="tabs">
      <Tabs {tabs} />
      {#each tabs as tab, index (tab.id)}
        {#if selectedTab?.id === tab?.id}
          <MonacoEditor {tab} />
        {/if}
      {/each}
    </div>
  </div>
</main>

<style>
  .container {
    display: flex;
  }

  .side-panel {
    width: 20vw;
  }

  .tabs {
    width: 80vw;
  }
</style>
