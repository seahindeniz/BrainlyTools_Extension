import WaitForObject from "../../../../helpers/WaitForObject";
import MassContentDeleter from "./MassContentDeleter";
import MassManageUsers from "./MassManageUsers";
import MassMessageSender from "./MassMessageSender";
import MassModerateContents from "./MassModerateContents";
import MassModerateReportedContents from "./MassModerateReportedContents";
import NoticeBoard from "./NoticeBoard";
import PointChanger from "./PointChanger";
import ReportedCommentsDeleter from "./ReportedCommentsDeleter";
import renderUserFinder from "./UserFinder";
import { MenuList } from "@style-guide";

const SELECTOR = {
  STATISTICS: "#moderate-functions-panel > div.statistics",
  NEW_PANEL: ".brn-moderation-panel__list",
  NEW_PANEL_BUTTON: ".brn-moderation-panel__button",
  OLD_PANEL: "#moderate-functions-panel > div.panel > div.content-scroll",
  OLD_PANEL_COVERING_TEXT: `
  #moderate-functions-panel > div.panel > div.covering-text`,
  PANELS: ".brn-moderation-panel__list, #moderate-functions",
}

class ModerationPanel {
  constructor() {
    this.$statistics = $(SELECTOR.STATISTICS);
    this.$newPanel = $(SELECTOR.NEW_PANEL);
    this.$newPanelButton = $(SELECTOR.NEW_PANEL_BUTTON);
    this.$oldPanel = $(SELECTOR.OLD_PANEL);
    this.$oldPanelCoveringText = $(SELECTOR.OLD_PANEL_COVERING_TEXT);

    this.RenderList();
    this.RenderComponents();
    this.RenderComponentsAfterDeleteReasonsLoaded();
    this.RenderResizeTrackingElement();
    this.BindHandlers();
  }
  RenderList() {
    this.ul = MenuList({
      size: "small",
      className: "sg-content-box--spaced-bottom"
    });

    let panel = document.querySelector(SELECTOR.PANELS);

    if (panel)
      panel.prepend(this.ul);
  }
  RenderComponents() {
    this.RenderComponent({ li: renderUserFinder() });

    if (
      System.checkUserP(20) ||
      System.data.Brainly.userData.extension.noticeBoard !== null
    )
      this.RenderComponent(new NoticeBoard());

    if (System.checkUserP(9))
      this.RenderComponent(new MassMessageSender());

    if (System.checkUserP(13) && System.checkBrainlyP(41))
      this.RenderComponent(new PointChanger());

    if (System.checkUserP([27, 30, 31, 32]))
      this.RenderComponent(new MassManageUsers());
  }
  async RenderComponentsAfterDeleteReasonsLoaded() {
    await WaitForObject(
      "System.data.Brainly.deleteReasons.__withTitles.comment", {
        noError: true
      }
    );

    if (System.checkUserP(17))
      this.RenderComponent(new ReportedCommentsDeleter());

    if (System.checkUserP(7))
      this.RenderComponent(new MassContentDeleter());

    if (System.checkUserP(29)) {
      this.RenderComponent(new MassModerateContents());
    }

    if (System.checkUserP(18))
      this.RenderComponent(new MassModerateReportedContents());
  }
  /**
   * @param { NoticeBoard |
   * MassMessageSender |
   * PointChanger |
   * MassModerateContents |
   * MassModerateReportedContents |
   * MassManageUsers |
   * ReportedCommentsDeleter |
   * MassContentDeleter |
   * {li: HTMLElement} } instance
   */
  RenderComponent(instance) {
    if (instance.li)
      this.ul.append(instance.li);
  }
  RenderResizeTrackingElement() {
    this.$resizeOverlay = $(`
		<div class="resizeOverlay">
			<style></style>
		</div>`);

    this.$resizeStyle = $("style", this.$resizeOverlay);
    this.$resizeOverlay.appendTo(document.body);
  }
  BindHandlers() {
    this.$newPanelButton.click(this.DelayedHeightFix.bind(this));
    this.$oldPanelCoveringText.click(this.DelayedHeightFix.bind(this));
    window.addEventListener("load", this.FixPanelsHeight.bind(this));
    window.addEventListener('scroll', this.FixPanelsHeight.bind(this))

    if ("ResizeObserver" in window) {
      // @ts-ignore
      new window.ResizeObserver(this.FixPanelsHeight.bind(this))
        .observe(this.$resizeOverlay[0])
    } else {
      window.addEventListener('resize', this.FixPanelsHeight.bind(this))
    }
  }
  async DelayedHeightFix() {
    await System.Delay(15);
    this.FixPanelsHeight();
  }
  FixPanelsHeight() {
    this.FixNewPanelsHeight();
    this.FixOldPanelsHeight();
  }
  FixNewPanelsHeight() {
    if (this.$newPanel.length > 0) {
      let height = window.innerHeight - 226;

      if (this.$newPanel[0].scrollHeight < height)
        height = this.$newPanel[0].scrollHeight;

      this.$newPanel.css("cssText", `height: ${height}px`);
    }
  }
  FixOldPanelsHeight() {
    if (this.$oldPanel.length > 0) {
      let height = window.innerHeight - 115;

      if (this.$statistics.is(":visible"))
        height -= 160;

      if (this.$oldPanel[0].scrollHeight < height)
        height = this.$oldPanel[0].scrollHeight;

      this.$resizeStyle.html(`
#html .mint .panel .covering-text,
#html .mint .panel .content-scroll {
	height: ${height}px !important;
}`);
    }
  }
}

export default ModerationPanel
