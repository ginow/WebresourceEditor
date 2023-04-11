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
    javascript: 3
}
var notification;
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
    var language;
    var webResource = await getWebresource();
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
            theme: 'vs-dark'
        });
        // Define the command to execute when Ctrl+S is pressed (Save the webresource)
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, function () {
            updateWebresource(editor.getValue(), webResource.webresourceid);
        })
        // Define the command to execute when Ctrl+P is pressed (Publish the webresource)
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP, function () {
            publishWebResource(webResource.webresourceid);
        })
        // Define the command to execute when Ctrl+W is pressed (Open the webresource)
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyO, function () {
            openWebResource(webResource.name);
        })
    })
}
async function getWebresource() {
    try {
        var webResourceName = prompt("Please enter webresource name:", "");
        document.title = webResourceName;
        var webResource = {
            name: webResourceName,
            webresourceid: null,
            content: null,
            webresourcetype: null
        }
        showNotification("Retrieving webresource, please wait...", notificationType.info)
        var response = await fetch(window.location.origin + "/api/data/v9.2/webresourceset?$select=content,webresourceid,webresourcetype&$filter=name eq '" + webResourceName + "'", {
            method: "GET",
            headers: headers
        })
        const data = await response.json();
        if (data.value.length > 0) {
            const encodedContent = data.value[0]["content"];
            webResource.content = atob(encodedContent);
            webResource.webresourceid = data.value[0]["webresourceid"];
            webResource.webresourcetype = data.value[0]["webresourcetype"];
            showNotification("Webresource retrieved successfully. Use CTRL+S to save, CTRL+P to publish to D365.", notificationType.success, 10);
            return webResource;
        }
        else {
            showNotification(webResourceName + " not found. Please refresh the page and try again", notificationType.error);
        }
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
        showNotification("Webresource saved successfully.", notificationType.success, 5);
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
function openWebResource(name) {
    const url = window.location.origin + '/WebResources/' + name;
    window.open(url, "_blank");
}