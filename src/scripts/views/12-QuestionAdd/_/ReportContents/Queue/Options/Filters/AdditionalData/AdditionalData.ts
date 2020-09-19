import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import { Flex, Select, Text, Textarea } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type FiltersClassType from "../Filters";
import Condition, { ConditionKeyType } from "./Condition";

export default class AdditionalData {
  main: FiltersClassType;

  container: FlexElementType;
  contentWrapper: FlexElementType;
  conditionSelect: Select;
  textarea: HTMLTextAreaElement;
  conditions: Condition[];

  constructor(main: FiltersClassType) {
    this.main = main;

    this.conditions = [];

    this.Render();
    this.InitConditions();
  }

  Render() {
    this.container = Flex();

    this.main.container.append(this.container);

    this.contentWrapper = Build(
      Flex({
        tag: "label",
        marginTop: "s",
      }),
      [
        [
          Flex({ marginRight: "xs", alignItems: "center" }),
          Text({
            weight: "bold",
            noWrap: true,
            size: "small",
            text: `${System.data.locale.reportedContents.options.filter.filters.additionalData.name}: `,
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
                alignItems: "center",
                grow: true,
                marginBottom: "xxs",
                marginTop: "xxs",
              }),
              (this.conditionSelect = new Select({
                fullWidth: true,
                onChange: this.ConditionChanged.bind(this),
                options: [
                  {
                    selected: true,
                    text:
                      System.data.locale.reportedContents.options.filter.filters
                        .additionalData.chooseCondition,
                  },
                ],
              })),
            ],
            [
              Flex({
                grow: true,
                alignItems: "center",
              }),
              (this.textarea = Textarea({
                tag: "textarea",
                fullWidth: true,
                onChange: this.InputChanged.bind(this),
                placeholder: "...",
              })),
            ],
          ],
        ],
      ],
    );
  }

  InitConditions() {
    Object.keys(
      System.data.locale.reportedContents.options.filter.filters.additionalData
        .conditions,
    ).forEach((key: ConditionKeyType) => {
      const condition = new Condition(this, key);

      this.conditions.push(condition);
    });
  }

  get selectedCondition() {
    const selectedOptions = Array.from(
      this.conditionSelect.select.selectedOptions,
    );

    return this.conditions.find(condition =>
      selectedOptions.includes(condition.option),
    );
  }

  ConditionChanged() {
    const { selectedCondition } = this;

    let placeholder = "...";

    if (selectedCondition?.key === "regExp") {
      placeholder = "/mistakes in answer/gi";
    }

    this.textarea.placeholder = placeholder;

    this.InputChanged();
  }

  InputChanged() {
    const { selectedCondition } = this;

    if (!selectedCondition) return;

    this.main.main.main.filter.byName.additionalData.SetQuery(
      selectedCondition.key,
      this.textarea.value,
    );
  }

  Show() {
    this.container.append(this.contentWrapper);
  }

  Hide() {
    HideElement(this.contentWrapper);
  }

  Reset() {
    this.textarea.value = "";
    (this.conditionSelect.select
      .firstElementChild as HTMLOptionElement).selected = true;

    this.ConditionChanged();
  }
}
