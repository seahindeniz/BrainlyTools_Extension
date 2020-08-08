// @flow
import Build from "@root/scripts/helpers/Build";
import { Flex, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type OptionsClassType from "../Options";
import Reporter from "./Reporter";
import Reported from "./Reported";
import ReportingDate from "./ReportingDate";

export default class Filters {
  main: OptionsClassType;

  container: FlexElementType;

  filter: {
    reporter: Reporter,
    reported: Reported,
    reportingDate: ReportingDate,
  };

  constructor(main: OptionsClassType) {
    this.main = main;

    this.Render();

    this.filter = {
      reporter: new Reporter(this),
      reported: new Reported(this),
      reportingDate: new ReportingDate(this),
    };
  }

  Render() {
    this.container = Build(
      Flex({
        direction: "column",
      }),
      [
        [
          Flex({
            marginTop: "xs",
            marginBottom: "xs",
            direction: "column",
          }),
          [
            [
              Flex({
                justifyContent: "center",
              }),
              Text({
                weight: "bold",
                transform: "uppercase",
                children:
                  System.data.locale.reportedContents.options.filter.optionName,
              }),
            ],
            [
              Flex({
                marginTop: "xxs",
              }),
              [
                [
                  Flex({
                    grow: true,
                    minContent: true,
                    justifyContent: "center",
                  }),
                  Text({
                    size: "xsmall",
                    color: "gray",
                    children:
                      System.data.locale.reportedContents.options.filter
                        .description,
                  }),
                ],
              ],
            ],
          ],
        ],
      ],
    );

    this.main.optionContainer.append(this.container);
  }
}
