using Microsoft.Xrm.Sdk;
using System;
using System.Text;

namespace WebresourceEditor
{
    public class UpdateWebresource : PluginBase
    {
        public UpdateWebresource(string unsecureConfiguration, string secureConfiguration)
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
                tracingService.Trace("In UpdateWebresource");
                string webresourceid = (string)context.InputParameters["webresourceid"];
                string content = (string)context.InputParameters["content"];
                Entity webresource = new Entity("webresource", new Guid(webresourceid));
                // webresource.Attributes["content"] = Convert.ToBase64String(Encoding.UTF8.GetBytes(content));
                webresource.Attributes["content"] = content;
                service.Update(webresource);
                tracingService.Trace("webresourceid: " + webresourceid);
                context.OutputParameters["response"] = "success";
            }
            catch (Exception ex)
            {
                tracingService.Trace("Error: " + ex.StackTrace);
                context.OutputParameters["response"] = ex.StackTrace;
            }
        }
    }
}
