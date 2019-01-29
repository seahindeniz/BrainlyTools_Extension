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

		if (System.checkUserP(7)) {
			renderTaskDeleter($seperator);
		}

		if (true || System.checkUserP(0)) {
			/* console.log(new PointChanger());
			$seperator.before(new PointChanger()); */
		}

		/*System.checkUserP(9, () => {
			renderMessageSender($seperator);
		});*/
	}
}
