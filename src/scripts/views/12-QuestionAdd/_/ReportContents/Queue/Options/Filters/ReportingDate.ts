// @flow

import Build from "@/scripts/helpers/Build";
import { Flex, InputDeprecated, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type { InputElementType } from "@style-guide/InputDeprecated";
import type FiltersClassType from "./Filters";

export default class Reporter {
  main: FiltersClassType;

  container: FlexElementType;
  startingDateInput: InputElementType;
  endingDateInput: InputElementType;

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
            text: `${System.data.locale.reportedContents.options.filter.filters.reportingDate.name}: `,
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
              (this.startingDateInput = InputDeprecated({
                type: "date",
                fullWidth: true,
                onChange: [
                  this.StartingDateChanged.bind(this),
                  this.InputChanged.bind(this),
                ],
                title: `${System.data.locale.reportedContents.options.filter.filters.reportingDate.startingDate}..`,
              })),
            ],
            [
              Flex({
                grow: true,
                alignItems: "center",
              }),
              (this.endingDateInput = InputDeprecated({
                type: "date",
                fullWidth: true,
                onChange: [
                  this.EndingDateChanged.bind(this),
                  this.InputChanged.bind(this),
                ],
                placeholder: `${System.data.locale.reportedContents.options.filter.filters.reportingDate.endingDate}..`,
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
    this.endingDateInput.valueAsDate = new Date();
    this.startingDateInput.max = this.endingDateInput.value;
    this.endingDateInput.max = this.endingDateInput.value;
  }

  StartingDateChanged() {
    this.endingDateInput.min = this.startingDateInput.value;
  }

  EndingDateChanged() {
    this.startingDateInput.max = this.endingDateInput.value;
  }

  InputChanged() {
    this.main.main.main.filter.byName.reportingDate.SetQuery(
      this.startingDateInput.value,
      this.endingDateInput.value,
    );
  }
}
