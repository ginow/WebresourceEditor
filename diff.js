
const headers = {
    "OData-MaxVersion": "4.0",
    "OData-Version": "4.0",
    "Accept": "application/json",
    "Content-Type": "application/json; charset=utf-8",
    "Prefer": "odata.include-annotations=\"*\""
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
async function onLoad() {
    var language;
    /*
    var webResource = await getWebresource("con_contact.js");
    switch (webResource.webresourcetype) {
        case webresourceType.html: language = 'html';
            break;
        case webresourceType.css: language = 'css';
            break;
        case webresourceType.javascript: language = 'javascript';
            break;
        default: language = 'text'
    }
    */
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
        var originalModel = monaco.editor.createModel(
            "This line is removed on the right.\njust some text\nabcd\nefgh\nSome more text",
            "text/plain"
        );
        var modifiedModel = monaco.editor.createModel(
            "just some text\nabcz\nzzzzefgh\nSome more text.\nThis line is removed on the left.",
            "text/plain"
        );

        var diffEditor = monaco.editor.createDiffEditor(
            document.getElementById("diffContainer"),
            {
                enableSplitViewResizing: true,
                readOnly: true,
                theme: 'vs-dark',
                automaticLayout: true
            }
        );
        diffEditor.setModel({
            original: originalModel,
            modified: modifiedModel,
        });
    })
}
async function getWebresource(webresourceid) {
    try {
        var webResource = {
            name: null,
            webresourceid: webresourceid,
            content: null,
            webresourcetype: null
        }
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
        document.title = webResource.name;
        return webResource;
    }
    catch (ex) {
        console.error(ex.stack)
    }
}
