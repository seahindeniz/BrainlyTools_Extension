/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import notification from "@/scripts/components/notification2";
import {
  Button,
  Flex,
  Spinner,
  SpinnerContainer,
  Text,
  Icon,
} from "@/scripts/components/style-guide";
import Action from "@/scripts/controllers/Req/Brainly/Action";
import Build from "@/scripts/helpers/Build";
import IsVisible from "@/scripts/helpers/IsVisible";
import InsertAfter from "@/scripts/helpers/InsertAfter";
import FooterQDB from "./FooterQDB";

/**
 * @typedef {{
 *  elements: {
 *    main: JQuery<HTMLElement>,
 *    openToplayerButton: JQuery<HTMLElement>,
 *    close: JQuery<HTMLElement>
 *  },
 *  data: {
 *    model_type_id: 1 | 2 | 45,
 *    model_id: number,
 *    user: {
 *      id: number,
 *      nick: string,
 *    }
 *    disabled: boolean,
 *    removed: boolean,
 *    visible: boolean,
 *    timeInterval: number,
 *  },
 *  events: {},
 *  root: {}
 * }} ZdnObject
 */

export default class Report {
  /**
   * @param {import("../").default} main
   * @param {ZdnObject} zdnObject
   */
  constructor(main, zdnObject) {
    this.main = main;
    this.zdnObject = zdnObject;
    this.container = zdnObject.elements.main.get(0);

    if (!this.container) throw Error("Cannot find container");

    this.footer = this.container.querySelector(".content > .footer");

    if (this.footer.children.length === 0)
      throw Error("Cannot find details of report box");

    this.FindFooterDetails();

    this.processing = false;
    this.deleted = false;
    this.openToplayerButton = zdnObject.elements.openToplayerButton.get(0);

    this.RelocateElement();
    this.AttachTimeAttribute();
    this.RenderProfileLink();

    // if (System.checkUserP([1, 2, 45]))

    this.BindMouseHandler();
  }

  FindFooterDetails() {
    const footerChildElements = Array.from(this.footer.children);
    /**
     * @type {HTMLDivElement}
     */
    // @ts-ignore
    this.contentOwnerDetailRow = footerChildElements.shift();
    /**
     * @type {HTMLDivElement}
     */
    // @ts-ignore
    this.reporterDetailRow = footerChildElements.shift();
  }

  RelocateElement() {
    this.main.queueContainer.append(this.container);
  }

  AttachTimeAttribute() {
    /**
     * @type {HTMLSpanElement[]}
     */
    // @ts-ignore
    const elements = this.container.querySelectorAll(
      "div.content > div.footer span.span.pull-right",
    );

    if (!elements || elements.length === 0) return;

    elements.forEach(element => {
      element.dataset.time = element.innerHTML;
    });
  }

  RenderProfileLink() {
    const profileLinkContainer = this.container.querySelector(".alert-error");

    if (!profileLinkContainer) return;

    const contentContainer = profileLinkContainer.nextElementSibling;
    const container = Build(
      Flex({
        direction: "column",
      }),
      [
        [
          Flex(),
          Text({
            size: "small",
            weight: "bold",
            target: "_blank",
            href: System.createProfileLink(this.zdnObject.data.user),
            color: "peach-dark",
            text: this.zdnObject.data.user.nick,
          }),
        ],
        [Flex(), contentContainer],
      ],
    );

    InsertAfter(container, profileLinkContainer);

    profileLinkContainer.remove();
  }

  BindMouseHandler() {
    if (this.openToplayerButton)
      this.openToplayerButton.addEventListener(
        "click",
        this.OpenToplayerButtonClicked.bind(this),
      );

    if (System.checkUserP(this.zdnObject.data.model_type_id)) {
      this.container.addEventListener(
        "mouseleave",
        this.HideButtons.bind(this),
      );
      this.container.addEventListener("mouseover", this.ShowButtons.bind(this));
    }
  }

  OpenToplayerButtonClicked() {
    if (this.zdnObject.data.disabled || this.zdnObject.data.removed) return;

    this.main.main.lastActiveReport = this.zdnObject;
  }

  HideButtons() {
    if (this.processing) return;

    this.HideSpinner();
    this.ShowUserDetailRows();
    this.main.main.HideElement(this.buttonContainer);
  }

  ShowUserDetailRows() {
    this.footer.append(this.contentOwnerDetailRow);

    if (this.reporterDetailRow) this.footer.append(this.reporterDetailRow);
  }

  ShowButtons() {
    if (
      !IsVisible(this.contentOwnerDetailRow) ||
      this.processing ||
      this.deleted
    )
      return;

    this.HideUserDetailRows();

    if (!this.buttonContainer) {
      this.RenderButtonContainer();
      this.RenderButtonSpinner();
      this.RenderDeleteButtons();
      this.RenderConfirmButton();
    }

    this.footer.append(this.buttonContainer);
  }

  HideUserDetailRows() {
    if (this.reporterDetailRow)
      this.main.main.HideElement(this.reporterDetailRow);

    this.main.main.HideElement(this.contentOwnerDetailRow);
  }

  RenderButtonContainer() {
    this.buttonContainer = Flex({
      justifyContent: "center",
    });
  }

  RenderButtonSpinner() {
    this.buttonSpinner = Spinner({
      overlay: true,
      light: true,
    });
  }

  /**
   * @param {string} [reasonType]
   * @param {{
   *  button: import("@style-guide/Button").ButtonPropsType,
   *  text: import("@style-guide/Text").TextColorType,
   * }} [components]
   */
  RenderDeleteButtons(reasonType, components) {
    const reasonIds = System.data.config.quickDeleteButtonsReasons[reasonType];
    const reasons = System.data.Brainly.deleteReasons.__withIds[reasonType];

    reasonIds.forEach((reasonId, i) => {
      const reason = reasons[reasonId];

      if (!reason) return;

      const quickActionButton = new FooterQDB(this, {
        reason,
        components,
        buttonText: i + 1,
      });

      this.buttonContainer.append(quickActionButton.container);
    });
  }

  RenderConfirmButton() {
    this.confirmButton = new Button({
      iconOnly: true,
      type: "solid-mint",
      title: System.data.locale.common.confirm,
      icon: new Icon({
        type: "check",
        size: 22,
      }),
    });
    this.confirmButtonContainer = Build(
      Flex({
        tag: "div",
        marginLeft: "s",
      }),
      [
        [
          (this.confirmButtonSpinnerContainer = SpinnerContainer()),
          this.confirmButton.element,
        ],
      ],
    );

    this.confirmButton.element.addEventListener(
      "click",
      this.Confirm.bind(this),
    );
    this.buttonContainer.append(this.confirmButtonContainer);
  }

  async Confirm() {
    if (
      !confirm(
        System.data.locale.userContent.notificationMessages
          .doYouWantToConfirmThisContent,
      )
    )
      return;

    this.processing = true;
    const { model_id } = this.zdnObject.data;
    const { model_type_id } = this.zdnObject.data;

    this.confirmButtonSpinnerContainer.append(this.buttonSpinner);

    const resConfirm = await new Action().ConfirmContent(
      model_id,
      model_type_id,
    );
    this.processing = false;

    this.HideButtons();

    if (!resConfirm)
      notification({
        html: System.data.locale.common.notificationMessages.operationError,
        type: "error",
      });
    else if (!resConfirm.success) {
      notification({
        html:
          resConfirm.message ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
        type: "error",
      });
    } else {
      this.container.classList.add("confirmed");
      System.log(model_type_id === 1 ? 19 : model_type_id === 2 ? 20 : 21, {
        user: this.zdnObject.data.user,
        data: [model_id],
      });
    }
  }

  HideSpinner() {
    this.main.main.HideElement(this.buttonSpinner);
  }

  /**
   * @param {MouseEvent} event
   */
  // eslint-disable-next-line class-methods-use-this
  DeleteButtonClicked(event) {
    /**
     * @type {HTMLElement}
     */
    // @ts-ignore
    let button = event.target;

    if (button.tagName !== "BUTTON") button = button.closest("button");
  }

  /**
   * @param {{
   *  model_id: number,
   *  reason: any,
   *  reason_title: any,
   *  reason_id: any,
   *  give_warning: boolean,
   * }} _
   * @returns {Promise<*>}
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  Delete(_) {
    throw Error("No content type specified");
  }
}
