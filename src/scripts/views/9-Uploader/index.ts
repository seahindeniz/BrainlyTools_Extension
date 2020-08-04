import WaitForElement from "@/scripts/helpers/WaitForElement";
import prettysize from "prettysize";
import Button from "../../components/Button";
import notification from "../../components/notification2";
import Chunk from "./_/Chunk";
import FileUpload from "./_/FileUpload";

System.pageLoaded("Supervisors page OK!");

class Uploader {
  constructor() {
    this.ServerFileURL = "";
    this.Chunk = new Chunk(this);
    this.Init();
  }

  async Init() {
    this.mainRight = await WaitForElement("#main-right");

    this.RenderUploadPanel();
    this.RenderFileInput();
    this.RenderSelectFileButton();
    this.BindHandlers();
  }

  RenderUploadPanel() {
    this.$panel = $(`
		<div class="sg-box sg-box--no-border" style="padding: 3em 0 0;">
			<div class="sg-box__hole">
				<div class="sg-content-box__content sg-content-box__content--full sg-content-box__content--spaced-bottom">
					<div class="sg-actions-list sg-actions-list--space-between">
						<div class="sg-actions-list__hole">
              <h2 class="sg-text sg-text--small sg-text--gray sg-text--bold">${System.data.locale.uploader.text}</h2>
						</div>
						<div class="sg-actions-list__hole">
              <h2 class="sg-text sg-text--small sg-text--gray sg-text--bold"></h2>
						</div>
					</div>
				</div>
				<div class="sg-horizontal-separator"></div>
				<div class="sg-content-box sg-content-box--full">
					<div class="sg-content-box__content sg-content-box__content--spaced-top">	</div>
					<div class="sg-content-box__content sg-content-box__content--spaced-top js-progress"></div>
				</div>
			</div>
		</div>`);

    this.$counterLabel = $(
      ".sg-actions-list__hole:nth-child(2) > h2",
      this.$panel,
    );
    this.$progressBoxContainer = $(".js-progress", this.$panel);
    this.$selectFileButtonContainer = $(
      ".sg-content-box > .sg-content-box__content:nth-child(1)",
      this.$panel,
    );

    this.Chunk.$counterLabel = this.$counterLabel;

    this.$panel.appendTo(this.mainRight);
  }

  RenderFileInput() {
    this.$fileInput = $(`<input type="file" multiple />`);
  }

  RenderSelectFileButton() {
    this.$selectFileButton = Button({
      type: "solid-blue",
      text: System.data.locale.uploader.selectFiles,
      fullWidth: true,
    });

    this.$selectFileButton.appendTo(this.$selectFileButtonContainer);
  }

  BindHandlers() {
    const that = this;

    this.$selectFileButton.click(() => this.$fileInput.click());
    this.$fileInput.change(function () {
      that.ProcessFiles(this.files);
      this.value = "";
    });
  }

  ProcessFiles(files) {
    if (files.length > 0) {
      for (let i = 0, file; (file = files[i]); i++) {
        this.ProcessFile(file);
      }
    }
  }

  async ProcessFile(file) {
    if (this.IsExist(file)) {
      notification({
        html: System.data.locale.uploader.notificationMessages.alreadyExist.replace(
          "%{file_name}",
          ` ${file.name} `,
        ),
        type: "error",
      });
    } else if (file.name.indexOf("\\") >= 0) {
      notification({
        html: System.data.locale.uploader.notificationMessages.fileNameCannotContainBackslash.replace(
          "%{file_name}",
          ` ${file.name} `,
        ),
        type: "error",
      });
    } else {
      const $box = this.AddProgressBox(file);
      const uploader = new FileUpload(file, $box);
      this.Chunk.AddToQueue(uploader);
    }
  }

  IsExist(file) {
    const $nameColumns = $(
      `#uploader_table > tbody > tr > td.name:contains("${file.name}")`,
    );

    return $nameColumns.length > 0;
  }

  AddProgressBox(file) {
    const $box = $(`
		<div class="sg-content-box sg-content-box--full">
			<div class="sg-content-box__content sg-content-box__content--spaced-top-small">
				<div class="sg-actions-list">
					<div class="sg-actions-list__hole sg-actions-list__hole--grow">
						<span class="sg-text sg-text--small sg-text--gray sg-text--bold file-name">${
              file.name
            }</span>
					</div>
					<div class="sg-actions-list__hole">
						<span class="sg-text sg-text--small sg-text--gray sg-text--bold">${prettysize(
              file.size,
            )}</span>
					</div>
				</div>
			</div>
		</div>`);

    $box.appendTo(this.$progressBoxContainer);

    return $box;
  }
}

new Uploader();
