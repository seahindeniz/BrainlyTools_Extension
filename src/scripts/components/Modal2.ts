import {
  ContentBox,
  ContentBoxActions,
  ContentBoxContent,
  ContentBoxTitle,
  Overlay,
  ToplayerDeprecated,
} from "@style-guide";
import type { ActionsPropsType } from "@style-guide/ContentBox/Actions";
import type { ContentPropsType } from "@style-guide/ContentBox/Content";
import type { TitlePropsType } from "@style-guide/ContentBox/Title";
import type { ToplayerElementType } from "@style-guide/ToplayerDeprecated";
import { ToplayerDeprecatedPropsType } from "@style-guide/ToplayerDeprecated";
import HideElement from "../helpers/HideElement";
import IsVisible from "../helpers/IsVisible";
import notification, { NotificationPropsType } from "./notification2";

type ModalPropsType = ToplayerDeprecatedPropsType & {
  overlay?: boolean;
  title?: string | TitlePropsType;
  content?: ContentPropsType;
  actions?: ActionsPropsType;
};

export default class Modal {
  hasOverlay: boolean;
  // eslint-disable-next-line react/static-property-placement
  props: {
    [x: string]: any;
  };

  sections: {
    actions: ActionsPropsType;
    content: ContentPropsType;
    title: string | TitlePropsType;
  };

  contentBox: HTMLElement;
  toplayer: ToplayerElementType;
  #title?: HTMLElement;
  #content?: HTMLElement;
  #actions?: HTMLElement;
  container: HTMLDivElement;
  flashContainer: HTMLDivElement;
  overlay: HTMLDivElement;

  constructor({
    overlay,
    title,
    content,
    actions,
    ...props
  }: ModalPropsType = {}) {
    this.hasOverlay = overlay;
    this.props = props;
    this.sections = {
      title,
      content,
      actions,
    };
    this.Render();

    if (overlay) this.RenderInOverlay();
  }

  Render() {
    if (this.sections.title || this.sections.content || this.sections.actions) {
      this.contentBox = ContentBox();

      if (this.sections.title) this.RenderTitle(this.sections.title);

      if (this.sections.content) this.RenderContent(this.sections.content);

      if (this.sections.actions) this.RenderActions(this.sections.actions);
    }

    this.toplayer = ToplayerDeprecated({
      modal: true,
      size: "medium",
      children: this.contentBox,
      onClose: this.Close.bind(this),
      ...this.props,
    });

    // this.modalContainer.appendChild(this.toplayer);
  }

  RenderTitle(props: string | TitlePropsType = {}) {
    if (props instanceof HTMLElement) {
      this.#title = props;
    } else {
      if (typeof props === "string")
        // eslint-disable-next-line no-param-reassign
        props = {
          children: props,
        };

      this.#title = ContentBoxTitle({
        spacedTop: "normal",
        spacedBottom: "large",
        ...props,
      });
    }

    if (this.#title) this.contentBox.appendChild(this.#title);

    this.ObserveSection(this.#title);
  }

  RenderContent(props: ContentPropsType = {}) {
    if (props instanceof HTMLElement) {
      this.#content = props;
    } else if (props.children) this.#content = ContentBoxContent(props);

    if (this.#content) this.contentBox.appendChild(this.#content);

    this.ObserveSection(this.#content);
  }

  RenderActions(props: ActionsPropsType = {}) {
    if (props instanceof HTMLElement) {
      this.#actions = props;
    } else if (props.children) this.#actions = ContentBoxActions(props);

    if (this.#actions) this.contentBox.appendChild(this.#actions);

    this.ObserveSection(this.#actions);
  }

  ObserveSection(section: HTMLElement) {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.target) {
          // @ts-expect-error
          const { target }: { target: HTMLDivElement } = mutation;

          if (target.children.length) this.contentBox.appendChild(target);
          else HideElement(target);
        }
      });
    });

    observer.observe(section, { childList: true });
  }

  set title(container) {
    this.#title = container;
  }

  get title() {
    if (!this.#title) this.RenderTitle();

    return this.#title;
  }

  set content(container) {
    this.#content = container;
  }

  get content() {
    if (!this.#content) this.RenderContent();

    return this.#content;
  }

  set actions(container) {
    this.#actions = container;
  }

  get actions() {
    if (!this.#actions) this.RenderActions();

    return this.#actions;
  }

  /**
   * param {import("./style-guide/ContentBox/Actions").Element} element
   */
  /* set actions(element) {
    this.#actions = element;

    if (!this.actionsContainer)
      this.RenderActions();

    if (element instanceof HTMLElement)
      this.actionsContainer.appendChild(element);
    else
      this.HideElement(this.actionsContainer);

    if (this.actionsContainer.children.length)
      this.contentBox.appendChild(this.actionsContainer);
  }
  get actions() {
    if (!this.#actions)
      this.RenderActions();

    return this.#actions;
  } */
  RenderInOverlay() {
    this.container = document.createElement("div");
    this.container.className = "js-modal";

    this.flashContainer = document.createElement("div");
    this.flashContainer.className = "js-flash-container";

    this.container.appendChild(this.flashContainer);

    this.overlay = Overlay();

    this.overlay.appendChild(this.toplayer);
    this.container.appendChild(this.overlay);
  }

  get IsOpen() {
    return IsVisible(this.container);
  }

  // eslint-disable-next-line class-methods-use-this
  get modalContainer() {
    let modalContainer = document.querySelector(".js-modal-container");

    if (!modalContainer) {
      modalContainer = document.createElement("div");
      modalContainer.className = "js-modal-container";

      document.body.appendChild(modalContainer);
    }

    return modalContainer;
  }

  Open() {
    if (!this.modalContainer) console.error(".js-modal-container is undefined");

    this.modalContainer.append(this.container || this.toplayer);
  }

  Close() {
    HideElement(this.container);
  }

  Notification(options: NotificationPropsType) {
    const notificationElement = notification(options);

    if (notificationElement)
      this.flashContainer.appendChild(notificationElement);
  }
}
