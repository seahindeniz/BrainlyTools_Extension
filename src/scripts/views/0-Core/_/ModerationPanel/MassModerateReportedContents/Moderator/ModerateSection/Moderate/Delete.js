import DeleteSection from "@/scripts/components/DeleteSection";
import Build from "@/scripts/helpers/Build";
import Action from "@BrainlyAction";
import { Button, Flex, Text } from "@style-guide";
import Moderate from ".";

export default class Delete extends Moderate {
  /**
   * @param {import("..").default} main
   */
  constructor(main) {
    super(main, {
      actionName: "Delete",
      buttonType: "outline-peach",
      selectedButtonType: "solid-peach",
    });

    this.deleteSections = {
      Question: {
        /**
         * @type {DeleteSection}
         */
        deleteSection: undefined,
        /**
         * @type {HTMLElement}
         */
        container: undefined,
      },
      Answer: {
        /**
         * @type {DeleteSection}
         */
        deleteSection: undefined,
        /**
         * @type {HTMLElement}
         */
        container: undefined,
      },
    };

    this.RenderDeleteReasonSections();
    this.RenderStartButton();
    this.BindStartButtonListener();
  }

  RenderDeleteReasonSections() {
    Object.entries(this.deleteSections).forEach(
      /**
       * @param {["Question" | "Answer", *]} param0
       */
      ([contentTypeName, entry]) => {
        entry.container = Build(
          Flex({
            marginTop: "l",
            direction: "column",
          }),
          [
            [
              Flex(),
              Text({
                size: "large",
                text:
                  System.data.locale.core.massModerateReportedContents
                    .moderateActions.Delete.choose[contentTypeName],
              }),
            ],
          ],
        );
        entry.deleteSection = new DeleteSection({
          type: contentTypeName,
          noSpacedTop: true,
          verticalOptions: true,
        });

        entry.container.append(
          Flex({
            marginLeft: "xs",
            children: entry.deleteSection.$[0],
          }),
        );
      },
    );
  }

  RenderStartButton() {
    this.startButtonContainer = Flex({
      marginTop: "m",
      marginBottom: "xs",
      justifyContent: "center",
      fullWidth: true,
      children: (this.startButton = new Button({
        type: "solid-peach",
        text: `${System.data.locale.common.start}!`,
      })),
    });
  }

  BindStartButtonListener() {
    this.startButton.element.addEventListener(
      "click",
      this.StartModerating.bind(this),
    );
  }

  StartModerating() {
    this.reports = this.main.main.filteredReports.filter(report => {
      return !report.deleted;
    });

    if (
      !this.IsDeleteReasonsSelected() ||
      !this.CheckReports() ||
      !confirm(
        System.data.locale.core.massModerateReportedContents.moderateActions.Delete.confirmDeletion.replace(
          /%\{n}/gi,
          `${this.reports.length}`,
        ),
      )
    )
      return;

    this.Moderating();
    this.main.ShowSpinner();
  }

  IsDeleteReasonsSelected() {
    return (
      Object.values(
        this.main.main.filtersByName.ContentType.contentTypes,
      ).filter(type => {
        return (
          type.selected &&
          this.deleteSections[type.name].deleteSection.selectedReason
        );
      }).length > 0
    );
  }

  Moderating() {
    super.Moderating();
    this.HideStartButton();
    this.main.main.preview.ResizeReportsContainerHeight();
  }

  Select() {
    super.Select();
    this.ToggleDeleteSections();
  }

  Unselect() {
    super.Unselect();
    this.ToggleDeleteSections();
  }

  ToggleDeleteSections() {
    let showStartButton = false;

    const namesOfSelectedContentTypes = this.NamesOfSelectedContentTypes();

    /* Object.entries(this.main.main.contentTypes)
      .forEach(([typeName, typeDetails]) => { */
    this.main.main.main.contentTypeNames.forEach(name => {
      if (
        this.main.selectedModerateAction === this &&
        ((namesOfSelectedContentTypes.length === 0 &&
          this.main.main.FiltersInUse()) ||
          namesOfSelectedContentTypes.includes(name))
      ) {
        showStartButton = true;

        this.ShowDeleteSection(name);
      } else
        this.main.main.main.HideElement(this.deleteSections[name].container);
    });

    if (showStartButton) this.ShowStartButton();
    else this.HideStartButton();

    this.main.main.preview.ResizeReportsContainerHeight();
  }

  NamesOfSelectedContentTypes() {
    return Object.values(this.main.main.filtersByName.ContentType.contentTypes)
      .map(type => type.selected && type.name)
      .filter(Boolean);
  }

  ShowDeleteSections() {
    const namesOfSelectedContentTypes = this.NamesOfSelectedContentTypes();

    this.main.main.main.contentTypeNames.forEach(name => {
      if (
        namesOfSelectedContentTypes.length === 0 ||
        namesOfSelectedContentTypes.includes(name)
      )
        this.ShowDeleteSection(name);
    });
  }

  HideDeleteSections() {
    const entries = Object.values(this.deleteSections);

    entries.forEach(entry => {
      this.main.main.main.HideElement(entry.container);
    });
  }

  /**
   * @param {"Question" | "Answer"} name
   */
  ShowDeleteSection(name) {
    this.main.container.append(this.deleteSections[name].container);
  }

  ShowStartButton() {
    this.main.container.append(this.startButtonContainer);
  }

  HideStartButton() {
    this.main.main.main.HideElement(this.startButtonContainer);
  }

  /**
   * @param {import("../../../Report").default} report
   */
  async Moderate(report) {
    try {
      let action = new Action();
      let resDelete;
      const { deleteSection } = this.deleteSections[report.is];
      const contentData = {
        model_id: report.data.model_id,
        reason_id: deleteSection.selectedReason.id,
        reason: deleteSection.reasonText,
        give_warning: deleteSection.giveWarning,
      };

      if (report.is === "Question" || report.is === "Answer")
        contentData.take_points = deleteSection.takePoints;

      if (report.is === "Question")
        contentData.return_points = deleteSection.returnPoints;

      if (report.is === "Question")
        resDelete = await action.RemoveQuestion(contentData, true);

      if (report.is === "Answer")
        resDelete = await action.RemoveAnswer(contentData, true);

      if (!resDelete || !resDelete.success)
        throw Error(`Failed to delete ${report.is} ${report.data.model_id}`);

      report.ChangeStatus("deleted");
      this.Moderated();

      action = null;
      resDelete = null;
    } catch (error) {
      this.FailedToModerate(report);
      console.error(error);
    }

    // eslint-disable-next-line no-param-reassign
    report = null;
  }
}
