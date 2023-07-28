using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;

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
                // The InputParameters collection contains all the data passed in the message request.  
                if (context.InputParameters.Contains("Target") &&
                    context.InputParameters["Target"] is Entity)
                {
                    // Obtain the target entity from the input parameters.  
                    Entity entity = (Entity)context.InputParameters["Target"];
                    if (entity.LogicalName != "webresource")
                        return;

                    // Check if the preimage contains the web resource content
                    if (context.PreEntityImages.Contains("PreImage"))
                    {
                        Entity preImage = (Entity)context.PreEntityImages["PreImage"];
                        if (preImage.Contains("content") && preImage["content"] is string && preImage.Contains("name") && preImage["name"] is string)
                        {
                            string webresourceContent = (string)preImage["content"];
                            string name = (string)preImage["name"];

                            // Create a new record in the WebresourceHistory table with the content value
                            CreateWebresourceHistoryRecord(name, webresourceContent, service);
                            LimitHistory(service );
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                tracingService.Trace("Error in PostUpdateWebresourceAsync: " + ex.StackTrace);
            }
        }

        private void LimitHistory(IOrganizationService service  )
        {
            // Define the FetchXML query to get count and name sorted by createdon in ascending order
            string fetchXml = @"
                <fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>
                  <entity name='web_webresourcehistory'>
                    <attribute name='web_name' />
                    <attribute name='createdon' />
                    <order attribute='createdon' descending='false' />
                  </entity>
                </fetch>";
            // Execute the FetchXML query
            EntityCollection result = service.RetrieveMultiple(new FetchExpression(fetchXml));
            // Check if the count is greater than or equal to 5000
            if (result.Entities.Count >= 5000)
            {
                // Retrieve the oldest record (first retrieved record is the oldest due to sorting by "createdon" in ascending order)
                Entity oldestRecord = result.Entities[0];
                service.Delete(oldestRecord.LogicalName, oldestRecord.Id);
            }
        }

        private void CreateWebresourceHistoryRecord(string name, string webresourceContent, IOrganizationService service )
        {
            Entity webresourceHistory = new Entity("web_webresourcehistory");
            webresourceHistory["web_content"] = webresourceContent;
            webresourceHistory["web_name"] = name;
            service.Create(webresourceHistory);
        }
    }
}
