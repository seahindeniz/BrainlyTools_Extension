import Build from "@root/helpers/Build";
import { Flex, Icon, SeparatorHorizontal, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type OptionsClassType from "../Options";
import AdditionalData from "./AdditionalData/AdditionalData";
import AttachmentLength from "./AttachmentLength";
import ContentLength from "./ContentLength";
import ContentTypeFilter from "./ContentTypeFilter/ContentTypeFilter";
import Reported from "./Reported";
import Reporter from "./Reporter";
import ReportingDate from "./ReportingDate";
import Subjects from "./Subject/Subjects";

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
    subject: Subjects;
    additionalData: AdditionalData;
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
      subject: new Subjects(this),
      additionalData: new AdditionalData(this),
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
                children:
                  System.data.locale.reportedContents.options.filter.optionName,
                transform: "uppercase",
                weight: "bold",
              }),
            ],
            [
              Flex({
                marginTop: "xxs",
              }),
              [
                [
                  Flex({
                    alignItems: "center",
                    grow: true,
                    justifyContent: "center",
                    minContent: true,
                  }),
                  [
                    [
                      Flex({ marginRight: "xs" }),
                      new Icon({
                        color: "mustard",
                        size: 24,
                        type: "question",
                      }),
                    ],
                    Text({
                      children:
                        System.data.locale.reportedContents.options.filter
                          .description,
                      color: "peach-dark",
                      size: "small",
                      weight: "bold",
                    }),
                  ],
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
