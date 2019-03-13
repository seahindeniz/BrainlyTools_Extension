"use strict";

let Seperator = () => {
	let $moderationPanel = $(".brn-moderation-panel__list > ul, #moderate-functions > ul");

	let $seperator = null;

	if ($moderationPanel.length > 0) {
		$seperator = $('<li class="seperator">&nbsp;</li>');

		$seperator.prependTo($moderationPanel);
	}

	return $seperator
}

export default Seperator;
