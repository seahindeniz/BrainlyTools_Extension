// @flow

import type { ReportedContentDataType } from "@BrainlyAction";
import type ReportedContentsType from "../ReportedContents";
import Content from "./Content";

export default class Comment extends Content {
  constructor(main: ReportedContentsType, data: ReportedContentDataType) {
    super({ main, data, contentType: "Comment" });
  }
}
