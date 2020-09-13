/* eslint-disable class-methods-use-this */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import notification from "@components/notification2";
import {
  Button,
  Flex,
  Icon,
  Spinner,
  SpinnerContainer,
  Text,
} from "@style-guide";
import Action from "@BrainlyAction";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import InsertAfter from "@root/helpers/InsertAfter";
import IsVisible from "@root/helpers/IsVisible";
import { FlexElementType } from "@style-guide/Flex";
import type ReportBoxEnhancerClassType from "..";
import FooterQDB from "./FooterQDB";

type ObjectAnyType = {
  [x: string]: any;
};

export type ZdnObject = {
  elements: {
    main: JQuery<HTMLElement>;
    openToplayerButton: JQuery<HTMLElement>;
    close: JQuery<HTMLElement>;
  };
  data: {
    model_type_id: 1 | 2 | 45;
    model_id: number;
    user: {
      id: number;
      nick: string;
    };
    disabled: boolean;
    removed: boolean;
    visible: boolean;
    timeInterval: number;
  };
  events: ObjectAnyType;
  root: ObjectAnyType;
};

export default class Report {
  main: ReportBoxEnhancerClassType;
  zdnObject: ZdnObject;
  container: HTMLElement;
  footer: HTMLDivElement;
  processing: boolean;
  deleted: boolean;
  openToplayerButton: HTMLElement;
  reporterDetailRow: HTMLElement;
  buttonSpinner: HTMLDivElement;
  confirmButton: Button;
  confirmButtonContainer: FlexElementType;
  confirmButtonSpinnerContainer: HTMLDivElement;
  buttonContainer: FlexElementType;
  contentOwnerDetailRow: HTMLElement;

  constructor(main: ReportBoxEnhancerClassType, zdnObject: ZdnObject) {
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
    const footerChildElements = Array.from(
      this.footer.children,
    ) as HTMLElement[];
    this.contentOwnerDetailRow = footerChildElements.shift();
    this.reporterDetailRow = footerChildElements.shift();
  }

  RelocateElement() {
    this.main.queueContainer.append(this.container);
  }

  AttachTimeAttribute() {
    const elements: HTMLSpanElement[] = this.container.querySelectorAll(
      "div.content > div.footer span.span.pull-right",
    ) as any;

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
        [
          Flex(),
          Text({
            size: "small",
            color: "gray-secondary",
            html: contentContainer.innerHTML,
          }),
        ],
      ],
    );

    InsertAfter(container, profileLinkContainer);
    profileLinkContainer.remove();
    contentContainer.remove();
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
    HideElement(this.buttonContainer);
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
    if (this.reporterDetailRow) HideElement(this.reporterDetailRow);

    HideElement(this.contentOwnerDetailRow);
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

  RenderDeleteButtons(
    reasonType?: string,
    components?: {
      button: import("@style-guide/Button").ButtonPropsType;
      text: import("@style-guide/Text").TextColorType;
    },
  ) {
    const reasonIds = System.data.config.quickDeleteButtonsReasons[reasonType];
    const reasons = System.data.Brainly.deleteReasons.__withIds[reasonType];

    reasonIds.forEach((reasonId, i) => {
      const reason = reasons[reasonId];

      if (!reason) return;

      // @ts-expect-error
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
    HideElement(this.buttonSpinner);
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
}
