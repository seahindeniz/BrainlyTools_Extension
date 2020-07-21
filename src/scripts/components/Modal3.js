// @flow

import { Flex, Overlay, Text, TopLayer } from "@style-guide";
import type { FlexElementType, FlexPropsType } from "@style-guide/Flex";
import type { ChildrenParamType } from "@style-guide/helpers/AddChildren";
import type { TextElement } from "@style-guide/Text";
import type { ToplayerElement, ToplayerPropsType } from "@style-guide/TopLayer";
import HideElement from "../helpers/HideElement";
import CreateElement from "./CreateElement";
import notification, { type NotificationPropsType } from "./notification2";

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
  overlay?: boolean,
  title?: ChildrenParamType,
  content?: FlexPropsType,
  actions?: FlexPropsType,
  ...
} & ToplayerPropsType;

export default class Modal {
  hasOverlay: boolean;
  title: FlexPropsType;
  content: FlexPropsType;
  actions: FlexPropsType;
  props: ToplayerPropsType;

  container: FlexElementType;
  toplayer: ToplayerElement;

  overlay: HTMLDivElement;
  flashContainer: HTMLDivElement;

  titleContainer: FlexElementType;
  titleText: TextElement;

  contentContainer: FlexElementType;

  actionsContainer: FlexElementType;

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

  Render() {
    this.toplayer = TopLayer({
      modal: true,
      size: "medium",
      children: (this.container = Flex({ direction: "column" })),
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
      marginTop: "m",
      marginBottom: "m",
      children: (this.titleText = Text({
        size: "large",
        color: "gray",
        weight: "extra-bold",
        children: this.title,
      })),
    });

    this.container.append(this.titleContainer);
  }

  RenderContent() {
    this.contentContainer = Flex({
      ...this.content,
    });

    this.container.append(this.contentContainer);
  }

  RenderActions() {
    this.actionsContainer = Flex({
      ...this.actions,
    });

    this.container.append(this.actionsContainer);
  }

  Open() {
    const modalContainer = getModalContainer();

    if (!modalContainer) console.error(".js-modal-container is undefined");

    modalContainer.append(this.overlay || this.toplayer);
  }

  Close() {
    HideElement(this.overlay || this.toplayer);
  }

  Notification(props: NotificationPropsType) {
    const notificationElement = notification(props);

    if (notificationElement)
      this.flashContainer.appendChild(notificationElement);
  }
}
