import WaitForElement from "../../helpers/WaitForElement";
import QuickDeleteButtons from "../1-Home/_/QuickDeleteButtons";
import WaitForObject from "../../helpers/WaitForObject";

System.pageLoaded("Supervisors page OK!");

window.selectors = {
	questionLink: "> div > a"
}

class QuestionSearch {
	constructor() {
		this.Init();
	}
	async Init() {
		try {
			if (System.checkUserP(1) && System.checkBrainlyP(102)) {
				let _$_observe = await WaitForObject("$().observe");

				if (_$_observe) {
					this.searchResults = await WaitForElement(".js-react-search-results");

					if (this.searchResults && this.searchResults.length > 0) {
						this.ObserveResults();
					}
				}
			}
		} catch (error) {
			console.error(error);
		}
	}
	ObserveResults() {
		$(this.searchResults).observe('childlist', '.sg-layout__box', this.PrepareQuestionBoxes.bind(this));
	}
	PrepareQuestionBoxes(event) {
		if (event.addedNodes && event.addedNodes.length > 0) {
			let $questions = $(`[data-test="search-stream-wrapper"] > .sg-content-box.sg-content-box--spaced-top-large`, event.addedNodes);

			if ($questions.length > 0) {
				event.addedNodes[0].classList.add("quickDelete");

				$questions.each((i, $question) => new QuickDeleteButtons($question))
			}
		}
	}
}

new QuestionSearch();
