const headers = {
    "OData-MaxVersion": "4.0",
    "OData-Version": "4.0",
    "Accept": "application/json",
    "Content-Type": "application/json; charset=utf-8",
    "Prefer": "odata.include-annotations=\"*\""
}
const notificationType = {
    info: 'info',
    error: 'error',
    success: 'success'
}
const webresourceType = {
    html: 1,
    css: 2,
    javascript: 3,
    xml: 4,
    png: 5,
    jpg: 6,
    gif: 7,
    xap: 8,
    xsl: 9,
    ico: 10,
    svg: 11,
    resx: 12
}

var notification;
var button = document.getElementById("search");
var spinner = document.getElementById("spinner");
async function search() {
    var webresources = [];
    var searchText = document.getElementById("searchInput").value;
    spinnerVisibility(true);
    // Get all list items except the header
    const listItems = document.querySelectorAll("#webresourceslist li:not(#header)");
    // Remove existing li
    listItems.forEach(element => element.remove());
    var response = await fetch(window.location.origin + "/api/data/v9.2/webresourceset?$select=displayname,webresourceid,webresourcetype,modifiedon,name&$filter=contains(name,'" + searchText + "') or contains(displayname,'" + searchText + "')&$orderby=name", {
        method: "GET",
        headers: headers
    })

    webresources = await response.json();
    webresources = webresources.value;
    const ul = document.getElementById("webresourceslist");
    if (webresources.length > 0) {
        document.getElementById("header").style.display = "inline";
    }
    else {
        var li = document.getElementById("header");
        li.style.display = "none";
        li.innerHTML = "";
        showNotification(searchText + " not found. Please check and try again.", notificationType.error, 5);
    }

    const webresource = webresources.map((each) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.id = each.webresourceid;
        a.href = "#";
        a.onclick = selectWebresource;
        const nameDiv = document.createElement("div");
        nameDiv.className = "name";
        nameDiv.textContent = each.name;
        const displaynameDiv = document.createElement("div");
        displaynameDiv.className = "displayname";
        displaynameDiv.textContent = each.displayname;
        const typeDiv = document.createElement("div");
        typeDiv.className = "type";
        typeDiv.textContent = getWebResourceTypeString(each.webresourcetype);
        const modifiedonDiv = document.createElement("div");
        modifiedonDiv.className = "modifiedon";
        modifiedonDiv.textContent = each.modifiedon;
        a.appendChild(nameDiv);
        a.appendChild(displaynameDiv);
        a.appendChild(typeDiv);
        a.appendChild(modifiedonDiv);
        li.appendChild(a);
        return li;
    });

    // Append list items to ul
    ul.append(...webresource);
    spinnerVisibility(false);
}
async function selectWebresource(event) {
    let target = event.target;
    while (target.tagName !== 'A') {
        target = target.parentElement;
    }
    document.getElementById("searchContainer").remove();
    document.getElementById("editorContainer").style.display = "block";
    var language;
    var webResource = await getWebresource(target.id);
    switch (webResource.webresourcetype) {
        case webresourceType.html: language = 'html';
            break;
        case webresourceType.css: language = 'css';
            break;
        case webresourceType.javascript: language = 'javascript';
            break;
        default: language = 'text'
    }
    // Configure the loader to use the minified version of the editor
    self.MonacoEnvironment = {
        getWorkerUrl: function (workerId, label) {
            return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
          self.MonacoEnvironment = {
            baseUrl: 'https://unpkg.com/monaco-editor@0.37.1/min/'
          };
          importScripts('https://unpkg.com/monaco-editor@0.37.1/min/vs/base/worker/workerMain.js');`
            )}`;
        }
    };
    // Load the editor and create an instance
    require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@0.37.1/min/vs' } });
    require(['vs/editor/editor.main'], function () {
        var editor = monaco.editor.create(document.getElementById('editorContainer'), {
            value: webResource.content,
            language: language,
            theme: 'vs-dark',
            automaticLayout: true
        });
        // Define the command to execute when Ctrl+S is pressed (Save the webresource)
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, function () {
            updateWebresource(editor.getValue(), webResource.webresourceid);
        })
        // Define the command to execute when Ctrl+P is pressed (Publish the webresource)
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP, function () {
            publishWebResource(webResource.webresourceid);
        })
        // Define the command to execute when Ctrl+O is pressed (Open the webresource)
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyO, function () {
            openWebResource(webResource.name);
        })
        // Define the command to execute when Ctrl+Shift+P is pressed (Update and Publish the webresource)
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP, function () {
            updateAndPublish(editor.getValue(), webResource.webresourceid);
        })
    })
}
function getWebResourceTypeString(typeNumber) {
    switch (typeNumber) {
        case webresourceType.html:
            return 'html';
        case webresourceType.css:
            return 'css';
        case webresourceType.javascript:
            return 'javascript';
        case webresourceType.xml:
            return 'xml';
        case webresourceType.png:
            return 'png';
        case webresourceType.jpg:
            return 'jpg';
        case webresourceType.gif:
            return 'gif';
        case webresourceType.xap:
            return 'xap';
        case webresourceType.xsl:
            return 'xsl';
        case webresourceType.ico:
            return 'ico';
        case webresourceType.svg:
            return 'svg';
        case webresourceType.resx:
            return 'resx';
        default:
            return 'unknown format';
    }
}
function showNotification(text, type, duration) {
    notification.innerText = text;
    notification.style.display = 'block'
    notification.className = type
    duration && setTimeout(hideNotification, duration * 1000);
}
function hideNotification() {
    notification.style.display = 'none'
}
async function onLoad() {
    notification = document.getElementById("notification");
    document.getElementById("searchInput").focus();
    // Add event listener to search input text box to detect Enter key press
    document.getElementById("searchInput").addEventListener("keyup", function (event) {
        if (event.key === 'Enter') {
            // Call search function when user presses Enter key
            search();
        }
    });
    document.getElementById("editorContainer").style.display = "none";
    createCustomAPI();
}
async function getWebresource(webresourceid) {
    try {
        var webResource = {
            name: null,
            webresourceid: webresourceid,
            content: null,
            webresourcetype: null
        }
        showNotification("Retrieving webresource, please wait...", notificationType.info)
        var response = await fetch(window.location.origin + "/api/data/v9.2/webresourceset(" + webresourceid + ")?$select=content,name,webresourceid,webresourcetype", {
            method: "GET",
            headers: headers
        })
        const data = await response.json();
        const encodedContent = data["content"];
        webResource.content = atob(encodedContent);
        webResource.webresourceid = data["webresourceid"];
        webResource.webresourcetype = data["webresourcetype"];
        webResource.name = data["name"]
        showNotification("Webresource retrieved successfully. Use CTRL+S to save, CTRL+P to publish or CTRL+SHIFT+P to save and publish to D365.", notificationType.success, 10);
        document.title = webResource.name;
        return webResource;
    }
    catch (ex) {
        showNotification(ex.message, notificationType.error);
    }
}
async function updateWebresource(content, webresourceid) {
    try {
        var body = JSON.stringify(
            {
                "content": btoa(content),
                "webresourceid": webresourceid
            }
        )
        showNotification("Saving webresource...", notificationType.info);
        await fetch(window.location.origin + "/api/data/v9.2/web_update", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        })
        showNotification("Webresource saved successfully. Press CTRL+P to publish it.", notificationType.success, 5);
    }
    catch (ex) {
        showNotification(ex.message, notificationType.error)
    }
}
async function publishWebResource(webresourceid) {
    try {
        var data = {
            ParameterXml: "<importexportxml><webresources><webresource>{" + webresourceid + "}</webresource></webresources></importexportxml>"
        };
        showNotification("Publishing webresource...", notificationType.info);
        var response = await fetch(window.location.origin + "/api/data/v9.2/PublishXml", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });
        if (response.ok) {
            showNotification("Web resource published successfully.", notificationType.success, 5);
        } else {
            showNotification(response.statusText, notificationType.error);
        }
    } catch (error) {
        showNotification(error.message, notificationType.error);
    }
}
async function updateAndPublish(content, webresourceid) {
    await updateWebresource(content, webresourceid);
    await publishWebResource(webresourceid);
}
function openWebResource(name) {
    const url = window.location.origin + '/WebResources/' + name;
    window.open(url, "_blank");
}
async function createCustomAPI() {
    try {
        var response = await fetch(window.location.origin + "/api/data/v9.2/customapis?$filter=uniquename eq 'web_update' &$select=customapiid")
        const data = await response.json();
        if (data.value.length == 0) {
            // API doesn't exist so create it (in default solution)
            body = {
                "allowedcustomprocessingsteptype": 0,
                "boundentitylogicalname": null,
                "uniquename": "web_update",
                "displayname": "Update Webresource",
                "bindingtype": 0,
                "executeprivilegename": null,
                "isfunction": false,
                "isprivate": false,
                "name": "UpdateWebresource",
                "description": "UpdateWebresource",
                "iscustomizable": {
                    "Value": true
                },
                "CustomAPIRequestParameters": [
                    {
                        "type": 10,
                        "isoptional": false,
                        "displayname": "UpdateWebresource.content",
                        "name": "UpdateWebresource.content",
                        "uniquename": "content",
                        "logicalentityname": null,
                        "description": "UpdateWebresource.content",
                        "iscustomizable": {
                            "Value": true
                        }
                    },
                    {
                        "type": 10,
                        "isoptional": false,
                        "displayname": "UpdateWebresource.webresourceid",
                        "name": "UpdateWebresource.webresourceid",
                        "uniquename": "webresourceid",
                        "logicalentityname": null,
                        "description": "UpdateWebresource.webresourceid",
                        "iscustomizable": {
                            "Value": true
                        }
                    }
                ],
                "CustomAPIResponseProperties": [
                    {
                        "type": 10,
                        "name": "UpdateWebresource.response",
                        "logicalentityname": null,
                        "displayname": "UpdateWebresource.response",
                        "uniquename": "response",
                        "description": "UpdateWebresource.response",
                        "iscustomizable": {
                            "Value": true
                        }
                    }
                ],
                "PluginTypeId@odata.bind": "plugintypes(a8de3897-c9de-480c-8007-9e618c9d2ea8)"
            }
            await fetch(window.location.origin + "/api/data/v9.2/customapis", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'MSCRM.SolutionUniqueName': 'Default'
                },
                body: JSON.stringify(body)
            })
        }
    }
    catch (error) {
        showNotification("Error in createCustomAPI: " + error.message);
    }
}
function spinnerVisibility(visible) {
    if (visible) {
        // show spinner
        button.disabled = true;
        spinner.style.display = "inline-block";
    }
    else {
        spinner.style.display = "none";
        button.disabled = false;
    }
}