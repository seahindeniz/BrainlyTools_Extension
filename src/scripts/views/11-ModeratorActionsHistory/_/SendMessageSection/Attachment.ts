import CreateElement from "@components/CreateElement";
import notification from "@components/notification2";
import HideElement from "@root/helpers/HideElement";
import InsertBefore from "@root/helpers/InsertBefore";
import readFileAsync from "@root/helpers/readFileAsync";
import ActionHistoryRemoveAttachment from "@ServerReq/ActionsHistory/RemoveAttachment";
import ActionHistoryUploadAttachment, {
  ActionHistoryAttachmentDataType,
} from "@ServerReq/ActionsHistory/UploadAttachment";
import { Button, Flex, Icon, Spinner, Text } from "@style-guide";
import { FlexElementType } from "@style-guide/Flex";
import type SendMessageSectionClassType from "./SendMessageSection";

const ICON_NAMES = ["file", "pdf", "video", "audio", "image"];

type Props = {
  customFilename?: string;
  noRemove?: boolean;
};

export default class Attachment {
  main: SendMessageSectionClassType;
  file: File | Blob;
  customFilename: string;
  props?: Props;

  removeButton?: Button;
  container: FlexElementType;
  filename: string;
  spinnerContainer: FlexElementType;
  previewContainer: FlexElementType;
  previewElement: HTMLElement;
  uploadingSpinner: HTMLDivElement;
  state: "uploading" | "failed" | "success";
  data: ActionHistoryAttachmentDataType;
  link: string;

  constructor(
    main: SendMessageSectionClassType,
    file: File | Blob,
    props?: Props,
  ) {
    this.main = main;
    this.file = file;
    this.props = props;
    this.state = "uploading";

    this.Render();
    this.ProcessFile();
    this.main.UpdateGallery();
  }

  Render() {
    this.uploadingSpinner = Spinner({
      overlay: true,
      size: "small",
    });
    this.container = Flex({
      relative: true,
      marginRight: "s",
      children: [
        (this.spinnerContainer = Flex({
          border: true,
          children: Spinner({
            overlay: true,
          }),
        })),
        !this.props?.noRemove &&
          (this.removeButton = new Button({
            type: "solid-blue",
            size: "xs",
            className: "ext-attachment-delete-button",
            iconOnly: true,
            icon: this.uploadingSpinner,
            onClick: this.ChangeState.bind(this),
          })),
      ],
    });
    /*   */

    InsertBefore(this.container, this.main.addAttachmentButtonContainer);
  }

  ChangeState() {
    if (this.state === "failed") {
      this.UploadFile();
    } else if (this.state === "success") {
      this.Remove();
    }
  }

  async Remove(noRefresh?: boolean) {
    if (this.main.PreventIfLocked()) return;

    this.ShowUploadingSpinner();

    try {
      const resDelete = await ActionHistoryRemoveAttachment(this.filename);

      if (resDelete.success === false) {
        this.ShowRemoveButton();

        return;
      }

      this.container.remove();
      this.previewElement?.remove();

      this.container = null;
      this.previewElement = null;

      const index = this.main.attachments.findIndex(
        attachment => attachment === this,
      );

      if (index >= 0) {
        this.main.attachments.splice(index, 1);
      }

      if (noRefresh !== true) {
        this.main.UpdateGallery();
        this.main.MessageChanged();
      }
    } catch (error) {
      console.error(error);
      this.HideUploadingSpinner();
    }
  }

  private async ProcessFile() {
    await this.main.main.screenshotPromise;

    this.SetFilename();
    this.RenderPreview();
    this.UploadFile();
  }

  SetFilename() {
    if (this.file instanceof File) {
      this.filename = this.props?.customFilename || this.file.name;
    } else if (this.file instanceof Blob) {
      this.filename = this.props?.customFilename;
    }
  }

  async RenderPreview() {
    await this.ReadFile();

    this.previewContainer = Flex({
      border: true,
      alignItems: "center",
      justifyContent: "center",
      children: this.previewElement,
      onClick: this.ShowPreview.bind(this),
    });

    InsertBefore(this.previewContainer, this.spinnerContainer);
    this.HideSpinner();
    this.main.UpdateGallery();
  }

  private async ReadFile() {
    const fileURL = await readFileAsync(this.file);

    if (typeof fileURL !== "string") return;

    if (this.file.type.includes("image")) {
      this.previewElement = CreateElement({
        tag: "img",
        src: fileURL,
        title: this.filename,
      });
    } else {
      const fileType = this.file.type.split("/").shift();
      const iconName = ICON_NAMES.includes(fileType) ? fileType : "file";

      this.previewElement = Flex({
        direction: "column",
        title: this.filename,
        children: [
          CreateElement({
            tag: "img",
            src: `${System.data.meta.extension.URL}/images/fileIcons/${iconName}.svg`,
          }),
          Flex({
            children: Text({
              className: "trimmed-file-name",
              size: "xsmall",
              weight: "bold",
              children: this.filename,
            }),
          }),
        ],
      });
    }
  }

  ShowPreview() {
    this.previewElement.click();
  }

  HideSpinner() {
    HideElement(this.spinnerContainer);
  }

  async UploadFile() {
    this.Uploading();

    try {
      const resUpload = await ActionHistoryUploadAttachment(
        this.file,
        this.filename,
      );

      if (resUpload.success === false) {
        if (resUpload.message === "LIMIT_FILE_SIZE")
          notification({
            html: System.data.locale.userProfile.notificationMessages.fileSizeExceeded
              .replace("%{file_name}", this.filename)
              .replace(
                "%{file_size}",
                `${System.constants.config.MAX_FILE_SIZE_OF_EVIDENCE_IN_MB} MB`,
              ),
          });

        throw Error("Can't upload attachment");
      }

      this.data = resUpload.data;
      this.filename = resUpload.data.name;
      this.link = `${System.data.config.extension.shortenedLinkURL}/${resUpload.data.shortCode}`;

      this.Uploaded();
    } catch (error) {
      console.error(error);
      this.UploadFailed();
    }

    this.HideUploadingSpinner();
  }

  private Uploading() {
    this.state = "uploading";

    this.ShowUploadingSpinner();
  }

  private ShowUploadingSpinner() {
    this.removeButton?.ChangeIcon(this.uploadingSpinner);
  }

  private HideUploadingSpinner() {
    HideElement(this.uploadingSpinner);
  }

  private Uploaded() {
    this.state = "success";

    this.ShowRemoveButton();
    this.main.MessageChanged();
  }

  private ShowRemoveButton() {
    this.removeButton?.ChangeType({
      type: "solid-peach",
    });
    this.removeButton?.ChangeIcon(
      new Icon({
        type: "close",
      }),
    );
  }

  private UploadFailed() {
    this.state = "failed";

    this.ShowRetryButton();
  }

  private ShowRetryButton() {
    this.removeButton?.ChangeIcon(
      new Icon({
        type: "reload",
      }),
    );
  }
}
