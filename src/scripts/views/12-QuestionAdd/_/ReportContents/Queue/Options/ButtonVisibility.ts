import Build from "@root/scripts/helpers/Build";
import storage from "@root/scripts/helpers/extStorage";
import { Flex, Select, SeparatorHorizontal, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type OptionsClassType from "./Options";

export default class ButtonVisibility {
  main: OptionsClassType;

  container: FlexElementType;
  buttonVisibilitySelect: Select;

  constructor(main: OptionsClassType) {
    this.main = main;

    this.Render();
  }

  Render() {
    const options = [
      {
        value: 0,
        text:
          System.data.locale.reportedContents.options.buttonVisibility
            .defaultVisibility,
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
        type: "spaced",
      }),
      this.container,
    );

    this.SetValue();
    this.main.optionContainer.append(this.container);
  }

  async SetValue() {
    const value =
      (await storage("get", "reported_contents_buttons_visibility")) || "0";
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

    if (event) {
      storage("set", { reported_contents_buttons_visibility: value });
    }
  }
}
