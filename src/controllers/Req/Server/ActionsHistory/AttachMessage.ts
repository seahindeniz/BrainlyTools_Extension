import { CommonResponseDataType } from "@BrainlyAction";
import ServerReq from "@ServerReq";

export default async function ActionHistoryAttachMessage(
  id: string | string[],
  message: string,
): Promise<CommonResponseDataType> {
  if (!message)
    return {
      success: false,
      message: "Invalid message",
    };

  let idList = id as string[];

  if (!(id instanceof Array)) {
    idList = [id];
  }

  idList = idList.filter(Boolean);

  if (idList.length < 0) {
    return { success: false, message: "Invalid id list" };
  }

  return new ServerReq().actionsHistory().review().PUT({
    idList,
    message,
  });
}
