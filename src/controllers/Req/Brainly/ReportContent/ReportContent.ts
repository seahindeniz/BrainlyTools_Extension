import Action from "@BrainlyAction";
import type { CommonResponseDataType } from "@BrainlyReq/Brainly";
import type { ContentNameType } from "@components/ModerationPanel/ModeratePanelController";

export type ReportContentCommonPropsType = {
  id: number;
  reason?: string;
  categoryId?: number;
  subCategoryId?: number;
};

type PropsType = {
  contentType: ContentNameType;
} & ReportContentCommonPropsType;

export default async function ReportContent({
  contentType,
  id,
  reason,
  categoryId,
  subCategoryId,
}: PropsType): Promise<CommonResponseDataType> {
  const modelTypeId =
    contentType === "Question"
      ? 1
      : contentType === "Answer"
      ? 2
      : contentType === "Comment"
      ? 45
      : undefined;

  if (!modelTypeId) {
    throw new Error("Invalid content type");
  }

  if (categoryId === undefined)
    // eslint-disable-next-line no-param-reassign
    [categoryId] = System.data.config.marketConfig.default.abuseReportReason[
      contentType
    ];

  if (subCategoryId === undefined)
    [
      ,
      // eslint-disable-next-line no-param-reassign
      subCategoryId,
    ] = System.data.config.marketConfig.default.abuseReportReason[contentType];

  const data = {
    abuse: {
      category_id: categoryId,
      subcategory_id: subCategoryId,
      data: (reason || "") + System.constants.config.reasonSign,
    },
    model_id: id,
    model_type_id: modelTypeId,
  };

  return new Action().Legacy().api_moderation().abuse_report().POST(data);
}
