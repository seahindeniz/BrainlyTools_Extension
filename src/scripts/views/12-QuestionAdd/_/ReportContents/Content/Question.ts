import { RemoveQuestionReqDataType } from "@root/controllers/Req/Brainly/Action";
import type { ReportedContentDataType } from "@root/controllers/Req/Brainly/Action";
import { Flex, Icon, Label } from "@style-guide";
import type ReportedContentsType from "../ReportedContents";
import Content from "./Content";

export type QuestionExtraDataType = {
  id: string;
  isPopular: boolean;
  attachments: {
    id: string;
  }[];
};

export default class Question extends Content {
  extraData: QuestionExtraDataType;

  constructor(main: ReportedContentsType, data: ReportedContentDataType) {
    super({ main, data, contentType: "Question" });
  }

  RenderExtraDetails() {
    if (!this.extraDetailsContainer || !this.extraData) return;

    this.RenderAttachmentsIcon();
    this.RenderPopularIcon();
  }

  RenderAttachmentsIcon() {
    if (!this.extraData.attachments?.length) return;

    const attachmentIconContainer = Flex({
      marginTop: "xs",
      children: Label({
        color: "gray",
        icon: { type: "attachment" },
        children: this.extraData.attachments.length,
      }),
    });

    this.extraDetailsContainer.append(attachmentIconContainer);
  }

  RenderPopularIcon() {
    if (!this.extraData.isPopular) return;

    const popularIconContainer = Flex({
      title: System.data.locale.reportedContents.queue.popularQuestion,
      children: new Icon({
        type: "friends",
        color: "blue",
      }),
    });

    this.extraDetailsContainer.append(popularIconContainer);
  }

  ExpressDelete(data: RemoveQuestionReqDataType) {
    data.take_points = data.give_warning;
    data.return_points = !data.give_warning;

    return super.ExpressDelete(data, "RemoveQuestion");
  }
}
