import type {
  RemoveQuestionReqDataType,
  ReportedContentDataType,
} from "@BrainlyAction";
import { QuickActionButtonsForQuestion } from "@components";
import { Flex, Icon, Label, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import tippy from "tippy.js";
import type ReportedContentsType from "../ReportedContents";
import Content from "./Content";

type UserType = {
  id: string;
  nick: string;
};

export type QuestionExtraDataType = {
  id: string;
  isPopular: boolean;
  attachments: {
    id: string;
  }[];
  answers: {
    hasVerified: boolean;
    nodes: {
      author?: UserType;
      verification?: {
        approval: {
          approvedTime: string;
          approver?: UserType;
        };
      };
    }[];
  };
};

export default class Question extends Content {
  contentType: "Question";
  data: ReportedContentDataType & {
    // eslint-disable-next-line camelcase
    model_type_id: 1;
  };

  extraData: QuestionExtraDataType;
  private attachmentIconContainer: FlexElementType;
  private approvedAnswersIconContainer: FlexElementType;
  private popularIconContainer: FlexElementType;

  constructor(main: ReportedContentsType, data: ReportedContentDataType) {
    super({ main, data, contentType: "Question" });
  }

  RenderExtraDetails() {
    if (!this.contentWrapper || !this.extraData) return;

    this.RenderAttachmentsIcon();
    this.RenderApprovedAnswersIcon();
    this.RenderPopularIcon();

    if (!this.extraData.answers.hasVerified) return;

    this.quickActionButtons?.RemoveDeleteButtons();
  }

  RenderAttachmentsIcon() {
    if (!this.extraData.attachments?.length || this.attachmentIconContainer)
      return;

    this.attachmentIconContainer = Flex({
      marginRight: "xs",
      children: new Label({
        color: "gray",
        icon: new Icon({ type: "attachment" }),
        children: this.extraData.attachments.length,
      }),
    });

    this.extraDetailsContainer.append(this.attachmentIconContainer);
  }

  RenderApprovedAnswersIcon() {
    if (this.approvedAnswersIconContainer) return;

    const approvedAnswers = this.extraData.answers?.nodes.filter(
      answer => answer.verification,
    );

    if (!approvedAnswers?.length) return;

    this.approvedAnswersIconContainer = Flex({
      marginRight: "xs",
      children: new Label({
        color: "mint",
        type: "solid",
        icon: new Icon({ type: "verified" }),
        children: approvedAnswers.length,
      }),
    });

    tippy(this.approvedAnswersIconContainer, {
      allowHTML: true,
      content: Flex({
        direction: "column",
        children: approvedAnswers.map(answer => {
          if (!answer.verification) return undefined;

          const users = {
            "%{author}": answer.author,
            "%{verifier}": answer.verification.approval.approver,
          };
          const textPieces = System.data.locale.reportedContents.queue.moderatorVerifiedSomeonesAnswer.split(
            /(%\{.*?})/gi,
          );

          return Text({
            size: "small",
            weight: "bold",
            children: textPieces.map(string => {
              const user: UserType = users[string];

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
          });
        }),
      }),
      interactive: true,
      placement: "bottom",
      theme: "light",
    });

    this.extraDetailsContainer.append(this.approvedAnswersIconContainer);
  }

  RenderPopularIcon() {
    if (!this.extraData.isPopular || this.popularIconContainer) return;

    this.popularIconContainer = Flex({
      marginRight: "xs",
      title: System.data.locale.reportedContents.queue.popularQuestion,
      children: new Icon({
        type: "influence",
        color: "blue",
        size: 32,
      }),
    });

    tippy(this.popularIconContainer, {
      allowHTML: true,
      content: Text({
        children: System.data.locale.reportedContents.queue.popularQuestion,
        size: "small",
        weight: "bold",
      }),
      placement: "bottom",
      theme: "light",
    });

    this.extraDetailsContainer.append(this.popularIconContainer);
  }

  RenderQuickActionButtons() {
    this.quickActionButtons = new QuickActionButtonsForQuestion({
      content: {
        databaseId: this.data.model_id,
        hasVerifiedAnswers: this.extraData?.answers.hasVerified,
        reported: true, // !!this.data.report,
        author: {
          nick: this.users.reported.data.nick,
          databaseId: this.users.reported.data.id,
        },
      },
      moreButton: true,
      containerProps: {
        alignItems: "center",
        justifyContent: "flex-end",
        className: "ext-quick-action-buttons",
      },
      onDelete: this.Deleted.bind(this),
      onConfirm: this.Confirmed.bind(this),
    });
  }

  ExpressDelete(data: RemoveQuestionReqDataType) {
    data.take_points = true;
    data.return_points = false;

    return super.ExpressDelete(data, "RemoveQuestion");
  }

  Deleted() {
    super.Deleted();

    this.HideModerateButton();
  }
}
