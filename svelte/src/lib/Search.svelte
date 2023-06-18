<script>
  import CloseIcon from "../assets/CloseIcon.svelte";
  export let isOpen;
  export let onClose;
  const headers = {
    "OData-MaxVersion": "4.0",
    "OData-Version": "4.0",
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
    Prefer: 'odata.include-annotations="*"',
  };
  var webresources = [];
  webresources = [
    {
      name: "con_contact.js",
      displayname: "contact.js",
      type: "javascript",
      modifiedon: "23",
    },
    {
      name: "con_account.js",
      displayname: "account.js",
      type: "javascript",
      modifiedon: "33",
    },
    {
      name: "con_quote.js",
      displayname: "quote.js",
      type: "javascript",
      modifiedon: "33",
    },
  ];
  async function search() {
    var response = await fetch(
      window.location.origin +
        "/api/data/v9.2/webresourceset?$select=displayname,webresourceid,webresourcetype,modifiedon,name&$filter=contains(name,'" +
        "searchText" +
        "') or contains(displayname,'" +
        "searchText" +
        "')&$orderby=name",
      {
        method: "GET",
        headers: headers,
      }
    );

    webresources = await response.json();
    webresources = webresources.value;
  }
</script>

{#if isOpen}
  <div class="container">
    <div class="popup">
      <div class="title-bar">
        <p class="title">Search Webresources</p>
        <button class="close-icon" on:click={onClose}>
          <CloseIcon />
        </button>
      </div>
      <div id="searchContainer">
        <input
          id="searchInput"
          placeholder="Enter name of webresource"
          type="search"
        />
        <button id="search" on:click={search}>
          Search
          <span id="spinner" class="spinner" style="display:none;" />
        </button>
        <ul id="webresourceslist">
          <li id="header">
            <div class="name">Name</div>
            <div class="displayname">Display Name</div>
            <div class="type">Type</div>
            <div class="modifiedon">Modified On</div>
          </li>
          {#each webresources as webresource}
            <li class="rows">
              <div class="name">{webresource.name}</div>
              <div class="displayname">{webresource.displayname}</div>
              <div class="type">{webresource.type}</div>
              <div class="modifiedon">{webresource.modifiedon}</div>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
{/if}

<style>
  .container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(0.5px);
    z-index: 999;
  }

  .popup {
    position: relative;
    width: 75vw;
    height: 75vh;
    background-color: #212121;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  .close-icon {
    position: absolute;
    top: 0;
    right: 0;
    height: 30px;
    width: 30px;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .close-icon:hover {
    background-color: red;
  }
  .title-bar {
    height: 20px;
    background-color: #333;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
  }
  .title {
    margin: 0;
  }
  #webresourceslist {
    list-style-type: none;
    overflow: auto;
    height: 90vh;
    padding: 0px;
  }

  .rows {
    text-decoration: none;
    padding: 5px;
    margin-top: 10;
    display: flex;
    color: #a4a4a4;
    background-color: rgb(27, 27, 27);
  }

  .rows:hover {
    background-color: #333333;
    cursor: pointer;
  }
  #header {
    display: flex;
    padding: 5px;
    background-color: #2f2f2f;
    flex-direction: row;
  }

  .name,
  .displayname {
    flex-direction: row;
    flex: 0 0 37.5%;
  }

  .modifiedon,
  .type {
    flex-direction: row;
    flex: 0 0 12.5%;
  }

  input[type="search"] {
    background-color: #191919;
    border: none;
    border-radius: 4px;
    color: #a4a4a4;
    padding: 12px;
    margin-right: 10px;
    width: 50%;
  }

  button#search {
    background-color: #191919;
    border: none;
    border-radius: 4px;
    padding: 12px;
    cursor: pointer;
    color: #a4a4a4;
  }

  button#search:hover {
    background-color: #282828;
  }

  .spinner {
    display: inline-block;
    width: 10px;
    height: 10px;
    border: 2px solid #fff;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s ease-in-out infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  #searchContainer {
    padding: 15px;
  }
</style>
