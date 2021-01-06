import Brainly, { CommonResponseDataType } from "@BrainlyReq/Brainly";

export default async function ConfirmContent(
  contentId: number,
  contentType: "Question" | "Answer" | "Comment",
): Promise<CommonResponseDataType> {
  if (!contentId) throw Error(`Invalid content id: ${contentId}`);

  return new Brainly()
    .Legacy()
    .moderation_new()
    .accept()
    .POST({
      model_id: contentId,
      model_type_id:
        contentType === "Question" ? 1 : contentType === "Answer" ? 2 : 45,
    });
}
