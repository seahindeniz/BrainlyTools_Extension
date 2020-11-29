import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import { Flex, Input, Select, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type { NumberConditionType } from "../Filter/ContentLength";
import { PreventMathOperators } from "./ContentLength";
import type FiltersClassType from "./FiltersPanel";

export default class AttachmentLength {
  main: FiltersClassType;

  container: FlexElementType;
  contentWrapper: FlexElementType;
  conditionSelect: Select;
  input: Input;

  constructor(main: FiltersClassType) {
    this.main = main;

    this.Render();
  }

  Render() {
    this.container = Flex();

    this.main.container.append(this.container);

    this.contentWrapper = Build(
      Flex({
        grow: true,
        tag: "label",
        marginTop: "s",
      }),
      [
        [
          Flex({ marginRight: "xs", alignItems: "center" }),
          Text({
            noWrap: true,
            size: "small",
            text: `${
              //
              System.data.locale.reportedContents.filtersPanel.filters
                .attachmentLength.name
            }: `,
            weight: "bold",
          }),
        ],
        [
          Flex({
            wrap: true,
            grow: true,
          }),
          [
            [
              Flex({
                grow: true,
                marginTop: "xxs",
                marginBottom: "xxs",
              }),
              (this.conditionSelect = new Select({
                fullWidth: true,
                onChange: this.InputChanged.bind(this),
                options: [
                  {
                    value: 0,
                    text:
                      System.data.locale.reportedContents.filtersPanel.filters
                        .contentLength.equals,
                  },
                  {
                    value: 1,
                    text:
                      System.data.locale.reportedContents.filtersPanel.filters
                        .contentLength.greaterThan,
                  },
                  {
                    value: 2,
                    text:
                      System.data.locale.reportedContents.filtersPanel.filters
                        .contentLength.lowerThan,
                  },
                ],
              })),
            ],
            [
              Flex({
                grow: true,
                alignItems: "center",
              }),
              (this.input = new Input({
                min: 0,
                max:
                  System.data.Brainly.defaultConfig.config.data.config
                    .attachmentCount,
                placeholder: `0 - ${System.data.Brainly.defaultConfig.config.data.config.attachmentCount}`,
                type: "number",
                fullWidth: true,
                onKeyDown: PreventMathOperators,
                onChange: this.InputChanged.bind(this),
              })),
            ],
          ],
        ],
      ],
    );
  }

  InputChanged() {
    const { value } = this.input.input;
    const condition: NumberConditionType =
      this.conditionSelect.select.value === "0"
        ? "equals"
        : this.conditionSelect.select.value === "1"
        ? "greaterThan"
        : this.conditionSelect.select.value === "2"
        ? "lowerThan"
        : undefined;

    this.main.main.filter.byName.attachmentLength.SetQuery(
      condition,
      Number(value === "" ? NaN : Number(value)),
    );
  }

  Show() {
    this.container.append(this.contentWrapper);
  }

  Hide() {
    HideElement(this.contentWrapper);
  }

  Deselected() {
    this.input.input.value = "";
    (this.conditionSelect.select
      .firstElementChild as HTMLOptionElement).selected = true;
  }
}
