class FileIcon {
  stream: File & {
    extension: string;
  };

  $img: JQuery<HTMLElement>;
  iconFileType: string;
  icon: string;

  constructor(
    stream: File & {
      extension: string;
    },
    $img,
  ) {
    this.stream = stream;
    this.$img = $img;
    this.iconFileType = "file";
    let readable = false;

    if (this.stream) {
      const mimeType = stream.type.split("/");

      if (mimeType[0] === "image") {
        this.iconFileType = "image";
        readable = true;
      } else if (mimeType[0] === "audio") {
        this.iconFileType = "audio";
        readable = true;
      } else if (mimeType[0] === "video") {
        this.iconFileType = "video";
        readable = true;
      } else if (mimeType[1] === "pdf") {
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
    if (this.stream.constructor.name.toLowerCase() === "file") {
      this.ReadFile();
    } else {
      this.ReadURL();
    }
  }

  ReadFile() {
    const reader = new FileReader();

    reader.onprogress = this.ReaderOnProgress.bind(this);
    reader.onload = event => this.ReaderOnLoad(event.target.result as string);

    reader.readAsDataURL(this.stream);
  }

  ReadURL() {
    const url =
      System.data.config.extension.uploadedFilesURL +
      this.stream.name +
      this.stream.extension;

    this.ReaderOnLoad(url);
  }

  ReaderOnLoad(source: string) {
    if (!source) return;

    if (this.iconFileType === "image") {
      this.$img.attr({
        title: System.data.locale.common.show,
        src: source,
      });
    } else if (this.iconFileType === "video") {
      const $video = $(
        `<video class="sg-avatar__image" src="${source}" title="${System.data.locale.popup.extensionManagement.accountDeleteReports.playOrPause}"></video>`,
      );

      $video.insertAfter(this.$img);
      this.$img.remove();
    } else if (this.iconFileType === "audio") {
      const $video = $(
        `<video class="sg-avatar__image" poster="${this.icon}" src="${source}" title="${System.data.locale.popup.extensionManagement.accountDeleteReports.playOrPause}"></video>`,
      );

      $video.insertAfter(this.$img);
      this.$img.remove();
    }
  }

  ReaderOnProgress(event) {
    if (event.lengthComputable) {
      const percentLoaded = Math.round((event.loaded / event.total) * 100);
      let bgColor = "";

      if (percentLoaded < 100) {
        const w = 100 - percentLoaded;
        bgColor = `-webkit-linear-gradient(left, rgba(0, 0, 0, 0.${
          w + 10
        }) ${percentLoaded}%, white ${w}%)`;
      }

      this.$img.css("background", bgColor);
    }
  }
}

export default FileIcon;
