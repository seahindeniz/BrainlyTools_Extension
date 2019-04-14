import WaitForElement from "../../helpers/WaitForElement";
import WaitForObject from "../../helpers/WaitForObject";
import ModerateSection from "./_/ModerateSection";
import QuestionBox from "./_/QuestionBox";

System.pageLoaded("Question search page OK!");

window.selectors = {
	questionLink: "> div > a"
}

class QuestionSearch {
	constructor() {
		this.questionBoxs = {};

		this.Init();
	}
	async Init() {
		try {
			if (System.checkUserP([1, 14]) && System.checkBrainlyP(102)) {
				let _$_observe = await WaitForObject("$().observe");

				if (_$_observe) {
					this.searchResults = await WaitForElement(".js-react-search-results");

					if (this.searchResults && this.searchResults.length > 0) {
						this.ObserveResults();

						let questionBoxContainer = await WaitForElement(".sg-layout__box");

						this.PrepareQuestionBoxes(questionBoxContainer[0]);
					}
				}
			}
		} catch (error) {
			console.error(error);
		}
	}
	ObserveResults() {
		$(this.searchResults).observe('childlist', ".sg-layout__box", event => {
			if (event.addedNodes && event.addedNodes.length > 0) {
				this.PrepareQuestionBoxes(event.addedNodes[0]);
			}
		});
	}
	/**
	 * @param {HTMLElement} element
	 */
	PrepareQuestionBoxes(element) {
		let $questions = $(`[data-test="search-stream-wrapper"] > .sg-content-box.sg-content-box--spaced-top-large`, element);

		if ($questions.length > 0 && !element.classList.contains("quickDelete")) {
			this.element = element;

			element.classList.add("quickDelete");

			if (System.checkUserP(14))
				this.moderateSection = new ModerateSection(this);

			$questions.each((i, $question) => this.InitQuestionBox($question));
		}
	}
	InitQuestionBox($question) {
		let $seeAnswerLink = $(".sg-content-box__actions > .sg-actions-list a", $question);
		let id = System.ExtractId($seeAnswerLink.attr("href"));
		/**
		 * @type {QuestionBox}
		 */
		let questionBox = this.questionBoxs[id];

		if (!questionBox)
			this.questionBoxs[id] = new QuestionBox($question, id);
		else {
			questionBox.$ = $question;

      questionBox.RenderQuestionOwner();
      questionBox.ShowSelectbox();
			questionBox.ShowQuickDeleteButtons();
		}
	}
}

new QuestionSearch();
