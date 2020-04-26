import Build from "@/scripts/helpers/Build";
import IsVisible from "@/scripts/helpers/IsVisible";
import { Flex, Spinner } from "@style-guide";
import Confirm from "./Moderate/Confirm";
import Delete from "./Moderate/Delete";

export default class ModerateSection {
  /**
   * @param {import("..").default} main
   */
  constructor(main) {
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
    /**
     * @type {Confirm | Delete}
     */
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
