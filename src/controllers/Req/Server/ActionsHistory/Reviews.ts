import type { CommonGenericResponseType } from "@BrainlyAction";
import ServerReq from "@ServerReq";

export type ActionHistoryReviewDataType = {
  id: string;
  // actionTime: string;
  hash: string;
  reviewTime: string;
  reviewer: {
    id: number;
    nick: string;
  };
  valid: boolean;
  message?: string;
};

export default async function ActionHistoryReviews(
  hashList: string[],
): Promise<
  CommonGenericResponseType<{
    data: ActionHistoryReviewDataType[];
  }>
> {
  if (!hashList?.length)
    return {
      success: false,
      message: "",
    };

  return new ServerReq().actionsHistory().reviews().POST({ hashList });
}
