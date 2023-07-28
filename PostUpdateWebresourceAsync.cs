using Microsoft.Xrm.Sdk;
using System;
using System.Text;

namespace WebresourceEditor
{
    public class PostUpdateWebresourceAsync : PluginBase
    {
        public PostUpdateWebresourceAsync(string unsecureConfiguration, string secureConfiguration)
            : base(typeof(PostUpdateWebresourceAsync))
        {
        }

        protected override void ExecuteDataversePlugin(ILocalPluginContext localPluginContext)
        {
            if (localPluginContext == null)
            {
                throw new ArgumentNullException(nameof(localPluginContext));
            }
            var context = localPluginContext.PluginExecutionContext;
            var tracingService = localPluginContext.TracingService;
            var service = localPluginContext.PluginUserService;
            try
            {
                tracingService.Trace("In PostUpdateWebresourceAsync");
                // The InputParameters collection contains all the data passed in the message request.  
                if (context.InputParameters.Contains("Target") &&
                    context.InputParameters["Target"] is Entity)
                {
                    // Obtain the target entity from the input parameters.  
                    Entity entity = (Entity)context.InputParameters["Target"];
                    tracingService.Trace("entity: " + entity.LogicalName);
                    tracingService.Trace("id: " + entity.Id);
                    if (entity.LogicalName != "webresource")
                        return;

                    // Check if the preimage contains the web resource content
                    if (context.PreEntityImages.Contains("PreImage"))
                    {
                        Entity preImage = (Entity)context.PreEntityImages["PreImage"];
                        if (preImage.Contains("content") && preImage["content"] is string && preImage.Contains("name") && preImage["name"] is string)
                        {
                            string webresourceContent = (string)preImage["content"];
                            string name = (string) preImage["name"];

                            // Create a new record in the WebresourceHistory table with the content value
                            CreateWebresourceHistoryRecord(name, webresourceContent, service, tracingService);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                tracingService.Trace("Error in PostUpdateWebresourceAsync: " + ex.StackTrace);
            }
        }

        private void CreateWebresourceHistoryRecord(string name, string webresourceContent, IOrganizationService service, ITracingService tracingService)
        {
            Entity webresourceHistory = new Entity("web_webresourcehistory");
            webresourceHistory["web_content"] = webresourceContent;
            webresourceHistory["web_name"] = name;
            service.Create(webresourceHistory);
        }
    }
}
