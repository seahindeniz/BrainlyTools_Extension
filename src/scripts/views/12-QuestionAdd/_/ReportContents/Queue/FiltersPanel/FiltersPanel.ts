import Build from "@root/helpers/Build";
import { Button, Flex, Icon, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import tippy from "tippy.js";
import type QueueClassType from "../Queue";
import AttachmentLength from "./AttachmentLength";
import ContentLength from "./ContentLength";
import ContentTypeFilter from "./ContentTypeFilter/ContentTypeFilter";
import ReportingDate from "./ReportingDate";
import AdditionalData from "./StringFilter/AdditionalData";
import Content from "./StringFilter/Content";
import Subjects from "./Subject/Subjects";
import Reported from "./User/Reported";
import Reporter from "./User/Reporter";

export default class FiltersPanel {
  main: QueueClassType;

  container: FlexElementType;

  filter: {
    contentType: ContentTypeFilter;
    content: Content;
    contentLength: ContentLength;
    attachmentLength: AttachmentLength;
    reporter: Reporter;
    reported: Reported;
    reportingDate: ReportingDate;
    subject: Subjects;
    additionalData: AdditionalData;
  };

  filtersButtonContainer: FlexElementType;
  filtersButton: Button;
  containerTippy: any;
  filterContainer: FlexElementType;

  constructor(main: QueueClassType) {
    this.main = main;

    this.RenderFiltersButton();
    this.Render();

    this.filter = {
      contentType: new ContentTypeFilter(this),
      content: new Content(this),
      contentLength: new ContentLength(this),
      attachmentLength: new AttachmentLength(this),
      reported: new Reported(this),
      reporter: new Reporter(this),
      reportingDate: new ReportingDate(this),
      subject: new Subjects(this),
      additionalData: new AdditionalData(this),
    };
  }

  RenderFiltersButton() {
    this.filtersButtonContainer = Flex({
      marginRight: "s",
      children: (this.filtersButton = new Button({
        size: "l",
        iconOnly: true,
        type: "solid-mustard",
        icon: new Icon({
          type: "filters",
          color: "adaptive",
        }),
      })),
    });

    this.containerTippy = tippy(this.filtersButton.element, {
      theme: "light",
      trigger: "click",
      maxWidth: "none",
      interactive: true,
      placement: "bottom",
      content: (this.filterContainer = Flex({
        marginTop: "xs",
        marginBottom: "s",
        direction: "column",
      })),
    });

    tippy(this.filtersButton.element, {
      theme: "light",
      maxWidth: "none",
      content: Text({
        size: "small",
        weight: "bold",
        children: System.data.locale.reportedContents.filtersPanel.title,
      }),
    });

    this.main.main.popupMenuContainer.append(this.filtersButtonContainer);
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
                children: System.data.locale.reportedContents.filtersPanel.name,
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
                        System.data.locale.reportedContents.filtersPanel
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

    this.filterContainer.append(this.container);
  }
}
