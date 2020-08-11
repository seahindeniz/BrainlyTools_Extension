import Build from "@root/scripts/helpers/Build";
import HideElement from "@root/scripts/helpers/HideElement";
import IsVisible from "@root/scripts/helpers/IsVisible";
import { Box, Button, Flex, Icon, SpinnerContainer, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type FreelancerToolClassType from ".";

export default class KeywordList {
  main: FreelancerToolClassType;
  answeringLayer: HTMLDivElement;
  container: any;
  spinner: HTMLDivElement;
  boxHole: any;
  keywordListContainer: FlexElementType;
  toggleButton: Button;
  rightArrowIcon: Icon;
  leftArrowIcon: Icon;
  listContainer: FlexElementType;

  constructor(main: FreelancerToolClassType) {
    this.main = main;

    this.ObserveAnswerPanel();
  }

  ObserveAnswerPanel() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (
          mutation &&
          mutation.target &&
          mutation.target instanceof HTMLElement
        ) {
          const answeringLayer = mutation.target.querySelector(
            ".brn-answering-layer",
          ) as HTMLDivElement;

          if (
            answeringLayer &&
            (!this.container || !IsVisible(this.container))
          ) {
            this.answeringLayer = answeringLayer;

            this.ShowContainer();
            this.DesktopView();
          }

          const targetsHasAnsweringEditor = mutation.target.querySelector(
            ".js-react-add-answer-editor",
          );

          if (
            targetsHasAnsweringEditor &&
            targetsHasAnsweringEditor instanceof HTMLDivElement &&
            targetsHasAnsweringEditor.firstChild &&
            targetsHasAnsweringEditor.firstChild instanceof HTMLDivElement &&
            targetsHasAnsweringEditor.firstChild.classList.contains(
              "sg-content-box",
            )
          ) {
            this.answeringLayer = targetsHasAnsweringEditor;

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
    this.rightArrowIcon = new Icon({
      color: "adaptive",
      type: "arrow_right",
    });
    this.leftArrowIcon = new Icon({
      color: "adaptive",
      type: "arrow_left",
    });
    this.container = Build(
      Flex({
        fullWidth: true,
        marginBottom: "xxs",
      }),
      [
        [
          (this.listContainer = Flex({ grow: true })),
          (this.boxHole = SpinnerContainer({
            fullWidth: true,
          })),
        ],
        [
          Flex(),
          (this.toggleButton = new Button({
            iconOnly: true,
            type: "outline",
            icon: this.rightArrowIcon,
          })),
        ],
      ],
    );

    this.toggleButton.element.addEventListener("click", this.Toggle.bind(this));
  }

  Toggle() {
    if (IsVisible(this.boxHole)) {
      HideElement(this.boxHole);
      this.toggleButton.ChangeIcon(this.leftArrowIcon);
    } else {
      this.listContainer.append(this.boxHole);
      this.toggleButton.ChangeIcon(this.rightArrowIcon);
    }
  }

  RenderKeywordList() {
    this.keywordListContainer = Build(
      Flex({
        justifyContent: "center",
        fullWidth: true,
      }),
      [
        [
          Flex({
            margin: "xxs",
            alignItems: "center",
          }),
          Text({
            size: "small",
            weight: "bold",
            noWrap: true,
            html: `${System.data.locale.question.keywords}:`,
          }),
        ],
      ],
    );
  }

  async RenderKeywords() {
    await this.main.dataPromise;

    if (
      !this.main.data.keywordList ||
      this.main.data.keywordList.length === 0
    ) {
      this.HideContainer();

      return;
    }

    this.HideSpinner();
    this.ShowKeywordListContainer();
    this.main.data.keywordList.forEach(this.RenderKeyword.bind(this));
  }

  HideContainer() {
    HideElement(this.container);
  }

  HideSpinner() {
    HideElement(this.spinner);
  }

  ShowKeywordListContainer() {
    this.boxHole.appendChild(this.keywordListContainer);
  }

  RenderKeyword(keyword: string, index: number) {
    const keywordBox = Build(
      Flex({
        marginLeft: "xs",
      }),
      [
        [
          new Box({
            // noMinHeight: true,
            border: false,
            padding: null,
            color: "blue-secondary",
          }),
          [
            [
              Flex({
                marginTop: "xxs",
                marginRight: "xs",
                marginBottom: "xxs",
                marginLeft: "xs",
              }),
              Text({
                html: keyword,
                size: "small",
                weight: index === 0 ? "bold" : "regular",
              }),
            ],
          ],
        ],
      ],
    );

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
