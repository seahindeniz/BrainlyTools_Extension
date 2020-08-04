import Build from "@/scripts/helpers/Build";
import IsVisible from "@/scripts/helpers/IsVisible";
import { Flex, Spinner } from "@style-guide";
import { FlexElementType } from "@style-guide/Flex";
import Confirm from "./Moderate/Confirm";
import Delete from "./Moderate/Delete";
import type ModeratorClassType from "..";

export default class ModerateSection {
  main: ModeratorClassType;

  moderating: boolean;

  container: FlexElementType;
  moderateActionsContainer: FlexElementType;
  moderateActionButtonContainer: FlexElementType;
  spinner: HTMLDivElement;

  actions: {
    Confirm: Confirm;
    Delete: Delete;
  };

  selectedModerateAction?: Confirm | Delete;

  constructor(main: ModeratorClassType) {
    this.main = main;
    this.moderating = false;

    this.Render();
    this.RenderSpinner();
    this.InitActions();
  }

  Render() {
    this.container = Build(
      Flex({
        fullWidth: true,
        direction: "column",
        marginTop: "xl",
      }),
      [
        [
          (this.moderateActionsContainer = Flex({
            noShrink: true,
            marginTop: "s",
            direction: "column",
          })),
          (this.moderateActionButtonContainer = Flex({
            noShrink: true,
            justifyContent: "space-around",
          })),
        ],
      ],
    );

    this.container.addEventListener("click", () => {});
  }

  RenderSpinner() {
    this.spinner = Spinner({
      opaque: true,
      overlay: true,
      size: "xxxlarge",
    });
  }

  InitActions() {
    this.actions = {
      Confirm: new Confirm(this),
      Delete: new Delete(this),
    };
    this.selectedModerateAction = undefined;
  }

  Show() {
    if (
      this.main.filteredReports.length === 0 ||
      IsVisible(this.container.parentElement)
    )
      return;

    this.main.actionsContainer.append(this.container);
    // this.actions.Delete.ToggleDeleteSections();
  }

  Hide() {
    if (!IsVisible(this.container.parentElement)) return;

    this.main.main.HideElement(this.container);
    this.actions.Delete.ToggleDeleteSections();
  }

  ShowSpinner() {
    this.main.actionsContainer.style.position = "relative";

    this.main.actionsContainer.append(this.spinner);
  }

  HideSpinner() {
    this.main.actionsContainer.style.position = "";

    this.main.statusBar.HideSpinner();
    this.main.main.HideElement(this.spinner);
  }
}
