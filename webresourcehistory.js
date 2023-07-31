// This should be in a script loaded on the form. 
// form_onload is a handler for the form onload event.
function form_onload(executionContext) {
    var formContext = executionContext.getFormContext();
    var wrControl = formContext.getControl("WebResource_diff");
    if (wrControl) {
        wrControl.getContentWindow().then(
            function (contentWindow) {
                if (contentWindow.setClientApiContext && typeof contentWindow.setClientApiContext === "function") {
                    contentWindow.setClientApiContext(Xrm, formContext);
                } else {
                    // The function does not exist or is not a function, handle the situation accordingly
                    console.log("setClientApiContext is not available.");
                    // formContext.data.refresh();
                    // location.reload();
                }
            }
        )
    }
}