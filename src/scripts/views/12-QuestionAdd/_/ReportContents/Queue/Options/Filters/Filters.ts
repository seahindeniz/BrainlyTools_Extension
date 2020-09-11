import Build from "@root/helpers/Build";
import { Flex, SeparatorHorizontal, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type OptionsClassType from "../Options";
import Reporter from "./Reporter";
import Reported from "./Reported";
import ReportingDate from "./ReportingDate";
import ContentTypeFilter from "./ContentTypeFilter/ContentTypeFilter";
import ContentLength from "./ContentLength";

export default class Filters {
  main: OptionsClassType;

  container: FlexElementType;

  filter: {
    contentType: ContentTypeFilter;
    reporter: Reporter;
    reported: Reported;
    reportingDate: ReportingDate;
    contentLength: ContentLength;
  };

  constructor(main: OptionsClassType) {
    this.main = main;

    this.Render();

    this.filter = {
      contentType: new ContentTypeFilter(this),
      contentLength: new ContentLength(this),
      reported: new Reported(this),
      reporter: new Reporter(this),
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

    /* const separator = Flex({
      marginTop: "s",
      marginBottom: "s",
      margin: "xs",
      children: SeparatorHorizontal,
    }); */

    this.main.optionContainer.append(
      SeparatorHorizontal({
        type: "spaced",
      }),
      this.container,
    );
  }
}
