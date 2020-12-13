import Action from "@BrainlyAction";

export default class FileUpload {
  file: File;
  $box: JQuery<HTMLElement>;

  constructor(file: File, $box: JQuery<HTMLElement>) {
    this.file = file;
    this.$box = $box;
  }

  async Upload() {
    const res = await new Action().UploadFile(
      this.file,
      this.OnProgress.bind(this),
    );
    // let res = await System.Delay(System.randomNumber(1, 3) * 1000);

    this.$box.slideUp("normal", () => this.$box.remove());

    return res;
  }

  OnProgress(progressEvent) {
    const percent = Action.CalculateProgressPercent(progressEvent);

    this.$box.css(
      "background",
      `linear-gradient(to right, #b9e2fe ${percent}%, #fff ${percent}%)`,
    );
  }
}
