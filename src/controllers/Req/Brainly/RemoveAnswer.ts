/* eslint-disable camelcase */
import Brainly, { CommonResponseDataType, FAILED_RESPONSE } from "./Brainly";
import ReportAnswer from "./ReportContent/ReportAnswer";

export type RemoveAnswerReqDataType = {
  model_id: number;
  reason: string;
  reason_title?: string;
  reason_id: number;
  model_type_id?: number;
  give_warning?: boolean;
  take_points?: boolean;
  _coupon_?: string;
};

export default async function RemoveAnswer(
  data: RemoveAnswerReqDataType,
  dontReport?: boolean,
): Promise<CommonResponseDataType> {
  // eslint-disable-next-line no-param-reassign
  data = {
    model_type_id: 2,
    give_warning: false,
    take_points: true,
    ...data,
  };
  data.reason += ` ${System.constants.config.reasonSign}`;

  if (
    !dontReport &&
    data.reason_title &&
    System.data.config.marketConfig.default.abuseReportReason
  ) {
    const resReport = await ReportAnswer({
      id: data.model_id,
      reason: data.reason_title,
    });

    if (resReport.success === false && resReport.code !== 10)
      return Promise.resolve(resReport || FAILED_RESPONSE);
  }

  return new Brainly()
    .Legacy()
    .moderation_new()
    .delete_response_content()
    .POST(data);
}
