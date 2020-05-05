import GetAbsoluteHeight from "@/scripts/helpers/GetAbsoluteHeight";
import IsVisible from "@/scripts/helpers/IsVisible";
import {
  Button,
  ContentBoxActions,
  ContentBoxContent,
  Flex,
} from "@style-guide";

const REPORT_PREVIEW_LIMIT = 100;

export default class PreviewSection {
  /**
   * @param {import("..").default} main
   */
  constructor(main) {
    this.main = main;

    this.Render();
    this.RenderReportsContainer();
  }

  Render() {
    this.container = Flex({
      grow: true,
      marginLeft: "l",
      direction: "column",
    });
  }

  RenderReportsContainer() {
    this.reportsContainer = ContentBoxContent();
    this.reportsContainer.style.overflowY = "auto";
  }

  ShowContainer() {
    if (IsVisible(this.container)) return;

    this.main.builderContainer.append(this.container);
  }

  HideContainer() {
    if (!IsVisible(this.container)) return;

    this.main.main.HideElement(this.container);
  }

  /**
   * @param {boolean} [increase]
   */
  ShowReports(increase) {
    this.HideMoreButton();

    if (this.main.filteredReports.length === 0) return;

    let increaseBy = 0;

    if (increase)
      increaseBy = Math.trunc(
        this.reportsContainer.childElementCount / REPORT_PREVIEW_LIMIT,
      );

    let reportIndex = REPORT_PREVIEW_LIMIT * increaseBy;

    for (
      ;
      reportIndex < REPORT_PREVIEW_LIMIT * (1 + increaseBy);
      reportIndex++
    ) {
      let report = this.main.filteredReports[reportIndex];

      if (!report) break;

      if (report.container) this.reportsContainer.append(report.container);

      report = null;
    }

    if (this.main.filteredReports.length > reportIndex) this.ShowMoreButton();

    this.ResizeReportsContainerHeight();
    this.ShowReportsContainer();
  }

  ShowReportsContainer() {
    if (IsVisible(this.reportsContainer)) return;

    this.container.append(this.reportsContainer);
  }

  HideReportsContainer() {
    this.main.main.HideElement(this.reportsContainer);
  }

  ResizeReportsContainerHeight() {
    const containerHeight = GetAbsoluteHeight(this.reportsContainer);
    const targetHeight =
      GetAbsoluteHeight(this.main.filtersContainer.parentElement) +
      GetAbsoluteHeight(this.main.moderate.container) -
      GetAbsoluteHeight(this.main.statusBar.container);

    if (containerHeight === targetHeight) return;

    this.reportsContainer.style.height = `${targetHeight}px`;
  }

  ShowMoreButton() {
    if (!this.moreButtonContainer) this.RenderMoreButton();
    else if (IsVisible(this.moreButtonContainer)) return;

    this.reportsContainer.append(this.moreButtonContainer);
  }

  HideMoreButton() {
    this.main.main.HideElement(this.moreButtonContainer);
  }

  RenderMoreButton() {
    this.moreButtonContainer = ContentBoxActions({
      align: "center",
      children: (this.moreButton = new Button({
        type: "solid-mint",
        text: "Show more..",
        size: "small",
      })),
    });

    this.moreButton.element.addEventListener("click", () => {
      const lastScrollPosition = this.reportsContainer.scrollTop;

      this.moreButton.Disable();
      this.ShowReports(true);
      this.moreButton.Enable();

      this.reportsContainer.scrollTop = lastScrollPosition;
    });
  }
}
