import WaitForElement from "@root/scripts/helpers/WaitForElement";
import ModerateSection from "./_/ModerateSection";
import QuestionBox from "./_/QuestionBox";

System.pageLoaded("Question search page OK!");

export default class QuestionSearch {
  questionBoxList: {
    [x: number]: QuestionBox;
  };

  moderateSection: ModerateSection;

  searchResults: HTMLElement;
  element: HTMLElement;

  constructor() {
    this.questionBoxList = {};

    this.Init();

    if (System.checkUserP([14, 26]))
      this.moderateSection = new ModerateSection(this);
  }

  async Init() {
    try {
      if (System.checkUserP([1, 14, 26]) && System.checkBrainlyP(102)) {
        this.searchResults = await WaitForElement(".js-react-search-results");

        if (!this.searchResults) return;

        this.ObserveResults();

        const questionBoxContainer = await WaitForElement(".sg-layout__box");

        this.PrepareQuestionBoxes(questionBoxContainer);
      }
    } catch (error) {
      console.error(error);
    }
  }

  ObserveResults() {
    const observer = new MutationObserver(mutationsList => {
      mutationsList.forEach(mutation => {
        if (
          mutation.type === "childList" &&
          mutation.addedNodes &&
          mutation.addedNodes.length > 0
        ) {
          const nodes = Array.from(mutation.addedNodes) as HTMLElement[];
          const layoutBox = nodes.find(box => {
            if (
              !box ||
              !box.classList.contains("sg-layout__box") ||
              box.classList.contains("quickDelete")
            )
              return undefined;

            const animationBox = Array.from(box.children).find(child =>
              child.classList.contains("brn-placeholder__animation-box"),
            );

            return !animationBox;
          });

          if (layoutBox) this.PrepareQuestionBoxes(layoutBox);
        }
      });
    });

    const config = { attributes: false, childList: true, subtree: false };
    observer.observe(this.searchResults, config);
  }

  PrepareQuestionBoxes(element: HTMLElement) {
    const $questions = $(
      `[data-test="search-stream-wrapper"] > .sg-content-box.sg-content-box--spaced-top-large`,
      element,
    );

    if ($questions.length === 0 || element.classList.contains("quickDelete"))
      return;

    this.element = element;

    element.classList.add("quickDelete");
    this.moderateSection.Show();

    $questions.each((_, $question) => this.InitQuestionBox($question));
  }

  InitQuestionBox(question: HTMLElement) {
    const $seeAnswerLink = $(
      ".sg-content-box__actions > .sg-actions-list a",
      question,
    );
    const id = System.ExtractId($seeAnswerLink.attr("href"));
    let questionBox: QuestionBox = this.questionBoxList[id];

    if (!questionBox) {
      questionBox = new QuestionBox(this, question, id);
      this.questionBoxList[id] = questionBox;
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
