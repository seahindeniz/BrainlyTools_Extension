"use strict";

import renderModerationPanelSeperator from "../../components/ModerationPanelSeperator";
import renderUserFinder from "../../components/UserFinder";
import renderTaskDeleter from "./TaskDeleter"
import renderMessageSender from "./MessageSender"

export default ()=>{
	let $seperator = renderModerationPanelSeperator();

	if ($seperator && $seperator.length > 0) {
		renderUserFinder($seperator);
		
		System.checkUserP(7, () => {
			renderTaskDeleter($seperator);
		});
		/*System.checkUserP(9, () => {
			renderMessageSender($seperator);
		});*/
	}
}