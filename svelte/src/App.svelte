<script>
  import MonacoEditor from "./lib/MonacoEditor.svelte";
  import { onMount } from "svelte";
  import Tabs from "./lib/Tabs.svelte";
  import { data as tabs } from "./assets/sampledata";
  import SidePanel from "./lib/SidePanel.svelte";
  import CustomMenu from "./lib/menu/CustomMenu.svelte";

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
  <div class="container">
    <div class="menu">
      <CustomMenu />
    </div>

    <!-- <div class="side-panel">
      <SidePanel on:resize={handleResize} />
    </div>

    <div class="tabs">
      <Tabs {tabs} />
      {#each tabs as tab, index (tab.id)}
        {#if selectedTab?.id === tab?.id}
          <MonacoEditor {tab} />
        {/if}
      {/each}
    </div>
  </div> -->
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
