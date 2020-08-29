import HideElement from "@root/scripts/helpers/HideElement";
import { Button, Flex } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type FetcherClassType from "./Fetcher";

export default class FetchAll {
  main: FetcherClassType;
  container: FlexElementType;
  loadAllButton: Button;
  stopButton: Button;

  constructor(main: FetcherClassType) {
    this.main = main;

    this.Render();
  }

  Render() {
    this.container = Flex({
      margin: "xxs",
      marginTop: "m",
      children: this.loadAllButton = new Button({
        fullWidth: true,
        type: "outline",
        toggle: "mustard",
        children: System.data.locale.reportedContents.loadAll,
        onClick: this.LoadAllReports.bind(this),
      }),
    });

    this.main.container.append(this.container);
  }

  HideContainer() {
    HideElement(this.container);
  }

  LoadAllReports() {
    if (
      !confirm(System.data.locale.reportedContents.loadAllConfirmationMessage)
    )
      return;

    this.HideLoadAllButton();
    this.ShowStopButton();
    this.main.FetchReports({
      fetchOnly: true,
      keepFetching: true,
    });
  }

  ShowLoadAllButton() {
    this.container.append(this.loadAllButton.element);
  }

  HideLoadAllButton() {
    HideElement(this.loadAllButton.element);
  }

  ShowStopButton() {
    if (!this.stopButton) {
      this.RenderStopButton();
    }

    this.container.append(this.stopButton.element);

    this.container.style.zIndex = "1";
  }

  HideStopButton() {
    this.container.style.zIndex = "";

    HideElement(this.stopButton?.element);
  }

  RenderStopButton() {
    this.stopButton = new Button({
      fullWidth: true,
      type: "solid-peach",
      onClick: this.StopLoadingAllReports.bind(this),
      children: System.data.locale.common.stop,
    });
  }

  StopLoadingAllReports() {
    this.main.stopFetching = true;

    this.HideStopButton();
    this.ShowLoadAllButton();
  }
}
