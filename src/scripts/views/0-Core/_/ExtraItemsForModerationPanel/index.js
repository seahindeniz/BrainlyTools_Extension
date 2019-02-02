"use strict";

import renderModerationPanelSeperator from "../../../../components/ModerationPanelSeperator";
import renderUserFinder from "./UserFinder";
import renderTaskDeleter from "./TaskDeleter"
import PointChanger from "./PointChanger"
//import renderMessageSender from "./MessageSender"

export default () => {
	let $seperator = renderModerationPanelSeperator();

	if ($seperator && $seperator.length > 0) {
		renderUserFinder($seperator);

		if ($seperator.parents(".brn-moderation-panel__list").length > 0) {
			if (System.checkUserP(7)) {
				renderTaskDeleter($seperator);
			}

			if (System.checkUserP(13)) {
				$seperator.before(new PointChanger());
			}
		}

		/*System.checkUserP(9, () => {
			renderMessageSender($seperator);
		});*/
	}
}
