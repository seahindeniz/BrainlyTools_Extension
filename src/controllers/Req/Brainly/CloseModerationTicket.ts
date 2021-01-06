import Brainly, { CommonResponseDataType } from "./Brainly";

export default async function CloseModerationTicket(
  questionId: number | string,
): Promise<CommonResponseDataType> {
  if (!questionId) return Promise.resolve({ success: false });

  return new Brainly().Legacy().moderate_tickets().expire().POST({
    model_id: questionId,
    model_type_id: 1,
  });
}
