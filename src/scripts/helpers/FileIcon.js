class FileIcon {
	constructor(stream, $img) {
		this.stream = stream;
		this.$img = $img;
		this.iconFileType = "file";
		let readable = false;

		if (this.stream) {
			let mimetype = stream.type.split("/");

			if (mimetype[0] == "image") {
				this.iconFileType = "image";
				readable = true;
			} else if (mimetype[0] == "audio") {
				this.iconFileType = "audio";
				readable = true;
			} else if (mimetype[0] == "video") {
				this.iconFileType = "video";
				readable = true;
			} else if (mimetype[1] == "pdf") {
				this.iconFileType = "pdf";
			}
		}

		this.icon = `${System.data.meta.extension.URL}/images/fileIcons/${this.iconFileType}.svg`;
		this.$img.attr("src", this.icon);

		if (readable) {
			this.Read();
		}
	}
	Read() {
		if (this.stream.constructor.name.toLowerCase() == "file") {
			this.ReadFile();
		} else {
			this.ReadURL();
		}
	}
	ReadFile() {
		let reader = new FileReader();

		reader.onprogress = this.ReaderOnProgress.bind(this);
		reader.onload = event => this.ReaderOnLoad(event.target.result);

		reader.readAsDataURL(this.stream);
	}
	ReadURL() {
		let url = System.data.config.extension.uploadedFilesURL + this.stream.name + this.stream.extension;

		this.ReaderOnLoad(url);
	}
	ReaderOnLoad(source) {
		if (!source) return false;

		if (this.iconFileType == "image") {
			this.$img
				.addClass("preview")
				.attr({
					title: System.data.locale.common.show,
					src: source
				});
		} else if (this.iconFileType == "video") {
			let $video = $(`<video class="sg-avatar__image preview" src="${source}" title="${System.data.locale.popup.extensionManagement.accountDeleteReports.play}"></video>`);

			$video.insertAfter(this.$img);
			this.$img.remove();
		} else if (this.iconFileType == "audio") {
			let $video = $(`<video class="sg-avatar__image preview" poster="${this.icon}" src="${source}" title="${System.data.locale.popup.extensionManagement.accountDeleteReports.play}"></video>`);

			$video.insertAfter(this.$img);
			this.$img.remove();
		}
	}
	ReaderOnProgress(event) {
		if (event.lengthComputable) {
			let percentLoaded = Math.round((event.loaded / event.total) * 100);
			let bgColor = "";

			if (percentLoaded < 100) {
				let w = 100 - percentLoaded;
				bgColor = `-webkit-linear-gradient(left, rgba(0, 0, 0, 0.${w + 10}) ${percentLoaded}%, white ${w}%)`;
			}

			this.$img.css("background", bgColor);
		}
	}
}

export default FileIcon;
