"use strict";

let Seperator = () => {
	let $moderationPanel = $(".brn-moderation-panel__list > ul, #moderate-functions > ul");

	let $seperator;

	if ($moderationPanel.length > 0) {
		$seperator = $('<li class="seperator">&nbsp;</li>');

		$seperator.prependTo($moderationPanel);
	}

	console.log($seperator);
	return $seperator
}

export default Seperator;
