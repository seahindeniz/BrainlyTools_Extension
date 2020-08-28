import { DeleteReasonContentTypeNameType } from "@root/scripts/controllers/System";
import type DeleteSectionClassType from "../DeleteSection";
import RadioSection from "./RadioSection";

export default class ContentTypeSection extends RadioSection {
  constructor(main: DeleteSectionClassType) {
    super(
      main,
      [
        {
          text: "Question",
          value: "Question",
        },
        {
          text: "Answer",
          value: "Answer",
        },
        {
          text: "Comment",
          value: "Comment",
        },
      ],
      main.defaults.contentType,
    );
  }

  get contentType() {
    return this.value.toLowerCase() as DeleteReasonContentTypeNameType;
  }

  async Selected() {
    // wait for main to set the contentTypeSection property
    await System.Delay(50);

    this.main.listeners?.onContentTypeChange?.();
    this.main.RenderReasonSection();
    this.main.RenderOptionsSection();
  }

  Deselected() {
    this.main.listeners?.onContentTypeChange?.();
    this.main.reasonSection?.Deselected();
    this.main.HideReasonSection();
  }
}
