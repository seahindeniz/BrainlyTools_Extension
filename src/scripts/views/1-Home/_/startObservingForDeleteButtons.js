import WaitForElement from "../../../helpers/WaitForElement";
import createQuestionRemoveButtons from "./createQuestionRemoveButtons";

export default async function startObservingForDeleteButtons(feeds_parent){

	$(feeds_parent).observe('added', selectors.feed_item + ':not(.ext-buttons-added)', e => {
		createQuestionRemoveButtons(e.addedNodes);
	});

	let feed_item = await WaitForElement(`${selectors.feed_item}:not(.ext-buttons-added)`, true);

	if (feed_item) {
		createQuestionRemoveButtons(feed_item);
	}
}