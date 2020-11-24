import { CommonResponseDataType } from "@BrainlyAction";

export default async function ActionHistoryRemoveAttachment(
  filename: string,
): Promise<CommonResponseDataType> {
  if (!filename)
    return {
      success: false,
      message: "Invalid file name",
    };

  return this.FrontGate()
    .Axios()
    .P("actionsHistory")
    .P("attachment")
    .P(filename)
    .DELETE();
}
