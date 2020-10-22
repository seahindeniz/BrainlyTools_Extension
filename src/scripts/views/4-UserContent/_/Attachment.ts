import type { AttachmentDataInTicketType } from "@BrainlyAction";
import Action from "@BrainlyAction";
import CreateElement from "@components/CreateElement";
import notification from "@components/notification2";
import { Button, Flex, Icon, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type ContentViewerContentClassType from "./ContentViewer_Content";

export default class Attachment {
  main: ContentViewerContentClassType;
  data: AttachmentDataInTicketType;

  container: FlexElementType;
  deleteButton: Button;

  constructor(
    main: ContentViewerContentClassType,
    data: AttachmentDataInTicketType,
  ) {
    this.main = main;
    this.data = data;
    console.log(data);

    this.Render();
  }

  Render() {
    this.container = Flex({
      relative: true,
      children: [
        this.data.type.includes("image")
          ? CreateElement({
              tag: "img",
              src: this.data.thumbnail,
              dataset: {
                src: this.data.full,
              },
            })
          : Flex({
              tag: "a",
              target: "_blank",
              href: this.data.full,
              alignItems: "center",
              justifyContent: "center",
              children: Text({
                href: "",
                text: this.data.extension,
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

  async Delete() {
    if (!confirm(System.data.locale.common.notificationMessages.areYouSure))
      return;

    const resDelete = await new Action().DeleteAttachment({
      attachment_id: this.data.id,
      model_id: this.main.source.id,
      model_type_id: this.main.contentData.type === "Question" ? 1 : 2,
      task_id:
        "task_id" in this.main.source
          ? this.main.source.task_id
          : this.main.source.id,
    });
    // console.log({
    //   attachment_id: this.data.id,
    //   model_id: this.main.source.id,
    //   model_type_id: this.main.contentData.type === "Question" ? 1 : 2,
    //   task_id:
    //     "task_id" in this.main.source
    //       ? this.main.source.task_id
    //       : this.main.source.id,
    // });
    // System.TestDelay();
    // const resDelete = { success: true, message: "Deleted!" };

    if (!resDelete.success) {
      throw resDelete.message
        ? {
            msg: resDelete.message,
          }
        : Error("Can't delete attachment");
    }

    this.container.remove();
    notification({
      type: "success",
      text: resDelete.message || "Attachment removed!",
    });

    const index = this.main.source.attachments.indexOf(this.data);

    if (index < 0) return;

    this.main.source.attachments.splice(index, 1);

    const { length } = this.main.source.attachments;

    if (length === 0) {
      this.main.attachmentContainer.remove();

      return;
    }

    this.main.attachmentLabelNumber.nodeValue = String(length);
  }
}
