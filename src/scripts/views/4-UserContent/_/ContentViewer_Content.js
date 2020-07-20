// @flow

import CreateElement from "@/scripts/components/CreateElement";
import notification from "@/scripts/components/notification2";
import Build from "@/scripts/helpers/Build";
import Action from "@BrainlyAction";
import {
  Avatar,
  Box,
  BoxDeprecated,
  Breadcrumb,
  Button,
  Counter,
  Flex,
  Icon,
  Label,
  Spinner,
  Text,
} from "@style-guide";
import type { ColorType as BoxColorType } from "@style-guide/Box";
import type { Properties as BoxDeprecatedPropsType } from "@style-guide/BoxDeprecated";
import mime from "mime-types";
import type UserContentRowType from "./UserContentRow";

function HideElement(element: HTMLElement) {
  if (!element || !element.parentElement) return;

  element.parentElement.removeChild(element);
}

export default class ContentViewerContent {
  main: UserContentRowType;

  constructor(main: UserContentRowType, source, user) {
    this.main = main;
    this.source = source;
    this.contentData = {
      content: source.content,
      user,
      userProfileLink: System.createProfileLink(user),
      avatar: System.ExtractAvatarURL(user),
      type: source.hasOwnProperty("responses") ? "Question" : "Answer",
    };

    this.CheckLatex();
    this.RenderContent();
  }

  get buttonSpinner() {
    if (!this._buttonSpinner) this.RenderButtonSpinner();

    return this._buttonSpinner;
  }

  RenderButtonSpinner() {
    this._buttonSpinner = Spinner({ overlay: true });
  }

  CheckLatex() {
    if (this.contentData.content) {
      this.contentData.content = this.contentData.content
        .replace(/(?:\r\n|\n)/g, "")
        .replace(/\[tex\](.*?)\[\/tex\]/gi, (_, latex) => {
          let latexURI = window.encodeURIComponent(latex);

          if (!latex.startsWith("\\")) {
            latexURI = `%5C${latexURI}`;
          }

          return `<img src="${System.data.Brainly.defaultConfig.config.data.config.serviceLatexUrlHttps}${latexURI}" title="${latex}" align="absmiddle" class="latex-formula sg-box__image">`;
        });
    }
  }

  BoxBorderColor() {
    let borderColor: BoxColorType = "light";

    if (this.IsApproved()) {
      borderColor = "mint";
    } else if (this.source.settings.is_marked_abuse) {
      borderColor = "peach";
    } else if (this.source.user_id === Number(window.sitePassedParams[0]))
      borderColor = "blue";

    return borderColor;
  }

  RenderContent() {
    let rankTexts = [];

    if (this.contentData.user.ranks_ids)
      rankTexts = this.contentData.user.ranks_ids.map(rankId => {
        return Text({
          size: "small",
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
      /* color:
        this.source.user_id === Number(window.sitePassedParams[0])
          ? "blue-secondary-light"
          : undefined, */
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
            // Icon side
          ],
          [
            // Content side
            (this.contentContainer = Flex({
              grow: true,
              direction: "column",
            })),
            [
              [
                // Nick container
                Flex({
                  marginBottom: "s",
                  marginTop: "xxs",
                  justifyContent: "space-between",
                }),
                [
                  [
                    (this.nickContainer = Flex({
                      direction: "column",
                    })),
                    Breadcrumb({
                      elements: [
                        Text({
                          tag: "a",
                          size: "small",
                          color: "gray",
                          weight: "bold",
                          underlined: true,
                          transform: "capitalize",
                          text: this.contentData.user.nick,
                          href: this.contentData.userProfileLink,
                        }),
                        ...rankTexts,
                      ],
                    }),
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
    this.$ = $(this.container.element);
    this.$box = $("> .sg-box", this.$);
    this.$attachmentsIconContainer = $(
      ".sg-actions-list__hole:eq(0) .sg-content-box__content",
      this.$,
    );

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

  RenderBestIcon() {
    if (!this.source.best) return;

    this.RenderIcon("mustard", "excellent");
  }

  RenderApprovedIcon() {
    this.approvedIcon = this.RenderIcon("mint", "verified");
  }

  IsApproved() {
    return this.source.approved?.date;
  }

  HideApproveIcon() {
    if (!this.approvedIcon || !this.approvedIcon.parentElement) return;

    this.approvedIcon.parentElement.removeChild(this.approvedIcon);
  }

  RenderIcon(color, type) {
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

  RenderQuestionPoints() {
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

    this.nickContainer.append(pointsContainer);
  }

  RenderReportedContentIcon() {
    this.reportedContentIcon = this.RenderIcon("peach", "report_flag");
  }

  RenderConfirmButton() {
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

  RenderApproveButton() {
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

  RenderAttachmentsIcon() {
    const attachmentIconContainer = Flex({
      marginTop: "xs",
      children: Label({
        color: "gray",
        icon: { type: "attachment" },
        text: this.source.attachments.length,
      }),
    });

    this.iconContainer.append(attachmentIconContainer);
  }

  RenderAttachments() {
    const attachmentContainer = Flex({
      marginTop: "l",
    });

    this.contentContainer.append(attachmentContainer);

    this.source.attachments.forEach(
      (attachment: {
        type: string,
        thumbnail: string,
        full: string,
        extension: string,
      }) => {
        const boxProps: BoxDeprecatedPropsType = {
          color: "dark",
        };

        if (!attachment.thumbnail) {
          const attachmentTypes =
            attachment.extension ||
            [
              ...new Set(
                attachment.type
                  .split("application/")
                  .filter(Boolean)
                  .map(type =>
                    mime.extension(
                      type.includes("/") ? type : `application/${type}`,
                    ),
                  ),
              ),
            ].join(" ");

          boxProps.children = Text({
            weight: "bold",
            href: "",
            text: (attachmentTypes || attachment.type).toLocaleUpperCase(),
          });
        } else {
          boxProps.imgSrc = attachment.thumbnail;
        }

        const container = Build(
          Flex({
            marginLeft: "xs",
          }),
          [
            [
              CreateElement({
                tag: "a",
                target: "_blank",
                href: attachment.full,
              }),
              BoxDeprecated(boxProps),
            ],
          ],
        );

        attachmentContainer.append(container);
      },
    );
  }

  async Confirm() {
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

    if (!resConfirm) {
      notification({
        html: System.data.locale.common.notificationMessages.operationError,
        type: "error",
      });

      return;
    }

    if (!resConfirm.success) {
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
      HideElement(this.main.reportedContentIcon.element);
    }
  }

  async Approve() {
    if (
      !confirm(
        System.data.locale.userContent.notificationMessages.confirmApproving,
      )
    )
      return;

    this.approveButton.Disable();
    this.approveButton.element.append(this.buttonSpinner);

    const resApprove = await new Action().ApproveAnswer(this.source.id);

    if (!resApprove) {
      notification({
        html: System.data.locale.common.notificationMessages.operationError,
        type: "error",
      });

      return;
    }

    if (!resApprove.success) {
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

    HideElement(this.confirmButton.element);
    HideElement(this.approveButton.element);
    HideElement(this.reportedContentIcon);
    this.RenderApprovedIcon();
    this.container.ChangeBorderColor(this.BoxBorderColor());

    if (this.source.user_id === Number(window.sitePassedParams[0])) {
      this.main.RenderApproveIcon(this.source);
      HideElement(this.main.reportedContentIcon.element);
    }
  }
}
