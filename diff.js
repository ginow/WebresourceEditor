
const headers = {
    'OData-MaxVersion': '4.0',
    'OData-Version': '4.0',
    'Accept': 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
    'Prefer': 'odata.include-annotations=\'*\''
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
// No usage of Xrm or formContext should happen until this method is called.
async function setClientApiContext(xrm, formContext) {
    // Optionally set Xrm and formContext as global variables on the page.
    window.Xrm = xrm;
    window._formContext = formContext;
    var language;
    var web_name=formContext.getAttribute("web_name").getValue();
    var oldContent=atob(formContext.getAttribute("web_content").getValue());
    var latestWebResource = await getWebresource(web_name);
    switch (latestWebResource.webresourcetype) {
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
        var originalModel = monaco.editor.createModel(
            oldContent,
            language
        );
        var modifiedModel = monaco.editor.createModel(
            latestWebResource.content,
            language 
        );

        var diffEditor = monaco.editor.createDiffEditor(
            document.getElementById('diffContainer'),
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
async function getWebresource(name) {
    try {
        var webResource = {
            name: name,
            webresourceid: null,
            content: null,
            webresourcetype: null
        }
        var response = await Xrm.WebApi.retrieveMultipleRecords('webresource','?$select=content,name,webresourceid,webresourcetype&$filter=name eq \''+name+'\'');
        var data=response.entities[0];
        const encodedContent =data.content;
        webResource.content = atob(encodedContent);
        webResource.webresourceid = data['webresourceid'];
        webResource.webresourcetype = data['webresourcetype'];
        webResource.name = data['name']
        document.title = webResource.name;
        return webResource;
    }
    catch (ex) {
        console.error(ex.stack)
    }
}
