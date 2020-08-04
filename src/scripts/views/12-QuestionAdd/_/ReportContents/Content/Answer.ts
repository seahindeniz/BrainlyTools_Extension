// @flow

import type { ReportedContentDataType } from "@BrainlyAction";
import { Flex, Icon, Label } from "@style-guide";
import type ReportedContentsType from "../ReportedContents";
import Content from "./Content";

function truncateToDecimals(num: number, decimal: number = 1) {
  const calcDec = 10 ** decimal;
  return Math.trunc(num * calcDec) / calcDec;
}

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

  constructor(main: ReportedContentsType, data: ReportedContentDataType) {
    super({ main, data, contentType: "Answer" });
  }

  RenderExtraDetails() {
    if (!this.extraDetailsContainer || !this.extraData) return;

    this.RenderBestIcon();
    this.RenderAttachmentsIcon();
    this.RenderThanksIcon();
    this.RenderRatingIcon();
  }

  RenderBestIcon() {
    if (!this.extraData.isBest) return;

    const bestIconContainer = Flex({
      marginBottom: "xs",
      children: new Icon({
        type: "excellent",
        color: "mustard",
        size: 32,
      }),
    });

    this.extraDetailsContainer.append(bestIconContainer);
  }

  RenderAttachmentsIcon() {
    if (!this.extraData.attachments?.length) return;

    const attachmentIconContainer = Flex({
      marginBottom: "xs",
      children: Label({
        color: "gray",
        icon: { type: "attachment" },
        children: this.extraData.attachments.length,
      }),
    });

    this.extraDetailsContainer.append(attachmentIconContainer);
  }

  RenderThanksIcon() {
    if (!this.extraData.thanksCount) return;

    const thanksIconContainer = Flex({
      marginBottom: "xs",
      children: Label({
        type: "solid",
        color: "peach",
        icon: { type: "heart" },
        children: this.extraData.thanksCount,
      }),
    });

    this.extraDetailsContainer.append(thanksIconContainer);
  }

  RenderRatingIcon() {
    if (!this.extraData.rating) return;

    const rating = truncateToDecimals(this.extraData.rating);

    const ratingIconContainer = Flex({
      title: System.data.locale.reportedContents.queue.rating
        .replace("%{rating}", String(this.extraData.rating))
        .replace("%{ratesCount}", String(this.extraData.ratesCount)),
      children: Label({
        type: "solid",
        color: "mustard",
        icon: { type: "star_half_outlined" },
        text: System.data.locale.reportedContents.queue.numberOfRates
          .replace("%{rating}", String(rating))
          .replace("%{ratesCount}", String(this.extraData.ratesCount)),
      }),
    });

    this.extraDetailsContainer.append(ratingIconContainer);
  }
}
