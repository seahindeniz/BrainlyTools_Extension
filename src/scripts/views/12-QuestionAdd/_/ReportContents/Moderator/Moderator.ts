import Build from "@root/scripts/helpers/Build";
import HideElement from "@root/scripts/helpers/HideElement";
import IsVisible from "@root/scripts/helpers/IsVisible";
import { Button, Flex, Icon, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type { Instance } from "tippy.js";
import tippy from "tippy.js";
import type ReportedContentsClassType from "../ReportedContents";
import type ActionSectionClassType from "./ActionSection";
import MassConfirmSection from "./MassConfirm";
import MassDeleteSection from "./MassDelete/MassDelete";

export default class Moderator {
  main: ReportedContentsClassType;

  panelButton: Button;
  panelButtonContainer: FlexElementType;
  container: FlexElementType;
  actionButtonContainer: FlexElementType;
  tippy: Instance;

  moderateSections: {
    all: (MassConfirmSection | MassDeleteSection)[];
    massConfirmSection?: MassConfirmSection;
    massDeleteSection?: MassDeleteSection;
  };

  selectedActionSection?:
    | MassConfirmSection
    | MassDeleteSection
    | ActionSectionClassType;

  stopButtonContainer: FlexElementType;
  stopButton: Button;

  constructor(main: ReportedContentsClassType) {
    this.main = main;
    this.moderateSections = {
      all: [],
    };
  }

  ShowPanelButton() {
    if (!this.panelButton) {
      this.Render();
      this.RenderPanelButton();
    }

    this.main.popupMenuContainer.append(this.panelButtonContainer);
  }

  HidePanelButton() {
    HideElement(this.panelButtonContainer);
    this.tippy?.hide();
  }

  Render() {
    this.container = Build(
      Flex({
        marginTop: "xs",
        marginBottom: "xs",
        direction: "column",
      }),
      [
        [
          Flex({
            justifyContent: "center",
          }),
          Text({
            weight: "bold",
            transform: "uppercase",
            children: System.data.locale.reportedContents.massModerate.name,
          }),
        ],
        [
          Flex({
            marginTop: "xxs",
            marginBottom: "s",
          }),
          [
            [
              Flex({
                grow: true,
                minContent: true,
                justifyContent: "center",
              }),
              Text({
                size: "xsmall",
                color: "gray",
                align: "CENTER",
                children:
                  System.data.locale.reportedContents.massModerate.description,
              }),
            ],
          ],
        ],
        (this.actionButtonContainer = Flex({
          wrap: true,
          justifyContent: "space-evenly",
        })),
      ],
    );
  }

  RenderPanelButton() {
    this.panelButtonContainer = Flex({
      marginRight: "s",
      children: this.panelButton = new Button({
        size: "l",
        iconOnly: true,
        type: "solid-light",
        toggle: "peach",
        icon: new Icon({
          type: "pencil",
          color: "adaptive",
        }),
      }),
    });

    this.tippy = tippy(this.panelButton.element, {
      theme: "light",
      trigger: "click",
      maxWidth: 700,
      interactive: true,
      placement: "bottom",
      content: this.container,
      onShow: this.InitSections.bind(this),
      onHidden: this.ResetSections.bind(this),
    });

    tippy(this.panelButton.element, {
      theme: "light",
      maxWidth: "none",
      content: Text({
        size: "small",
        weight: "bold",
        children: System.data.locale.reportedContents.massModerate.name,
      }),
    });

    this.UpdateTippySizeOnDOMChange();
  }

  UpdateTippySizeOnDOMChange() {
    const observer = new MutationObserver(mutationsList => {
      mutationsList.forEach(this.ResizeTippy.bind(this));
    });

    observer.observe(this.container, { childList: true });
  }

  async ResizeTippy() {
    await System.Delay(50);
    this.tippy.popperInstance?.update();
  }

  InitSections() {
    if (this.moderateSections.all.length > 0) return;

    this.moderateSections.massConfirmSection = new MassConfirmSection(this);
    this.moderateSections.massDeleteSection = new MassDeleteSection(this);

    this.moderateSections.all.push(
      this.moderateSections.massConfirmSection,
      this.moderateSections.massDeleteSection,
    );
  }

  ResetSections() {
    if (!this.selectedActionSection || this.selectedActionSection.moderating)
      return;

    this.selectedActionSection.Hide();
  }

  DisableButtons() {
    this.moderateSections.all.forEach(section =>
      section.actionButton.Disable(),
    );
  }

  EnableButtons() {
    this.moderateSections.all.forEach(section => section.actionButton.Enable());
  }

  ShowStopButtonContainer() {
    if (IsVisible(this.stopButtonContainer)) return;

    if (!this.stopButtonContainer) {
      this.RenderStopButtonContainer();
    }

    this.container.append(this.stopButtonContainer);
  }

  HideStopButtonContainer() {
    HideElement(this.stopButtonContainer);
  }

  RenderStopButtonContainer() {
    this.stopButtonContainer = Flex({
      marginTop: "s",
      justifyContent: "center",
    });
  }

  ShowStopButton() {
    if (!this.stopButton) {
      this.RenderStopButton();
    }

    this.ShowStopButtonContainer();
    this.stopButtonContainer.append(this.stopButton.element);
  }

  HideStopButton() {
    HideElement(this.stopButton.element);
  }

  RenderStopButton() {
    this.stopButton = new Button({
      type: "solid-blue",
      children: System.data.locale.common.stop,
      onClick: this.selectedActionSection.StopModerating.bind(
        this.selectedActionSection,
      ),
    });
  }
}
