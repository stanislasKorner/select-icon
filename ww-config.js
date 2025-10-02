export default {
  editor: {
    label: {
      en: "Icon Selector",
    },
    bubble: {
      resizable: false,
    },
  },
  properties: {
    selectedIcon: {
      label: {
        en: "Selected Icon",
      },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: "phosphor/star",
      /* wwEditor:start */
      bindingValidation: {
        type: "string",
        tooltip: "Icon identifier format: phosphor/icon-name (e.g., phosphor/star, phosphor/heart)",
      },
      propertyHelp: "Selected icon in format: phosphor/icon-name",
      /* wwEditor:end */
    },
    iconSize: {
      label: {
        en: "Icon Size",
      },
      type: "Length",
      section: "settings",
      defaultValue: "24px",
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: "string",
        tooltip: "CSS length value for icon size",
      },
      /* wwEditor:end */
    },
    iconColor: {
      label: {
        en: "Icon Color",
      },
      type: "Color",
      section: "settings",
      defaultValue: "#000000",
      bindable: true,
    },
    showLabel: {
      label: {
        en: "Show Label",
      },
      type: "OnOff",
      section: "settings",
      defaultValue: false,
      bindable: true,
    },
    labelPosition: {
      label: {
        en: "Label Position",
      },
      type: "TextSelect",
      section: "settings",
      options: {
        options: [
          { value: "bottom", label: "Bottom" },
          { value: "top", label: "Top" },
          { value: "left", label: "Left" },
          { value: "right", label: "Right" },
        ],
      },
      defaultValue: "bottom",
      bindable: true,
      hidden: (content) => !content?.showLabel,
      /* wwEditor:start */
      bindingValidation: {
        type: "string",
        tooltip: "Valid values: bottom | top | left | right",
      },
      /* wwEditor:end */
    },
    labelColor: {
      label: {
        en: "Label Color",
      },
      type: "Color",
      section: "settings",
      defaultValue: "#666666",
      bindable: true,
      hidden: (content) => !content?.showLabel,
    },
    labelSize: {
      label: {
        en: "Label Size",
      },
      type: "Length",
      section: "settings",
      defaultValue: "14px",
      bindable: true,
      hidden: (content) => !content?.showLabel,
    },
    searchPlaceholder: {
      label: {
        en: "Search Placeholder",
      },
      type: "Text",
      section: "settings",
      defaultValue: "Search icons...",
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: "string",
        tooltip: "Placeholder text for search input",
      },
      /* wwEditor:end */
    },
    searchTextSize: {
      label: {
        en: "Search Text Size",
      },
      type: "Length",
      section: "settings",
      defaultValue: "13px",
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: "string",
        tooltip: "Font size for search input",
      },
      /* wwEditor:end */
    },
    searchTextColor: {
      label: {
        en: "Search Text Color",
      },
      type: "Color",
      section: "settings",
      defaultValue: "#000000",
      bindable: true,
    },
  },
  triggerEvents: [
    {
      name: "icon-change",
      label: { en: "On icon change" },
      event: { iconValue: "" },
    },
  ],
};
