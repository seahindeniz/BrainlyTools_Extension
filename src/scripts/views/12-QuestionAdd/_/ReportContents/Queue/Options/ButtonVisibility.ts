import Build from "@root/helpers/Build";
import storage from "@root/helpers/extStorage";
import { Flex, Select, SeparatorHorizontal, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type OptionsClassType from "./Options";

const REPORTED_CONTENTS_VISIBILITY_KEY = "reported_contents_buttons_visibility";

export default class ButtonVisibility {
  main: OptionsClassType;

  container: FlexElementType;
  buttonVisibilitySelect: Select;

  constructor(main: OptionsClassType) {
    this.main = main;

    this.Render();
    this.SetValue();
  }

  Render() {
    const options = [
      {
        value: 0,
        text: `${
          System.data.locale.reportedContents.options.buttonVisibility[
            document.documentElement.classList.contains("mobile")
              ? "alwaysVisible"
              : "onHoverOrTouch"
          ]
        } (${System.data.locale.reportedContents.options.buttonVisibility.defaultVisibility.toLowerCase()})`,
      },
    ];

    if (!document.documentElement) return;

    if (!document.documentElement.classList.contains("mobile"))
      options.push({
        value: 1,
        text:
          System.data.locale.reportedContents.options.buttonVisibility
            .alwaysVisible,
      });
    else
      options.push({
        value: 2,
        text:
          System.data.locale.reportedContents.options.buttonVisibility
            .onHoverOrTouch,
      });

    this.container = Build(
      Flex({
        tag: "label",
        marginTop: "xxs",
      }),
      [
        [
          Flex({ marginRight: "s", alignItems: "center" }),
          Text({
            size: "small",
            weight: "bold",
            text: `${System.data.locale.reportedContents.options.buttonVisibility.optionName}: `,
          }),
        ],
        [
          Flex({
            grow: true,
          }),
          (this.buttonVisibilitySelect = new Select({
            options,
            fullWidth: true,
            onChange: this.ChangeVisibility.bind(this),
          })),
        ],
      ],
    );

    this.main.optionContainer.append(
      SeparatorHorizontal({
        type: "short-spaced",
      }),
      this.container,
    );
  }

  async SetValue() {
    const value =
      (await storage("get", REPORTED_CONTENTS_VISIBILITY_KEY)) || "0";
    this.buttonVisibilitySelect.select.value = value;

    this.ChangeVisibility();
  }

  ChangeVisibility(event?: Event) {
    const { value } = this.buttonVisibilitySelect.select;

    if (value === "0") {
      this.main.main.main.queueContainer.classList.remove(
        "buttons-visibility-always",
        "buttons-visibility-on-hover",
      );
    } else if (value === "1") {
      this.main.main.main.queueContainer.classList.add(
        "buttons-visibility-always",
      );
      this.main.main.main.queueContainer.classList.remove(
        "buttons-visibility-on-hover",
      );
    } else if (value === "2") {
      this.main.main.main.queueContainer.classList.add(
        "buttons-visibility-on-hover",
      );
      this.main.main.main.queueContainer.classList.remove(
        "buttons-visibility-always",
      );
    }

    this.main.main.main.contents.filtered.forEach(content => {
      if (!content.contentWrapper) return;

      content.TryToRenderButtons();
    });

    if (event) {
      storage("set", { [REPORTED_CONTENTS_VISIBILITY_KEY]: value });
    }
  }
}
