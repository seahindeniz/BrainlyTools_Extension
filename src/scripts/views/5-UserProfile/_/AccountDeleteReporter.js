import notification from "../../../components/notification";
import { AccountDeleteReport } from "../../../controllers/ActionsOfServer";
import JSZip from "jszip";
import Progress from "../../../components/Progress";
import FileIcon from "../../../helpers/FileIcon";
import prettysize from "prettysize";

class AccountDeleteReporter {
	constructor() {
		this.evidencePool = {};
		this.svgPath = {
			close: `<use xlink:href="#icon-x"></use>`,
			"delete": `<path d="M12 38c0 2 2 4 4 4h16c2 0 4-2 4-4V14H12v24zM38 8h-7l-2-2H19l-2 2h-7v4h28V8z" style="transform: scale(0.45) translate(-8px,-9px);"></path>`
		}
		this.Render();
		this.RenderProgress()
	}
	Render() {
		this.$deleteForm = $(`#DelUserAddForm`);
		let $deleteButtonContainer = $(`> div.submit`, this.$deleteForm);

		if (this.$deleteForm.length > 0) {
			this.$evidences = $(`
			<div class="evidences">
				<div class="container">
					<label for="addFileInput">${System.data.locale.userProfile.accountDelete.evidences} <i>(${System.data.locale.userProfile.accountDelete.willBeReviewedByCommunityManager})</i></label>
					<div class="sg-content-box__content sg-content-box__content--spaced-top">
						<div class="sg-content-box addFile">
							<div class="sg-content-box__content sg-content-box__content--with-centered-text sg-content-box__content--spaced-top">
								<label class="sg-button-secondary sg-button-secondary--dark-inverse" for="addFileInput">
									<span class="sg-button-primary__icon">
										<div class="sg-icon sg-icon--adaptive sg-icon--x14">
											<svg class="sg-icon__svg">
												<use xlink:href="#icon-attachment"></use>
											</svg>
										</div>
									</span>${System.data.locale.userProfile.accountDelete.addFiles}..</label>
								<input type="file" id="addFileInput" multiple>
							</div>
						</div>
					</div>
				</div>
				<div class="container sg-text--to-center">
					<label for="comment">${System.data.locale.userProfile.accountDelete.yourComment} <i>(${System.data.locale.userProfile.accountDelete.willBeReviewedByCommunityManager})</i></label>
					<textarea name="comment" id="comment" style="margin-top: 3px;"></textarea>
				</div>
			</div>`);

			this.$comment = $("textarea#comment", this.$evidences);
			this.$addFileButtonContainer = $("div.addFile", this.$evidences);
			this.$addFile = $(`#addFileInput`, this.$evidences);
			this.$progressHole = $(".container.progress", this.$evidences);

			this.$evidences.insertBefore($deleteButtonContainer);
			this.BindEvents();
		}
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
	BindEvents() {
		let that = this;

		this.$deleteForm.on('submit', function(event) {
			event.preventDefault();

			that.DeleteFormSubmited(this);
		});

		this.$addFile.on("change", function() {
			that.ProcessFiles(this.files);
			this.value = "";
		});

		this.$evidences
			.on("click", ".evidence:not(.previewing) .preview > *", function() {
				let evidence = $(this).parents(".evidence");

				that.ShowPreview(evidence)
			})
			.on("click", ".evidence .sg-button-secondary", function() {
				let $parent = $(this).parents(".evidence");

				if ($parent.is(".previewing")) {
					that.ClosePreview($parent);
				} else {
					that.RemoveListItem($parent);
				}
			});
	}
	async DeleteFormSubmited(form) {
		this.$progressHole.html("");

		if (this.IsFormFilled() || confirm(System.data.locale.userProfile.notificationMessages.confirmNoEvidenceOrComment)) {
			try {
				this.ShowProgress();
				await this.PrepareForm();

				let resAccountDeleteReport = await this.SendFormDataToExtensionServer();

				if (!resAccountDeleteReport || !resAccountDeleteReport.success) {
					return notification(System.data.locale.userProfile.notificationMessages.unableToReportAccountDeleting + (resAccountDeleteReport.message ? (`\n${resAccountDeleteReport.message}`) : ""), "error");
				}

				this.progress.UpdateLabel(System.data.locale.common.done);
				form.submit();
			} catch (error) {
				console.error(error);
				notification(System.data.locale.userProfile.notificationMessages.unableToReportAccountDeleting, "error");
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
			notification(System.data.locale.userProfile.notificationMessages.fileSizeExceeded.replace("%{file_name}", file.name).replace("%{file_size}", `${System.constants.config.MAX_FILE_SIZE_OF_EVIDENCE_IN_MB} MB`));
		} else {
			let fileExtension = file.name.split('.').pop();
			let isShortcut = /lnk|url|xnk/.test(fileExtension);

			if (!isShortcut || confirm(System.data.locale.userProfile.notificationMessages.aShortcutFile)) {
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
					<div class="sg-actions-list__hole">
						<span class="sg-button-secondary sg-button-secondary--small sg-button-secondary--peach">
							<div class="sg-icon sg-icon--adaptive sg-icon--x14">
								<svg class="sg-icon__svg">${this.svgPath.delete}</svg>
							</div>
						</span>
					</div>
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

		$evidence.insertBefore(this.$addFileButtonContainer);

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
		$(".sg-button-secondary svg", $evidence).html(this.svgPath.close);
	}
	ClosePreview($evidence) {
		$evidence.removeClass("previewing");
		$("video, audio", $evidence).removeAttr("controls").trigger("pause");
		$(".sg-button-secondary svg", $evidence).html(this.svgPath.delete);
	}
	SendFormDataToExtensionServer() {
		let xhrPromise = AccountDeleteReport(this.formData);

		xhrPromise.progress(this.UpdateUploadProgress.bind(this));

		return xhrPromise;
	}
	UpdateUploadProgress(event) {
		var percent = 0;
		var position = event.loaded || event.position;
		var total = event.total;

		if (event.lengthComputable) {
			percent = position / total * 100;
		}

		this.progress.update(percent);
		this.progress.UpdateLabel(System.data.locale.userProfile.accountDelete.uploading.replace("%{percentage_value}", ` ${Math.ceil(percent)} `));
	}
	async PrepareForm() {
		this.formData = new FormData();
		let comment = this.$comment.val();
		let fileDetails = await this.PrepareFile();

		this.formData.append("comment", comment);
		this.formData.append("id", profileData.id);
		this.formData.append("nick", profileData.nick);
		this.formData.append("url", System.createProfileLink(profileData.nick, profileData.id));

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

		this.progress.UpdateLabel(System.data.locale.userProfile.accountDelete.compressingTheFiles);

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
			this.progress.UpdateLabel(System.data.locale.userProfile.accountDelete.compressingTheFile.replace("%{file_name}", ` ${metadata.currentFile} `));
		}
	}
}

export default AccountDeleteReporter
