import { SendMessage } from "@BrainlyReq";
import CreateElement from "@components/CreateElement";
import notification from "@components/notification2";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import isShortcut from "@root/helpers/isShortcut";
import ActionHistoryAttachMessage from "@ServerReq/ActionsHistory/AttachMessage";
import { Box, Button, Flex, Icon, Spinner, Text, Textarea } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import chunk from "chunk-text";
import linkifyHtml from "linkifyjs/html";
import Viewer from "viewerjs";
import type ActionEntryClassType from "../ActionEntry/ActionEntry";
import type MultiReviewSectionClassType from "../MultiReviewSection/MultiReviewSection";
import Attachment from "./Attachment";

const MAX_MESSAGE_LENGTH = 512;

let templateAnchor = Text({
  href: "#",
  color: "white",
  underlined: true,
});
const MESSAGE_ANCHOR_CLASSNAMES = templateAnchor.className;
templateAnchor = null;

export function createDashList(strings: string[]) {
  if (!strings?.length) return "";

  if (strings.length === 1) return strings[0];

  return `\n- ${strings.join("\n- ")}`;
}

export default class SendMessageSection {
  main: ActionEntryClassType | MultiReviewSectionClassType;
  private questionLink: string;

  container: FlexElementType;
  private messageTextarea: HTMLTextAreaElement;
  private counterNode: Text;
  attachments: Attachment[];
  private attachmentInput: HTMLInputElement;
  addAttachmentButtonContainer: FlexElementType;
  private gallery: Viewer;
  private galleryContainer: FlexElementType;
  private messagePreviewContainer: FlexElementType;
  private messageChunks: string[];
  private messagePreviewBoxes: Box[];
  private state: "default" | "locked" | "sending";
  private spinner: HTMLDivElement;

  constructor(
    main: ActionEntryClassType | MultiReviewSectionClassType,
    questionLink: string,
  ) {
    this.main = main;
    this.questionLink = questionLink;

    this.attachments = [];

    this.Render();
    this.InitScreenshotAttachment();
  }

  private Render() {
    this.attachmentInput = CreateElement({
      tag: "input",
      type: "file",
      multiple: true,
      onClick: this.PreventIfLocked.bind(this),
      onChange: this.ProcessSelectedFiles.bind(this),
    });

    this.container = Build(
      Flex({ marginTop: "s", direction: "column", relative: true }),
      [
        [
          Flex({
            marginBottom: "xs",
            marginLeft: "s",
          }),
          Text({
            weight: "extra-bold",
            children: System.data.locale.moderatorActionHistory.informModerator,
          }),
        ],
        [
          new Box({
            padding: "s",
            border: true,
            borderColor: "gray-secondary-lightest",
          }),
          [
            [
              Flex({ direction: "column" }),
              [
                (this.messagePreviewContainer = Flex({
                  marginBottom: "xs",
                  direction: "column",
                })),
                [
                  Flex({ direction: "column", marginBottom: "s" }),
                  [
                    (this.messageTextarea = Textarea({
                      tag: "textarea",
                      fullWidth: true,
                      size: "tall",
                      onKeyDown: this.PreventIfLocked.bind(this),
                      onInput: this.MessageChanged.bind(this),
                      resizable: "vertical",
                      value:
                        System.data.locale.moderatorActionHistory
                          .messageTemplate,
                    })),
                    [
                      Flex({ justifyContent: "flex-end", marginRight: "s" }),
                      Text({
                        size: "small",
                        weight: "bold",
                        children: this.counterNode = document.createTextNode(
                          "0",
                        ),
                      }),
                    ],
                  ],
                ],
                [
                  new Box({
                    border: true,
                    borderColor: "gray-secondary-ultra-light",
                  }),
                  [
                    [
                      (this.galleryContainer = Flex({
                        wrap: true,
                        className: "ext-image-gallery",
                      })),
                      [
                        [
                          (this.addAttachmentButtonContainer = Flex({
                            marginLeft: "s",
                          })),
                          [
                            [
                              Flex({
                                direction: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                onClick: this.attachmentInput.click.bind(
                                  this.attachmentInput,
                                ),
                              }),
                              [
                                new Button({
                                  size: "s",
                                  type: "solid-mint",
                                  iconOnly: true,
                                  icon: new Icon({
                                    type: "plus",
                                  }),
                                }),
                                [
                                  Flex({ marginTop: "xxs" }),
                                  Text({
                                    align: "CENTER",
                                    size: "xsmall",
                                    weight: "bold",
                                    children: "Add attachment",
                                  }),
                                ],
                              ],
                            ],
                          ],
                        ],
                      ],
                    ],
                  ],
                ],
                [
                  Flex({ marginTop: "xs" }),
                  new Button({
                    type: "solid-blue",
                    children: System.data.locale.common.send,
                    onClick: this.SendMessage.bind(this),
                  }),
                ],
              ],
            ],
          ],
        ],
      ],
    );

    this.MessageChanged();
  }

  PreventIfLocked(event?: KeyboardEvent) {
    if (this.state !== "locked") return false;

    event?.preventDefault();

    if (!confirm(System.data.locale.moderatorActionHistory.warnBeforeEditing))
      return true;

    this.state = "default";

    return false;
  }

  get message() {
    let { value } = this.messageTextarea;

    const uploadedAttachmentLinks = this.attachments
      .map(attachment => attachment.link)
      .filter(Boolean);

    if (value?.length > 0) {
      value = value
        .replace(/%{nick}/g, this.main.main.moderator.nick)
        .replace(/%{question}/g, this.questionLink)
        .replace(/%{links}/, createDashList(uploadedAttachmentLinks) || "");
    }

    return value;
  }

  MessageChanged() {
    this.messageChunks = chunk(this.message, MAX_MESSAGE_LENGTH);

    let messageCount = 0;
    this.messagePreviewContainer.innerHTML = "";
    this.messagePreviewBoxes = [];
    // const counterTexts = [];

    this.messageChunks.forEach(msg => {
      messageCount += msg.length;

      const transformedMessage = linkifyHtml(msg, {
        target: "_blank",
        className: MESSAGE_ANCHOR_CLASSNAMES,
      });
      const box = new Box({
        border: false,
        padding: "m",
        color: "blue",
      });
      const messagePreview = Build(
        Flex({
          marginBottom: "s",
          justifyContent: "flex-end",
        }),
        [
          [
            Flex({
              direction: "column",
            }),
            [
              [
                box,
                Text({
                  tag: "span",
                  breakWords: true,
                  color: "white",
                  whiteSpace: "pre-wrap",
                  children: transformedMessage,
                }),
              ],
              this.messageChunks.length > 1 && [
                Flex({
                  justifyContent: "flex-end",
                  marginTop: "xxs",
                  marginRight: "s",
                }),
                Text({
                  size: "small",
                  weight: "bold",
                  children: msg.length,
                }),
              ],
            ],
          ],
        ],
      );

      this.messagePreviewBoxes.push(box);
      this.messagePreviewContainer.append(messagePreview);
    });

    // let counterText = String(messageCount);

    // if (messageCount > MAX_MESSAGE_LENGTH) {

    //   this.messageChunks.forEach(msg => {F
    //   });

    // }

    this.counterNode.nodeValue = String(messageCount); // counterTexts.join(", ");
  }

  private ProcessSelectedFiles() {
    const { files } = this.attachmentInput;

    if (files.length === 0) return;

    Array.from(files).forEach(file => {
      if (file.size > System.constants.config.MAX_FILE_SIZE_OF_EVIDENCE) {
        notification({
          html: System.data.locale.userProfile.notificationMessages.fileSizeExceeded
            .replace("%{file_name}", file.name)
            .replace(
              "%{file_size}",
              `${System.constants.config.MAX_FILE_SIZE_OF_EVIDENCE_IN_MB} MB`,
            ),
        });

        return;
      }

      if (
        this.attachments.find(
          attachment =>
            attachment.file instanceof File &&
            attachment.file.size === file.size &&
            attachment.file.name === file.name &&
            attachment.file.lastModified === file.lastModified,
        )
      )
        return;

      if (
        isShortcut(file.name) &&
        !confirm(
          System.data.locale.userProfile.notificationMessages.aShortcutFile,
        )
      )
        return;

      let { id } = this.main;

      if (typeof id !== "string") {
        id = this.main.hash;
      }

      const filename = `${id}_${file.name}`;
      const attachment = new Attachment(this, file, {
        customFilename: filename,
      });

      this.attachments.push(attachment);
    });

    this.attachmentInput.value = "";
  }

  private set conversationId(id) {
    this.main.main.conversationId = id;
  }

  private get conversationId() {
    return this.main.main.conversationId;
  }

  private async SendMessage() {
    if (this.attachments.find(attachment => attachment.state === "uploading")) {
      notification({
        type: "info",
        children:
          System.data.locale.moderatorActionHistory.anAttachmentUploading,
      });

      return;
    }

    this.Sending();

    let { conversationId } = this;
    let messageIndex = 0;

    try {
      await this.InformServer();

      // eslint-disable-next-line no-restricted-syntax
      for (const message of this.messageChunks) {
        // eslint-disable-next-line no-await-in-loop
        /* await System.Delay(2000);
        console.log({
          message,
          conversationId,
          userId: this.moderator.id,
        });

        const resSend: any = { success: true, message: "Failed" }; */
        // eslint-disable-next-line no-await-in-loop
        const resSend = await SendMessage({
          message,
          conversationId,
          userId: this.main.main.moderator.id,
        });

        if (resSend.success === false) {
          this.Lock(messageIndex);
          notification({
            type: "error",
            text: System.data.locale.moderatorActionHistory.anErrorOccurredWhileSendingMessage.replace(
              "%{reason}",
              resSend.message,
            ),
          });
          break;
        }

        if (!conversationId) {
          conversationId = resSend.data.conversation_id;
          this.conversationId = resSend.data.conversation_id;
        }

        messageIndex++;
      }

      this.MessageSent();
    } catch (error) {
      console.error(error);
    }

    this.HideSpinner();
  }

  private Sending() {
    this.ShowSpinner();
  }

  private ShowSpinner() {
    if (!this.spinner) {
      this.RenderSpinner();
    }

    this.container.append(this.spinner);
  }

  private HideSpinner() {
    HideElement(this.spinner);
  }

  private RenderSpinner() {
    this.spinner = Spinner({
      overlay: true,
      size: "xxxlarge",
    });
  }

  async InformServer() {
    await ActionHistoryAttachMessage(this.main.id, this.message);
  }

  private Lock(byMessageIndex: number) {
    this.state = "locked";
    const { length } = this.messageChunks;

    for (let i = byMessageIndex; i < length; i++) {
      const box = this.messagePreviewBoxes[i];

      box.ChangeColor("peach");
    }
  }

  private MessageSent() {
    this.main.MessageSent(this.message);
  }

  private async InitScreenshotAttachment() {
    this.main.TryToTakeScreenshot();
    await this.main.screenshotPromise;

    const screenshotAttachment = new Attachment(
      this,
      this.main.screenshotBlob,
      {
        customFilename: this.main.screenshotName,
        noRemove: true,
      },
    );

    this.attachments.push(screenshotAttachment);
  }

  UpdateGallery() {
    this.gallery?.destroy();

    this.InitGallery();
  }

  private InitGallery() {
    this.gallery = null;
    this.gallery = new Viewer(this.galleryContainer, {
      fullscreen: false,
      loop: false,
      title: false,
      filter(image: HTMLImageElement) {
        return !image.src.endsWith("svg");
      },
      toolbar: {
        zoomIn: 1,
        zoomOut: 1,
        oneToOne: 1,
        reset: 1,
        play: false,
        prev: this.attachments.length > 1 ? 1 : false,
        next: this.attachments.length > 1 ? 1 : false,
        rotateLeft: 1,
        rotateRight: 1,
        flipHorizontal: 1,
        flipVertical: 1,
      },
    });
  }
}
