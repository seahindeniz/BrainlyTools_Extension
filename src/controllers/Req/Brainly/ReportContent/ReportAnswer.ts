import ReportContent, { ReportContentCommonPropsType } from "./ReportContent";

export default function ReportAnswer(props: ReportContentCommonPropsType) {
  return ReportContent({ contentType: "Answer", ...props });
}
