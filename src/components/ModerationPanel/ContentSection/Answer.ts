import type { AnswerDataInTicketType } from "@BrainlyAction";
import Action from "@BrainlyAction";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import IsVisible from "@root/helpers/IsVisible";
import replaceLatexWithURL from "@root/helpers/replaceLatexWithURL";
import {
  Box,
  Breadcrumb,
  Button,
  Flex,
  Icon,
  Label,
  Text,
  Textarea,
} from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import { TextElement } from "@style-guide/Text";
import tippy from "tippy.js";
import type ModerationPanelClassType from "../ModerationPanel";
import ContentSection from "./ContentSection";
import QuickActionButtonsForAnswer from "./QuickActionButtons/Answer";

export default class Answer extends ContentSection {
  answerData: AnswerDataInTicketType;
  extraData: {
    id?: string;
    verification?: {
      approval: {
        approver: {
          id: string;
          nick: string;
        };
      };
    };
  };

  askForCorrectionContainer: FlexElementType;
  askForCorrectionButton: Button;
  askForCorrectionTextarea: HTMLTextAreaElement;
  reportedForCorrectionFlagIconContainer: FlexElementType;
  correctionReportDetailsContainer: FlexElementType;
  approvedIconContainer: FlexElementType;
  quickActionButtons: QuickActionButtonsForAnswer;
  correctionReportDetailsBox: Box;
  originalAnswerContainer: FlexElementType;
  reportedForCorrectionLabelContainer: FlexElementType;
  originalAnswerLink: TextElement<"div">;

  constructor(main: ModerationPanelClassType, data: AnswerDataInTicketType) {
    super(main, "Answer");

    this.answerData = data;
    this.data = data;
    this.extraData = {};

    this.SetOwner();
    this.Render();
    this.RenderCorrectionReportDetails();
    this.RenderBestIcon();
    this.RenderThanksIcon();
    this.RenderRatingIcon();
    this.RenderApprovedIcon();
    this.RenderQuickActionButtons();
  }

  RenderBestIcon() {
    if (!this.answerData.best) return;

    const iconContainer = Flex({
      marginLeft: "xs",
      title: System.data.locale.reportedContents.queue.bestAnswer,
      children: new Label({
        icon: new Icon({
          type: "excellent",
          color: "mustard",
          size: 24,
        }),
      }),
    });

    this.contentDetailsContainer.append(iconContainer);
  }

  RenderThanksIcon() {
    if (!this.answerData.thanks) return;

    const iconContainer = Flex({
      marginLeft: "xs",
      children: new Label({
        type: "solid",
        color: "peach",
        icon: new Icon({ type: "heart" }),
        children: this.answerData.thanks,
      }),
    });

    this.contentDetailsContainer.append(iconContainer);
  }

  RenderRatingIcon() {
    if (!this.answerData.mark) return;

    const iconContainer = Flex({
      marginLeft: "xs",
      children: new Label({
        type: "solid",
        color: "mustard",
        icon: new Icon({ type: "star_half_outlined" }),
        children: this.answerData.mark,
      }),
    });

    this.contentDetailsContainer.append(iconContainer);
  }

  RenderApprovedIcon() {
    if (!this.extraData?.verification) return;

    if (this.approvedIconContainer) {
      this.ShowApprovedIcon();

      return;
    }

    this.approvedIconContainer = Flex({
      marginLeft: "xs",
      children: new Label({
        type: "solid",
        color: "mint",
        icon: new Icon({
          color: "adaptive",
          type: "verified",
          size: 24,
        }),
      }),
    });

    const users = {
      "%{author}": this.owner.data,
      "%{verifier}": this.extraData.verification.approval.approver,
    };
    const textPieces = System.data.locale.reportedContents.queue.moderatorVerifiedSomeonesAnswer.split(
      /(%\{.*?})/gi,
    );

    tippy(this.approvedIconContainer, {
      content: Text({
        size: "small",
        weight: "bold",
        children: textPieces.map((string: keyof typeof users) => {
          const user = users[string];

          if (!user) {
            if (string in users) {
              return System.data.locale.common.deletedUser;
            }

            return string;
          }

          const profileLink = System.createProfileLink(user);

          return Text({
            children: user.nick,
            color: "blue-dark",
            href: profileLink,
            size: "small",
            tag: "a",
            target: "_blank",
            weight: "bold",
          });
        }),
      }),
      interactive: true,
      placement: "bottom",
      theme: "light",
    });

    this.ShowApprovedIcon();
  }

  private ShowApprovedIcon() {
    this.contentDetailsContainer.append(this.approvedIconContainer);
  }

  RenderQuickActionButtons() {
    this.quickActionButtons = new QuickActionButtonsForAnswer(this);

    this.contentContainer.append(this.quickActionButtons.container);
  }

  RenderCorrectionReportDetails() {
    if (this.correctionReportDetailsContainer) {
      this.correctionReportDetailsContainer?.remove();
      this.reportedForCorrectionLabelContainer?.remove();
      this.originalAnswerLink?.remove();
      this.originalAnswerContainer?.remove();
    }

    const { wrong_report: wrongReport } = this.answerData;

    if (!wrongReport) return;

    const reporter = this.main.usersData.find(
      user => user.id === wrongReport.user.id,
    );

    const reportTimeEntry = this.CreateTimeEntry(wrongReport.reported);

    this.RenderReportedForCorrectionFlagIcon();

    this.correctionReportDetailsContainer = Build(
      Flex({ marginBottom: "xs" }),
      [
        [
          (this.correctionReportDetailsBox = new Box({
            border: true,
            padding: "xs",
            borderColor: "blue-secondary-light",
          })),
          [
            [
              Flex({ alignItems: "center" }),
              [
                [
                  Flex,
                  new Icon({
                    size: 32,
                    color: "blue",
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
                        Text({
                          tag: "span",
                          size: "small",
                          weight: "bold",
                          color: "blue-dark",
                          text: reporter.nick,
                          target: "_blank",
                          href: System.createProfileLink(reporter),
                        }),
                        ...reporter.ranks.names.map(rankName => {
                          return Text({
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
                        Text({
                          size: "small",
                          weight: "bold",
                          html: wrongReport.reason,
                        }),
                      ],
                    ],
                  ],
                ],
                [
                  Flex({ direction: "column" }),
                  [
                    Text({
                      size: "xsmall",
                      align: "RIGHT",
                      children: reportTimeEntry.node,
                    }),
                    this.answerData.edited &&
                      (this.originalAnswerLink = Text({
                        tag: "div",
                        align: "RIGHT",
                        size: "xsmall",
                        href: "",
                        color: "blue-dark",
                        weight: "bold",
                        onClick: this.ToggleOriginalAnswer.bind(this),
                        children:
                          System.data.locale.moderationPanel.originalAnswer,
                      })),
                  ],
                ],
              ],
            ],
          ],
        ],
      ],
    );

    this.contentContainerBox.element.prepend(
      this.correctionReportDetailsContainer,
    );
  }

  RenderReportedForCorrectionFlagIcon() {
    if (!this.answerData.edited) {
      this.reportedForCorrectionFlagIconContainer = this.RenderReportedFlagIcon(
        "blue",
      );

      return;
    }

    this.reportedForCorrectionLabelContainer = Flex({
      marginLeft: "xs",
      children: new Label({
        type: "solid",
        color: "mint",
        noSelection: true,
        icon: new Icon({ type: "report_flag" }),
        children: System.data.locale.moderationPanel.corrected,
      }),
    });

    tippy(this.reportedForCorrectionLabelContainer, {
      placement: "bottom",
      theme: "light",
      content: Text({
        size: "small",
        weight: "bold",
        children: System.data.locale.moderationPanel.answerHasCorrected.replace(
          "%{nick}",
          this.owner.data.nick,
        ),
      }),
    });

    this.contentDetailsContainer.append(
      this.reportedForCorrectionLabelContainer,
    );
  }

  ToggleOriginalAnswer() {
    if (IsVisible(this.originalAnswerContainer)) {
      this.HideOriginalAnswer();

      return;
    }

    this.ShowOriginalAnswer();
  }

  ShowOriginalAnswer() {
    if (!this.originalAnswerContainer) {
      this.RenderOriginalAnswer();
    }

    this.correctionReportDetailsBox.element.append(
      this.originalAnswerContainer,
    );
  }

  HideOriginalAnswer() {
    HideElement(this.originalAnswerContainer);
  }

  RenderOriginalAnswer() {
    this.originalAnswerContainer = Flex({
      marginTop: "xs",
      marginLeft: "xs",
      marginRight: "xs",
      borderTop: true,
      children: Text({
        size: "small",
        children: replaceLatexWithURL(this.answerData.original_content),
      }),
    });
  }

  ToggleAskForCorrectionSection() {
    if (!IsVisible(this.askForCorrectionContainer)) {
      this.OpenAskForCorrectionSection();

      return;
    }

    this.HideAskForCorrectionSection();
  }

  OpenAskForCorrectionSection() {
    if (!this.askForCorrectionContainer) {
      this.RenderAskForCorrectionSection();
    }

    this.deleteSection?.Hide();
    this.contentContainer.append(this.askForCorrectionContainer);
  }

  OpenDeleteSection() {
    this.HideAskForCorrectionSection();
    super.OpenDeleteSection();
  }

  HideAskForCorrectionSection() {
    HideElement(this.askForCorrectionContainer);
  }

  RenderAskForCorrectionSection() {
    this.askForCorrectionContainer = Build(
      Flex({
        relative: true,
        direction: "column",
      }),
      [
        [
          Flex({
            marginTop: "s",
          }),
          (this.askForCorrectionTextarea = Textarea({
            tag: "textarea",
            fullWidth: true,
            resizable: "vertical",
            placeholder:
              System.data.locale.userContent.askForCorrection.placeholder,
          })),
        ],
        [
          Flex({
            margin: "s",
            marginTop: "xs",
          }),
          (this.askForCorrectionButton = new Button({
            type: "solid-blue",
            onClick: this.ConfirmReportingForCorrection.bind(this),
            children: System.data.locale.userContent.askForCorrection.ask,
          })),
        ],
      ],
    );
  }

  async ConfirmReportingForCorrection() {
    this.quickActionButtons.DisableButtons();
    this.askForCorrectionContainer.append(this.quickActionButtons.spinner);

    await System.Delay(50);

    if (
      !confirm(System.data.locale.moderationPanel.confirmReportingForCorrection)
    ) {
      this.quickActionButtons.EnableButtons();

      return;
    }

    this.ReportForCorrection();
  }

  async ReportForCorrection() {
    try {
      const resReport = await new Action().ReportForCorrection({
        model_id: this.data.id,
        reason: this.askForCorrectionTextarea.value,
      });

      if (resReport?.success === false) {
        throw resReport.message
          ? { msg: resReport.message }
          : resReport || Error("No response");
      }

      this.ReportedForCorrection();
    } catch (error) {
      console.error(error);
      this.main.modal.Notification({
        type: "error",
        html:
          error.msg ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
      });
    }

    this.quickActionButtons.EnableButtons();
  }

  ReportedForCorrection() {
    this.answerData.wrong_report = {
      reason: this.askForCorrectionTextarea.value,
      reported: new Date().toISOString(),
      user: {
        id: System.data.Brainly.userData.user.id,
      },
    };

    delete this.answerData.edited;
    delete this.answerData.original_content;

    this.HideAskForCorrectionSection();
    this.RenderCorrectionReportDetails();
    this.quickActionButtons.RenderConfirmButton();
    this.contentBox.ShowBorder();
    this.contentBox.ChangeBorderColor("blue-secondary-light");
    this.quickActionButtons.askForCorrectionButton?.Hide();
  }

  ConfirmApproving() {
    if (!this.quickActionButtons.selectedButton) return;

    if (
      !confirm(
        System.data.locale.userContent.notificationMessages.confirmApproving,
      )
    ) {
      this.quickActionButtons.EnableButtons();

      return;
    }

    this.Approve();
  }

  async Approve() {
    try {
      const resApprove = await new Action().ApproveAnswer(this.data.id);

      // TODO remove these lines
      /* console.log(this.data.id);
    const resApprove = { success: true, message: "" };
    await System.TestDelay(); */

      if (resApprove?.success === false) {
        throw resApprove.message
          ? { msg: resApprove.message }
          : resApprove || Error("No response");
      }

      this.Approved();
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

  Approved() {
    this.extraData.verification = {
      approval: {
        approver: {
          id: window.btoa(`user:${System.data.Brainly.userData.user.id}`),
          nick: System.data.Brainly.userData.user.nick,
        },
      },
    };

    this.quickActionButtons.selectedButton.Hide();
    this.Confirmed();
    this.RenderApprovedIcon();
    this.quickActionButtons.RenderUnApproveButton();
  }

  ConfirmUnApproving() {
    if (!this.quickActionButtons.selectedButton) return;

    if (
      !confirm(
        System.data.locale.userContent.notificationMessages.confirmUnapproving,
      )
    ) {
      this.quickActionButtons.EnableButtons();

      return;
    }

    this.UnApprove();
  }

  async UnApprove() {
    try {
      const resUnApprove = await new Action().UnapproveAnswer(this.data.id);

      // TODO remove these lines
      // console.log(this.data.id);
      // const resUnApprove = { success: true, message: "" };
      // await System.TestDelay();

      if (!resUnApprove?.success) {
        throw resUnApprove.message
          ? { msg: resUnApprove.message }
          : resUnApprove || Error("No response");
      }

      this.UnApproved();
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

  UnApproved() {
    this.extraData.verification = null;

    this.quickActionButtons.selectedButton.Hide();
    this.quickActionButtons.RenderApproveButton();
    this.Confirmed();
    HideElement(this.approvedIconContainer);
  }

  Confirmed() {
    super.Confirmed();

    if ("RenderAskForCorrectionButton" in this.quickActionButtons)
      this.quickActionButtons.RenderAskForCorrectionButton();
  }

  Deleted() {
    super.Deleted();

    this.HideAskForCorrectionSection();
  }

  HideReportDetails() {
    super.HideReportDetails();

    delete this.answerData.wrong_report;

    HideElement(this.correctionReportDetailsContainer);
    HideElement(this.reportedForCorrectionFlagIconContainer);
  }

  RenderExtraDetails() {
    this.RenderApprovedIcon();
    this.quickActionButtons.RenderApproveButton();
  }
}
