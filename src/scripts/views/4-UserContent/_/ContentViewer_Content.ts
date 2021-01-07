import Action from "@BrainlyAction";
import type {
  QuestionMainViewAnswerDataType,
  QuestionMainViewQuestionDataType,
} from "@BrainlyReq/GetQuestion";
import type { AttachmentDataType } from "@components/AttachmentSection/Attachment";
import AttachmentSection from "@components/AttachmentSection/AttachmentSection";
import notification from "@components/notification2";
import Build from "@root/helpers/Build";
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
  Spinner,
  Text,
} from "@style-guide";
import type { BoxColorType } from "@style-guide/Box";
import type { FlexElementType } from "@style-guide/Flex";
import type UserContentRowType from "./UserContentRow";

function HideElement(element: HTMLElement) {
  if (!element || !element.parentElement) return;

  element.parentElement.removeChild(element);
}

export default class ContentViewerContent {
  main: UserContentRowType;
  container: any;
  source: QuestionMainViewQuestionDataType | QuestionMainViewAnswerDataType;
  contentData: {
    content: any;
    user: any;
    userProfileLink: string;
    avatar: string;
    type?: "Question" | "Answer";
  };

  #buttonSpinner: HTMLDivElement;
  private iconContainer: FlexElementType;
  private contentContainer: FlexElementType;
  private actionsContainer: FlexElementType;
  private approvedIcon: FlexElementType;
  private reportedContentIcon: FlexElementType;
  private confirmButton?: Button;
  private confirmButtonContainer: FlexElementType;
  private approveButton: Button;
  private approveButtonContainer: FlexElementType;
  private attachmentLabelNumber: Text;
  private attachmentSection: AttachmentSection;

  constructor(main: UserContentRowType, source, user) {
    this.main = main;
    this.source = source;
    this.contentData = {
      content: source.content,
      user,
      userProfileLink: System.createProfileLink(user),
      avatar: System.ExtractAvatarURL(user),
      // type: "responses" in source ? "Question" : "Answer",
    };

    this.contentData.type = "responses" in source ? "Question" : "Answer";

    this.CheckLatex();
    this.RenderContent();
  }

  private get buttonSpinner() {
    if (!this.#buttonSpinner) this.RenderButtonSpinner();

    return this.#buttonSpinner;
  }

  private RenderButtonSpinner() {
    this.#buttonSpinner = Spinner({ overlay: true });
  }

  private CheckLatex() {
    if (!this.contentData.content) return;

    this.contentData.content = replaceLatexWithURL(this.contentData.content);
  }

  private BoxBorderColor() {
    let borderColor: BoxColorType = "light";

    if (this.IsApproved()) {
      borderColor = "mint";
    } else if (this.source.settings.is_marked_abuse) {
      borderColor = "peach";
    } else if (this.source.user_id === Number(window.sitePassedParams[0]))
      borderColor = "blue";

    return borderColor;
  }

  private RenderContent() {
    let rankTexts = [];

    if (this.contentData.user.ranks_ids)
      rankTexts = this.contentData.user.ranks_ids.map(rankId =>
        Text({
          tag: "span",
          size: "xsmall",
          color: "gray",
          weight: "bold",
          underlined: true,
          transform: "capitalize",
          text:
            System.data.Brainly.defaultConfig.config.data.ranksWithId[rankId]
              .name,
        }),
      );

    this.container = new Box({
      padding: "s",
      border: true,
      borderColor: this.BoxBorderColor(),
    });

    Build(this.container.element, [
      [
        Flex(),
        [
          [
            (this.iconContainer = Flex({
              direction: "column",
              marginRight: "s",
            })),
            [
              [
                Flex({ marginBottom: "s", justifyContent: "center" }),
                new Avatar({
                  imgSrc: this.contentData.avatar,
                }),
              ],
            ],
          ],
          [
            (this.contentContainer = Flex({
              grow: true,
              direction: "column",
            })),
            [
              [
                Flex({
                  marginBottom: "s",
                  marginTop: "xxs",
                  justifyContent: "space-between",
                }),
                [
                  [
                    Flex({
                      direction: "column",
                    }),
                    [
                      Text({
                        tag: "a",
                        size: "small",
                        weight: "bold",
                        underlined: true,
                        transform: "capitalize",
                        text: this.contentData.user.nick,
                        href: this.contentData.userProfileLink,
                      }),
                      new Breadcrumb({
                        elements: rankTexts,
                      }),
                    ],
                  ],
                  (this.actionsContainer = Flex({})),
                ],
              ],
              [
                Text({
                  html: this.contentData.content,
                  className: "brn-rich-content brn-answer__text",
                }),
              ],
            ],
          ],
        ],
      ],
    ]);

    if (this.source.settings.is_marked_abuse) {
      this.RenderReportedContentIcon();
      this.RenderConfirmButton();
    }

    this.RenderBestIcon();

    if (this.IsApproved()) {
      this.RenderApprovedIcon();
    } else if (
      this.contentData.type === "Answer" &&
      System.checkBrainlyP(146)
    ) {
      this.RenderApproveButton();
    }

    this.RenderQuestionPoints();

    if (this.source.attachments && this.source.attachments.length > 0) {
      this.RenderAttachmentsIcon();
      this.RenderAttachments();
    }
  }

  private RenderBestIcon() {
    if (!("best" in this.source) || !this.source.best) return;

    this.RenderIcon("mustard", "excellent");
  }

  private RenderApprovedIcon() {
    this.approvedIcon = this.RenderIcon("mint", "verified");
  }

  private IsApproved() {
    return "approved" in this.source && this.source.approved?.date;
  }

  HideApproveIcon() {
    if (!this.approvedIcon || !this.approvedIcon.parentElement) return;

    this.approvedIcon.parentElement.removeChild(this.approvedIcon);
  }

  private RenderIcon(color, type) {
    const iconContainer = Flex({
      marginTop: "xs",
      justifyContent: "center",
      children: new Icon({
        type,
        color,
        size: 32,
      }),
    });

    this.iconContainer.append(iconContainer);

    return iconContainer;
  }

  private RenderQuestionPoints() {
    const { points } = this.source;

    if (!points || typeof points !== "object") return;

    const pointsContainer = Flex({
      children: Counter({
        icon: "points",
        children: [
          `+${points.ptsForResp} `,
          Text({
            tag: "span",
            size: "small",
            weight: "bold",
            color: "gray-secondary",
            text: System.data.locale.common.shortPoints.toLowerCase(),
          }),
        ],
      }),
    });

    this.actionsContainer.append(pointsContainer);
  }

  private RenderReportedContentIcon() {
    this.reportedContentIcon = this.RenderIcon("peach", "report_flag");
  }

  private RenderConfirmButton() {
    this.confirmButton = new Button({
      iconOnly: true,
      type: "solid-blue",
      icon: new Icon({ type: "check" }),
      title: System.data.locale.common.confirm,
    });

    this.confirmButtonContainer = Flex({
      marginLeft: "xs",
      children: this.confirmButton,
    });

    this.actionsContainer.append(this.confirmButtonContainer);
    this.confirmButton.element.addEventListener(
      "click",
      this.Confirm.bind(this),
    );
  }

  private RenderApproveButton() {
    this.approveButton = new Button({
      iconOnly: true,
      type: "solid-mint",
      icon: new Icon({ type: "verified" }),
      title: System.data.locale.common.moderating.approve,
    });

    this.approveButtonContainer = Flex({
      marginLeft: "xs",
      children: this.approveButton,
    });

    this.actionsContainer.append(this.approveButtonContainer);
    this.approveButton.element.addEventListener(
      "click",
      this.Approve.bind(this),
    );
  }

  private RenderAttachmentsIcon() {
    this.attachmentLabelNumber = document.createTextNode(
      String(this.source.attachments.length),
    );

    const attachmentIconContainer = Flex({
      marginTop: "xs",
      children: new Label({
        color: "gray",
        icon: new Icon({ type: "attachment" }),
        children: this.attachmentLabelNumber,
      }),
    });

    this.iconContainer.append(attachmentIconContainer);
  }

  private RenderAttachments() {
    const attachments: AttachmentDataType[] = this.source.attachments.map(
      attachmentData => ({
        databaseId: attachmentData.id,
        url: attachmentData.full,
        thumbnailUrl: attachmentData.thumbnail,
      }),
    );

    this.attachmentSection = new AttachmentSection({
      attachments,
      content: {
        databaseId: this.source.id,
        questionId:
          "task_id" in this.source ? this.source.task_id : this.source.id,
        type: this.contentData.type,
      },
      notificationHandler: notification,
      onDelete: this.AttachmentDeleted.bind(this),
    });

    this.attachmentSection.container.ChangeMargin({ marginTop: "l" });

    this.contentContainer.append(this.attachmentSection.container);
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

  private async Confirm() {
    if (
      !confirm(
        System.data.locale.userContent.notificationMessages
          .doYouWantToConfirmThisContent,
      )
    )
      return;

    this.confirmButton.Disable();
    this.confirmButton.element.append(this.buttonSpinner);

    const resConfirm = await new Action().ConfirmContent(
      this.source.id,
      this.contentData.type,
    );
    // const resConfirm: CommonResponseDataType = {
    //   success: true,
    //   // @ts-expect-error
    //   message: "",
    // };
    // await System.TestDelay();

    if (!resConfirm) {
      notification({
        html: System.data.locale.common.notificationMessages.operationError,
        type: "error",
      });

      return;
    }

    if (resConfirm.success === false) {
      notification({
        html:
          resConfirm.message ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
        type: "error",
      });

      return;
    }

    this.source.settings.is_marked_abuse = false;

    HideElement(this.confirmButton.element);
    HideElement(this.reportedContentIcon);
    this.container.ChangeBorderColor(this.BoxBorderColor());

    if (this.source.user_id === Number(window.sitePassedParams[0])) {
      if (this.contentData.type === "Question")
        HideElement(this.main.reportedIconForQuestion?.element);

      if (this.contentData.type === "Answer")
        HideElement(this.main.reportedIconForAnswer?.element);
    }
  }

  private async Approve() {
    if (
      !confirm(
        System.data.locale.userContent.notificationMessages.confirmApproving,
      )
    )
      return;

    this.approveButton.Disable();
    this.approveButton.element.append(this.buttonSpinner);

    const resApprove = await new Action().ApproveAnswer(this.source.id);
    // const resApprove: CommonResponseDataType = {
    //   success: true,
    //   // @ts-expect-error
    //   message: "",
    // };
    // await System.TestDelay();

    if (!resApprove) {
      notification({
        html: System.data.locale.common.notificationMessages.operationError,
        type: "error",
      });

      return;
    }

    if (resApprove.success === false) {
      notification({
        html:
          resApprove.message ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
        type: "error",
      });

      return;
    }

    this.source.settings.is_marked_abuse = false;

    if ("approved" in this.source)
      this.source.approved = {
        date: new Date().toISOString(),
        approver: undefined,
      };

    HideElement(this.confirmButton?.element);
    HideElement(this.approveButton.element);
    HideElement(this.reportedContentIcon);
    this.RenderApprovedIcon();
    this.container.ChangeBorderColor(this.BoxBorderColor());

    if (this.source.user_id === Number(window.sitePassedParams[0])) {
      this.main.RenderApproveIcon(this.source);
      HideElement(this.main.reportedIconForAnswer?.element);
    }
  }
}
