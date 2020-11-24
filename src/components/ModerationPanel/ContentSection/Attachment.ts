import type { AttachmentDataInTicketType } from "@BrainlyAction";
import Action from "@BrainlyAction";
import { Button, Flex, Icon, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import CreateElement from "@components/CreateElement";
import type AnswerClassType from "./Answer";
import type ContentSectionClassType from "./ContentSection";
import type QuestionClassType from "./Question";

export default class Attachment {
  main: ContentSectionClassType | AnswerClassType | QuestionClassType;
  data: AttachmentDataInTicketType;
  container: FlexElementType;
  deleteButton: Button;

  constructor(
    main: ContentSectionClassType | AnswerClassType | QuestionClassType,
    data: AttachmentDataInTicketType,
  ) {
    this.main = main;
    this.data = data;

    this.Render();
  }

  Render() {
    this.container = Flex({
      relative: true,
      children: [
        this.data.type.includes("image")
          ? Flex({
              border: true,
              alignItems: "center",
              justifyContent: "center",
              children: CreateElement({
                tag: "img",
                src: this.data.thumbnail,
                dataset: {
                  src: this.data.full,
                },
              }),
            })
          : Flex({
              border: true,
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
      model_id: this.main.data.id,
      model_type_id: this.main.contentType,
      task_id:
        "task_id" in this.main.data
          ? this.main.data.task_id
          : this.main.data.id,
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
    this.main.main.modal.Notification({
      type: "success",
      text: resDelete.message || "Attachment removed!",
    });

    const index = this.main.data.attachments.indexOf(this.data);

    if (index < 0) return;

    this.main.data.attachments.splice(index, 1);

    const { length } = this.main.data.attachments;

    if (length === 0) {
      this.main.RemoveAttachmentContainer();

      return;
    }

    this.main.numberOfAttachments.nodeValue = String(length);
  }
}
