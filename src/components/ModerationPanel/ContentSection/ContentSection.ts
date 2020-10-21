import type {
  AnswerDataInTicketType,
  QuestionDataInTicketType,
  RemoveAnswerReqDataType,
  RemoveQuestionReqDataType,
  UsersDataInReportedContentsType,
} from "@BrainlyAction";
import Action from "@BrainlyAction";
import notification from "@components/notification2";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import IsVisible from "@root/helpers/IsVisible";
import {
  Avatar,
  Box,
  Breadcrumb,
  Flex,
  Icon,
  LabelDeprecated,
  SeparatorHorizontal,
  Text as TextComponent,
} from "@style-guide";
import { BoxPropsType } from "@style-guide/Box";
import type { FlexElementType } from "@style-guide/Flex";
import { IconColorType } from "@style-guide/Icon";
import { TextElement } from "@style-guide/Text";
import moment from "moment";
import Viewer from "viewerjs";
import DeleteSection from "../../DeleteSection2/DeleteSection";
import type ModerationPanelClassType from "../ModerationPanel";
import Attachment from "./Attachment";
import CommentSection from "./CommentSection/CommentSection";
import type QuickActionButtonsForAnswerClassType from "./QuickActionButtons/Answer";
import type QuickActionButtonsForQuestionClassType from "./QuickActionButtons/Question";

export type ContentTypeType = "Question" | "Answer";

const BOX_STATUS: {
  [x in "default" | "reported" | "reportedForCorrection"]: BoxPropsType;
} = {
  default: { border: false },
  reported: { border: true, borderColor: "peach-secondary" },
  reportedForCorrection: { border: true, borderColor: "blue-secondary-light" },
};

export default class ContentSection {
  main: ModerationPanelClassType;
  contentType: ContentTypeType;

  data: QuestionDataInTicketType | AnswerDataInTicketType;
  owner: {
    data: UsersDataInReportedContentsType;
    profileLink: string;
    avatarLink: string;
  };

  container: FlexElementType;
  userDetailsContainer: Breadcrumb;
  contentDetailsContainer: FlexElementType;
  creationDateText: TextElement<"span">;
  contentContainer: FlexElementType;
  contentBox: Box;
  contentContainerBox: Box;
  commentSection?: CommentSection;
  contentWrapper: FlexElementType;
  gallery?: Viewer;
  deleteSection?: DeleteSection;
  quickActionButtons:
    | QuickActionButtonsForAnswerClassType
    | QuickActionButtonsForQuestionClassType;

  deleted: boolean;
  reportDetailsBox: FlexElementType;
  reportedFlagIconContainer: FlexElementType;
  numberOfAttachments: Text;
  attachmentLabelContainer: FlexElementType;
  attachmentContainer: FlexElementType;
  attachments: Attachment[];

  constructor(main: ModerationPanelClassType, contentType: ContentTypeType) {
    this.main = main;
    this.contentType = contentType;
  }

  SetOwner() {
    const owner = this.main.usersData.find(
      user => user.id === this.data.user_id,
    );

    if (!owner) {
      console.error("Can't find owner details");
      // this.main.FinishModeration();

      return;
    }

    this.owner = {
      data: owner,
      profileLink: System.createProfileLink(owner),
      avatarLink: System.ExtractAvatarURL(owner),
    };
  }

  Render() {
    const createdTimeEntry = this.CreateTimeEntry(this.data.created);

    let status: keyof typeof BOX_STATUS = "default";

    if ("wrong_report" in this.data) status = "reportedForCorrection";

    // Prioritized
    if (this.data.report) status = "reported";

    const content = this.data.content.replace(
      "http://tex.z-dn.net",
      "//tex.z-dn.net",
    );

    this.container = Build(
      Flex({
        fullWidth: true,
        direction: "column",
      }),
      [
        [
          (this.contentContainerBox = new Box({
            border: true,
            padding: "xs",
            borderColor: "gray-secondary-lightest",
          })),
          [
            [
              Flex(),
              [
                [
                  (this.contentBox = new Box({
                    padding: "xs",
                    ...BOX_STATUS[status],
                  })),
                  [
                    [
                      (this.contentContainer = Flex({ direction: "column" })),
                      [
                        [
                          (this.contentWrapper = Flex({
                            grow: true,
                            direction: "column",
                          })),
                          [
                            [
                              // Head
                              Flex({
                                wrap: true,
                                marginBottom: "s",
                              }),
                              [
                                [
                                  // Left
                                  Flex({
                                    grow: true,
                                  }),
                                  [
                                    [
                                      // Avatar container
                                      Flex(),
                                      Avatar({
                                        imgSrc: this.owner.avatarLink,
                                        link: this.owner.profileLink,
                                      }),
                                    ],
                                    [
                                      // nick and details container
                                      Flex({
                                        marginLeft: "s",
                                        direction: "column",
                                      }),
                                      [
                                        [
                                          // Nick container
                                          Flex(),
                                          new Breadcrumb({
                                            elements: [
                                              TextComponent({
                                                tag: "span",
                                                size: "small",
                                                weight: "bold",
                                                text: this.owner.data.nick,
                                                target: "_blank",
                                                href: this.owner.profileLink,
                                              }),
                                              ...this.owner.data.ranks.names.map(
                                                rankName => {
                                                  return TextComponent({
                                                    tag: "span",
                                                    size: "small",
                                                    text: rankName,
                                                    style: {
                                                      color: this.owner.data
                                                        .ranks.color,
                                                    },
                                                  });
                                                },
                                              ),
                                            ],
                                          }),
                                        ],
                                        [
                                          // user details container
                                          Flex(),
                                          (this.userDetailsContainer = new Breadcrumb(
                                            {
                                              elements: [
                                                (this.creationDateText = TextComponent(
                                                  {
                                                    tag: "span",
                                                    size: "xsmall",
                                                    color: "gray-secondary",
                                                    children:
                                                      createdTimeEntry.node,
                                                  },
                                                )),
                                              ],
                                            },
                                          )),
                                        ],
                                      ],
                                    ],
                                  ],
                                ],
                                [
                                  // Right
                                  (this.contentDetailsContainer = Flex({
                                    wrap: true,
                                    grow: true, // Force align left on mobile d.
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                  })),
                                ],
                              ],
                            ],
                            [
                              // Content container
                              Flex({
                                direction: "column",
                                marginBottom: "s",
                              }),
                              TextComponent({
                                breakWords: true,
                                children: content,
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
          ],
        ],
      ],
    );

    this.RenderReporterDetails();
    this.RenderAttachments();
    this.RenderCommentSection();

    this.main.contentContainer.append(this.container);
  }

  CreateTimeEntry(date: string) {
    moment.locale(navigator.language);

    const timeInstance = moment(date);
    const lastPrintedTime = timeInstance.fromNow();

    const entry = {
      timeInstance,
      lastPrintedTime,
      node: document.createTextNode(lastPrintedTime),
    };

    this.main.timeElements.push(entry);

    return entry;
  }

  RenderReporterDetails() {
    const { report } = this.data;

    if (!report) return;

    const reporter = this.main.usersData.find(
      user => user.id === report.user.id,
    );

    const reportTimeEntry = this.CreateTimeEntry(report.created);

    this.reportedFlagIconContainer = this.RenderReportedFlagIcon("peach");

    this.reportDetailsBox = Build(Flex({ marginBottom: "xs" }), [
      [
        new Box({
          border: true,
          padding: "xs",
          borderColor: "peach-secondary-light",
        }),
        [
          [
            Flex({ alignItems: "center" }),
            [
              [
                Flex,
                new Icon({
                  size: 32,
                  color: "peach",
                  type: "report_flag",
                }),
              ],
              [
                Flex({
                  grow: true,
                  marginRight: "xs",
                  marginLeft: "xs",
                  direction: "column",
                }),
                [
                  new Breadcrumb({
                    elements: [
                      TextComponent({
                        tag: "span",
                        size: "small",
                        weight: "bold",
                        color: "blue-dark",
                        text: reporter.nick,
                        target: "_blank",
                        href: System.createProfileLink(reporter),
                      }),
                      ...reporter.ranks.names.map(rankName => {
                        return TextComponent({
                          tag: "span",
                          size: "small",
                          text: rankName,
                          style: {
                            color: reporter.ranks.color,
                          },
                        });
                      }),
                    ],
                  }),
                  [
                    Flex({
                      marginTop: "xxs",
                      marginLeft: "xs",
                      direction: "column",
                    }),
                    [
                      TextComponent({
                        breakWords: true,
                        html: report.abuse.name,
                        size: "small",
                        weight: "bold",
                      }),
                      report.abuse.data &&
                        TextComponent({
                          breakWords: true,
                          html: report.abuse.data,
                          size: "small",
                          blockquote: true,
                        }),
                    ],
                  ],
                ],
              ],
              [
                Flex(),
                TextComponent({
                  noWrap: true,
                  size: "xsmall",
                  children: reportTimeEntry.node,
                }),
              ],
            ],
          ],
        ],
      ],
    ]);

    this.contentContainerBox.element.prepend(this.reportDetailsBox);
  }

  RenderReportedFlagIcon(color: IconColorType) {
    const flagIconContainer = Flex({
      marginLeft: "xs",
      children: new Icon({
        size: 24,
        color,
        type: "report_flag",
      }),
    });

    this.contentDetailsContainer.append(flagIconContainer);

    return flagIconContainer;
  }

  RenderAttachments() {
    if (!this.data.attachments?.length) return;

    this.RenderAttachmentLabel();

    const galleryContainer = Flex({
      wrap: true,
      className: "ext-image-gallery",
    });

    this.attachments = this.data.attachments.map(attachmentData => {
      const attachment = new Attachment(this, attachmentData);

      galleryContainer.append(attachment.container);

      return attachment;
    });

    this.attachmentContainer = Flex({
      marginBottom: "xs",
      children: galleryContainer,
    });

    this.contentWrapper.append(this.attachmentContainer);

    this.gallery = new Viewer(galleryContainer, {
      fullscreen: false,
      loop: false,
      title: false,
      url(image: HTMLImageElement) {
        return image.dataset.src;
      },
      toolbar: {
        zoomIn: 1,
        zoomOut: 1,
        oneToOne: 1,
        reset: 1,
        prev: this.data.attachments.length > 1 ? 1 : false,
        play: false,
        next: this.data.attachments.length > 1 ? 1 : false,
        rotateLeft: 1,
        rotateRight: 1,
        flipHorizontal: 1,
        flipVertical: 1,
      },
    });

    if (this.data.attachments.length > 1) {
      galleryContainer.addEventListener(
        "view",
        (
          event: CustomEvent<{
            image: HTMLImageElement;
            index: number;
            originalImage: HTMLImageElement;
          }>,
        ) => {
          const prevTooltip = (this.gallery[
            // eslint-disable-next-line dot-notation
            "toolbar"
          ] as HTMLDivElement).querySelector(".viewer-prev") as HTMLLIElement;
          const nextTooltip = (this.gallery[
            // eslint-disable-next-line dot-notation
            "toolbar"
          ] as HTMLDivElement).querySelector(".viewer-next") as HTMLLIElement;

          if (event.detail.index === 0) {
            nextTooltip.removeAttribute("style");
            prevTooltip.style.display = "none";
          } else if (event.detail.index === this.data.attachments.length - 1) {
            prevTooltip.removeAttribute("style");
            nextTooltip.style.display = "none";
          } else {
            nextTooltip.removeAttribute("style");
            prevTooltip.removeAttribute("style");
          }
        },
      );
    }
  }

  RenderAttachmentLabel() {
    this.numberOfAttachments = document.createTextNode(
      String(this.data.attachments.length),
    );

    this.attachmentLabelContainer = Flex({
      marginLeft: "xs",
      children: LabelDeprecated({
        color: "gray",
        icon: { type: "attachment" },
        children: this.numberOfAttachments,
      }),
    });

    this.contentDetailsContainer.append(this.attachmentLabelContainer);
  }

  RenderCommentSection() {
    if (!this.data.comments?.length) return;

    this.contentBox.element.append(
      SeparatorHorizontal({
        type: "spaced",
      }),
    );

    this.commentSection = new CommentSection(this);

    this.contentBox.element.append(this.commentSection.container);
  }

  ToggleDeleteSection() {
    if (!IsVisible(this.deleteSection?.container)) {
      this.OpenDeleteSection();

      return;
    }

    this.HideDeleteSection();
  }

  OpenDeleteSection() {
    if (!this.deleteSection) {
      this.deleteSection = new DeleteSection({
        defaults: this,
        listeners: {
          onDeleteButtonClick: this.DeleteSectionButtonClicked.bind(this),
        },
      });
    }

    this.contentContainer.append(this.deleteSection.container);
  }

  async DeleteSectionButtonClicked() {
    await this.Moderating();
    this.Delete(this.deleteSection?.PrepareData());
  }

  HideDeleteSection() {
    this.deleteSection.Hide();
  }

  async ConfirmDeletion(
    data: RemoveQuestionReqDataType | RemoveAnswerReqDataType,
  ) {
    if (!data) return;

    this.Moderating();

    const confirmMessage = System.data.locale.common.moderating.doYouWantToDeleteWithReason
      .replace("%{reason_title}", data.reason_title)
      .replace("%{reason_message}", data.reason);

    if (!confirm(confirmMessage)) {
      this.quickActionButtons.EnableButtons();

      return;
    }

    this.Delete(data);
  }

  Moderating() {
    this.quickActionButtons.DisableButtons();
    this.deleteSection?.container.append(this.quickActionButtons.spinner);

    return System.Delay(50);
  }

  async Delete(data: RemoveQuestionReqDataType | RemoveAnswerReqDataType) {
    try {
      const actionType =
        this.contentType === "Question" //
          ? "RemoveQuestion"
          : "RemoveAnswer";

      const resDelete = await new Action()[actionType](
        {
          ...data,
          model_id: this.data.id,
        },
        !!this.data.report,
      );

      // TODO delete this comment
      /* console.log({
        ...data,

        model_id: this.data.id,
      });

      const resDelete = { success: true, message: "" };
      await System.TestDelay(); */

      if (resDelete?.success === false) {
        throw resDelete.message
          ? { msg: resDelete.message }
          : resDelete || Error("No response");
      }

      this.Deleted();
    } catch (error) {
      console.error(error);
      this.main.modal.Notification({
        type: "error",
        html:
          error.msg ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
      });

      this.quickActionButtons.EnableButtons();
    }
  }

  Deleted() {
    this.deleted = true;

    this.deleteSection?.Hide();
    this.quickActionButtons.Hide();
    this.contentBox.ChangeColor("peach-secondary");
    this.main.listeners.onModerate(this.data.id, "delete", this.contentType);

    if (this.attachments)
      this.attachments.forEach(attachment =>
        attachment.deleteButton.element.remove(),
      );

    if (this.contentType === "Question") {
      if (
        this.main.listeners?.switchNext ||
        this.main.listeners?.switchPrevious
      )
        this.main.CloseModerationSomeTimeLater();
      else {
        notification({
          type: "success",
          text: System.data.locale.moderationPanel.questionHasBeenDeleted,
        });
        this.main.CloseModeration();
      }
    }

    this.commentSection?.deleteCommentsSection?.Hide();
  }

  ConfirmConfirming() {
    if (!this.quickActionButtons.selectedButton) return;

    if (
      !confirm(
        System.data.locale.userContent.notificationMessages
          .doYouWantToConfirmThisContent,
      )
    ) {
      this.quickActionButtons.EnableButtons();

      return;
    }

    this.Confirm();
  }

  async Confirm() {
    try {
      const resConfirm = await new Action().ConfirmContent(
        this.data.id,
        this.contentType,
      );

      // TODO remove these lines
      // console.log(this.data.id, this.contentType);
      // const resConfirm = { success: true, message: "" };
      // await System.TestDelay();

      if (resConfirm.success === false) {
        throw resConfirm.message
          ? { msg: resConfirm.message }
          : resConfirm || Error("No response");
      }

      this.Confirmed();
    } catch (error) {
      console.error(error);
      this.main.modal.Notification({
        type: "error",
        html:
          error.msg ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
      });
      this.quickActionButtons.EnableButtons();
    }
  }

  Confirmed() {
    this.HideReportDetails();
    this.contentBox.HideBorder();
    this.contentBox.ChangeColor();
    this.contentBox.ChangeBorderColor();
    this.quickActionButtons.EnableButtons();
    this.quickActionButtons.confirmButton?.Hide();
    this.main.listeners.onModerate(this.data.id, "confirm", this.contentType);
  }

  HideReportDetails() {
    delete this.data.report;

    HideElement(this.reportDetailsBox);
    HideElement(this.reportedFlagIconContainer);
  }

  RemoveAttachmentContainer() {
    this.numberOfAttachments.remove();
    this.attachmentLabelContainer.remove();
    this.attachmentContainer.remove();
    this.gallery?.destroy();

    this.numberOfAttachments = null;
    this.attachmentLabelContainer = null;
    this.attachmentContainer = null;
    this.gallery = null;
  }
}
