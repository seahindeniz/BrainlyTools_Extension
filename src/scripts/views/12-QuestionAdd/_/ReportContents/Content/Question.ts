import type { ReportedContentDataType } from "@BrainlyAction";
import { RemoveQuestionReqDataType } from "@BrainlyAction";
import HideElement from "@root/helpers/HideElement";
import { Flex, Icon, Label, Text } from "@style-guide";
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

  constructor(main: ReportedContentsType, data: ReportedContentDataType) {
    super({ main, data, contentType: "Question" });
  }

  RenderExtraDetails() {
    if (!this.extraDetailsContainer || !this.extraData) return;

    this.RenderAttachmentsIcon();
    this.RenderApprovedAnswersIcon();
    this.RenderPopularIcon();

    if (!this.extraData.answers.hasVerified) return;

    this.quickDeleteButtons.forEach(quickDeleteButton =>
      HideElement(quickDeleteButton.container),
    );
  }

  RenderAttachmentsIcon() {
    if (!this.extraData.attachments?.length) return;

    const attachmentIconContainer = Flex({
      marginRight: "xs",
      children: new Label({
        color: "gray",
        icon: new Icon({ type: "attachment" }),
        children: this.extraData.attachments.length,
      }),
    });

    this.extraDetailsContainer.append(attachmentIconContainer);
  }

  RenderApprovedAnswersIcon() {
    const approvedAnswers = this.extraData.answers?.nodes.filter(
      answer => answer.verification,
    );

    if (!approvedAnswers?.length) return;

    const approvedAnswersIconContainer = Flex({
      marginRight: "xs",
      children: new Label({
        color: "mint",
        type: "solid",
        icon: new Icon({ type: "verified" }),
        children: approvedAnswers.length,
      }),
    });

    tippy(approvedAnswersIconContainer, {
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

    this.extraDetailsContainer.append(approvedAnswersIconContainer);
  }

  RenderPopularIcon() {
    if (!this.extraData.isPopular) return;

    const iconContainer = Flex({
      marginRight: "xs",
      title: System.data.locale.reportedContents.queue.popularQuestion,
      children: new Icon({
        type: "influence",
        color: "blue",
        size: 32,
      }),
    });

    tippy(iconContainer, {
      allowHTML: true,
      content: Text({
        children: System.data.locale.reportedContents.queue.popularQuestion,
        size: "small",
        weight: "bold",
      }),
      placement: "bottom",
      theme: "light",
    });

    this.extraDetailsContainer.append(iconContainer);
  }

  RenderQuickDeleteButtons() {
    if (this.extraData?.answers.hasVerified) return;

    super.RenderQuickDeleteButtons();
  }

  ExpressDelete(data: RemoveQuestionReqDataType) {
    data.take_points = data.give_warning;
    data.return_points = !data.give_warning;

    return super.ExpressDelete(data, "RemoveQuestion");
  }

  Deleted() {
    super.Deleted();

    this.HideModerateButton();
  }
}
