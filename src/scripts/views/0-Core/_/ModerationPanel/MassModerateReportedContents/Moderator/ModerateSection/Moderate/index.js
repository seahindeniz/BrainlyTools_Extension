// @flow

import { Button, Flex } from "@style-guide";
import { type ButtonColorType } from "@style-guide/Button";
import type ModerateSection from "..";
import type Report from "../../../Report";

type propsType = {
  actionName: "Delete" | "Confirm",
  buttonType: ButtonColorType,
  selectedButtonType: ButtonColorType,
};

export default class Moderate {
  main: ModerateSection;
  props: propsType;
  reports: Report[];
  numberOfModeratedReports: number;
  numberOfReportsInModerating: number;
  buttonContainer: HTMLElement;
  button: Button;
  loopTryToModerate: IntervalID;

  constructor(main: ModerateSection, props: propsType) {
    this.main = main;
    this.props = props;
    this.reports = [];
    this.numberOfModeratedReports = 0;
    this.numberOfReportsInModerating = 0;

    this.RenderButton();
    this.BindListener();
  }

  RenderButton() {
    this.buttonContainer = Flex({
      children: (this.button = new Button({
        ...this.props.buttonType,
        text:
          System.data.locale.core.massModerateReportedContents.moderateActions[
            this.props.actionName
          ].text,
      })),
    });

    this.main.moderateActionButtonContainer.append(this.buttonContainer);
  }

  BindListener() {
    this.button.element.addEventListener("click", this.Clicked.bind(this));
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

  // eslint-disable-next-line no-unused-vars
  Moderate(_: Report) {
    this.StopModerating();
    this.TryToFinishModerating();
  }

  Moderated() {
    this.numberOfReportsInModerating--;

    this.UpdateModeratedReportsNumber();
    this.TryToFinishModerating();
  }

  FailedToModerate(report: Report) {
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
