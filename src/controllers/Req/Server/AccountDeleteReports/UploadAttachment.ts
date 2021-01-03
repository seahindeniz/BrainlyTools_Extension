import { CommonGenericResponseType } from "@BrainlyAction";
import ServerReq from "@ServerReq";

export type AccountDeleteReportAttachmentDataType = {
  name: string;
};

export type PropsType = {
  name?: string;
  onUploadProgress?: (progressEvent: any) => void;
};

export default function AccountDeleteReportUploadAttachment(
  file: File | Blob,
  props: PropsType = {},
): Promise<
  CommonGenericResponseType<{
    data: AccountDeleteReportAttachmentDataType;
  }>
> {
  const formData = new FormData();

  formData.append("file", file, props.name);

  return new ServerReq()
    .FrontGate()
    .Axios({ onUploadProgress: props.onUploadProgress })
    .P("accountDeleteReports")
    .P("attachment")
    .POST(formData);
}
