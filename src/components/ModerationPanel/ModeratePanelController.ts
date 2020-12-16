import { ModerationTicketDataType } from "@BrainlyAction";
import getModalContainer from "@components/helpers/getModalContainer";
import HideElement from "@root/helpers/HideElement";
import { Overlay, Spinner } from "@style-guide";
import ModerationPanel, { ModeratePanelActionType } from "./ModerationPanel";

export type ContentNameType = "Question" | "Answer" | "Comment";

type ModeratePanelControllerPropsType = {
  switcher?: boolean;
};

export default class ModeratePanelController {
  props: ModeratePanelControllerPropsType;

  modalContainer: HTMLDivElement;
  loadingOverlay: HTMLDivElement;
  moderationPanel: ModerationPanel;

  constructor(props: ModeratePanelControllerPropsType = {}) {
    this.props = props;

    this.RenderLoadingOverlay();
    this.BindListener();
  }

  RenderLoadingOverlay() {
    this.loadingOverlay = Overlay({
      children: Spinner({
        overlay: true,
        light: true,
        size: "xxxlarge",
      }),
    });
  }

  BindListener() {
    if (this.props.switcher)
      document.addEventListener("keyup", this.SwitchHandler.bind(this));
  }

  SwitchHandler(event: KeyboardEvent) {
    if (
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey ||
      event.metaKey ||
      !this.moderationPanel ||
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLSelectElement ||
      event.target instanceof HTMLOptionElement ||
      event.target instanceof HTMLTextAreaElement
    )
      return;

    if (event.code === "KeyA" || event.code === "ArrowLeft")
      this.SwitchToPreviousReport();
    else if (event.code === "KeyD" || event.code === "ArrowRight")
      this.SwitchToNextReport();
  }

  OpenModeratePanel(resTicket: ModerationTicketDataType) {
    if (resTicket.success === false) return;

    this.moderationPanel = new ModerationPanel(
      resTicket.data,
      resTicket.users_data,
      {
        onClose: this.ModerationPanelClosed.bind(this),
        onModerate: this.SomethingModerated.bind(this),
        switchNext: this.props.switcher && this.SwitchToNextReport.bind(this),
        switchPrevious:
          this.props.switcher && this.SwitchToPreviousReport.bind(this),
      },
    );
  }

  ModerationPanelClosed() {
    this.moderationPanel = null;
    // this.contentCurrentlyModerating = null;
  }

  SomethingModerated(
    id: number,
    action: ModeratePanelActionType,
    contentType: ContentNameType,
  ) {
    console.warn(id, action, contentType, this);
  }

  SwitchToNextReport() {
    this.SwitchToReport("next");
  }

  SwitchToPreviousReport() {
    this.SwitchToReport("previous");
  }

  SwitchToReport(direction: "next" | "previous") {
    console.warn(direction, this);
  }

  ShowLoadingOverlay() {
    if (!this.modalContainer) {
      this.modalContainer = getModalContainer();

      if (!this.modalContainer)
        console.error(".js-modal-container is undefined");
    }

    this.modalContainer.append(this.loadingOverlay);
  }

  HideLoadingOverlay() {
    HideElement(this.loadingOverlay);
  }
}
