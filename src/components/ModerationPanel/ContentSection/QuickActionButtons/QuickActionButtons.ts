import HideElement from "@root/helpers/HideElement";
import { Flex, Spinner } from "@style-guide";
import { ButtonSizeType } from "@style-guide/Button";
import { FlexElementType } from "@style-guide/Flex";
import type AnswerClassType from "../Answer";
import type CommentClassType from "../CommentSection/Comment";
import type QuestionClassType from "../Question";
import type ActionButtonClassType from "./ActionButton/ActionButton";
import ConfirmButton from "./ActionButton/ConfirmButton";
import type DeleteButtonClassType from "./ActionButton/DeleteButton";
import MoreButton from "./ActionButton/MoreButton";

export type ButtonClassTypes =
  | ActionButtonClassType
  | MoreButton
  | ConfirmButton
  | DeleteButtonClassType;

export default class QuickActionButtons {
  main: AnswerClassType | CommentClassType | QuestionClassType;
  container: FlexElementType;
  actionButtons: ButtonClassTypes[];
  spinner: HTMLDivElement;

  selectedButton: ButtonClassTypes;
  confirmButton?: ConfirmButton;
  buttonSize: ButtonSizeType;
  moreButton: MoreButton;

  constructor(
    main: AnswerClassType | CommentClassType | QuestionClassType,
    buttonSize?: ButtonSizeType,
  ) {
    this.main = main;
    this.buttonSize = buttonSize;

    this.actionButtons = [];

    this.Render();
    this.RenderSpinner();
    this.RenderMoreButton();
  }

  private Render() {
    this.container = Flex({ wrap: true, justifyContent: "flex-end" });
  }

  private RenderSpinner() {
    this.spinner = Spinner({
      overlay: true,
    });
  }

  RenderMoreButton() {
    this.moreButton = new MoreButton(this);

    this.actionButtons.push(this.moreButton);
  }

  RenderConfirmButton() {
    if (!this.main.data.report && !("wrong_report" in this.main.data)) return;

    if (this.confirmButton) {
      this.confirmButton.Show();

      return;
    }

    this.confirmButton = new ConfirmButton(this);

    this.actionButtons.push(this.confirmButton);
  }

  Hide() {
    HideElement(this.container);
  }

  HideSpinner() {
    HideElement(this.spinner);
  }

  DisableButtons() {
    this.actionButtons.forEach(actionButton => actionButton.button.Disable());
  }

  EnableButtons() {
    this.selectedButton = null;

    this.HideSpinner();
    this.actionButtons.forEach(actionButton => actionButton.button.Enable());
  }
}
