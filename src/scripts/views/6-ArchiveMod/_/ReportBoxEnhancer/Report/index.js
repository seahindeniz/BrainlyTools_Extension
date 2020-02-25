import notification from "@/scripts/components/notification2";
import {
  ButtonRound,
  Flex,
  Spinner,
  SpinnerContainer,
  Text
} from "@/scripts/components/style-guide";
import Action from "@/scripts/controllers/Req/Brainly/Action";
import Build from "@/scripts/helpers/Build";
import IsVisible from "@/scripts/helpers/IsVisible";
import FooterQDB from "./FooterQDB";
import InsertAfter from "@/scripts/helpers/InsertAfter";

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
    this.container = zdnObject.elements.main[0];
    this.footer = this.container.querySelector(".content > .footer");
    /**
     * @type {HTMLDivElement}
     */
    // @ts-ignore
    this.contentOwnerDetailRow = this.footer.children[0];
    /**
     * @type {HTMLDivElement}
     */
    // @ts-ignore
    this.reporterDetailRow = this.footer.children[1];
    this.processing = false;
    this.deleted = false;

    this.RelocateElement();
    this.AttachTimeAttribute();
    this.RenderProfileLink();

    //if (System.checkUserP([1, 2, 45]))

    if (System.checkUserP(this.zdnObject.data.model_type_id))
      this.BindMouseHandler()
  }
  RelocateElement() {
    this.main.queueContainer.append(this.container);
  }
  AttachTimeAttribute() {
    /**
     * @type {HTMLSpanElement[]}
     */
    // @ts-ignore
    let elements = this.container.querySelectorAll(
      "div.content > div.footer span.span.pull-right");

    if (!elements || elements.length == 0)
      return;

    elements.forEach(element => {
      element.dataset.time = element.innerHTML;
    })
  }
  RenderProfileLink() {
    let profileLinkContainer = this.container.querySelector(".alert-error");

    if (!profileLinkContainer)
      return;

    let contentContainer = profileLinkContainer.nextElementSibling;
    let container = Build(Flex({
      direction: "column",
    }), [
      [
        Flex(),
        Text({
          size: "small",
          weight: "bold",
          target: "_blank",
          href: System.createProfileLink(this.zdnObject.data.user),
          color: "peach-dark",
          text: this.zdnObject.data.user.nick,
        })
      ],
      [
        Flex(),
        contentContainer
      ]
    ]);

    InsertAfter(container, profileLinkContainer);

    profileLinkContainer.remove();
  }
  BindMouseHandler() {
    this.container
      .addEventListener("mouseleave", this.HideButtons.bind(this));
    this.container.addEventListener("mouseover", this.ShowButtons.bind(
      this));
  }
  HideButtons() {
    if (this.processing)
      return;

    this.HideSpinner();
    this.ShowUserDetailRows();
    this.main.main.HideElement(this.buttonContainer);
  }
  ShowUserDetailRows() {
    this.footer.append(this.contentOwnerDetailRow);
    this.footer.append(this.reporterDetailRow);
  }
  ShowButtons() {
    if (
      !IsVisible(this.reporterDetailRow) ||
      this.processing || this.deleted
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
      size: "small",
      light: true,
    });
  }
  /**
   * @param {string} [reasonType]
   * @param {{
   *  button: import("@style-guide/ButtonRound").RoundButtonColorType,
   *  text: import("@style-guide/Text").TextColorType,
   * }} [color]
   */
  RenderDeleteButtons(reasonType, color) {
    let reasonIds = System.data.config.quickDeleteButtonsReasons[reasonType];
    let reasons = System.data.Brainly.deleteReasons.__withIds[reasonType];

    reasonIds.forEach((reasonId, i) => {
      let reason = reasons[reasonId];

      if (!reason)
        return;

      let quickActionButton = new FooterQDB(this, {
        reason,
        color,
        buttonText: i + 1,
      });

      this.buttonContainer.append(quickActionButton.container);
    });
  }
  RenderConfirmButton() {
    this.confirmButton = ButtonRound({
      icon: {
        type: "check",
        size: 22,
      },
      color: "mint",
      title: System.data.locale.common.confirm,
      filled: true,
    });
    this.confirmButtonContainer = Build(Flex({
      tag: "div",
      marginLeft: "s",
    }), [
      [
        this.confirmButtonSpinnerContainer = SpinnerContainer(),
        this.confirmButton
      ]
    ]);

    this.confirmButton.addEventListener("click", this.Confirm.bind(this));
    this.buttonContainer.append(this.confirmButtonContainer);
  }
  async Confirm() {
    if (!confirm(System.data.locale.userContent.notificationMessages
        .doYouWantToConfirmThisContent))
      return;

    this.processing = true;
    let model_id = this.zdnObject.data.model_id;
    let model_type_id = this.zdnObject.data.model_type_id;

    this.confirmButtonSpinnerContainer.append(this.buttonSpinner);

    let resConfirm = await new Action()
      .ConfirmContent(model_id, model_type_id);
    this.processing = false;

    this.HideButtons();

    if (!resConfirm)
      notification({
        html: System.data.locale.common.notificationMessages
          .operationError,
        type: "error"
      });
    else if (!resConfirm.success) {
      notification({
        html: resConfirm.message || System.data.locale.common
          .notificationMessages.somethingWentWrong,
        type: "error"
      });
    } else {
      this.container.classList.add("confirmed");
      System.log(
        model_type_id == 1 ? 19 : model_type_id == 2 ? 20 : 21, {
          user: this.zdnObject.data.user,
          data: [model_id],
        }
      );
    }
  }
  HideSpinner() {
    this.main.main.HideElement(this.buttonSpinner);
  }
  /**
   * @param {MouseEvent} event
   */
  DeleteButtonClicked(event) {
    /**
     * @type {HTMLElement}
     */
    // @ts-ignore
    let button = event.target;

    if (button.tagName != "BUTTON")
      button = button.closest("button");
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
  Delete(_) {
    return Promise.reject("No content type specified");
  }
}
