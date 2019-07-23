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

class ModerationPanel {
  constructor() {
    this.$statictic = $("#moderate-functions-panel > div.statistics");
    this.$newpanel = $(".brn-moderation-panel__list");
    this.$newpanelButton = $(".brn-moderation-panel__button");
    this.$oldPanel = $("#moderate-functions-panel > div.panel > div.content-scroll");
    this.$oldPanelCoveringText = $("#moderate-functions-panel > div.panel > div.covering-text");

    this.RenderList();
    this.RenderComponents();
    this.RenderComponentsAfterDeleteReasonsLoaded();
    this.RenderResizeTrackingElement();
    this.BindHandlers();
  }
  RenderList() {
    this.$ul = $(`<ul class="sg-menu-list sg-menu-list--small sg-content-box--spaced-bottom"></ul>`);

    this.$ul.prependTo(".brn-moderation-panel__list, #moderate-functions");
  }
  RenderComponents() {
    this.RenderComponent({ $li: renderUserFinder() });

    if (System.checkUserP(20) || System.data.Brainly.userData.extension.noticeBoard !== null)
      this.RenderComponent(new NoticeBoard());

    if (System.checkUserP(9))
      this.RenderComponent(new MassMessageSender());

    if (System.checkUserP(13) && System.checkBrainlyP(41))
      this.RenderComponent(new PointChanger());

    if (System.checkUserP(29)) {
      //this.RenderComponent(new MassModerateContents());
    }

    if (System.checkUserP(18))
      this.RenderComponent(new MassModerateReportedContents());

    if (System.checkUserP([27, 30, 31, 32]))
      this.RenderComponent(new MassManageUsers());
  }
  async RenderComponentsAfterDeleteReasonsLoaded() {
    await WaitForObject("window.System.data.Brainly.deleteReasons.__withTitles.comment", { noError: true });

    if (System.checkUserP(17))
      this.RenderComponent(new ReportedCommentsDeleter());

    if (System.checkUserP(7))
      this.RenderComponent(new MassContentDeleter());

  }
  RenderComponent(instance) {
    instance.$li.appendTo(this.$ul);
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
    this.$newpanelButton.click(this.DelayedHeightFix.bind(this));
    this.$oldPanelCoveringText.click(this.DelayedHeightFix.bind(this));
    window.addEventListener("load", this.FixPanelsHeight.bind(this));
    window.addEventListener('scroll', this.FixPanelsHeight.bind(this))

    if ("ResizeObserver" in window) {
      new window.ResizeObserver(this.FixPanelsHeight.bind(this)).observe(this.$resizeOverlay[0])
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
    if (this.$newpanel.length > 0) {
      let height = window.innerHeight - 226;

      if (this.$newpanel[0].scrollHeight < height)
        height = this.$newpanel[0].scrollHeight;

      this.$newpanel.css("cssText", `height: ${height}px`);
    }
  }
  FixOldPanelsHeight() {
    if (this.$oldPanel.length > 0) {
      let height = window.innerHeight - 115;

      if (this.$statictic.is(":visible"))
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
