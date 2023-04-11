## Introduction

Modifying webresources in D365 CRM is a cumbersome process. If we directly edit the scripts in CRM then intellisense and formatting options aren't available and syntax errors aren't detected. So normally we download and open these webresources in code editors like VS Code and then upload it back into CRM.
The solution for above problem is to have an editor like VS Code in the CRM itself. This is achievable by using the Monaco editor which is what powers VS Code, and is open sourced by Microsoft.

## Installation

- Download and import the managed solution `WebresourceEditor_managed.zip` from the `solution` folder or the `Releases` section of this project.
- Follow below steps to create Custom API definitions:

  1. Create new solution, give any name (eg. CustomAPI)
  2. In the solution create new Custom API as below:

     Click on `+New` -> `More` -> `Other` -> `Custom API`

     ![steps](resources/steps.png)

     ![Custom API](resources/customapi.png)

  3. Create two Custom API Request Parameters as below:

     ![Content](resources/content.png)
     ![Webresourceid](resources/webresourceid.png)

  4. Create Custom API Response Parameter as below:

     ![response](resources/response.png)

## Usage

- Open the HTML file (`<your_org_here>/WebResources/web_editor.html`).

  For example if your D365 url is `https://orgded007.crm9.dynamics.com/main.aspx` then the URL of the webresource editor app will be `https://orgded007.crm9.dynamics.com/WebResources/web_editor.html`

- Enter any webresource name you want to edit.

  ![popup](resources/popup.png)

  For example for below webresource the name will be `con_samplewebresource.js`

  ![name](resources/name.png)

- Press CTRL+S to save and CTRL+P to publish.

  ![editor](resources/editor.png)

- Press CTRL+O to open the webresource in new tab.

## References

- Monaco editor: https://microsoft.github.io/monaco-editor/playground.html

<style>
    img {
      max-height:300px;
    }
</style>
