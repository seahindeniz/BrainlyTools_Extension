import type { CommonGenericResponseType } from "@BrainlyAction";
import ServerReq from "@ServerReq";

/* type ActionHistoryReviewPropsType = {
  hash: string;
  actionTime: string;
}; */

export type ActionHistoryNewReviewResponseType = {
  hash: string;
  id: string;
};

export default async function ActionHistoryNewReview(
  moderatorId: number,
  valid: boolean,
  hash: string | string[],
): Promise<
  CommonGenericResponseType<{
    data: ActionHistoryNewReviewResponseType[];
  }>
> {
  let hashList = hash as string[];

  if (!(hash instanceof Array)) {
    hashList = [hash];
  }

  if (hashList.length < 0) {
    return { success: false };
  }

  return new ServerReq()
    .actionsHistory()
    .review()
    .P(moderatorId)
    .P(String(valid))
    .POST(hashList);
}
