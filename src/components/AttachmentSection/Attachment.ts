import Action from "@BrainlyAction";
import CreateElement from "@components/CreateElement";
import { Button, Flex, Icon, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import mimeTypes from "mime-types";
import type AttachmentSectionClassType from "./AttachmentSection";

export type AttachmentDataType = {
  url: string;
  thumbnailUrl: string;
  databaseId?: number;
  id?: string;
  mimeType?: string;
};

export default class Attachment {
  private main: AttachmentSectionClassType;
  private data: AttachmentDataType;

  private mimeType: string;
  container: FlexElementType;
  deleteButton: Button;

  constructor(main: AttachmentSectionClassType, data: AttachmentDataType) {
    this.main = main;
    this.data = data;

    this.mimeType = this.data.mimeType || mimeTypes.lookup(data.url) || "";

    this.EnsureDatabaseId();
    this.Render();
  }

  private EnsureDatabaseId() {
    if (this.data.databaseId) return;

    this.data.databaseId = System.DecryptId(this.data.id);
  }

  private Render() {
    this.container = Flex({
      relative: true,
      children: [
        this.mimeType.includes("image")
          ? Flex({
              border: true,
              alignItems: "center",
              justifyContent: "center",
              children: CreateElement({
                tag: "img",
                src: this.data.thumbnailUrl,
                dataset: {
                  src: this.data.url,
                },
              }),
            })
          : Flex({
              border: true,
              tag: "a",
              target: "_blank",
              href: this.data.url,
              alignItems: "center",
              justifyContent: "center",
              children: Text({
                href: "",
                text: this.data.url.split(".").pop(),
              }),
            }),
        (this.deleteButton = new Button({
          type: "solid-peach",
          size: "xs",
          className: "ext-attachment-delete-button",
          iconOnly: true,
          icon: new Icon({
            type: "close",
          }),
          onClick: this.Delete.bind(this),
        })),
      ],
    });
  }

  private async Delete() {
    if (!confirm(System.data.locale.common.notificationMessages.areYouSure))
      return;

    const resDelete = await new Action().DeleteAttachment({
      attachment_id: this.data.databaseId,
      model_id: this.main.content.databaseId,
      model_type_id: this.main.content.type,
      task_id: this.main.content.questionId,
    });
    // const resDelete = { success: true, message: "Deleted!" };

    if (!resDelete.success) {
      throw resDelete.message
        ? {
            msg: resDelete.message,
          }
        : Error("Can't delete attachment");
    }

    this.container.remove();
    this.main.props.notificationHandler?.({
      type: "success",
      text: resDelete.message || "Attachment removed!",
    });

    const index = this.main.attachments.indexOf(this);

    if (index < 0) return;

    this.main.attachments.splice(index, 1);

    this.main.AttachmentDeleted();
  }
}
