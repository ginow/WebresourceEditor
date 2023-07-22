using Microsoft.Xrm.Sdk;
using System;
using System.Text;

namespace WebresourceEditor
{
    public class PostPublishWebresourceAsync : PluginBase
    {
        public PostPublishWebresourceAsync(string unsecureConfiguration, string secureConfiguration)
            : base(typeof(UpdateWebresource))
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
                tracingService.Trace("In PostPublishWebresourceAsync");
                tracingService.Trace("pac push testing");
                // The InputParameters collection contains all the data passed in the message request.  
                if (context.InputParameters.Contains("Target") &&
                    context.InputParameters["Target"] is Entity)
                {
                    // Obtain the target entity from the input parameters.  
                    Entity entity = (Entity)context.InputParameters["Target"];
                    tracingService.Trace("entity: " + entity.LogicalName);
                    tracingService.Trace("id: " + entity.Id);
                }
            }
            catch (Exception ex)
            {
                tracingService.Trace("Error: " + ex.StackTrace);
            }
        }
    }
}
