import Build from "@root/helpers/Build";
import { Flex, SeparatorHorizontal, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type OptionsClassType from "../Options";
import AttachmentLength from "./AttachmentLength";
import ContentLength from "./ContentLength";
import ContentTypeFilter from "./ContentTypeFilter/ContentTypeFilter";
import Reported from "./Reported";
import Reporter from "./Reporter";
import ReportingDate from "./ReportingDate";

export default class Filters {
  main: OptionsClassType;

  container: FlexElementType;

  filter: {
    contentType: ContentTypeFilter;
    contentLength: ContentLength;
    attachmentLength: AttachmentLength;
    reporter: Reporter;
    reported: Reported;
    reportingDate: ReportingDate;
  };

  constructor(main: OptionsClassType) {
    this.main = main;

    this.Render();

    this.filter = {
      contentType: new ContentTypeFilter(this),
      contentLength: new ContentLength(this),
      attachmentLength: new AttachmentLength(this),
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
