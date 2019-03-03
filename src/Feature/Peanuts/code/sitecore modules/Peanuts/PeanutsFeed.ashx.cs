using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Xml.Linq;
using Sitecore;
using Sitecore.Collections;
using Sitecore.Configuration;
using Sitecore.Data;
using Sitecore.Data.Items;
using Sitecore.Data.Managers;
using Sitecore.ExperienceEditor.Utils;
using Sitecore.Layouts;
using Sitecore.Resources;
using Sitecore.Rules;
using Sitecore.Web;
using Sitecore.Web.UI;

// ReSharper disable once CheckNamespace
namespace Feature.Peanuts
{
    public class PeanutsFeed : IHttpHandler
    {
        private Database database;
        private Item item;

        public bool IsReusable => true;
        public static readonly string ExcludedRenderings = Settings.GetSetting("Peanuts.ExcludedRenderings").ToUpperInvariant();

        private SafeDictionary<string> Initialize()
        {
            var data = HttpUtility.UrlDecode(HttpContext.Current.Request.Form["querystring"]);
            var query = WebUtil.ParseQueryString(data, true);
            database = Factory.GetDatabase(query["database"]);

            if (int.TryParse(query["sc_version"], out int version))
            {
                version = Math.Max(version, 0);
                item = database.GetItem(new ID(query["sc_itemId"]), LanguageManager.GetLanguage(query["sc_lang"])).Versions.GetVersions()[version];
            }
            else
            {
                item = database.GetItem(new ID(query["sc_itemId"]), LanguageManager.GetLanguage(query["sc_lang"]));
            }
            
            return query;
        }

        private List<RenderingDefinition> GetRenderingDefinitions(SafeDictionary<string> data)
        {
            var device = data["deviceId"];
            var renderingFieldId = WebUtility.IsEditAllVersionsTicked() ? FieldIDs.LayoutField : FieldIDs.FinalLayoutField;
            var field = item.Fields[renderingFieldId];
            var layoutXml = Sitecore.Data.Fields.LayoutField.GetFieldValue(field);
            var layout = LayoutDefinition.Parse(layoutXml);
            var deviceLayout = string.IsNullOrEmpty(device) ? layout.Devices[0] as DeviceDefinition : layout.GetDevice(device);
            return deviceLayout?.Renderings.ToArray().Select(r => r as RenderingDefinition).ToList();
        }

        private IEnumerable<object> GetOverview(IReadOnlyCollection<RenderingDefinition> renderings)
        {
            var result = new List<object>();
            var localItems = 0;
            if (item.HasChildren)
            {
                var dataItem = item.Children.FirstOrDefault(i => i.TemplateID.Guid.ToString("B").Equals("{1c82e550-ebcd-4e5d-8abd-d50d0809541e}", StringComparison.OrdinalIgnoreCase));
                if (dataItem != null)
                {
                    localItems = dataItem.Children.Count;
                }
            }

            result.Add(new
            {
                count = renderings.Count,
                localRenderings = renderings.Count(r => r.Datasource.StartsWith("local")),
                localItems = localItems
            });
            return result;
        }

        private IEnumerable<object> GetDetails(List<RenderingDefinition> renderings)
        {
            var result = new List<object>();
            var excludedRenderings = ExcludedRenderings.Split('|');

            foreach (RenderingDefinition rendering in renderings)
            {
                var renderItem = database.GetItem(rendering.ItemID);

                if (excludedRenderings.All(x => x != renderItem.ID.Guid.ToString().ToUpper()))
                {
                    result.Add(new
                    {
                        name = renderItem.DisplayName,
                        uniqueId = rendering.UniqueId,
                        renderingId = $"r_{Guid.Parse(rendering.UniqueId).ToString("N").ToUpperInvariant()}",
                        dataSourceId = rendering.Datasource,
                        dataSourceName = GetDatasource(rendering.Datasource),
                        variant = GetVariant(rendering.Parameters),
                        icon = Images.GetThemedImageSource(renderItem.Appearance.Icon, ImageDimension.id16x16),
                        placeholder = rendering.Placeholder,
                        rules = GetRules(rendering.Rules)
                    });
                }
            }

            return result;
        }

        private string GetDatasource(string datasource)
        {
            if (string.IsNullOrEmpty(datasource))
            {
                return null;
            }

            if (datasource.StartsWith("local", StringComparison.OrdinalIgnoreCase))
            {
                return database.GetItem(item.Paths.FullPath + datasource.Remove(0, 6)).DisplayName;
            }

            return database.GetItem(new ID(datasource)).DisplayName;
        }

        private object GetVariant(string parameters)
        {
            var data = WebUtil.ParseUrlParameters(parameters);
            if (Guid.TryParse(data["FieldNames"], out Guid variant))
            {
                var variantItem = database.GetItem(new ID(variant));
                return new
                {
                    name = variantItem.DisplayName,
                    icon = Images.GetThemedImageSource(variantItem.Appearance.Icon, ImageDimension.id16x16)
                };
            }

            return null;
        }

        private IEnumerable<object> GetRules(XElement rules)
        {
            if (rules == null)
            {
                return null;
            }

            var ruleList = RuleFactory.ParseRules<RuleContext>(database, rules);
            var result = new List<object>();
            foreach (var rule in ruleList.Rules)
            {
                result.Add(new
                {
                    name = rule.Name,
                    uniqueId = rule.UniqueId.Guid
                });
            }

            return result;
        }

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json";

            var data = Initialize();
            var renderings = GetRenderingDefinitions(data);
            if (renderings == null)
            {
                return;
            }

            var result = new
            {
                overview = GetOverview(renderings),
                details = GetDetails(renderings)
            };

            context.Response.Write(new JavaScriptSerializer().Serialize(result));
        }
    }
}