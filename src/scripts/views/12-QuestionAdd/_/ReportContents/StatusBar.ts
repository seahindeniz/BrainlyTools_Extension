import { Breadcrumb } from "@components";
import Build from "@root/helpers/Build";
import { Button, Flex, Icon, Text, Text as TextComponent } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import tippy from "tippy.js";
import ExportToSpreadsheet from "./Queue/ExportToSpreadsheet/ExportToSpreadsheet";
import type ReportedContentsClassType from "./ReportedContents";

export default class ReportedContentsStatusBar {
  main: ReportedContentsClassType;

  container: FlexElementType;
  #exportButton: Button;
  #list: Breadcrumb;
  visibleContentsCount: Text;
  fetchedContentsCount: Text;
  filteredContentsCount: Text;
  moderatedContentsCount: Text;
  numberOfModeratedContents: number;
  numberOfFailedContents: number;
  failedContentsCount: Text;

  constructor(main: ReportedContentsClassType) {
    this.main = main;
    this.numberOfModeratedContents = 0;
    this.numberOfFailedContents = 0;

    this.RenderExportButton();
    this.Render();
  }

  private RenderExportButton() {
    this.#exportButton = new Button({
      type: "transparent",
      iconOnly: true,
      icon: new Icon({
        color: "mint",
        type: "ext-sheet",
      }),
      onClick: this.ExportToSpreadsheet.bind(this),
    });

    tippy(this.#exportButton.element, {
      theme: "light",
      content: Text({
        size: "small",
        weight: "bold",
        children:
          System.data.locale.reportedContents.queue.exportReports
            .exportAsSpreadsheet,
      }),
    });
  }

  private ExportToSpreadsheet() {
    const instance = new ExportToSpreadsheet(this);

    instance.ExportReports();
  }

  private Render() {
    this.container = Build(
      Flex({
        alignItems: "center",
        direction: "row-reverse",
      }),
      [
        [Flex(), this.#exportButton],
        (this.#list = new Breadcrumb({
          padding: "m",
          reverse: true,
        })),
      ],
    );

    this.fetchedContentsCount = this.RenderStatus("fetched");
    this.filteredContentsCount = this.RenderStatus("filtered");
    this.visibleContentsCount = this.RenderStatus("visible");

    this.main.actionsContainerLeftSide.append(this.container);
  }

  private RenderStatus(name: string) {
    const textNode = document.createTextNode("0");
    const textPieces: (
      | string
      | Text
    )[] = System.data.locale.reportedContents.massModerate.status[name].split(
      "%{count}",
    );

    textPieces.splice(1, 0, textNode);

    const status = TextComponent({
      tag: "span",
      size: "small",
      weight: "bold",
      children: textPieces,
    });

    this.#list.RenderChildren(status);

    return textNode;
  }

  UpdateFilteredNumber() {
    this.filteredContentsCount.nodeValue = String(
      this.main.contents.filtered.length,
    );
  }

  ShowCountOfModeration() {
    if (this.moderatedContentsCount) return;

    this.moderatedContentsCount = this.RenderStatus("moderated");
    this.failedContentsCount = this.RenderStatus("failed");
  }

  IncreaseNumberOfModeration() {
    this.moderatedContentsCount.nodeValue = String(
      ++this.numberOfModeratedContents,
    );
  }

  IncreaseNumberOfFailed() {
    this.failedContentsCount.nodeValue = String(++this.numberOfFailedContents);
  }

  ResetModerationCounters() {
    if (this.moderatedContentsCount && this.failedContentsCount) {
      this.moderatedContentsCount.nodeValue = "0";
      this.failedContentsCount.nodeValue = "0";
    }

    this.numberOfModeratedContents = 0;
    this.numberOfFailedContents = 0;
  }
}
