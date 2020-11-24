import { CommonResponseDataType } from "@BrainlyAction";
import ServerReq from "@ServerReq";

export default async function ActionHistoryRemoveAttachment(
  filename: string,
): Promise<CommonResponseDataType> {
  if (!filename)
    return {
      success: false,
      message: "Invalid file name",
    };

  return new ServerReq()
    .FrontGate()
    .Axios()
    .P("actionsHistory")
    .P("attachment")
    .P(filename)
    .DELETE();
}
