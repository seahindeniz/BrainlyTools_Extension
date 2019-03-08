"use strict";

import renderModerationPanelSeperator from "../../../../components/ModerationPanelSeperator";
//import renderMessageSender from "./MessageSender"
import WaitForObject from "../../../../helpers/WaitForObject";
import PointChanger from "./PointChanger";
import ReportedCommentsDeleter from "./ReportedCommentsDeleter";
import ReportedContentsConfirmer from "./ReportedContentsConfirmer";
import MassQuestionDeleter from "./MassQuestionDeleter";
import renderUserFinder from "./UserFinder";

export default async () => {
	let $seperator = renderModerationPanelSeperator();

	if ($seperator && $seperator.length > 0) {
		LoadItems($seperator);
		await WaitForObject("window.System.data.Brainly.deleteReasons.__withTitles.comment", { noError: true });
		LoadItemsAfterDeleteReasonsLoaded($seperator);
	}
}

function IsCurrentPageNotLegacy($seperator) {
	return $seperator.parents(".brn-moderation-panel__list").length > 0
}

function LoadItems($seperator) {
	RenderToplayerContainer();
	renderUserFinder($seperator);
	/* if (System.checkUserP(9)) {
		renderMessageSender($seperator);
	} */
	if (IsCurrentPageNotLegacy($seperator)) {
		if (System.checkUserP(13) && System.checkBrainlyP(41)) {
			$seperator.before(new PointChanger().$li);
		}

		if (System.checkUserP(18)) {
			$seperator.before(new ReportedContentsConfirmer().$li);
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

function LoadItemsAfterDeleteReasonsLoaded($seperator) {
	if (System.checkUserP(17)) {
		$seperator.before(new ReportedCommentsDeleter().$li);
	}

	if (IsCurrentPageNotLegacy($seperator)) {
		if (System.checkUserP(7)) {
			$seperator.before(new MassQuestionDeleter().$li);
		}
	}
}
