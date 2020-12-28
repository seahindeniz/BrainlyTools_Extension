import type {
  RemoveAnswerReqDataType,
  ReportedContentDataType,
} from "@BrainlyAction";
import { Flex, Icon, Label, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import tippy from "tippy.js";
import type ReportedContentsType from "../../ReportedContents";
import Content from "../Content";
import QuestionPreview from "./QuestionPreview";

export type AnswerExtraDataQuestionType = {
  id: string;
  isPopular: boolean;
  content: string;
  points: number;
  created: string;
  author?: {
    id: string;
    nick: string;
    avatar?: {
      thumbnailUrl: string;
    };
    rank: {
      id: string;
    };
    specialRanks: {
      id: string;
    }[];
  };
  attachments: {
    id: string;
    url: string;
    thumbnailUrl: string;
  }[];
  subject: {
    name: string;
  };
  grade: {
    name: string;
  };
  answers: {
    hasVerified: boolean;
  };
};

export type AnswerExtraDataType = {
  id: string;
  rating: number;
  isBest: boolean;
  ratesCount: number;
  thanksCount: number;
  attachments: {
    id: string;
    url: string;
  }[];
  question: AnswerExtraDataQuestionType;
};

export default class Answer extends Content {
  extraData: AnswerExtraDataType;
  contentType: "Answer";
  data: ReportedContentDataType & {
    // eslint-disable-next-line camelcase
    model_type_id: 2;
  };

  private questionPreview?: QuestionPreview;
  private bestIconContainer: FlexElementType;
  private attachmentIconContainer: FlexElementType;
  private thanksLabelContainer: FlexElementType;

  constructor(main: ReportedContentsType, data: ReportedContentDataType) {
    super({ main, data, contentType: "Answer" });
  }

  RenderExtraDetails() {
    if (!this.extraDetailsContainer || !this.extraData) return;

    this.RenderBestIcon();
    this.RenderAttachmentsIcon();
    this.RenderThanksIcon();
    // this.RenderRatingIcon();
    this.InitQuestionPreview();
  }

  RenderBestIcon() {
    if (!this.extraData.isBest || this.bestIconContainer) return;

    this.bestIconContainer = Flex({
      marginRight: "xs",
      title: System.data.locale.reportedContents.queue.bestAnswer,
      children: new Icon({
        type: "excellent",
        color: "mustard",
        size: 32,
      }),
    });

    tippy(this.bestIconContainer, {
      theme: "light",
      allowHTML: true,
      placement: "bottom",
      content: Text({
        size: "small",
        weight: "bold",
        children: System.data.locale.reportedContents.queue.bestAnswer,
      }),
    });

    this.extraDetailsContainer.append(this.bestIconContainer);
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

  RenderThanksIcon() {
    if (!this.extraData.thanksCount || this.thanksLabelContainer) return;

    this.thanksLabelContainer = Flex({
      marginRight: "xs",
      children: new Label({
        type: "solid",
        color: "peach",
        icon: new Icon({ type: "heart" }),
        children: this.extraData.thanksCount,
      }),
    });

    this.extraDetailsContainer.append(this.thanksLabelContainer);
  }

  RenderRatingIcon() {
    if (!this.extraData.rating) return;

    const rating = (Math.round(this.extraData.rating * 2) / 2).toFixed(1);
    const title = System.data.locale.reportedContents.queue.rating
      .replace("%{rating}", String(this.extraData.rating))
      .replace("%{ratesCount}", String(this.extraData.ratesCount));

    const labelContainer = Flex({
      title,
      children: new Label({
        type: "solid",
        color: "mustard",
        icon: new Icon({ type: "star_half_outlined" }),
        text: `${rating}/${this.extraData.ratesCount}`,
      }),
    });

    tippy(labelContainer, {
      theme: "light",
      allowHTML: true,
      placement: "bottom",
      content: Text({
        size: "small",
        weight: "bold",
        children: title,
      }),
    });

    this.extraDetailsContainer.append(labelContainer);
  }

  InitQuestionPreview() {
    if (!this.extraData.question) return;

    if (this.questionPreview) {
      this.questionPreview.separator?.remove();
      this.questionPreview.questionContentTypeButtonContainer?.remove();

      this.questionPreview = null;
    }

    this.questionPreview = new QuestionPreview(this);
  }

  ExpressDelete(data: RemoveAnswerReqDataType) {
    data.take_points = true;

    return super.ExpressDelete(data, "RemoveAnswer");
  }
}
