using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using Sitecore.Pipelines;

namespace Project.NoWeekend4Us
{
    public class ApplicationStart
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA1801:ReviewUnusedParameters", MessageId = "args", Justification = "By design")]
        public void Process(PipelineArgs args)
        {
            MvcHandler.DisableMvcResponseHeader = true;
            RouteTable.Routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            GlobalConfiguration.Configuration.IncludeErrorDetailPolicy = IncludeErrorDetailPolicy.LocalOnly;
        }
    }
}