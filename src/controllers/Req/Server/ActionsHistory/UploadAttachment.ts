import { CommonGenericResponseType } from "@BrainlyAction";

export type ActionHistoryAttachmentDataType = {
  name: string;
  shortCode: string;
};

export default function ActionHistoryUploadAttachment(
  file: File | Blob,
  name: string,
): Promise<
  CommonGenericResponseType<{
    data: ActionHistoryAttachmentDataType;
  }>
> {
  const formData = new FormData();

  formData.append("file", file, name);

  return this.FrontGate()
    .Axios()
    .P("actionsHistory")
    .P("attachment")
    .POST(formData);
}
