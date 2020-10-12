/* eslint-disable no-underscore-dangle */
import {
  RemoveAnswerReqDataType,
  RemoveCommentReqDataType,
  RemoveQuestionReqDataType,
} from "@BrainlyAction";
import type { ContentNameType } from "@components/ModerationPanel/ModeratePanelController";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import IsVisible from "@root/helpers/IsVisible";
import { Button, Flex, Textarea } from "@style-guide";
import { FlexElementType } from "@style-guide/Flex";
import { ChildrenParamType } from "@style-guide/helpers/AddChildren";
import type { TextareaPropsType } from "@style-guide/Textarea";
import OptionsSection from "./OptionsSection";
import ContentTypeSection from "./RadioSection/ContentTypeSection";
import ReasonSection from "./RadioSection/ReasonSection";
import SubReasonSection from "./RadioSection/SubReasonSection";

type DefaultsPropType = {
  contentType?: ContentNameType;
};

type ListenersPropType = {
  onContentTypeChange?: () => void;
  onReasonChange?: () => void;
  onSubReasonChange?: () => void;
  onDeleteButtonClick?: () => void;
};

export default class DeleteSection {
  defaults: DefaultsPropType;
  listeners: ListenersPropType;
  #textareaProps: TextareaPropsType<"textarea">;

  container: FlexElementType;
  radioSectionContainer: FlexElementType;
  textareaContainer: FlexElementType;
  textarea: HTMLTextAreaElement;
  optionsContainer: FlexElementType;

  contentTypeSection: ContentTypeSection;
  reasonSection?: ReasonSection;
  subReasonSection?: SubReasonSection;
  optionsSection?: OptionsSection;
  buttonContainer?: FlexElementType;
  #actionButton: ChildrenParamType;
  deleteButton: Button;
  disabled: boolean;

  constructor({
    defaults = {},
    listeners = {},
    actionButton,
    textareaProps,
  }: {
    defaults?: DefaultsPropType;
    listeners?: ListenersPropType;
    actionButton?: ChildrenParamType;
    textareaProps?: TextareaPropsType<"textarea">;
  } = {}) {
    this.defaults = defaults;
    this.listeners = listeners;
    this.#actionButton = actionButton;
    this.#textareaProps = textareaProps;

    this.Render();

    this.contentTypeSection = new ContentTypeSection(this);
  }

  RenderReasonSection() {
    this.HideReasonSection();
    this.HideSubReasonSection();
    this.HideTextarea();

    this.reasonSection = new ReasonSection(this);
  }

  HideReasonSection() {
    if (!this.reasonSection) return;

    this.reasonSection.container.remove();

    this.reasonSection = null;
  }

  RenderSubReasonSection() {
    this.HideSubReasonSection();

    this.subReasonSection = new SubReasonSection(this);
  }

  HideSubReasonSection() {
    if (!this.subReasonSection) return;

    this.subReasonSection.container.remove();

    this.subReasonSection = null;
  }

  Render() {
    this.container = Build(
      Flex({
        relative: true,
        marginTop: "xs",
        direction: "column",
      }),
      [
        (this.radioSectionContainer = Flex({ direction: "column" })),
        (this.textareaContainer = Flex()),
      ],
    );
  }

  RenderOptionsSection() {
    this.RemoveOptionsSection();

    this.optionsSection = new OptionsSection(this);
  }

  RemoveOptionsSection() {
    if (!this.optionsSection) return;

    this.optionsSection.container.remove();

    this.optionsSection = null;
  }

  HideOptionsSection() {
    HideElement(this.optionsSection.container);
  }

  ShowOptionsSection() {
    if (!this.optionsSection || IsVisible(this.optionsSection.container))
      return;

    this.container.append(this.optionsSection.container);
  }

  RenderTextarea() {
    this.textarea = Textarea({
      tag: "textarea",
      fullWidth: true,
      onKeyDown: this.KeyPressed.bind(this),
      onPaste: this.KeyPressed.bind(this),
      onDrop: this.KeyPressed.bind(this),
      ...this.#textareaProps,
    });
  }

  private KeyPressed(event: KeyboardEvent) {
    if (!this.disabled) return;

    event.preventDefault();
  }

  ShowTextarea() {
    if (!this.textarea) this.RenderTextarea();
    else if (IsVisible(this.textarea)) return;

    this.textareaContainer.append(this.textarea);
  }

  HideTextarea() {
    if (!this.textarea) return;

    this.textarea.value = "";

    HideElement(this.textarea);
  }

  ShowButtonContainer() {
    if (!this.buttonContainer) {
      this.RenderButtonContainer();
    }

    if (this.buttonContainer) {
      this.container.append(this.buttonContainer);
    }
  }

  HideButtonContainer() {
    if (!this.buttonContainer) return;

    HideElement(this.buttonContainer);
  }

  RenderButtonContainer() {
    if (!this.#actionButton && !this.listeners.onDeleteButtonClick) return;

    this.buttonContainer = Flex({
      margin: "s",
      marginTop: "xs",
      children: this.#actionButton,
    });

    if (!this.#actionButton) {
      this.RenderDeleteButton();
    }
  }

  RenderDeleteButton() {
    this.deleteButton = new Button({
      type: "solid-peach",
      onClick: this.listeners?.onDeleteButtonClick,
      children: System.data.locale.common.delete,
    });

    this.buttonContainer.append(this.deleteButton.element);
  }

  Hide() {
    HideElement(this.container);
  }

  PrepareData():
    | RemoveQuestionReqDataType
    | RemoveAnswerReqDataType
    | RemoveCommentReqDataType {
    if (!this.reasonSection || !this.subReasonSection) return undefined;

    const reason =
      System.data.Brainly.deleteReasons.__withIds.__all[
        this.reasonSection.value
      ];
    const subReason =
      System.data.Brainly.deleteReasons.__withIds.__all[
        this.subReasonSection.value
      ];

    const data = {
      model_id: undefined,
      reason_id: reason.id,
      reason: this.textarea.value,
      reason_title: subReason?.title || reason.text,
      give_warning: this.optionsSection.giveWarning.checkbox.checked,
      take_points: this.optionsSection.takePoints?.checkbox.checked,
      return_points: !this.optionsSection.returnPoints?.checkbox.checked,
    };

    if (!this.optionsSection.takePoints) {
      delete data.take_points;
    }

    if (!this.optionsSection.returnPoints) {
      delete data.return_points;
    }

    return data;
  }

  Disable() {
    this.disabled = true;

    if (this.textarea) {
      this.textarea.disabled = true;
    }

    this.deleteButton?.Disable();
  }

  Enable() {
    this.disabled = false;

    if (this.textarea) {
      this.textarea.disabled = false;
    }

    this.deleteButton?.Enable();
  }
}
