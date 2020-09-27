import notification from "@components/notification2";
import ActionSection from "./ActionSection";
import type ModeratorClassType from "./Moderator";

export default class MassConfirmSection extends ActionSection {
  constructor(main: ModeratorClassType) {
    super(
      main,
      {
        type: "outline",
        children: System.data.locale.common.confirm,
      },
      {
        type: "outline",
        toggle: "mint",
      },
    );
  }

  async ActionButtonClicked() {
    if (this.moderating) return;

    this.main.selectedActionSection?.Hide();
    this.main.HideStopButtonContainer();
    await System.Delay(50);

    this.contents = this.main.main.contents.filtered.filter(
      content =>
        content.has !== "reserved" &&
        content.has !== "confirmed" &&
        content.has !== "deleted",
    );

    if (this.contents.length === 0) {
      notification({
        type: "info",
        text:
          System.data.locale.reportedContents.massModerate.confirm
            .noContentToConfirm,
      });

      return;
    }

    if (
      !confirm(
        System.data.locale.reportedContents.massModerate.confirm.confirmModeration.replace(
          /%\{n}/gi,
          `${this.contents.length}`,
        ),
      )
    ) {
      return;
    }

    this.StartConfirming();
  }

  async StartConfirming() {
    await this.HighlightActionButton();
    await this.Moderating();
    this.TryToConfirm();

    this.loopTryToModerate = window.setInterval(
      this.TryToConfirm.bind(this),
      1000,
      // 360,
    );
  }

  TryToConfirm() {
    const contents = this.contents.splice(0, 7);

    if (contents.length === 0) {
      this.StopModerating();

      return;
    }

    contents.forEach(async content => {
      await content.ExpressConfirm();

      if (content.has === "failed")
        this.main.main.statusBar.IncreaseNumberOfFailed();
      else this.main.main.statusBar.IncreaseNumberOfModeration();

      if (this.contents.length > 0) return;

      await System.Delay(50);
      this.FinishModerating();
    });
  }
}
