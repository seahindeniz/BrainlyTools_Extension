import prettysize from "prettysize";
import WaitForElement from "../../helpers/WaitForElement";
import { UploadFile } from "../../controllers/ActionsOfBrainly";
import notification from "../../components/notification";

System.pageLoaded("Supervisors page OK!");

class FileUpload {
	constructor(file, $box) {
		this.file = file;
		this.$box = $box;
	}
	async Upload() {
		let res = await UploadFile(this.file, this.OnProgress.bind(this));
		//let res = await System.Delay(System.randomNumber(1, 3) * 1000);

		this.$box.slideUp("normal", () => this.$box.remove());
		return res;
	}
	OnProgress(percent) {
		this.$box.css("background", `linear-gradient(to right, #b9e2fe ${percent}%, #fff ${percent}%)`)
	}
}

class Chunk {
	constructor(master) {
		this.master = master;
		this.queue = [];
		this.uploadingQueue = [];
		this.inProgressCount = 0;
		this.uploadedCount = 0;
		this.CHUNK_LIMIT = 3;
		this.interval = false;
	}
	AddToQueue(uploader) {
		this.queue.push(uploader);

		if (!this.interval) {
			this.interval = setInterval(this.StartUploading.bind(this));
		}
	}
	StartUploading() {
		if (this.queue.length > 0 && this.inProgressCount <= this.CHUNK_LIMIT) {
			let uploader = this.queue[0];

			this.queue.splice(0, 1);
			this.inProgressCount++;
			this.ExecuteUpload(this.inProgressCount - 1, uploader);
		}
	}
	async ExecuteUpload(i, uploader) {
		await uploader.Upload();
		this.inProgressCount--;
		this.$counterLabel.text(++this.uploadedCount);

		if (this.inProgressCount == 0) {
			clearInterval(this.interval);
			this.interval = false;
		}
	}
}

class Uploader {
	constructor() {
		this.ServerFileURL = "";
		this.Chunk = new Chunk(this);
		this.Init();
	}
	async Init() {
		this.mainRight = await WaitForElement("#main-right");

		this.RenderUploadPanel();
		this.BindEvents();
	}
	RenderUploadPanel() {
		this.$panel = $(`
		<div class="sg-box sg-box--no-border" style="padding: 3em 0 0;">
			<div class="sg-box__hole">
				<div class="sg-content-box__content sg-content-box__content--full sg-content-box__content--spaced-bottom">
					<div class="sg-actions-list sg-actions-list--space-between">
						<div class="sg-actions-list__hole">
							<h1 class="sg-headline sg-headline--xsmall">${System.data.locale.uploader.text}</h1>
						</div>
						<div class="sg-actions-list__hole">
							<h1 class="sg-headline sg-headline--xsmall js-count"></h1>
						</div>
					</div>
				</div>
				<div class="sg-horizontal-separator"></div>
				<div class="sg-content-box sg-content-box--full">
					<div class="sg-content-box__content sg-content-box__content--spaced-top">
						<label class="sg-button-primary sg-button-primary--alt sg-button-primary--full-width" for="uploadInput">${System.data.locale.uploader.selectFiles}</label>
						<input type="file" class="sg-input sg-input--full-width js-hidden" id="uploadInput" multiple />
					</div>
					<div class="sg-content-box__content sg-content-box__content--spaced-top js-progress"></div>
				</div>
			</div>
		</div>`);

		this.$fileInput = $("#uploadInput", this.$panel);
		this.$counterLabel = $(".js-count", this.$panel);
		this.$progressBoxContainer = $(".js-progress", this.$panel);

		this.Chunk.$counterLabel = this.$counterLabel;

		this.$panel.appendTo(this.mainRight)
	}
	BindEvents() {
		let that = this;

		this.$fileInput.change(function() {
			that.ProcessFiles(this.files);
			this.value = "";
		});
	}
	ProcessFiles(files) {
		if (files.length > 0) {
			for (let i = 0, file;
				(file = files[i]); i++
			) {
				this.ProcessFile(file)
			}
		}
	}
	async ProcessFile(file) {
		if (this.IsExist(file)) {
			notification(System.data.locale.uploader.notificationMessages.alreadyExist.replace("%{file_name}", ` ${file.name} `), "error");
		} else if (file.name.indexOf("\\") >= 0) {
			notification(System.data.locale.uploader.notificationMessages.fileNameCannotContainBackslash.replace("%{file_name}", ` ${file.name} `), "error");
		} else {
			let $box = this.AddProgressBox(file);
			let uploader = new FileUpload(file, $box);
			this.Chunk.AddToQueue(uploader)
		}
	}
	IsExist(file) {
		let $nameColumns = $(`#uploader_table > tbody > tr > td.name:contains("${file.name}")`);

		return $nameColumns.length > 0;
	}
	AddProgressBox(file) {
		let $box = $(`
		<div class="sg-content-box sg-content-box--full">
			<div class="sg-content-box__content sg-content-box__content--spaced-top-small">
				<div class="sg-actions-list">
					<div class="sg-actions-list__hole sg-actions-list__hole--grow">
						<span class="sg-text sg-text--small sg-text--gray sg-text--bold file-name">${file.name}</span>
					</div>
					<div class="sg-actions-list__hole">
						<span class="sg-text sg-text--small sg-text--gray sg-text--bold">${prettysize(file.size)}</span>
					</div>
				</div>
			</div>
		</div>`);

		$box.appendTo(this.$progressBoxContainer);

		return $box;
	}
}

new Uploader();
