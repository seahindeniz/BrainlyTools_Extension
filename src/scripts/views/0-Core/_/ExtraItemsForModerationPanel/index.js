"use strict";

import renderModerationPanelSeperator from "../../../../components/ModerationPanelSeperator";
import renderUserFinder from "./UserFinder";
import renderTaskDeleter from "./TaskDeleter"
import PointChanger from "./PointChanger"
import ReportedCommentsDeleter from "./ReportedCommentsDeleter";
import ReportedContentsConfirmer from "./ReportedContentsConfirmer";
//import renderMessageSender from "./MessageSender"
import WaitForObject from "../../../../helpers/WaitForObject";

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
	renderUserFinder($seperator);
	/* if (System.checkUserP(9)) {
		renderMessageSender($seperator);
	} */
	if (IsCurrentPageNotLegacy($seperator)) {
		if (System.checkUserP(7)) {
			renderTaskDeleter($seperator);
		}

		if (System.checkUserP(13)) {
			$seperator.before(new PointChanger());
		}

		if (System.checkUserP(18)) {
			$seperator.before(new ReportedContentsConfirmer());
		}
	}
}

function LoadItemsAfterDeleteReasonsLoaded($seperator) {
	if (System.checkUserP(17)) {
		$seperator.before(new ReportedCommentsDeleter());
	}
}
