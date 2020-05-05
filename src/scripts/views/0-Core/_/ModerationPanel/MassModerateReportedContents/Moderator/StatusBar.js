import Build from "@/scripts/helpers/Build";
import InsertAfter from "@/scripts/helpers/InsertAfter";
import InsertBefore from "@/scripts/helpers/InsertBefore";
import IsVisible from "@/scripts/helpers/IsVisible";
import {
  Button,
  Flex,
  Icon,
  SeparatorVertical,
  Spinner,
  Text,
} from "@style-guide";

export default class StatusBar {
  /**
   * @param {import(".").default} main
   */
  constructor(main) {
    this.main = main;

    this.Render();
    this.RenderModeratedReportsText();
    this.RenderStopButton();
    this.RenderSpinner();
    this.RenderExportButton();
    this.BindListener();
  }

  Render() {
    this.container = Build(
      Flex({
        margin: "m",
        alignItems: "center",
      }),
      [
        [
          Flex(),
          [
            [
              (this.filteredReportsTextContainer = Flex({
                alignItems: "center",
              })),
              Text({
                size: "small",
                weight: "bold",
                fixPosition: true,
                text: `${System.data.locale.core.massModerateReportedContents.filteredReports}: `,
                children: (this.numberOfFilteredReports = document.createTextNode(
                  "0",
                )),
              }),
            ],
          ],
        ],
      ],
    );
  }

  RenderModeratedReportsText() {
    this.moderatedReportsTextContainer = Build(Flex(), [
      [
        Flex({
          fullHeight: true,
          marginLeft: "xs",
          marginRight: "xs",
          alignItems: "center",
        }),
        SeparatorVertical({ grayDark: true }),
      ],
      [
        Flex({ alignItems: "center" }),
        Text({
          size: "small",
          weight: "bold",
          text: `${System.data.locale.core.massModerateReportedContents.moderatedReports}: `,
          children: (this.numberOfModeratedReports = document.createTextNode(
            "0",
          )),
        }),
      ],
    ]);
  }

  RenderStopButton() {
    this.stopButtonContainer = Flex({
      grow: true,
      marginLeft: "m",
      justifyContent: "flex-end",
      alignItems: "center",
      children: (this.stopButton = new Button({
        size: "medium",
        type: "solid-peach",
        text: System.data.locale.common.stop,
      })),
    });
  }

  RenderSpinner() {
    this.spinnerContainer = Flex({
      marginLeft: "xs",
      children: Spinner({
        size: "xsmall",
      }),
    });
  }

  RenderExportButton() {
    this.exportButtonContainer = Build(
      Flex({
        marginRight: "xs",
        alignItems: "center",
      }),
      [
        [
          (this.exportButton = Text({
            tag: "a",
            href: "",
            title: System.data.locale.core.massModerateReportedContents.exportToSpreadsheet.replace(
              "%{file_format}",
              this.main.main.exportSpreadsheetFile.extension,
            ),
          })),
          new Icon({
            size: 54,
            color: "mint",
            type: this.main.main.exportSpreadsheetFile.icon,
          }),
        ],
      ],
    );
  }

  BindListener() {
    this.stopButton.element.addEventListener(
      "click",
      this.main.StopModeration.bind(this.main),
    );
    this.exportButton.addEventListener(
      "click",
      this.main.ExportReports.bind(this.main),
    );
  }

  Show() {
    if (IsVisible(this.main.builderContainer)) {
      this.HideSpinner();
      this.ShowExportButton();
      this.stopButton.ChangeSize();
      this.container.ChangeMargin({
        margin: "m",
        marginLeft: "",
        marginRight: "",
      });
      this.main.preview.container.prepend(this.container);
    } else {
      this.ShowSpinner();
      this.HideExportButton();
      this.stopButton.ChangeSize("xsmall");
      this.container.ChangeMargin({
        margin: "xs",
        marginLeft: "m",
        marginRight: "m",
      });
      InsertBefore(this.container, this.main.collapseToggleButtonContainer);
    }
  }

  ShowStopButton() {
    this.container.append(this.stopButtonContainer);
  }

  HideStopButton() {
    this.main.main.HideElement(this.stopButtonContainer);
  }

  ShowSpinner() {
    if (!this.main.moderate.moderating) return;

    InsertBefore(this.spinnerContainer, this.stopButtonContainer);
  }

  HideSpinner() {
    this.main.main.HideElement(this.spinnerContainer);
  }

  ShowModeratedReportsText() {
    InsertAfter(
      this.moderatedReportsTextContainer,
      this.filteredReportsTextContainer,
    );
  }

  ShowExportButton() {
    if (
      this.main.filteredReports.length === 0 ||
      IsVisible(this.exportButtonContainer)
    )
      return;

    InsertBefore(this.exportButtonContainer, this.filteredReportsTextContainer);
  }

  HideExportButton() {
    this.main.main.HideElement(this.exportButtonContainer);
  }
}
