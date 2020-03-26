import JSZip from "jszip";
import prettysize from "prettysize";
import notification from "../../../components/notification";
import Progress from "../../../components/Progress";
import ServerReq from "@ServerReq";
import FileIcon from "../../../helpers/FileIcon";
import Button from "../../../components/Button";

export default class AccountDeleteReporter {
  constructor() {
    this.evidencePool = {};
    this.$deleteForm = $(`#DelUserAddForm`);
    this.$deleteLink = this.$deleteForm.prev();

    if (System.checkUserP(0)) {
      this.$deleteForm.addClass("always-hidden");
      this.BindOneClickDeleteListener();

      return this;
    }

    this.Render();
    this.RenderAddFileInput();
    this.RenderAddFileButton();
    this.RenderProgress();
    this.BindHandlers();
  }
  BindOneClickDeleteListener() {
    this.$deleteLink.on("click", this.OneClickDelete.bind(this));
  }
  OneClickDelete() {
    if (!confirm("Do you want to delete this profile?"))
      return;

    this.$deleteForm.submit();
  }
  Render() {
    let $deleteButtonContainer = $(`> div.submit`, this.$deleteForm);

    if (this.$deleteForm.length > 0) {
      this.$evidences = $(`
			<div class="evidences">
				<div class="container">
					<label>${System.data.locale.userProfile.accountDelete.evidences}:</label>
					<div class="sg-content-box__content sg-content-box__content--spaced-top">
						<div class="sg-content-box addFile">
							<div class="sg-content-box__content sg-content-box__content--with-centered-text sg-content-box__content--spaced-top">

							</div>
						</div>
					</div>
				</div>
				<div class="container sg-text--to-center">
					<label for="comment">${System.data.locale.userProfile.accountDelete.yourComment}:</label>
					<textarea name="comment" id="comment" style="margin-top: 3px;"></textarea>
				</div>
			</div>`);

      this.$comment = $("textarea#comment", this.$evidences);
      this.$addFileButtonWrapper = $(".sg-content-box", this.$evidences);
      this.$addFileButtonContainer = $(".sg-content-box__content", this
        .$addFileButtonWrapper);
      this.$progressHole = $(".container.progress", this.$evidences);

      this.$evidences.insertBefore($deleteButtonContainer);
    }
  }
  RenderAddFileInput() {
    this.$addFileInput = $(`<input type="file" multiple>`);
  }
  RenderAddFileButton() {
    this.$addFileButton = Button({
      tag: "label",
      size: "small",
      icon: {
        type: "attachment"
      },
      text: `${System.data.locale.userProfile.accountDelete.addFiles}..`
    });

    this.$addFileButton.appendTo(this.$addFileButtonContainer);
  }
  RenderProgress() {
    this.$progressHole = $(`<div class="container"></div>`);
    this.progress = new Progress({
      type: "is-success",
      label: "",
      max: 100
    });

    this.$progressHole.appendTo(this.$evidences);
  }
  BindHandlers() {
    let that = this;

    this.$addFileButton.click(() => {
      this.$addFileInput.click();
    });
    this.$deleteForm.on('submit', function(event) {
      event.preventDefault();

      that.DeleteFormSubmited(this);
    });

    this.$addFileInput.on("change", function() {
      that.ProcessFiles(this.files);
      this.value = "";
    });

    if (this.$evidences) {
      this.$evidences
        .on("click", ".evidence:not(.previewing) .preview > *", function() {
          let evidence = $(this).parents(".evidence");

          that.ShowPreview(evidence)
        })
        .on("click", ".evidence .sg-button", function() {
          let $parent = $(this).parents(".evidence");

          if ($parent.is(".previewing")) {
            that.ClosePreview($parent);
          } else {
            that.RemoveListItem($parent);
          }
        });
    }
  }
  async DeleteFormSubmited(form) {
    this.$progressHole.html("");

    if (this.IsFormFilled() || confirm(System.data.locale.userProfile
        .notificationMessages.confirmNoEvidenceOrComment)) {
      try {
        this.ShowProgress();
        await this.PrepareForm();

        let resAccountDeleteReport = await this
          .SendFormDataToExtensionServer();

        if (!resAccountDeleteReport || !resAccountDeleteReport.success) {
          return notification(System.data.locale.userProfile
            .notificationMessages.unableToReportAccountDeleting + (
              resAccountDeleteReport.message ? (
                `\n${resAccountDeleteReport.message}`) : ""), "error");
        }

        this.progress.UpdateLabel(System.data.locale.common.done);
        form.submit();
      } catch (error) {
        console.error(error);
        notification(System.data.locale.userProfile.notificationMessages
          .unableToReportAccountDeleting, "error");
      }
    }
  }
  ShowProgress() {
    this.progress.$container.appendTo(this.$progressHole);
  }
  IsFormFilled() {
    let comment = this.$comment.val();

    return (
      !!comment ||
      Object.keys(this.evidencePool).length > 0
    );
  }
  ProcessFiles(files) {
    if (files && files.length > 0) {
      for (let i = 0, file;
        (file = files[i]); i++
      ) {
        this.ProcessFile(file);
      };
    }
  }
  ProcessFile(file) {
    if (file.size > System.constants.config.MAX_FILE_SIZE_OF_EVIDENCE) {
      notification(System.data.locale.userProfile.notificationMessages
        .fileSizeExceeded.replace("%{file_name}", file.name).replace(
          "%{file_size}",
          `${System.constants.config.MAX_FILE_SIZE_OF_EVIDENCE_IN_MB} MB`));
    } else {
      let fileExtension = file.name.split('.').pop();
      let isShortcut = /lnk|url|xnk/.test(fileExtension);

      if (!isShortcut || confirm(System.data.locale.userProfile
          .notificationMessages.aShortcutFile)) {
        let evidenceId = `${Date.now()}_${System.randomNumber(0,9999)}`;

        this.evidencePool[evidenceId] = {
          file,
          element: this.RenderEvidence(file, evidenceId)
        };
      }
    }
  }
  RenderEvidence(file, evidenceId) {
    let $evidence = $(`
		<div class="sg-content-box sg-content-box--full evidence" data-evidenceid="${evidenceId}">
			<div class="sg-content-box__content sg-content-box__content--spaced-top-small">
				<div class="sg-actions-list">
					<div class="sg-actions-list__hole"></div>
					<div class="sg-actions-list__hole sg-actions-list__hole--grow sg-text--to-right">
						<span class="sg-text sg-text--small sg-text--gray sg-text--bold" title="${file.name}">${file.name.replace(/[\s|⠀]{2,}/gm," ").trim()}</span>
						<i class="sg-text sg-text--xsmall sg-text--gray-secondary">${prettysize(file.size)} &nbsp;</i>
					</div>
					<div class="sg-actions-list__hole">
						<div class="sg-icon sg-icon--x32 preview">
							<img class="sg-avatar__image" src="">
						</div>
					</div>
				</div>
			</div>
    </div>`);

    let $buttonContainer = $(".sg-actions-list__hole:nth-child(1)",
      $evidence);
    let $button = Button({
      type: "destructive",
      size: "small",
      icon: {
        type: "ext-trash"
      },
      tag: "span"
    });

    $button.appendTo($buttonContainer);
    $evidence.insertBefore(this.$addFileButtonWrapper);

    let $iconImg = $(".preview > img", $evidence);
    new FileIcon(file, $iconImg);

    return $evidence;
  }
  RemoveListItem($evidence) {
    let evidenceId = $evidence.data("evidenceid");

    $evidence.remove();
    delete this.evidencePool[evidenceId];
  }
  ShowPreview($evidence) {
    $evidence.addClass("previewing");
    $("video, audio", $evidence).attr("controls", "true");
    $("a use", $evidence).attr("xlink:href", "#icon-close");
  }
  ClosePreview($evidence) {
    $evidence.removeClass("previewing");
    $("video, audio", $evidence).removeAttr("controls").trigger("pause");
    $("a use", $evidence).attr("xlink:href", "#icon-trash");
  }
  SendFormDataToExtensionServer() {
    return new ServerReq().AccountDeleteReport(this.formData, this
      .UpdateUploadProgress.bind(this));
  }
  UpdateUploadProgress(event) {
    var percent = 0;
    var position = event.loaded || event.position;
    var total = event.total;

    if (event.lengthComputable) {
      percent = position / total * 100;
    }

    this.progress.update(percent);
    this.progress.UpdateLabel(System.data.locale.userProfile.accountDelete
      .uploading.replace("%{percentage_value}", ` ${Math.ceil(percent)} `));
  }
  async PrepareForm() {
    this.formData = new FormData();
    let comment = this.$comment.val();
    let fileDetails = await this.PrepareFile();

    this.formData.append("comment", comment);
    this.formData.append("id", profileData.id);
    this.formData.append("nick", profileData.nick);
    this.formData.append("url", System.createProfileLink(profileData));

    if (fileDetails)
      this.formData.append("file", fileDetails.file, fileDetails.name);

    return Promise.resolve();
  }
  async PrepareFile() {
    let evidenceIds = Object.keys(this.evidencePool);
    let fileDetails;

    if (evidenceIds.length == 1) {
      let file = this.evidencePool[evidenceIds[0]].file;
      fileDetails = {
        file,
        name: file.name
      }

    } else if (evidenceIds.length > 1) {
      let file = await this.CompressStoredFiles();
      fileDetails = {
        file,
        name: `${profileData.nick}-${profileData.id}.zip`
      }
    }

    return Promise.resolve(fileDetails);
  }
  CompressStoredFiles() {
    let evidenceIds = Object.keys(this.evidencePool);
    let zip = new JSZip();

    evidenceIds.forEach(evidenceId => {
      let evidence = this.evidencePool[evidenceId];

      zip.file(evidence.file.name, evidence.file, { binary: true });
    });

    this.progress.UpdateLabel(System.data.locale.userProfile.accountDelete
      .compressingTheFiles);

    return zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 9
      },
      streamFiles: true
    }, metadata => this.UpdateCompressingProgress(metadata));
  }
  UpdateCompressingProgress(metadata) {
    this.progress.update(metadata.percent);

    if (metadata.currentFile) {
      this.progress.UpdateLabel(System.data.locale.userProfile.accountDelete
        .compressingTheFile.replace("%{file_name}",
          ` ${metadata.currentFile} `));
    }
  }
}
