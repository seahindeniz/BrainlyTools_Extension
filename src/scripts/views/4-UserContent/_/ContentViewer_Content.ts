import Action, { AttachmentDataInTicketType } from "@BrainlyAction";
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
import Viewer from "viewerjs";
import Attachment from "./Attachment";
import type UserContentRowType from "./UserContentRow";

function HideElement(element: HTMLElement) {
  if (!element || !element.parentElement) return;

  element.parentElement.removeChild(element);
}

export default class ContentViewerContent {
  main: UserContentRowType;
  container: any;
  source: any;
  contentData: {
    content: any;
    user: any;
    userProfileLink: string;
    avatar: string;
    type?: "Question" | "Answer";
  };

  #buttonSpinner: any;
  private iconContainer: FlexElementType;
  private contentContainer: FlexElementType;
  private actionsContainer: FlexElementType;
  private approvedIcon: FlexElementType;
  private reportedContentIcon: FlexElementType;
  private confirmButton?: Button;
  private confirmButtonContainer: FlexElementType;
  private approveButton: Button;
  private approveButtonContainer: FlexElementType;
  attachmentContainer: FlexElementType;
  attachmentLabelNumber: Text;
  private gallery: Viewer;

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
    if (this.contentData.content) {
      this.contentData.content = replaceLatexWithURL(this.contentData.content);
    }
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
      rankTexts = this.contentData.user.ranks_ids.map(rankId => {
        return Text({
          tag: "span",
          size: "xsmall",
          color: "gray",
          weight: "bold",
          underlined: true,
          transform: "capitalize",
          text:
            System.data.Brainly.defaultConfig.config.data.ranksWithId[rankId]
              .name,
        });
      });

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
                Avatar({
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
    if (!this.source.best) return;

    this.RenderIcon("mustard", "excellent");
  }

  private RenderApprovedIcon() {
    this.approvedIcon = this.RenderIcon("mint", "verified");
  }

  private IsApproved() {
    return this.source.approved?.date;
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
    const galleryContainer = Flex({
      wrap: true,
      className: "ext-image-gallery",
    });

    this.source.attachments.forEach(
      (attachmentData: AttachmentDataInTicketType) => {
        const attachment = new Attachment(this, attachmentData);

        galleryContainer.append(attachment.container);
      },
    );

    this.attachmentContainer = Flex({
      marginTop: "l",
      children: galleryContainer,
    });

    this.contentContainer.append(this.attachmentContainer);

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
        prev: this.source.attachments.length > 1 ? 1 : false,
        play: false,
        next: this.source.attachments.length > 1 ? 1 : false,
        rotateLeft: 1,
        rotateRight: 1,
        flipHorizontal: 1,
        flipVertical: 1,
      },
    });

    if (this.source.attachments.length > 1) {
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
          } else if (
            event.detail.index ===
            this.source.attachments.length - 1
          ) {
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
    this.source.approved = {
      date: new Date().toISOString(),
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
