import Button, { ButtonColorType, ButtonPropsType } from "@style-guide/Button";
import type { ContentClassTypes } from "../Fetcher/Fetcher";
import type ModeratorClassType from "./Moderator";

export default class ActionSection {
  main: ModeratorClassType;
  actionButtonProps: ButtonPropsType;
  actionButtonHighlightColorProps: ButtonColorType;

  actionButton: Button;
  moderating: boolean;

  contents: ContentClassTypes[];
  loopTryToModerate: number;

  constructor(
    main: ModeratorClassType,
    actionButtonProps: ButtonPropsType,
    actionButtonHighlightColorProps: ButtonColorType,
  ) {
    this.main = main;
    this.actionButtonProps = actionButtonProps;
    this.actionButtonHighlightColorProps = actionButtonHighlightColorProps;

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
  ActionButtonClicked() {
    //
  }

  HighlightActionButton() {
    if (this.main.selectedActionSection) {
      if (this.main.selectedActionSection === this) {
        this.Hide();

        return undefined;
      }

      this.main.selectedActionSection.Hide();
    }

    this.main.selectedActionSection = this;

    this.actionButton.ChangeType(this.actionButtonHighlightColorProps);

    return System.Delay(50);
  }

  Hide() {
    this.NormalizeActionButton();
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

    this.main.ShowStopButton();
    await this.HighlightActionButton();
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
    this.main.main.statusBar.numberOfFailedContents = 0;
    this.main.main.statusBar.numberOfModeratedContents = 0;

    this.StopModerating();
    this.main.HideStopButtonContainer();
  }
}
