"use strict";

//import renderMessageSender from "./MessageSender"
import WaitForObject from "../../../../helpers/WaitForObject";
import MassQuestionDeleter from "./MassQuestionDeleter";
import NoticeBoard from "./NoticeBoard";
import PointChanger from "./PointChanger";
import ReportedCommentsDeleter from "./ReportedCommentsDeleter";
import ReportedContentsConfirmer from "./ReportedContentsConfirmer";
import renderUserFinder from "./UserFinder";

class ModerationPanel {
	constructor() {
		this.$statictic = $("#moderate-functions-panel > div.statistics");
		this.$newpanel = $(".brn-moderation-panel__list");
		this.$newpanelButton = $(".brn-moderation-panel__button");
		this.$oldPanel = $("#moderate-functions-panel > div.panel > div.content-scroll");
		this.$oldPanelCoveringText = $("#moderate-functions-panel > div.panel > div.covering-text");

		this.RenderList();
		this.RenderToplayerContainer();
		this.RenderComponents();
		this.RenderComponentsAfterDeleteReasonsLoaded();
		this.RenderResizeTrackingElement();
		this.BindEvents();
		this.FixOldPanelsHeight();
	}
	RenderList() {
		this.$ul = $(`<ul class="sg-menu-list sg-menu-list--small sg-content-box--spaced-bottom"></ul>`);

		this.$ul.prependTo(".brn-moderation-panel__list, #moderate-functions");
	}
	RenderToplayerContainer() {
		let $toplayerContainer = $("body div.js-toplayers-container");

		if ($toplayerContainer.length == 0) {
			$toplayerContainer = $(`<div class="js-toplayers-container"></div>`);

			$toplayerContainer.appendTo("body");
		}
	}
	RenderComponents() {
		this.RenderComponent(renderUserFinder());

		if (System.checkUserP(20) || System.data.Brainly.userData.extension.noticeBoard !== null) {
			this.RenderComponent(new NoticeBoard().$li);
		}
		/* if (System.checkUserP(9)) {
			renderMessageSender($seperator);
		} */
		if (System.checkUserP(13) && System.checkBrainlyP(41)) {
			this.RenderComponent(new PointChanger().$li);
		}

		if (System.checkUserP(18)) {
			this.RenderComponent(new ReportedContentsConfirmer().$li);
		}
	}
	async RenderComponentsAfterDeleteReasonsLoaded() {
		await WaitForObject("window.System.data.Brainly.deleteReasons.__withTitles.comment", { noError: true });

		if (System.checkUserP(17)) {
			this.RenderComponent(new ReportedCommentsDeleter().$li);
		}

		if (System.checkUserP(7)) {
			this.RenderComponent(new MassQuestionDeleter().$li);
		}
	}
	RenderComponent($element) {
		$element.appendTo(this.$ul);
	}
	RenderResizeTrackingElement() {
		this.$resizeOverlay = $(`
		<div class="resizeOverlay">
			<style></style>
		</div>`);

		this.$resizeStyle = $("style", this.$resizeOverlay);
		this.$resizeOverlay.appendTo(document.body);
	}
	BindEvents() {
		this.$newpanelButton.click(this.DelayedHeightFix.bind(this));
		this.$oldPanelCoveringText.click(this.DelayedHeightFix.bind(this));
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
