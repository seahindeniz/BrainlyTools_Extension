import { ContentNameType } from "@components/ModerationPanel/ModeratePanelController";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import { Flex, Label, Button, Spinner } from "@style-guide";
import type { ButtonColorType, ButtonPropsType } from "@style-guide/Button";
import type { FlexElementType } from "@style-guide/Flex";
import type { ContentClassTypes } from "../Fetcher/Fetcher";
import type ModeratorClassType from "./Moderator";

export default class ActionSection {
  main: ModeratorClassType;
  actionButtonProps: ButtonPropsType;
  actionButtonHighlightColorProps: ButtonColorType;
  #moderateButtonProps: ButtonPropsType;

  actionButton: Button;
  moderating: boolean;

  contents: ContentClassTypes[];
  moderatableContents: ContentClassTypes[];
  moderateButtonsContainer?: FlexElementType;
  protected moderateFilteredContentsNumberText?: Text;
  protected moderateVisibleContentsNumberText?: Text;
  moderateVisibleContentsButton?: Button;
  moderateFilteredContentsButton?: Button;

  loopTryToModerate: number;
  moderateButtonSpinner: HTMLDivElement;
  targetNumberOfModeration: number;

  constructor(
    main: ModeratorClassType,
    actionButtonProps: ButtonPropsType,
    actionButtonHighlightColorProps: ButtonColorType,
    moderateButtonProps: ButtonPropsType,
  ) {
    this.main = main;
    this.actionButtonProps = actionButtonProps;
    this.actionButtonHighlightColorProps = actionButtonHighlightColorProps;
    this.#moderateButtonProps = moderateButtonProps;

    this.RenderActionButton();
  }

  RenderActionButton() {
    this.actionButton = new Button({
      onClick: this.ActionButtonClicked.bind(this),
      ...this.actionButtonProps,
    });

    this.main.actionButtonContainer.append(this.actionButton.element);
  }

  // eslint-disable-next-line class-methods-use-this
  async ActionButtonClicked() {
    if (this.moderating) return;

    if (this.main.selectedActionSection) {
      if (this.main.selectedActionSection === this) {
        this.main.HideStopButtonContainer();
        this.main.selectedActionSection.Hide();

        return;
      }

      this.main.selectedActionSection.Hide();
    }

    await System.Delay(50);

    this.ActionButtonSelected();
  }

  ActionButtonSelected() {
    console.warn(this);
  }

  ShowModerateButtons() {
    if (!this.moderateButtonsContainer) {
      this.RenderModerateButtons();
      this.RenderModerateButtonSpinner();
    }

    this.main.container.append(this.moderateButtonsContainer);

    this.UpdateModerateButtonNumbers();
  }

  HideModerateButtons() {
    HideElement(this.moderateButtonsContainer);
  }

  RenderModerateButtons() {
    const moderateVisibleContentsButtonLabel = new Label({
      color: "achromatic",
      children: this.moderateVisibleContentsNumberText = document.createTextNode(
        "0",
      ),
    });
    const moderateFilteredContentsButtonLabel = new Label({
      color: "achromatic",
      children: this.moderateFilteredContentsNumberText = document.createTextNode(
        "0",
      ),
    });

    this.moderateButtonsContainer = Build(
      Flex({
        marginTop: "m",
        justifyContent: "center",
        wrap: true,
      }),
      [
        [
          Flex({
            marginTop: "xs",
            marginRight: "xs",
            marginLeft: "xs",
          }),
          (this.moderateVisibleContentsButton = new Button({
            ...this.#moderateButtonProps,
            children:
              System.data.locale.reportedContents.massModerate.visible.contents,
            icon: moderateVisibleContentsButtonLabel.element,
            onClick: this.ModerateVisibleContents.bind(this),
          })),
        ],
        [
          Flex({
            marginTop: "xs",
            marginRight: "xs",
            marginLeft: "xs",
          }),
          (this.moderateFilteredContentsButton = new Button({
            ...this.#moderateButtonProps,
            children:
              System.data.locale.reportedContents.massModerate.filtered
                .contents,
            icon: moderateFilteredContentsButtonLabel.element,
            onClick: this.ModerateFilteredContents.bind(this),
          })),
        ],
      ],
    );
  }

  RenderModerateButtonSpinner() {
    this.moderateButtonSpinner = Spinner({
      overlay: true,
    });
  }

  protected VisibleContents(selectedContentTypes?: ContentNameType[]) {
    return this.contents.filter(
      content =>
        content.container &&
        (!selectedContentTypes ||
          selectedContentTypes.includes(content.contentType)),
    );
  }

  protected FilteredContents(selectedContentTypes?: ContentNameType[]) {
    if (!selectedContentTypes) return this.contents;

    return this.contents.filter(content =>
      selectedContentTypes.includes(content.contentType),
    );
  }

  async ModerateVisibleContents() {
    this.moderatableContents = this.VisibleContents();

    this.moderateVisibleContentsButton.element.append(
      this.moderateButtonSpinner,
    );
    await this.DisableModerateButtons();
    this.StartModerating();
  }

  async ModerateFilteredContents() {
    this.moderatableContents = this.FilteredContents();

    this.moderateFilteredContentsButton.element.append(
      this.moderateButtonSpinner,
    );
    await this.DisableModerateButtons();
    this.StartModerating();
  }

  DisableModerateButtons() {
    this.moderateVisibleContentsButton.Disable();
    this.moderateFilteredContentsButton.Disable();

    return System.Delay(50);
  }

  EnableModerateButtons() {
    this.HideSpinner();
    this.moderateVisibleContentsButton.Enable();
    this.moderateFilteredContentsButton.Enable();
  }

  StartModerating() {
    console.warn(this);
  }

  HideSpinner() {
    HideElement(this.moderateButtonSpinner);
  }

  UpdateModerateButtonNumbers() {
    const { contents } = this;
    const visibleContents = this.VisibleContents();

    this.moderateFilteredContentsNumberText.nodeValue = String(contents.length);
    this.moderateVisibleContentsNumberText.nodeValue = String(
      visibleContents.length,
    );
  }

  HighlightActionButton() {
    this.main.selectedActionSection = this;

    this.actionButton.ChangeType(this.actionButtonHighlightColorProps);

    return System.Delay(50);
  }

  Hide() {
    this.NormalizeActionButton();
    this.main.HideStopButtonContainer();
    this.main.tippy.popperInstance?.update();
  }

  NormalizeActionButton() {
    if (this.main.selectedActionSection === this)
      this.main.selectedActionSection = null;

    this.actionButton.ChangeType({
      type: "outline",
      toggle: this.actionButtonProps.toggle,
    });
  }

  async Moderating() {
    this.moderating = true;
    this.targetNumberOfModeration = this.moderatableContents.length;
    this.main.main.statusBar.numberOfFailedContents = 0;
    this.main.main.statusBar.numberOfModeratedContents = 0;

    // await this.HighlightActionButton();
    this.main.ShowStopButton();
    this.main.main.fetcher.ShowFilterSpinner();
    this.main.DisableButtons();
    this.main.main.statusBar.ShowCountOfModeration();
  }

  StopModerating() {
    this.moderating = false;

    this.main.HideStopButton();
    this.main.HideStopButtonContainer();
    this.main.EnableButtons();
    this.NormalizeActionButton();
    clearInterval(this.loopTryToModerate);
    this.main.main.fetcher.HideFilterSpinner();
  }

  FinishModerating() {
    this.StopModerating();
    this.main.HideStopButtonContainer();
    this.UpdateFilteredContentsStore();
    this.EnableModerateButtons();
    this.UpdateModerateButtonNumbers();
  }

  UpdateFilteredContentsStore() {
    this.contents = this.main.main.contents.filtered.filter(
      content => content.has !== "deleted" && content.ignored !== true,
    );
  }

  async ContentModerated(content: ContentClassTypes) {
    this.targetNumberOfModeration--;

    if (content.has === "failed")
      this.main.main.statusBar.IncreaseNumberOfFailed();
    else this.main.main.statusBar.IncreaseNumberOfModeration();

    if (this.targetNumberOfModeration > 0) return;

    await System.Delay(50);
    this.FinishModerating();
  }
}
