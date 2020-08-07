// @flow

import { Flex, Overlay, Text, Toplayer } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type { ChildrenParamType } from "@style-guide/helpers/AddChildren";
import type { TextElement } from "@style-guide/Text";
import type { ToplayerPropsType } from "@style-guide/Toplayer";
import HideElement from "../helpers/HideElement";
import CreateElement from "./CreateElement";
import notification, { NotificationPropsType } from "./notification2";

function getModalContainer() {
  let modalContainer = document.querySelector(".js-modal-container");

  if (!modalContainer) {
    modalContainer = document.createElement("div");
    modalContainer.className = "js-modal-container";

    if (document.body) document.body.appendChild(modalContainer);
  }

  return modalContainer;
}

type ModalPropsType = {
  overlay?: boolean;
  title?: string | ChildrenParamType;
  content?: ChildrenParamType;
  actions?: ChildrenParamType;
} & ToplayerPropsType;

export default class Modal {
  hasOverlay: boolean;
  title: string | ChildrenParamType;
  content: ChildrenParamType;
  actions: ChildrenParamType;
  // eslint-disable-next-line react/static-property-placement
  props: ToplayerPropsType;

  container: FlexElementType;
  toplayer: Toplayer;

  overlay: HTMLDivElement;
  flashContainer: HTMLDivElement;

  titleContainer: FlexElementType;
  titleText: TextElement<"div">;

  #contentContainer: FlexElementType;

  #actionsContainer: FlexElementType;

  constructor({
    overlay,
    title,
    content,
    actions,
    ...props
  }: ModalPropsType = {}) {
    this.hasOverlay = overlay;
    this.title = title;
    this.content = content;
    this.actions = actions;
    this.props = props;

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

    if (this.hasOverlay) this.RenderInOverlay();

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

  Open() {
    const modalContainer = getModalContainer();

    if (!modalContainer) console.error(".js-modal-container is undefined");

    modalContainer.append(this.overlay || this.toplayer.element);
  }

  Close() {
    HideElement(this.overlay || this.toplayer.element);
  }

  Notification(props: NotificationPropsType) {
    const notificationElement = notification(props);

    if (notificationElement)
      this.flashContainer.appendChild(notificationElement);
  }
}
