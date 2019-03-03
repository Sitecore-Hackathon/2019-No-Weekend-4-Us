# Documentation

# "Peanuts"

## Summary

**Category:** Best extension of the editing experience for SXA in Experience Editor

We took this category very literaly and have extended on the Experience Editor by adding new functionalities within a 'toggleable' additional toolbox. Our toolbox (lovingfully named "Peanuts", since it's meant to make the editing... well, you guessed). The additional toolbar helps to bring information regarding the SXA page structure closer to the content editor. The module focusses on displaying the component and rendering structure, providing human readable data source information, navigating towards the actual components as well as displaying information on the personalisation set up per component. On top of this, we show the number of renderings (to give an indication when the amount of components is too high) as well as information about the use and amount of local datasources.

## Pre-requisites

Next to the overall prerequisites (Sitecore 9.1) you will also need SXA 1.8
We installed Habitat on top of that to have data to work with. Our solution does not provide a site nor test data, so it should be installed on an instance with data to test. Habitat sounds like a good solution in that case.

## Installation

The module is installed with a Sitecore package. 

This will install one item in the core database for our checkbox in the ribbon. It will also add files in a folder in "sitecore modules", a dll in the bin folder and a few config files.

The install file is in the sc-package folder: [peanuts-2019.1.zip](../sc.package/peanuts-2019.1.zip)


## Configuration

The module does not require a lot of configuration - it will work as soon as it is installed. We do have one configuration file (Feature.Peanuts.Settings.config) that add a setting to Sitecore that lists ID's of renderings that should be included in the overview (they are still included in the count however). This feature can be used to hide purely structural renderings from the list but is optional. The module is for editing only so the configuration is only needed on ContentManagement or Standalone instances.

By default we added the ID of the Container rendering.


```xml
<configuration xmlns:patch="http://www.sitecore.net/xmlconfig/">
  <sitecore role:require="Standalone or ContentManagement">
    <settings>
      <!-- serperate renderings by | -->
      <setting name="Peanuts.ExcludedRenderings" value="896A2C68-1362-4E88-8BA0-1805AE6D4837"/>
    </settings>
  </sitecore>
</configuration>
```

## Usage

The module is initially disabled. To enable the module, open the View ribbon and toggle the 'Peanuts' checkbox inside the Editing chunk. On activation of the module, a second Toolbar block appears in red, featuring a 'P' icon.
When this block is clicked, the toolbox opens up to display the information of the contained components

![Peanuts checkbox](images/Checkbox.PNG?raw=true "Peanuts checkbox")

![Closed Peanuts toolbox](images/ClosedToolbox.PNG?raw=true "Closed Peanuts toolbox")

The toolbox ships with the following functionalities:
- Provide an overview of all contained components on the page and basic variant information

![Open Peanuts toolbox](images/OpenedToolbox.PNG?raw=true "Open Peanuts toolbox")

- Provide details on specific component, consisting of the
  - Component name
  - Datasource readable name
  - Variant readable name
  - Personalization rules

  ![Component details](images/ComponentDetails.PNG?raw=true "Component details")

- When selecting a component, the page navigates to that specific component. 
The component gets selected as if it was clicked within the editor.

![Component selection](images/ComponentSelection.PNG?raw=true "Component selection")

- On the details of a specific component, the personalization details can also be viewed - we display the different personalization rules available for that component.

![View personalization](images/ViewPersonalization.PNG?raw=true "View personalization")

To provide the much needed information for the front-end javascript built on and around the SXA toolbox, we worked based on our own HttpHandler "PeanutsFeed.ashx". We realize (and learned in more detail) that the hidden scLayout field is available in the Experience Editor. However, sending this back entirely would require too many unstructured item lookups and would not feel logical in its buildup. This is why we let the front-end code perform the actual call based on the current querystring. This allows us to retrieve the device, language, version as well as the database and the item ID.

Based on this information we are able to retrieve the actual information we require to build up the toolbox. This also means that no unnecessary information is pulled from Sitecore.

Future functionalities and things we would have liked to have added but were not realized within the Hackathon timeframe.
- Possibility to switch between the different personalization rules available for a component by clicking on the selected variation
- Change position of the components by drag and dropping them inside the toolbar
- Full support for snippets
- Delete component or personalization rule
- Extend to also include Partial Renderings
- Publish only a specific component - taking cache clearing into account
- Toggle components correctly

## Video

Please provide a video highlighing your Hackathon module submission and provide a link to the video. Either a [direct link](https://www.youtube.com/watch?v=EpNhxW4pNKk) to the video, upload it to this documentation folder or maybe upload it to Youtube...

[![Sitecore Hackathon Video Embedding Alt Text](https://img.youtube.com/vi/EpNhxW4pNKk/0.jpg)](https://www.youtube.com/watch?v=EpNhxW4pNKk)
