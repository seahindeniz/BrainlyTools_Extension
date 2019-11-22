import Build from "@/scripts/helpers/Build";
import ServerReq from "@ServerReq";
import { Box, Flex, Spinner, SpinnerContainer, Text } from "@style-guide";

export default class KeywordList {
  constructor() {
    /**
     * @type {HTMLDivElement}
     */
    this.answeringLayer;
    /**
     * @type {string[]}
     */
    this.keywords = [];

    this.ObserveAnswerPanel();
  }
  ObserveAnswerPanel() {
    let observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.target instanceof HTMLDivElement) {
          if (
            mutation.addedNodes &&
            mutation.addedNodes.length == 0 &&
            mutation.target.classList.contains(
              "brn-answering-layer__editor")
          ) {
            this.answeringLayer = document.querySelector(
              ".brn-answering-layer");

            this.ShowContainer();
            this.DesktopView();
          } else if (
            mutation.target.classList.contains(
              "js-react-add-answer-editor") &&
            mutation.addedNodes &&
            mutation.addedNodes.length == 1 &&
            mutation.addedNodes[0] instanceof HTMLDivElement &&
            mutation.addedNodes[0].classList.contains(
              "sg-content-box")
          ) {
            this.answeringLayer = mutation.target;

            this.ShowContainer();
            this.MobileView();
          } else if (
            mutation.addedNodes &&
            mutation.addedNodes.length > 0
          )
            mutation.addedNodes.forEach(node => {
              if (
                node instanceof HTMLDivElement &&
                node != this.container
              ) {
                this.answeringLayer = undefined;

                if (node.classList.contains(
                    "brn-answering-layer"))
                  this.answeringLayer = node;

                if (this.answeringLayer) {
                  this.ShowContainer();
                  this.DesktopView();
                }
              }
            });

        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
  ShowContainer() {
    if (this.answeringLayer) {
      if (!this.container) {
        this.Render();
        this.RenderKeywordList();
        this.FetchKeywords();
      }

      this.answeringLayer.append(this.container);
    }
  }
  Render() {
    let box;
    this.container = Flex({
      fullWidth: true,
      marginBottom: "xxs",
      children: SpinnerContainer({
        fullWidth: true,
        children: box = Box({
          padding: "xxsmall",
          color: "dark",
          full: true,
          noMinHeight: true,
          noBorderRadius: true,
          children: this.spinner = Spinner({
            overlay: true,
            size: "xsmall",
          })
        })
      })
    });
    this.boxHole = box.firstChild;
  }
  RenderKeywordList() {
    this.keywordListContainer = Build(Flex({
      justifyContent: "center",
    }), [
      [
        Flex({}),
        Box({
          noMinHeight: true,
          padding: "no",
          color: "dark",
          children: Text({
            html: `${System.data.locale.question.keywords}:`,
            size: "small",
          }),
        })
      ]
    ]);
  }
  async FetchKeywords() {
    let questionId = System.ExtractId(location.pathname);
    let resKeywords = await new ServerReq()
      .GetKeywordsForFreelancer(questionId);

    if (resKeywords.success)
      this.keywords = resKeywords.data;

    this.RenderKeywords();
  }
  RenderKeywords() {
    if (this.keywords.length == 0)
      return this.HideContainer();

    this.HideSpinner();
    this.ShowKeywordListContainer();
    this.keywords.forEach(this.RenderKeyword.bind(this));
  }
  HideContainer() {
    this.HideElement(this.container);
  }
  /**
   * @param {HTMLElement} element
   */
  HideElement(element) {
    if (element && element.parentElement)
      element.parentElement.removeChild(element);
  }
  HideSpinner() {
    this.HideElement(this.spinner);
  }
  ShowKeywordListContainer() {
    this.boxHole.appendChild(this.keywordListContainer);
  }
  /**
   * @param {string} keyword
   * @param {number} index
   */
  RenderKeyword(keyword, index) {
    let keywordBox = Flex({
      marginRight: "xxs",
      marginLeft: "xxs",
      children: Box({
        noMinHeight: true,
        padding: "xxsmall",
        color: "blue-secondary-light",
        children: Text({
          html: keyword,
          size: "xsmall",
          weight: index == 0 ? "bold" : "regular",
        }),
      }),
    });

    this.keywordListContainer.append(keywordBox);
  }
  DesktopView() {
    this.container.style.bottom = "0";
    this.container.style.position = "fixed";
  }
  MobileView() {
    this.container.style.position = "unset";
  }
}
