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
import Menu from "../../../../components/style-guide/List/Menu";

class ModerationPanel {
  constructor() {
    this.$statistics = $("#moderate-functions-panel > div.statistics");
    this.$newPanel = $(".brn-moderation-panel__list");
    this.$newPanelButton = $(".brn-moderation-panel__button");
    this.$oldPanel = $("#moderate-functions-panel > div.panel > div.content-scroll");
    this.$oldPanelCoveringText = $("#moderate-functions-panel > div.panel > div.covering-text");

    this.RenderList();
    this.RenderComponents();
    this.RenderComponentsAfterDeleteReasonsLoaded();
    this.RenderResizeTrackingElement();
    this.BindHandlers();
  }
  RenderList() {
    this.ul = Menu({
      size: "small",
      className: "sg-content-box--spaced-bottom"
    });

    let panel = document.querySelector(".brn-moderation-panel__list, #moderate-functions");

    if (panel)
      panel.prepend(this.ul);
  }
  RenderComponents() {
    this.RenderComponent({ li: renderUserFinder() });

    if (window.System.checkUserP(20) || window.System.data.Brainly.userData.extension.noticeBoard !== null)
      this.RenderComponent(new NoticeBoard());

    if (window.System.checkUserP(9))
      this.RenderComponent(new MassMessageSender());

    if (window.System.checkUserP(13) && window.System.checkBrainlyP(41))
      this.RenderComponent(new PointChanger());

    if (window.System.checkUserP(29)) {
      this.RenderComponent(new MassModerateContents());
    }

    if (window.System.checkUserP(18))
      this.RenderComponent(new MassModerateReportedContents());

    if (window.System.checkUserP([27, 30, 31, 32]))
      this.RenderComponent(new MassManageUsers());
  }
  async RenderComponentsAfterDeleteReasonsLoaded() {
    await WaitForObject("window.System.data.Brainly.deleteReasons.__withTitles.comment", { noError: true });

    if (window.System.checkUserP(17))
      this.RenderComponent(new ReportedCommentsDeleter());

    if (window.System.checkUserP(7))
      this.RenderComponent(new MassContentDeleter());

  }
  /**
   * @param {NoticeBoard | MassMessageSender | PointChanger | MassModerateContents | MassModerateReportedContents | MassManageUsers | ReportedCommentsDeleter | MassContentDeleter | {li: HTMLElement}} instance
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
      new window.ResizeObserver(this.FixPanelsHeight.bind(this)).observe(this.$resizeOverlay[0])
    } else {
      window.addEventListener('resize', this.FixPanelsHeight.bind(this))
    }
  }
  async DelayedHeightFix() {
    await window.System.Delay(15);
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
