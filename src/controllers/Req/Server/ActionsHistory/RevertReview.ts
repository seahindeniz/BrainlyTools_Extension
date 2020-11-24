import { CommonResponseDataType } from "@BrainlyAction";
import ServerReq from "@ServerReq";

export type ActionHistoryReviewProps = {
  hash?: string | string[];
  id?: string | string[];
};

export default async function ActionHistoryRevertReview({
  hash,
  id,
}: ActionHistoryReviewProps): Promise<CommonResponseDataType> {
  const data: { [x in "hash" | "id"]?: string[] } = {};

  if (hash) {
    data.hash = hash as string[];

    if (!(hash instanceof Array)) {
      data.hash = [hash];
    }

    data.hash = data.hash.filter(Boolean);

    if (data.hash.length < 0) {
      return { success: false };
    }
  }

  if (id) {
    data.id = id as string[];

    if (!(id instanceof Array)) {
      data.id = [id];
    }

    data.id = data.id.filter(Boolean);

    if (data.id.length < 0) {
      return { success: false };
    }
  }

  return new ServerReq().actionsHistory().review().DELETE(data);
}
