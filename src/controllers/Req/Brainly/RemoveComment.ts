/* eslint-disable camelcase */
// import { ReportComment } from "@BrainlyReq";
import Brainly, { FAILED_RESPONSE, CommonResponseDataType } from "./Brainly";
import ReportComment from "./ReportContent/ReportComment";

export type RemoveCommentReqDataType = {
  model_id: number;
  reason: string;
  reason_title?: string;
  reason_id: number;
  model_type_id?: number;
  give_warning?: boolean;
  _coupon_?: string;
};

export default async function RemoveComment(
  data: RemoveCommentReqDataType,
  dontReport?: boolean,
): Promise<CommonResponseDataType> {
  if (!data.model_id || Number.isNaN(data.model_id))
    throw new Error("Invalid comment id");

  // eslint-disable-next-line no-param-reassign
  data = {
    model_type_id: 45,
    give_warning: false,
    ...data,
  };
  data.reason += ` ${System.constants.config.reasonSign}`;

  if (
    !dontReport &&
    data.reason_title &&
    System.data.config.marketConfig.default.abuseReportReason
  ) {
    const resReport = await ReportComment({
      id: data.model_id,
      reason: data.reason_title,
    });

    if (resReport.success === false && resReport.code !== 10)
      return Promise.resolve(resReport || FAILED_RESPONSE);
  }

  return new Brainly()
    .Legacy()
    .moderation_new()
    .delete_comment_content()
    .POST(data);
}
