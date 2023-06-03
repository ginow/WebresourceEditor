<script>
  import MonacoEditor from "./lib/MonacoEditor.svelte";
  import { onMount } from "svelte";
  import Tabs from "./lib/Tabs.svelte";
  import { data as tabs } from "./assets/sampledata";
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
  <Tabs {tabs} />
  {#each tabs as tab, index (tab.id)}
    {#if selectedTab?.id === tab?.id}
      <MonacoEditor {tab} />
    {/if}
  {/each}
</main>

<style>
</style>
