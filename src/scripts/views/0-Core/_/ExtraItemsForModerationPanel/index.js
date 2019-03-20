"use strict";

//import renderMessageSender from "./MessageSender"
import WaitForObject from "../../../../helpers/WaitForObject";
import MassQuestionDeleter from "./MassQuestionDeleter";
import NoticeBoard from "./NoticeBoard";
import PointChanger from "./PointChanger";
import ReportedCommentsDeleter from "./ReportedCommentsDeleter";
import ReportedContentsConfirmer from "./ReportedContentsConfirmer";
import renderUserFinder from "./UserFinder";

class ExtraItems {
	constructor() {
		this.RenderList();
		this.RenderToplayerContainer();
		this.RenderComponents();
		this.RenderComponentsAfterDeleteReasonsLoaded();
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
}

export default ExtraItems
