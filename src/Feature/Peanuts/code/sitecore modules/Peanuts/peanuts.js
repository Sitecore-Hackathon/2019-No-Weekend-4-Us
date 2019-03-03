define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
    Sitecore.Commands.ShowPeanuts =
        {
            canExecute: function (context, parent) {
                var requestContext = context.app.clone(context.currentContext);
                var limitedDevice = context.app.canExecute("ExperienceEditor.XA.CheckDeviceLimited", requestContext);
                if (limitedDevice) {
                    parent.initiator.set({ isVisible: false });
                    return false;
                }

                if (context.currentContext.webEditMode !== "preview") {
                    ExperienceEditor.Common.registerDocumentStyles(["/sitecore modules/Peanuts/assets/build/output/index.css"], window.parent.document);

                    if (context.button.get("isChecked") === "1") {
                        if ($('#setPeanutscript').length <= 0) {
                            script = document.createElement('script');
                            script.type = 'text/javascript';
                            script.id = "setPeanutscript";
                            script.async = true;
                            script.src = '/sitecore modules/Peanuts/assets/build/output/index.js';
                            document.getElementsByTagName('head')[0].appendChild(script);
                        } else {
                            window.initializeDetailsFeed();
                        }
                    } else {
                        if (window.parent.document.getElementsByClassName("peanuts-toolbox-expander").length > 0) {
                            window.parent.document.getElementsByClassName("peanuts-toolbox-expander")[0].outerHTML = "";
                        }
                        if (window.parent.document.getElementsByClassName("peanuts-toolbox-content").length > 0) {
                            window.parent.document.getElementsByClassName("peanuts-toolbox-content")[0].outerHTML = "";
                        }

                    }
                    return true;
                }
                return false;
            },
            execute: function (context) {
                ExperienceEditor.modifiedHandling(true, function () {
                    ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ToggleRegistryKey.Toggle", function (response) {
                        response.context.button.set("isChecked", response.responseValue.value ? "1" : "0");
                        if (context.button.get("isChecked") === "1") {
                            if ($('#setPeanutscript').length <= 0) {
                                script = document.createElement('script');
                                script.type = 'text/javascript';
                                script.id = "setPeanutscript";
                                script.async = true;
                                script.src = '/sitecore modules/Peanuts/assets/build/output/index.js';
                                document.getElementsByTagName('head')[0].appendChild(script);
                            } else {
                                window.initializeDetailsFeed();
                            }
                        } else {
                            if (window.parent.document.getElementsByClassName("peanuts-toolbox-expander").length > 0) {
                                window.parent.document.getElementsByClassName("peanuts-toolbox-expander")[0].outerHTML = "";
                            }
                            if (window.parent.document.getElementsByClassName("peanuts-toolbox-content").length > 0) {
                                window.parent.document.getElementsByClassName("peanuts-toolbox-content")[0].outerHTML = "";
                            }
                        }
                    }, { value: context.button.get("registryKey") }).execute(context);
                });
            },
        };
});