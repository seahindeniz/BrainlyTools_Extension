"use strict";

import renderModerationPanelSeperator from "../../../../components/ModerationPanelSeperator";
//import renderMessageSender from "./MessageSender"
import WaitForObject from "../../../../helpers/WaitForObject";
import MassQuestionDeleter from "./MassQuestionDeleter";
import PointChanger from "./PointChanger";
import ReportedCommentsDeleter from "./ReportedCommentsDeleter";
import ReportedContentsConfirmer from "./ReportedContentsConfirmer";
import renderUserFinder from "./UserFinder";
import NoticeBoard from "./NoticeBoard";
let $seperator;

export default async () => {
	$seperator = renderModerationPanelSeperator();

	if ($seperator && $seperator.length > 0) {
		LoadItems();
		await WaitForObject("window.System.data.Brainly.deleteReasons.__withTitles.comment", { noError: true });
		LoadItemsAfterDeleteReasonsLoaded();
	}
}

function IsCurrentPageNotLegacy() {
	return $seperator.parents(".brn-moderation-panel__list").length > 0
}

function RenderItem($element) {
	$seperator.before($element);
}

function LoadItems() {
	RenderToplayerContainer();
	renderUserFinder($seperator);

	if (System.checkUserP(20) || System.data.Brainly.userData.extension.noticeBoard !== null) {
		RenderItem(new NoticeBoard().$li);
	}
	/* if (System.checkUserP(9)) {
		renderMessageSender($seperator);
	} */
	if (IsCurrentPageNotLegacy()) {
		if (System.checkUserP(13) && System.checkBrainlyP(41)) {
			RenderItem(new PointChanger().$li);
		}

		if (System.checkUserP(18)) {
			RenderItem(new ReportedContentsConfirmer().$li);
		}
	}
}

function RenderToplayerContainer() {
	let $toplayerContainer = $("body div.js-toplayers-container");

	if ($toplayerContainer.length == 0) {
		$toplayerContainer = $(`<div class="js-toplayers-container"></div>`);

		$toplayerContainer.appendTo("body");
	}
}

function LoadItemsAfterDeleteReasonsLoaded() {
	if (System.checkUserP(17)) {
		RenderItem(new ReportedCommentsDeleter().$li);
	}

	if (IsCurrentPageNotLegacy()) {
		if (System.checkUserP(7)) {
			RenderItem(new MassQuestionDeleter().$li);
		}
	}
}
