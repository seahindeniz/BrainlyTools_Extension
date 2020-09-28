import CreateElement from "@components/CreateElement";
import { Button, Flex, Icon, Overlay, Text, Toplayer } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type { ChildrenParamType } from "@style-guide/helpers/AddChildren";
import type { TextElement } from "@style-guide/Text";
import type { ToplayerPropsType } from "@style-guide/Toplayer";
import HideElement from "../helpers/HideElement";
import getModalContainer from "./helpers/getModalContainer";
import notification, { NotificationPropsType } from "./notification2";

type ModalPropsType = {
  overlay?: boolean;
  title?: string | ChildrenParamType;
  content?: ChildrenParamType;
  actions?: ChildrenParamType;
  scrollToTop?: boolean;
} & ToplayerPropsType;

export default class Modal {
  hasOverlay: boolean;
  title: string | ChildrenParamType;
  content: ChildrenParamType;
  actions: ChildrenParamType;
  #scrollToTop: boolean;
  props: ToplayerPropsType;

  container: FlexElementType;
  toplayer: Toplayer;

  overlay: HTMLDivElement;
  flashContainer: HTMLDivElement;

  titleContainer: FlexElementType;
  titleText: TextElement<"div">;

  #contentContainer: FlexElementType;

  #actionsContainer: FlexElementType;
  #scrollToTopButtonContainer: FlexElementType;

  constructor({
    overlay,
    title,
    content,
    actions,
    scrollToTop,
    ...props
  }: ModalPropsType = {}) {
    this.hasOverlay = overlay;
    this.title = title;
    this.content = content;
    this.actions = actions;
    this.props = props;
    this.#scrollToTop = scrollToTop;

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

    if (this.#scrollToTop && this.hasOverlay) this.RenderScrollToTopButton();

    if (this.title) this.RenderTitle();
    if (this.content) this.RenderContent();
    if (this.actions) this.RenderActions();
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

  RenderScrollToTopButton() {
    this.#scrollToTopButtonContainer = Flex({
      relative: true,
      className: "ext-modal--to-top-button",
      children: new Button({
        size: "xl",
        type: "solid-light",
        iconOnly: true,
        onClick: this.OverlayScrollToTop.bind(this),
        icon: new Icon({
          size: 40,
          type: "arrow_up",
          color: "adaptive",
        }),
      }),
    });

    this.overlay.addEventListener(
      "scroll",
      this.TryToShowScrollToTopButton.bind(this),
    );
  }

  OverlayScrollToTop() {
    this.overlay.scrollTop = 0;
  }

  TryToShowScrollToTopButton() {
    if (this.overlay.scrollTop < 300) {
      HideElement(this.#scrollToTopButtonContainer);

      return;
    }

    this.toplayer.wrapper.append(this.#scrollToTopButtonContainer);
  }

  Open() {
    const modalContainer = getModalContainer();

    if (!modalContainer) console.error(".js-modal-container is undefined");

    modalContainer.append(this.overlay || this.toplayer.element);
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
