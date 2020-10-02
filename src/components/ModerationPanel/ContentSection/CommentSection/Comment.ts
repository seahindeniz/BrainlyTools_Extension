import type {
  CommentDataInTicketType,
  RemoveCommentReqDataType,
  UsersDataInReportedContentsType,
} from "@BrainlyAction";
import Action from "@BrainlyAction";
import DeleteSection from "@components/DeleteSection2/DeleteSection";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import IsVisible from "@root/helpers/IsVisible";
import {
  Avatar,
  Box,
  Breadcrumb,
  Button,
  Flex,
  SeparatorHorizontal,
  Text,
} from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import QuickActionButtonsForComment from "../QuickActionButtons/Comment";
import type CommentSectionClassType from "./CommentSection";

export default class Comment {
  main: CommentSectionClassType;
  data: CommentDataInTicketType;
  container: FlexElementType;
  owner: {
    data: UsersDataInReportedContentsType;
    profileLink: string;
    avatarLink: string;
  };

  contentBox: Box;
  deleteSection: DeleteSection;
  quickActionButtons: QuickActionButtonsForComment;
  reportDetailsBox: FlexElementType;
  contentContainer: FlexElementType;
  contentContainerWrapper: FlexElementType;
  deleteSectionContainer: FlexElementType;
  deleteButton: Button;

  constructor(main: CommentSectionClassType, data: CommentDataInTicketType) {
    this.main = main;
    this.data = data;

    this.SetOwner();
    this.Render();
    this.BindListener();
  }

  SetOwner() {
    const owner = this.main.main.main.usersData.find(
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
    const createdTimeEntry = this.main.main.CreateTimeEntry(this.data.created);

    this.container = Build(
      Flex({
        direction: "column",
        borderTop: !this.data.report && !this.data.deleted,
        borderBottom: !this.data.report && !this.data.deleted,
        marginTop: "xxs",
        marginBottom: "xxs",
      }),
      [
        [
          (this.contentBox = new Box({
            padding: "xs",
            border: false,
            thinBorder: true,
          })),
          [
            [
              (this.contentContainerWrapper = Flex({
                relative: true,
                alignItems: "center",
              })),
              [
                [
                  (this.contentContainer = Flex({
                    fullWidth: true,
                    direction: "column",
                  })),
                  [
                    [
                      Flex({
                        justifyContent: "space-between",
                      }),
                      [
                        [
                          Flex({
                            marginRight: "xs",
                            alignItems: "center",
                          }),
                          [
                            [
                              Flex({ marginRight: "xs" }),
                              Avatar({
                                size: "xs",
                                target: "_blank",
                                link: this.owner.profileLink,
                                imgSrc: this.owner.avatarLink,
                              }),
                            ],
                            [
                              Flex(),
                              Text({
                                size: "xsmall",
                                breakWords: true,
                                html: this.data.content,
                              }),
                            ],
                          ],
                        ],
                        [
                          Flex({ alignItems: "center" }),
                          Text({
                            noWrap: true,
                            size: "xsmall",
                            children: createdTimeEntry.node,
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
    );

    this.RenderReportDetails();

    if (this.data.deleted) {
      this.Deleted();
    }
  }

  RenderReportDetails() {
    const { report } = this.data;

    if (!report) return;

    this.contentBox.ShowBorder();
    this.contentBox.ChangeBorderColor("peach-secondary");

    const reporter = this.main.main.main.usersData.find(
      user => user.id === report.user.id,
    );

    const reportTimeEntry = this.main.main.CreateTimeEntry(report.created);

    this.reportDetailsBox = Build(
      Flex({
        fullWidth: true,
        direction: "column",
      }),
      [
        [
          Flex(),
          [
            [
              Flex({ grow: true }),
              [
                [
                  Flex({ direction: "column" }),
                  [
                    new Breadcrumb({
                      elements: [
                        Text({
                          tag: "span",
                          size: "xsmall",
                          weight: "bold",
                          color: "blue-dark",
                          text: reporter.nick,
                          target: "_blank",
                          href: System.createProfileLink(reporter),
                        }),
                        ...reporter.ranks.names.map(rankName => {
                          return Text({
                            tag: "span",
                            size: "xsmall",
                            text: rankName,
                            style: {
                              color: reporter.ranks.color,
                            },
                          });
                        }),
                      ],
                    }),
                    Text({
                      size: "xsmall",
                      html: report.abuse.name,
                    }),
                    report.abuse.data &&
                      Text({
                        size: "xsmall",
                        blockquote: true,
                        html: report.abuse.data,
                      }),
                  ],
                ],
              ],
            ],
            [
              Flex({ alignItems: "center" }),
              Text({
                size: "xsmall",
                children: reportTimeEntry.node,
              }),
            ],
          ],
        ],
        SeparatorHorizontal({ type: "short-spaced" }),
      ],
    );

    this.contentContainer.prepend(this.reportDetailsBox);
  }

  BindListener() {
    if (this.data.deleted || this.main.main.deleted) return;

    this.container.addEventListener(
      "mouseenter",
      this.ShowQuickActionButtons.bind(this),
    );
    this.container.addEventListener(
      "mouseleave",
      this.HideQuickActionButtons.bind(this),
    );
  }

  ShowQuickActionButtons() {
    if (this.data.deleted || this.main.main.deleted) return;

    if (!this.quickActionButtons) {
      this.RenderQuickActionButtons();
    }

    this.contentContainerWrapper.append(this.quickActionButtons.container);
  }

  RenderQuickActionButtons() {
    this.quickActionButtons = new QuickActionButtonsForComment(this);
    /* this.quickActionButtonContainer = Flex({
      className: "ext-action-buttons",
    }); */
    this.quickActionButtons.container.classList.add("ext-action-buttons");

    this.contentContainerWrapper.append(this.quickActionButtons.container);
  }

  HideQuickActionButtons() {
    this.quickActionButtons?.Hide();
  }

  ToggleDeleteSection() {
    if (!IsVisible(this.deleteSectionContainer)) {
      this.OpenDeleteSection();
    } else {
      this.HideDeleteSection();
    }
  }

  OpenDeleteSection() {
    if (this.data.deleted || this.main.main.deleted) return;

    if (!this.deleteSection) {
      this.RenderDeleteSection();
    }

    this.contentBox.element.append(this.deleteSectionContainer);
  }

  HideDeleteSection() {
    HideElement(this.deleteSectionContainer);
  }

  RenderDeleteSection() {
    this.deleteSection = new DeleteSection({
      defaults: {
        contentType: "Comment",
      },
      listeners: {
        onDeleteButtonClick: this.DeleteSectionButtonClicked.bind(this),
      },
    });
    this.deleteSectionContainer = Flex({
      tag: "div",
      marginTop: "xs",
      direction: "column",
      children: this.deleteSection.container,
    });
  }

  DeleteSectionButtonClicked() {
    this.ConfirmDeletion(this.deleteSection.PrepareData());
  }

  async ConfirmDeletion(data: RemoveCommentReqDataType) {
    if (!data) return;

    const confirmMessage = System.data.locale.common.moderating.doYouWantToDeleteWithReason
      .replace("%{reason_title}", data.reason_title)
      .replace("%{reason_message}", data.reason);

    if (!confirm(confirmMessage)) {
      this.quickActionButtons.EnableButtons();

      return;
    }

    this.Delete(data);
  }

  async Delete(data: RemoveCommentReqDataType) {
    try {
      const resDelete = await new Action().RemoveComment({
        ...data,
        model_id: this.data.id,
      });

      // TODO delete this comment
      /* console.log({
        ...data,
        model_id: this.data.id,
      });
      const resDelete: import("@BrainlyAction").CommonResponseDataType = {
        success: true,
      };
      await System.TestDelay(); */

      if (!resDelete?.success) {
        throw resDelete.message
          ? { msg: resDelete.message }
          : resDelete || Error("No response");
      }

      this.Deleted();
    } catch (error) {
      console.error(error);
      this.quickActionButtons.EnableButtons();
      this.main.main.main.modal.Notification({
        type: "error",
        html:
          error.msg ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
      });
    }
  }

  Deleted() {
    this.data.deleted = true;

    this.quickActionButtons?.Hide();
    HideElement(this.deleteSectionContainer);
    this.contentBox.ChangeColor("peach-secondary");
    this.main.main.main.listeners.onModerate(this.data.id, "delete", "Comment");
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
      const resConfirm = await new Action().ConfirmComment(this.data.id);

      if (!resConfirm?.success) {
        throw resConfirm.message
          ? { msg: resConfirm.message }
          : resConfirm || Error("No response");
      }

      this.Confirmed();
    } catch (error) {
      console.error(error);
      this.quickActionButtons.EnableButtons();
      this.main.main.main.modal.Notification({
        type: "error",
        html:
          error.msg ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
      });
    }
  }

  Confirmed() {
    this.HideReportDetails();
    this.contentBox.ChangeBorderColor();
    this.quickActionButtons.EnableButtons();
    this.quickActionButtons.confirmButton.Hide();
    this.main.main.main.listeners.onModerate(
      this.data.id,
      "confirm",
      "Comment",
    );
  }

  HideReportDetails() {
    delete this.data.report;

    HideElement(this.reportDetailsBox);
  }
}
