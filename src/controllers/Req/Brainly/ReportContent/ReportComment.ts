import ReportContent, { ReportContentCommonPropsType } from "./ReportContent";

export default function ReportComment(props: ReportContentCommonPropsType) {
  return ReportContent({ contentType: "Comment", ...props });
}
