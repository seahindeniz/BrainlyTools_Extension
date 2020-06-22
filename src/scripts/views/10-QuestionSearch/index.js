import WaitForElements from "../../helpers/WaitForElements";
import ModerateSection from "./_/ModerateSection";
import QuestionBox from "./_/QuestionBox";

System.pageLoaded("Question search page OK!");

export default class QuestionSearch {
  constructor() {
    /**
     * @type {Object<number, QuestionBox>}
     */
    this.questionBoxList = {};

    this.Init();

    if (System.checkUserP([14, 26]))
      this.moderateSection = new ModerateSection(this);
  }

  async Init() {
    try {
      if (System.checkUserP([1, 14, 26]) && System.checkBrainlyP(102)) {
        this.searchResults = await WaitForElements(".js-react-search-results");

        if (this.searchResults && this.searchResults.length > 0) {
          this.searchResults = this.searchResults[0];
          this.ObserveResults();

          const questionBoxContainer = await WaitForElements(".sg-layout__box");

          this.PrepareQuestionBoxes(questionBoxContainer[0]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  ObserveResults() {
    const observer = new MutationObserver(mutationsList => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "childList" &&
          mutation.addedNodes &&
          mutation.addedNodes.length > 0
        ) {
          /**
           * @type {HTMLElement[]}
           */
          // @ts-ignore
          const elements = Array.from(mutation.addedNodes);
          const layout__box = elements.find(box => {
            if (
              box &&
              box.classList.contains("sg-layout__box") &&
              !box.classList.contains("quickDelete")
            ) {
              const animationBox = Array.from(box.children).find(child =>
                child.classList.contains("brn-placeholder__animation-box"),
              );

              return !animationBox;
            }
          });

          if (layout__box) this.PrepareQuestionBoxes(layout__box);
        }
      }
    });

    const config = { attributes: false, childList: true, subtree: false };
    observer.observe(this.searchResults, config);
  }

  /**
   * @param {HTMLElement} element
   */
  PrepareQuestionBoxes(element) {
    const $questions = $(
      `[data-test="search-stream-wrapper"] > .sg-content-box.sg-content-box--spaced-top-large`,
      element,
    );

    if ($questions.length > 0 && !element.classList.contains("quickDelete")) {
      this.element = element;

      element.classList.add("quickDelete");
      this.moderateSection.Show();

      $questions.each((i, $question) => this.InitQuestionBox($question));
    }
  }

  /**
   * @param {HTMLElement} question
   */
  InitQuestionBox(question) {
    const $seeAnswerLink = $(
      ".sg-content-box__actions > .sg-actions-list a",
      question,
    );
    const id = System.ExtractId($seeAnswerLink.attr("href"));
    /**
     * @type {QuestionBox}
     */
    let questionBox = this.questionBoxList[id];

    if (!questionBox) {
      questionBox = this.questionBoxList[id] = new QuestionBox(
        this,
        question,
        id,
      );
      questionBox.checkBox.dispatchEvent(new Event("change"));
    } else {
      questionBox.$ = $(question);

      questionBox.RenderQuestionOwner();
      questionBox.ShowSelectBox();
      questionBox.ShowQuickDeleteButtons();
      questionBox.CheckIsDeleted();
    }
  }
}

// eslint-disable-next-line no-new
new QuestionSearch();
