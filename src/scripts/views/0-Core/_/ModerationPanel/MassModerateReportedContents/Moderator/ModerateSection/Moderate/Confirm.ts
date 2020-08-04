import Action from "@BrainlyAction";
import Moderate from ".";

export default class Confirm extends Moderate {
  /**
   * @param {import("..").default} main
   */
  constructor(main) {
    super(main, {
      actionName: "Confirm",
      buttonType: {
        type: "outline",
        toggle: "mint",
      },
      selectedButtonType: {
        type: "solid-mint",
      },
    });
  }

  Select() {
    this.reports = this.main.main.filteredReports.filter(report => {
      return !report.deleted && !report.confirmed;
    });

    if (
      !this.CheckReports() ||
      !confirm(
        System.data.locale.core.massModerateReportedContents.moderateActions.Confirm.confirmModeration.replace(
          /%\{n}/gi,
          `${this.reports.length}`,
        ),
      )
    ) {
      this.Unselect();
      return;
    }

    super.Select();
    this.Moderating();
    this.main.ShowSpinner();
  }

  Moderating() {
    super.Moderating();
  }

  /**
   * @param {import("../../../Report").default} report
   */
  async Moderate(report) {
    try {
      let resConfirm = await new Action().ConfirmContent(
        report.data.model_id,
        report.data.model_type_id,
      );

      if (!resConfirm || !resConfirm.success)
        throw Error(`Failed to confirm ${report.is} ${report.data.model_id}`);

      report.ChangeStatus("confirmed");
      this.Moderated();

      resConfirm = null;
    } catch (error) {
      this.FailedToModerate(report);
      console.error(error);
    }

    // eslint-disable-next-line no-param-reassign
    report = null;
  }
}
