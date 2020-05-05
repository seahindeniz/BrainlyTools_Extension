import Build from "@/scripts/helpers/Build";
import { Flex, ButtonRound, Text, Avatar, Icon } from "@style-guide";
import CreateElement from "@/scripts/components/CreateElement";
import FileIcon from "@/scripts/helpers/FileIcon";
import prettysize from "prettysize";
import IsVisible from "@/scripts/helpers/IsVisible";

const REVIEWABLE_ICON_NAMES = ["video", "audio", "image"];
const ICON_NAMES = ["file", "pdf", ...REVIEWABLE_ICON_NAMES];

export default class Evidence {
  /**
   * @param {import(".").default} main
   * @param {File} file
   */
  constructor(main, file) {
    this.main = main;
    this.file = file;
    this.id = `${Date.now()}_${System.randomNumber(0, 9999)}`;

    this.fileType = this.file.type.split("/").shift();

    this.RenderPreviewContainer();
    this.RenderFileIcon();
    this.ReadFile();
    this.Render();
    this.BindListener();
  }

  RenderFileIcon() {
    const iconName = ICON_NAMES.includes(this.fileType)
      ? this.fileType
      : "file";

    this.iconSvg = `${System.data.meta.extension.URL}/images/fileIcons/${iconName}.svg`;

    this.iconImg = CreateElement({
      tag: "img",
      src: this.iconSvg,
      className: "sg-avatar__image",
    });
  }

  ReadFile() {
    const reader = new FileReader();

    // reader.onprogress = this.ReaderOnProgress.bind(this);
    reader.onload = event => this.FileRead(event.target.result);

    reader.readAsDataURL(this.file);
  }

  /**
   * @param {string | ArrayBuffer} source
   */
  FileRead(source) {
    if (source instanceof ArrayBuffer) return;

    /**
     * @type {import("@/scripts/components/CreateElement")
     * .CreateElementPropertiesType}
     */
    let data;

    if (this.fileType == "image") {
      this.iconImg.src = source;
      data = {
        tag: "img",
        src: source,
        className: "sg-avatar__image",
      };
    } else if (this.fileType == "video" || this.fileType == "audio") {
      data = {
        tag: "video",
        src: source,
        muted: true,
        controls: true,
        className: "sg-avatar__image",
        title:
          System.data.locale.popup.extensionManagement.accountDeleteReports
            .playOrPause,
      };

      if (this.fileType == "audio") data.poster = this.iconSvg;
    }

    if (!data) return;

    this.previewElement = CreateElement(data);
    this.previewContainer.append(this.previewElement);
  }

  Render() {
    this.container = Build(
      Flex({
        noShrink: true,
        fullWidth: true,
        marginBottom: "s",
        direction: "column",
      }),
      [
        [
          Flex({ fullWidth: true }),
          [
            [
              Flex({ alignItems: "center" }),
              (this.removeButton = ButtonRound({
                filled: true,
                color: "peach",
                icon: "close",
                size: "xsmall",
              })),
            ],
            [
              Flex({
                grow: true,
                direction: "column",
                marginLeft: "xs",
                marginRight: "xs",
                style: {
                  minWidth: 0,
                },
              }),
              [
                (this.fileLink = Text({
                  href: "",
                  color: "gray",
                  size: "small",
                  weight: "bold",
                  align: "CENTER",
                  title: this.file.name,
                  className: "ext-evidence-name",
                  text: this.file.name.replace(/\s{2,}/g, " ").trim(),
                })),
                [
                  Flex({ justifyContent: "flex-end" }),
                  Text({
                    tag: "i",
                    size: "xsmall",
                    color: "gray-secondary",
                    text: prettysize(this.file.size),
                  }),
                ],
              ],
            ],
            [
              (this.thumbnailContainer = Flex({ alignItems: "center" })),
              [
                [
                  new Icon({
                    size: 32,
                  }),
                  [
                    [
                      (this.iconLink = Text({
                        href: "",
                      })),
                      this.iconImg,
                    ],
                  ],
                ],
              ],
            ],
          ],
        ],
      ],
    );
  }

  RenderPreviewContainer() {
    this.previewContainer = Flex();
  }

  BindListener() {
    this.removeButton.addEventListener("click", this.Remove.bind(this));

    if (REVIEWABLE_ICON_NAMES.includes(this.fileType)) {
      this.iconLink.addEventListener("click", this.TogglePreview.bind(this));
      this.fileLink.addEventListener("click", this.TogglePreview.bind(this));
    }
  }

  Remove() {
    const index = this.main.evidences.indexOf(this);

    this.main.evidences.splice(index, 1);
    this.container.remove();
  }

  TogglePreview() {
    if (IsVisible(this.thumbnailContainer)) {
      this.main.HideElement(this.thumbnailContainer);
      this.ShowPreview();
    } else {
      this.container.firstElementChild.append(this.thumbnailContainer);
      this.HidePreview();
    }
  }

  ShowPreview() {
    this.container.append(this.previewContainer);

    if (this.previewElement instanceof HTMLVideoElement)
      this.previewElement.play();
  }

  HidePreview() {
    this.main.HideElement(this.previewContainer);

    if (this.previewElement instanceof HTMLVideoElement)
      this.previewElement.pause();
  }
}
