import type {
  RemoveAnswerReqDataType,
  ReportedContentDataType,
} from "@BrainlyAction";
import { Flex, Icon, LabelDeprecated, Text } from "@style-guide";
import tippy from "tippy.js";
import type ReportedContentsType from "../ReportedContents";
import Content from "./Content";

export type AnswerExtraDataType = {
  id: string;
  rating: number;
  isBest: boolean;
  ratesCount: number;
  thanksCount: number;
  attachments: {
    id: string;
  }[];
};

export default class Answer extends Content {
  extraData: AnswerExtraDataType;
  contentType: "Answer";
  data: ReportedContentDataType & {
    // eslint-disable-next-line camelcase
    model_type_id: 2;
  };

  constructor(main: ReportedContentsType, data: ReportedContentDataType) {
    super({ main, data, contentType: "Answer" });
  }

  RenderExtraDetails() {
    if (!this.extraDetailsContainer || !this.extraData) return;

    this.RenderBestIcon();
    this.RenderAttachmentsIcon();
    this.RenderThanksIcon();
    // this.RenderRatingIcon();
  }

  RenderBestIcon() {
    if (!this.extraData.isBest) return;

    const iconContainer = Flex({
      marginRight: "xs",
      title: System.data.locale.reportedContents.queue.bestAnswer,
      children: new Icon({
        type: "excellent",
        color: "mustard",
        size: 32,
      }),
    });

    tippy(iconContainer, {
      theme: "light",
      allowHTML: true,
      placement: "bottom",
      content: Text({
        size: "small",
        weight: "bold",
        children: System.data.locale.reportedContents.queue.bestAnswer,
      }),
    });

    this.extraDetailsContainer.append(iconContainer);
  }

  RenderAttachmentsIcon() {
    if (!this.extraData.attachments?.length) return;

    const attachmentIconContainer = Flex({
      marginRight: "xs",
      children: LabelDeprecated({
        color: "gray",
        icon: { type: "attachment" },
        children: this.extraData.attachments.length,
      }),
    });

    this.extraDetailsContainer.append(attachmentIconContainer);
  }

  RenderThanksIcon() {
    if (!this.extraData.thanksCount) return;

    const labelContainer = Flex({
      marginRight: "xs",
      children: LabelDeprecated({
        type: "solid",
        color: "peach",
        icon: { type: "heart" },
        children: this.extraData.thanksCount,
      }),
    });

    this.extraDetailsContainer.append(labelContainer);
  }

  RenderRatingIcon() {
    if (!this.extraData.rating) return;

    const rating = (Math.round(this.extraData.rating * 2) / 2).toFixed(1);
    const title = System.data.locale.reportedContents.queue.rating
      .replace("%{rating}", String(this.extraData.rating))
      .replace("%{ratesCount}", String(this.extraData.ratesCount));

    const labelContainer = Flex({
      title,
      children: LabelDeprecated({
        type: "solid",
        color: "mustard",
        icon: { type: "star_half_outlined" },
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

  ExpressDelete(data: RemoveAnswerReqDataType) {
    data.take_points = true;

    return super.ExpressDelete(data, "RemoveAnswer");
  }
}
