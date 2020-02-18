import Build from "@/scripts/helpers/Build";
import IsVisible from "@/scripts/helpers/IsVisible";
import { Box, Flex, Spinner, SpinnerContainer, Text } from "@style-guide";

export default class KeywordList {
  /**
   * @param {import("./").default} main
   */
  constructor(main) {
    this.main = main;
    /**
     * @type {HTMLDivElement}
     */
    this.answeringLayer;

    this.ObserveAnswerPanel();
  }
  ObserveAnswerPanel() {
    let observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (
          mutation && mutation.target &&
          mutation.target instanceof HTMLElement
        ) {
          /**
           * @type {HTMLDivElement}
           */
          let answeringLayer = mutation.target
            .querySelector(".brn-answering-layer");

          if (
            answeringLayer &&
            (
              !this.container ||
              !IsVisible(this.container)
            )
          ) {
            this.answeringLayer = answeringLayer;

            this.ShowContainer();
            this.DesktopView();
          }

          let targetsHasAnsweringEditor = mutation.target
            .querySelector(".js-react-add-answer-editor");

          if (
            targetsHasAnsweringEditor &&
            targetsHasAnsweringEditor instanceof HTMLDivElement &&
            targetsHasAnsweringEditor.firstChild &&
            targetsHasAnsweringEditor
            .firstChild instanceof HTMLDivElement &&
            targetsHasAnsweringEditor
            .firstChild.classList.contains("sg-content-box")
          ) {
            this.answeringLayer = targetsHasAnsweringEditor

            this.ShowContainer();
            this.MobileView();
          }
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
        this.RenderKeywords();
      }

      if (!this.main.data || this.main.data.keywordList.length > 0)
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
  async RenderKeywords() {
    await this.main.dataPromise;

    if (
      !this.main.data.keywordList ||
      this.main.data.keywordList.length == 0
    )
      return this.HideContainer();

    this.HideSpinner();
    this.ShowKeywordListContainer();
    this.main.data.keywordList.forEach(this.RenderKeyword.bind(this));
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
