// @flow

import Build from "@root/scripts/helpers/Build";
import { Flex, InputDeprecated, Select, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type { InputElementType } from "@style-guide/InputDeprecated";
import type FiltersClassType from "./Filters";

export default class Reported {
  main: FiltersClassType;

  container: FlexElementType;
  queryTypeSelect: Select;
  input: InputElementType;

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
            text: `${System.data.locale.reportedContents.options.filter.filters.reported.name}: `,
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
              (this.queryTypeSelect = new Select({
                fullWidth: true,
                onChange: this.InputChanged.bind(this),
                options: [
                  {
                    value: "",
                    selected: true,
                    disabled: true,
                    text: "Look for",
                  },
                  {
                    value: 0,
                    text: System.data.locale.common.nick,
                  },
                  {
                    value: 1,
                    text: System.data.locale.common.profileLinkOrId,
                  },
                ],
              })),
            ],
            [
              Flex({
                grow: true,
                alignItems: "center",
              }),
              (this.input = InputDeprecated({
                fullWidth: true,
                onChange: this.InputChanged.bind(this),
                placeholder: "...",
              })),
            ],
          ],
        ],
      ],
    );

    this.main.container.append(this.container);
  }

  InputChanged() {
    const target =
      this.queryTypeSelect.select.value === "0"
        ? "nick"
        : this.queryTypeSelect.select.value === "1"
        ? "id"
        : undefined;

    this.main.main.main.filter.byName.reported.SetQuery(
      target,
      this.input.value,
    );
  }
}
