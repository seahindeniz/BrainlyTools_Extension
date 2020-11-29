import Build from "@root/helpers/Build";
import { Flex, Input, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type FiltersClassType from "./FiltersPanel";

export default class Reporter {
  main: FiltersClassType;

  container: FlexElementType;
  startingDateInput: Input;
  endingDateInput: Input;

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
            weight: "bold",
            noWrap: true,
            size: "small",
            text: `${System.data.locale.reportedContents.filtersPanel.filters.reportingDate.name}: `,
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
              (this.startingDateInput = new Input({
                type: "date",
                fullWidth: true,
                title: `${System.data.locale.reportedContents.filtersPanel.filters.reportingDate.startingDate}..`,
                onChange: [
                  this.StartingDateChanged.bind(this),
                  this.InputChanged.bind(this),
                ],
              })),
            ],
            [
              Flex({
                grow: true,
                alignItems: "center",
              }),
              (this.endingDateInput = new Input({
                type: "date",
                fullWidth: true,
                placeholder: `${System.data.locale.reportedContents.filtersPanel.filters.reportingDate.endingDate}..`,
                onChange: [
                  this.EndingDateChanged.bind(this),
                  this.InputChanged.bind(this),
                ],
              })),
            ],
          ],
        ],
      ],
    );

    this.ResetDates();
    this.main.container.append(this.container);
  }

  ResetDates() {
    this.startingDateInput.input.value = "";
    this.endingDateInput.input.valueAsDate = new Date();
    this.startingDateInput.input.max = this.endingDateInput.input.value;
    this.endingDateInput.input.max = this.endingDateInput.input.value;
  }

  StartingDateChanged() {
    this.endingDateInput.input.min = this.startingDateInput.input.value;
  }

  EndingDateChanged() {
    this.startingDateInput.input.max = this.endingDateInput.input.value;
  }

  InputChanged() {
    this.main.main.filter.byName.reportingDate.SetQuery(
      this.startingDateInput.input.value,
      this.endingDateInput.input.value,
    );
  }
}
