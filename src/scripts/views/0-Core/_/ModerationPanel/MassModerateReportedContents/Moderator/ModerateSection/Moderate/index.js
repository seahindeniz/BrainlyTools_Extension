import { Button, Flex } from "@style-guide";

export default class Moderate {
  /**
   * @typedef {import("@style-guide/Button").ButtonTypeType} ButtonTypeType
   *
   * @param {import("..").default} main
   * @param {{
   *  actionName: "Delete" | "Confirm",
   *  buttonType: ButtonTypeType,
   *  selectedButtonType: ButtonTypeType,
   * }} props
   */
  constructor(main, props) {
    this.main = main;
    this.props = props;
    /**
     * @type {import("../../../Report").default[]}
     */
    this.reports = [];
    this.numberOfModeratedReports = 0;
    this.numberOfReportsInModerating = 0;

    this.RenderButton();
    this.BindListener();
  }

  RenderButton() {
    this.buttonContainer = Flex({
      children: (this.button = Button({
        type: this.props.buttonType,
        text:
          System.data.locale.core.massModerateReportedContents.moderateActions[
            this.props.actionName
          ].text,
      })),
    });

    this.main.moderateActionButtonContainer.append(this.buttonContainer);
  }

  BindListener() {
    this.button.addEventListener("click", this.Clicked.bind(this));
  }

  Clicked() {
    let { selectedModerateAction } = this.main;

    if (selectedModerateAction) {
      selectedModerateAction.Unselect();
      // this.main.main.preview.ResizeReportsContainerHeight();

      // @ts-ignore
      if (this === selectedModerateAction) {
        selectedModerateAction = undefined;

        return;
      }
    }

    // @ts-ignore
    this.main.selectedModerateAction = this;

    this.Select();
    // this.main.main.preview.ResizeReportsContainerHeight();
  }

  Select() {
    this.button.ChangeType(this.props.selectedButtonType);
  }

  Unselect() {
    this.main.selectedModerateAction = undefined;

    this.button.ChangeType(this.props.buttonType);
  }

  CheckReports() {
    if (this.reports.length > 0) return true;

    this.main.main.main.modal.Notification({
      type: "info",
      html:
        System.data.locale.core.massModerateReportedContents
          .notificationMessages.noModeratableContentLeft,
    });

    return false;
  }

  Moderating() {
    this.main.moderating = true;
    this.numberOfReportsInModerating = this.reports.length;

    this.main.main.statusBar.ShowModeratedReportsText();
    this.main.main.statusBar.ShowStopButton();

    this.TryToModerate();
    this.loopTryToModerate = setInterval(
      this.TryToModerate.bind(this),
      1000 / System.constants.Brainly.marketRequestLimit,
    );
    // this.loopTryToModerate = setInterval(this.TryToModerate.bind(this), 1000);
  }

  StopModerating() {
    this.main.moderating = false;

    this.main.main.statusBar.HideStopButton();
    clearInterval(this.loopTryToModerate);
  }

  TryToModerate() {
    const isModerating = this.IsAnyModeratorModeratingBeforeThis();

    if (isModerating) return;

    const report = this.reports.shift();

    if (!report) {
      this.StopModerating();
      return;
    }

    this.Moderate(report);
  }

  IsAnyModeratorModeratingBeforeThis() {
    // TODO name it better
    const moderatingModerators = this.main.main.main.moderators.all.filter(
      moderator => {
        return moderator.moderate.moderating;
      },
    );

    if (moderatingModerators.length === 0) return false;

    return moderatingModerators[0] !== this.main.main;
  }

  /**
   * @param {import("../../../Report").default} _
   */
  // eslint-disable-next-line no-unused-vars
  Moderate(_) {
    this.StopModerating();
    this.TryToFinishModerating();
  }

  Moderated() {
    this.numberOfReportsInModerating--;

    this.UpdateModeratedReportsNumber();
    this.TryToFinishModerating();
  }

  /**
   *
   * @param {import("../../../Report").default} report
   */
  FailedToModerate(report) {
    this.numberOfReportsInModerating--;

    report.ChangeStatus("failed");
    this.TryToFinishModerating();

    // eslint-disable-next-line no-param-reassign
    report = null;
  }

  TryToFinishModerating() {
    if (this.numberOfReportsInModerating > 0) return;

    this.FinishModerating();
  }

  FinishModerating() {
    this.Unselect();
    this.main.HideSpinner();
  }

  PauseModerating() {
    this.StopModerating();
    this.FinishModerating();
  }

  UpdateModeratedReportsNumber() {
    this.main.main.statusBar.numberOfModeratedReports.data = `${++this
      .numberOfModeratedReports}`;

    this.main.main.main.UpdateCounters();
  }
}
