import CreateElement from "@components/CreateElement";
import IsVisible from "@root/helpers/IsVisible";
import { Button, Flex, Icon, Overlay, Text, Toplayer } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type { ChildrenParamType } from "@style-guide/helpers/AddChildren";
import { IconTypeType } from "@style-guide/Icon";
import type { TextElement } from "@style-guide/Text";
import type { ToplayerPropsType } from "@style-guide/Toplayer";
import easyScroll from "easy-scroll";
import HideElement from "../helpers/HideElement";
import getModalContainer from "./helpers/getModalContainer";
import notification, { NotificationPropsType } from "./notification2";

type ModalPropsType = {
  overlay?: boolean;
  title?: string | ChildrenParamType;
  content?: ChildrenParamType;
  actions?: ChildrenParamType;
  jumpButton?: boolean;
} & ToplayerPropsType;

export default class Modal {
  hasOverlay: boolean;
  title: string | ChildrenParamType;
  content: ChildrenParamType;
  actions: ChildrenParamType;
  #showJumpButton: boolean;
  props: ToplayerPropsType;

  container: FlexElementType;
  toplayer: Toplayer;

  overlay: HTMLDivElement;
  flashContainer: HTMLDivElement;

  titleContainer: FlexElementType;
  titleText: TextElement<"div">;

  #contentContainer: FlexElementType;

  #actionsContainer: FlexElementType;
  #jumpButtonContainer: FlexElementType;
  #jumpButtonIcon: Icon;

  constructor({
    overlay,
    title,
    content,
    actions,
    jumpButton,
    ...props
  }: ModalPropsType = {}) {
    this.hasOverlay = overlay;
    this.title = title;
    this.content = content;
    this.actions = actions;
    this.props = props;
    this.#showJumpButton = jumpButton;

    this.Render();
  }

  get contentContainer(): FlexElementType {
    if (!this.#contentContainer) {
      this.RenderContent();
    }

    return this.#contentContainer;
  }

  set contentContainer(element: FlexElementType) {
    this.#contentContainer = element;
  }

  get actionsContainer(): FlexElementType {
    if (!this.#actionsContainer) {
      this.RenderActions();
    }

    return this.#actionsContainer;
  }

  set actionsContainer(element: FlexElementType) {
    this.#actionsContainer = element;
  }

  Render() {
    this.toplayer = new Toplayer({
      modal: true,
      size: "medium",
      children: this.container = Flex({ direction: "column" }),
      onClose: this.Close.bind(this),
      ...this.props,
    });

    document.addEventListener("keyup", this.KeyPressed.bind(this));

    if (this.hasOverlay) this.RenderInOverlay();

    if (this.title) this.RenderTitle();
    if (this.content) this.RenderContent();
    if (this.actions) this.RenderActions();

    if (this.#showJumpButton && this.hasOverlay) {
      this.overlay.addEventListener(
        "scroll",
        this.ToggleVisibilityOfJumpButton.bind(this),
      );
    }
  }

  RenderInOverlay() {
    this.flashContainer = CreateElement({
      tag: "div",
      className: "js-flash-container",
    });
    this.overlay = Overlay({
      children: [this.toplayer, this.flashContainer],
    });
  }

  RenderTitle() {
    this.titleContainer = Flex({
      wrap: true,
      marginTop: "s",
      marginBottom: "m",
      justifyContent: "space-between",
      children:
        typeof this.title === "string"
          ? (this.titleText = Text({
              tag: "div",
              size: "large",
              color: "gray",
              weight: "extra-bold",
              children: this.title,
            }))
          : this.title,
    });

    this.container.append(this.titleContainer);
  }

  RenderContent() {
    this.#contentContainer = Flex({
      children: this.content,
    });

    this.container.append(this.#contentContainer);
  }

  RenderActions() {
    this.actionsContainer = Flex({
      children: this.actions,
    });

    this.container.append(this.actionsContainer);
  }

  ToggleVisibilityOfJumpButton() {
    if (this.overlay.scrollHeight <= this.overlay.clientHeight) {
      HideElement(this.#jumpButtonContainer);

      return;
    }

    if (!this.#jumpButtonContainer) {
      this.RenderJumpButton();
    }

    this.TryToChangeJumpButtonIconType();

    if (!IsVisible(this.#jumpButtonContainer)) {
      this.toplayer.wrapper.append(this.#jumpButtonContainer);
    }
  }

  RenderJumpButton() {
    this.#jumpButtonContainer = Flex({
      relative: true,
      className: "ext-modal--to-top-button",
      children: new Button({
        size: "xl",
        type: "solid-light",
        iconOnly: true,
        onClick: this.PerformScroll.bind(this),
        icon: this.#jumpButtonIcon = new Icon({
          size: 40,
          type: "arrow_down",
          color: "adaptive",
        }),
      }),
    });
  }

  PerformScroll() {
    let direction = "top";
    const numberOfMiddleOfOverlay =
      (this.overlay.scrollHeight - this.overlay.clientHeight) / 2;
    const numberOfCurrentPosition = this.overlay.scrollTop;

    if (numberOfCurrentPosition < numberOfMiddleOfOverlay) {
      direction = "bottom";
    }

    easyScroll({
      scrollableDomEle: this.overlay,
      direction,
      duration: 300,
      easingPreset: "easeInQuad",
    });
  }

  TryToChangeJumpButtonIconType() {
    const numberOfMiddleOfOverlay =
      (this.overlay.scrollHeight - this.overlay.clientHeight) / 2;
    const numberOfCurrentPosition = this.overlay.scrollTop;

    let jumpButtonIconType: IconTypeType = "arrow_up";

    if (numberOfCurrentPosition < numberOfMiddleOfOverlay) {
      jumpButtonIconType = "arrow_down";
    }

    if (this.#jumpButtonIcon.type === jumpButtonIconType) return;

    this.#jumpButtonIcon.ChangeType(jumpButtonIconType);
  }

  Open() {
    const modalContainer = getModalContainer();

    if (!modalContainer) console.error(".js-modal-container is undefined");

    modalContainer.append(this.overlay || this.toplayer.element);

    if (this.#showJumpButton && this.hasOverlay)
      this.ToggleVisibilityOfJumpButton();
  }

  Close() {
    HideElement(this.overlay || this.toplayer.element);
  }

  KeyPressed(event: KeyboardEvent) {
    if (event.key !== "Escape") return;

    if (this.props.onClose) this.props.onClose(event);
    else this.Close();
  }

  Notification(props: NotificationPropsType) {
    const notificationElement = notification(props);

    if (notificationElement)
      this.flashContainer.appendChild(notificationElement);
  }
}
