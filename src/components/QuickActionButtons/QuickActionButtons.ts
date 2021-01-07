import type {
  RemoveAnswerReqDataType,
  RemoveCommentReqDataType,
} from "@BrainlyAction";
import { CloseModerationTicket, ConfirmContent } from "@BrainlyReq";
import type { RemoveQuestionReqDataType } from "@BrainlyReq/RemoveQuestion";
import type { ContentNameType } from "@components/ModerationPanel/ModeratePanelController";
import type { NotificationPropsType } from "@components/notification2";
import HideElement from "@root/helpers/HideElement";
import { Flex, Spinner } from "@style-guide";
import type { ButtonSizeType } from "@style-guide/Button";
import type {
  FlexElementType,
  FlexMarginsType,
  FlexPropsType,
} from "@style-guide/Flex";
import notification from "../notification2";
import type ActionButtonClassType from "./ActionButton/ActionButton";
import ConfirmButton from "./ActionButton/ConfirmButton";
import type DeleteButtonClassType from "./ActionButton/DeleteButton";
import ModerateButton from "./ActionButton/ModerateButton";
import MoreButton from "./ActionButton/MoreButton";

export type ButtonClassTypes =
  | ActionButtonClassType
  | MoreButton
  | ConfirmButton
  | DeleteButtonClassType;

type OptionalPropsType = {
  button?: {
    size?: ButtonSizeType;
    marginLeft?: FlexMarginsType;
  };
  containerProps?: FlexPropsType;
  moreButton?: boolean;
  notificationHandler?: (props: NotificationPropsType) => void;
  onConfirm?: () => void;
  onDelete?: () => void;
  onModerate?: () => void;
  vertical?: boolean;
};

export type ContentType = {
  databaseId: number;
  questionDatabaseId?: number;
  reported?: boolean;
  author: {
    databaseId: number;
    nick: string;
  };
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
  moderating: boolean;
  private moderateButton?: ModerateButton;

  constructor(
    public contentType: ContentNameType,
    { content, ...props }: QuickActionButtonsPropsType,
  ) {
    this.content = content;
    this.props = props;

    this.actionButtons = [];

    if (this.props.notificationHandler === undefined) {
      this.props.notificationHandler = notification;
    }

    this.Render();
    this.RenderModerateButton();
    this.RenderMoreButton();
  }

  private Render() {
    this.container = Flex({
      wrap: true,
      justifyContent: "space-between",
      ...this.props.containerProps,
      children: [
        (this.leftActionButtonContainer = Flex({
          wrap: true,
          direction: this.props.vertical && "column",
          alignItems: this.props.vertical ? "flex-end" : undefined,
        })),
        (this.rightActionButtonContainer = Flex({
          grow: true,
          wrap: true,
          justifyContent: "flex-end",
          direction: this.props.vertical && "column",
        })),
      ],
    });
  }

  private RenderModerateButton() {
    if (
      this.moderateButton ||
      !this.props.onModerate ||
      (this.contentType !== "Question" && !this.content.questionDatabaseId)
    )
      return;

    this.moderateButton = new ModerateButton(this);

    this.actionButtons.push(this.moderateButton);
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
    if (this.moreButton || !this.props.moreButton) return;

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
    if (this.moderating) return;

    HideElement(this.container);
  }

  HideSpinner() {
    if (this.moderating) return;

    HideElement(this.spinner);
  }

  Moderating() {
    this.moderating = true;

    this.DisableButtons();

    return System.Delay(50);
  }

  DisableButtons() {
    this.container.classList.add("js-disabled");

    this.actionButtons.forEach(actionButton => actionButton.button.Disable());
  }

  NotModerating() {
    this.moderating = false;

    this.EnableButtons();
  }

  EnableButtons() {
    this.selectedButton = null;

    this.HideSpinner();
    this.container.classList.remove("js-disabled");
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
    this.Hide();
    this.props.onDelete?.();
  }

  async ConfirmContent() {
    try {
      const resConfirm = await ConfirmContent(
        this.content.databaseId,
        this.contentType,
      );

      if (resConfirm?.success === false) {
        throw resConfirm.message
          ? { msg: resConfirm.message }
          : resConfirm || Error("No response");
      }

      CloseModerationTicket(this.content.questionDatabaseId);

      this.NotModerating();
      this.Confirmed();
    } catch (error) {
      console.error(error);
      this.props.notificationHandler?.({
        type: "error",
        html:
          error.msg ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
      });

      this.NotModerating();
    }
  }

  Confirmed() {
    this.RemoveConfirmButton();
    this.props.onConfirm?.();
  }

  RemoveConfirmButton() {
    if (!this.confirmButton) return;

    this.confirmButton.Hide();

    this.confirmButton = null;
  }

  RemoveDeleteButtons() {
    this.actionButtons.forEach(button => {
      if (!("deleteReason" in button)) return;

      button.Hide();
    });
  }
}
