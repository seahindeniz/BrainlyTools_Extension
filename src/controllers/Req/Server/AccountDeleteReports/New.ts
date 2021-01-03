import { CommonResponseDataType } from "@BrainlyReq/Brainly";
import ServerReq from "@ServerReq";

interface UserEntryType {
  id: number;
  nick: string;
  url: string;
}

interface DataType {
  comment?: string;
  filename?: string;
  userEntries: UserEntryType[];
}

export default function NewAccountDeleteReports(
  data: DataType,
): Promise<CommonResponseDataType> {
  return new ServerReq().P("accountDeleteReports").POST(data);
}
