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
      {
        type: "solid-mint",
      },
    );
  }

  async ActionButtonSelected() {
    this.UpdateFilteredContentsStore();

    if (this.contents.length === 0) {
      notification({
        type: "info",
        text:
          System.data.locale.reportedContents.massModerate.confirm
            .noContentToConfirm,
      });

      return;
    }

    await this.HighlightActionButton();
    this.ShowModerateButtons();
  }

  UpdateFilteredContentsStore() {
    this.contents = this.main.main.contents.filtered.filter(
      content =>
        content.has !== "confirmed" &&
        content.has !== "deleted" &&
        content.ignored !== true,
    );
  }

  Hide() {
    this.HideModerateButtons();
    super.Hide();
  }

  async StartModerating() {
    if (this.moderatableContents.length === 0) {
      notification({
        type: "info",
        text:
          System.data.locale.reportedContents.massModerate.confirm
            .noContentToConfirm,
      });
      this.EnableModerateButtons();

      return;
    }

    if (
      !confirm(
        System.data.locale.reportedContents.massModerate.confirm.confirmModeration.replace(
          /%\{n}/gi,
          `${this.moderatableContents.length}`,
        ),
      )
    ) {
      this.EnableModerateButtons();

      return;
    }

    // await this.HighlightActionButton();
    await this.Moderating();
    this.TryToConfirm();

    this.loopTryToModerate = window.setInterval(
      this.TryToConfirm.bind(this),
      1000,
      // 360,
    );
  }

  TryToConfirm() {
    const contents = this.moderatableContents.splice(0, 4);

    if (contents.length === 0) {
      this.StopModerating();

      return;
    }

    contents.forEach(async content => {
      await content.ExpressConfirm();
      // await System.TestDelay(800, 1500);
      // content.Confirmed();

      this.ContentModerated(content);
    });
  }
}
