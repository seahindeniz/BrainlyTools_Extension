import Build from "@root/helpers/Build";
import { Flex, Input, Select, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import { debounce } from "throttle-debounce";
import type FiltersClassType from "./Filters";
import type { NumberConditionType } from "../../Filter/ContentLength";

const MAX_CONTENT_LENGTH = 198;

export default class ContentLength {
  main: FiltersClassType;

  container: FlexElementType;
  conditionSelect: Select;
  input: Input;

  constructor(main: FiltersClassType) {
    this.main = main;

    this.Render();
  }

  Render() {
    this.container = Build(
      Flex({
        tag: "label",
        marginTop: "s",
      }),
      [
        [
          Flex({ marginRight: "xs", alignItems: "center" }),
          Text({
            noWrap: true,
            size: "small",
            text: `${System.data.locale.reportedContents.options.filter.filters.contentLength.name}: `,
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
                      System.data.locale.reportedContents.options.filter.filters
                        .contentLength.equals,
                  },
                  {
                    value: 1,
                    text:
                      System.data.locale.reportedContents.options.filter.filters
                        .contentLength.greaterThan,
                  },
                  {
                    value: 2,
                    text:
                      System.data.locale.reportedContents.options.filter.filters
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
                max: MAX_CONTENT_LENGTH,
                placeholder: `0 - ${MAX_CONTENT_LENGTH}`,
                type: "number",
                fullWidth: true,
                onInput: debounce(400, this.InputChanged.bind(this)),
              })),
            ],
          ],
        ],
        // (this.textarea = Textarea({
        //   tag: "textarea",
        //   fullWidth: true,
        //   placeholder: "...",
        //   resizable: "vertical",
        //   size: "short",
        //   onInput: debounce(300, this.InputChanged.bind(this)),
        // })),
      ],
    );

    this.main.container.append(this.container);
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

    this.main.main.main.filter.byName.contentLength.SetQuery(
      condition,
      Number(value === "" ? NaN : Number(value)),
    );
  }

  Deselected() {
    this.input.input.value = "";
    (this.conditionSelect.select
      .firstElementChild as HTMLOptionElement).selected = true;
  }
}
