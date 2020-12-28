import ReportContent, { ReportContentCommonPropsType } from "./ReportContent";

export default function ReportQuestion(props: ReportContentCommonPropsType) {
  return ReportContent({ contentType: "Question", ...props });
}
