import type { CommonResponseDataType } from "@BrainlyAction";
import ServerReq from "@ServerReq";

export default async function CloseDiscordPopupMessage(): Promise<CommonResponseDataType> {
  return new ServerReq().user().closeDiscordMessage().DELETE();
}
