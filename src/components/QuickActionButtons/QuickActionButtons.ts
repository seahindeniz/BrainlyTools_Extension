import type {
  RemoveAnswerReqDataType,
  RemoveCommentReqDataType,
  // RemoveQuestionReqDataType,
} from "@BrainlyAction";
import type { RemoveQuestionReqDataType } from "@BrainlyReq/RemoveQuestion";
import type { NotificationPropsType } from "@components/notification2";
import HideElement from "@root/helpers/HideElement";
import { Flex, Spinner } from "@style-guide";
import type { ButtonSizeType } from "@style-guide/Button";
import type { FlexElementType, FlexPropsType } from "@style-guide/Flex";
import type ActionButtonClassType from "./ActionButton/ActionButton";
import ConfirmButton from "./ActionButton/ConfirmButton";
import type DeleteButtonClassType from "./ActionButton/DeleteButton";
import MoreButton from "./ActionButton/MoreButton";
import notification from "../notification2";

export type ButtonClassTypes =
  | ActionButtonClassType
  | MoreButton
  | ConfirmButton
  | DeleteButtonClassType;

type OptionalPropsType = {
  buttonSize?: ButtonSizeType;
  containerProps: FlexPropsType;
  notificationHandler?: (props: NotificationPropsType) => void;
  onDelete?: () => void;
};

export type ContentType = {
  databaseId: number;
  reported?: boolean;
};

export type QuickActionButtonsPropsType = {
  content: ContentType;
} & OptionalPropsType;

export default class QuickActionButtons {
  content: ContentType;
  props: OptionalPropsType;

  protected actionButtons: ButtonClassTypes[];

  container: FlexElementType;
  leftActionButtonContainer: FlexElementType;
  rightActionButtonContainer: FlexElementType;
  #spinner: HTMLDivElement;
  selectedButton: ButtonClassTypes;
  private confirmButton?: ConfirmButton;
  private moreButton: MoreButton;

  constructor({ content, ...props }: QuickActionButtonsPropsType) {
    this.content = content;
    this.props = props;

    this.actionButtons = [];

    if (this.props.notificationHandler === undefined) {
      this.props.notificationHandler = notification;
    }

    this.Render();
  }

  private Render() {
    this.container = Flex({
      wrap: true,
      justifyContent: "space-between",
      ...this.props.containerProps,
      children: [
        (this.leftActionButtonContainer = Flex({ wrap: true })),
        (this.rightActionButtonContainer = Flex({
          grow: true,
          wrap: true,
          justifyContent: "flex-end",
        })),
      ],
    });
  }

  get spinner() {
    if (!this.#spinner) {
      this.RenderSpinner();
    }

    return this.#spinner;
  }

  private RenderSpinner() {
    this.#spinner = Spinner({
      overlay: true,
    });
  }

  RenderMoreButton() {
    this.moreButton = new MoreButton(this);

    this.actionButtons.push(this.moreButton);
  }

  RenderConfirmButton() {
    if (!this.content.reported) return;

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

  Moderating() {
    this.DisableButtons();

    return System.Delay(50);
  }

  DisableButtons() {
    this.actionButtons.forEach(actionButton => actionButton.button.Disable());
  }

  NotModerating() {
    this.EnableButtons();
  }

  EnableButtons() {
    this.selectedButton = null;

    this.HideSpinner();
    this.actionButtons.forEach(actionButton => actionButton.button.Enable());
  }

  DeleteContent(
    data:
      | RemoveQuestionReqDataType
      | RemoveAnswerReqDataType
      | RemoveCommentReqDataType,
  ) {
    console.warn(this, data);
  }

  Deleted() {
    this.props.onDelete?.();
  }
}
