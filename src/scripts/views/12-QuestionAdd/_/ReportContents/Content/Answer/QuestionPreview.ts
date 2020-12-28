import type { AttachmentDataType } from "@components/AttachmentSection/Attachment";
import AttachmentSection from "@components/AttachmentSection/AttachmentSection";
import notification from "@components/notification2";
import QuickActionButtonsForQuestion from "@components/QuickActionButtons/Question";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import replaceLatexWithURL from "@root/helpers/replaceLatexWithURL";
import {
  Avatar,
  Box,
  Breadcrumb,
  Button,
  Counter,
  Flex,
  Icon,
  Label,
  SeparatorVertical,
  Text,
} from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import { DateTime } from "luxon";
import tippy, { Instance, Props } from "tippy.js";
import type * as AnswerTypes from "./Answer";

export default class QuestionPreview {
  main: AnswerTypes.default;

  databaseId: number;
  data: AnswerTypes.AnswerExtraDataQuestionType;
  createdTimeInstance: DateTime;

  questionPopupTippy: Instance<Props>;
  questionPopupContainer: FlexElementType;
  questionContainer: Box;
  questionContentTypeButton: Button;
  contentDetailsContainer: FlexElementType;
  createdTimeText: import("@style-guide/Text").TextElement<"span">;
  attachmentSection?: AttachmentSection;
  contentWrapper: FlexElementType;
  private footerContainer: FlexElementType;
  private quickActionButtons: QuickActionButtonsForQuestion;
  questionContentTypeButtonContainer: FlexElementType;
  separator: HTMLDivElement;

  constructor(main: AnswerTypes.default) {
    this.main = main;

    this.data = this.main.extraData.question;
    this.databaseId = System.DecryptId(this.data.id);
    this.createdTimeInstance = DateTime.fromISO(this.data.created);

    this.RenderButton();
    this.InitTippy();
  }

  RenderButton() {
    this.questionContentTypeButtonContainer = Flex({
      alignItems: "center",
      children: (this.questionContentTypeButton = new Button({
        // ...CONTENT_TYPE_ICON_COLOR.Question,
        type: "outline",
        toggle: "blue",
        size: "s",
        iconOnly: true,
        icon: Text({
          breakWords: true,
          // color: "white",
          color: "blue-dark",
          text: "Q",
        }),
        // onClick();,
      })),
    });

    this.main.contentTypeButtonContainer.append(
      (this.separator = SeparatorVertical({ size: "small" })),
      this.questionContentTypeButtonContainer,
    );
  }

  InitTippy() {
    this.questionPopupTippy = tippy(this.questionContentTypeButton.element, {
      theme: "light",
      maxWidth: 600,
      trigger: "mouseenter focus click",
      interactive: true,
      content: (this.questionPopupContainer = Flex()),
      onShow: this.TryToRenderContent.bind(this),
    });

    this.main.tippyInstances.push(this.questionPopupTippy);
  }

  TryToRenderContent() {
    this.UpdateCreatedTimeText();

    if (this.questionContainer) return;

    this.RenderQuestionPopupContent();
  }

  RenderQuestionPopupContent() {
    const content = replaceLatexWithURL(this.data.content);

    const ownerProfileLink = System.createProfileLink(this.data.author);

    this.questionContainer = Build(
      new Box({
        border: false,
        padding: "xs",
      }),
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
                    marginRight: "l",
                  }),
                  [
                    [
                      // Avatar container
                      Flex(),
                      new Avatar({
                        imgSrc: this.data.author?.avatar?.thumbnailUrl,
                        link: ownerProfileLink,
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
                              Text({
                                tag: "span",
                                size: "small",
                                weight: "bold",
                                text:
                                  this.data.author?.nick ||
                                  System.data.locale.common.deletedUser,
                                target: "_blank",
                                href: ownerProfileLink,
                              }),
                              ...[
                                this.data.author?.rank,
                                ...this.data.author?.specialRanks,
                              ].map(rankData => {
                                if (!rankData?.id) return undefined;

                                const rankId = System.DecryptId(rankData.id);
                                const rank =
                                  System.data.Brainly.defaultConfig.config.data
                                    .ranksWithId[rankId];

                                if (!rank) return undefined;

                                return Text({
                                  tag: "span",
                                  size: "small",
                                  text: rank.name,
                                  style: {
                                    color: rank.color,
                                  },
                                });
                              }),
                            ],
                          }),
                        ],
                        [
                          // user details container
                          Flex(),
                          new Breadcrumb({
                            elements: [
                              (this.createdTimeText = Text({
                                tag: "span",
                                size: "xsmall",
                                color: "gray-secondary",
                              })),
                              Text({
                                tag: "span",
                                size: "xsmall",
                                color: "gray-secondary",
                                text: this.data.subject?.name || "",
                              }),
                              Text({
                                tag: "span",
                                size: "xsmall",
                                color: "gray-secondary",
                                text: this.data.grade?.name || "",
                              }),
                            ],
                          }),
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
                  [
                    [
                      Flex({
                        marginLeft: "xs",
                      }),
                      Counter({
                        icon: "points",
                        children: [
                          `+${this.data.points} `,
                          Text({
                            tag: "span",
                            size: "small",
                            weight: "bold",
                            color: "gray-secondary",
                            text: System.data.locale.common.shortPoints.toLowerCase(),
                          }),
                        ],
                      }),
                    ],
                  ],
                ],
              ],
            ],
            [
              // Content container
              Flex({
                direction: "column",
                marginBottom: "xs",
              }),
              Text({
                breakWords: true,
                children: content,
              }),
            ],
            // footer
            (this.footerContainer = Flex({
              justifyContent: "space-between",
            })),
          ],
        ],
      ],
    );

    this.UpdateCreatedTimeText();
    this.RenderPopularLabel();
    this.RenderAttachments();
    this.RenderQuickActionButtons();

    this.questionPopupContainer.append(this.questionContainer.element);
  }

  UpdateCreatedTimeText() {
    if (!this.createdTimeText) return;

    this.createdTimeText.innerHTML = this.createdTimeInstance.toRelative();
  }

  RenderPopularLabel() {
    if (!this.data.isPopular) return;

    this.contentDetailsContainer.append(
      Flex({
        marginLeft: "xs",
        children: new Label({
          type: "transparent",
          title: System.data.locale.reportedContents.queue.popularQuestion,
          icon: new Icon({
            type: "friends",
            color: "blue",
          }),
        }),
      }),
    );
  }

  RenderAttachments() {
    const attachments: AttachmentDataType[] = this.data.attachments.map(
      attachmentData => ({
        databaseId: System.DecryptId(attachmentData.id),
        url: attachmentData.url,
        thumbnailUrl: attachmentData.thumbnailUrl,
      }),
    );

    this.attachmentSection = new AttachmentSection({
      attachments,
      content: {
        databaseId: this.databaseId,
        questionId: this.databaseId,
        type: "Question",
      },
      notificationHandler: notification,
      onDelete: this.AttachmentDeleted.bind(this),
    });

    this.footerContainer.append(this.attachmentSection.container);
  }

  AttachmentDeleted() {
    const { length } = this.attachmentSection.attachments;

    if (length > 0) return;

    this.RemoveAttachmentContainer();
  }

  RemoveAttachmentContainer() {
    this.attachmentSection?.container.remove();

    this.attachmentSection = null;
  }

  RenderQuickActionButtons() {
    this.quickActionButtons = new QuickActionButtonsForQuestion({
      content: {
        databaseId: this.databaseId,
        hasVerifiedAnswers: this.data.answers.hasVerified,
      },
      containerProps: {
        alignItems: "flex-end",
      },
      onDelete: this.Deleted.bind(this),
    });

    this.footerContainer.append(this.quickActionButtons.container);
  }

  Deleted() {
    this.questionContainer.ChangeColor("peach-secondary-light");
    HideElement(this.quickActionButtons?.container);
    this.attachmentSection.RemoveDeleteButtons();
    this.main.Deleted();
  }
}
