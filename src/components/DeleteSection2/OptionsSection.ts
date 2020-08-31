import { Flex } from "@style-guide";
import type DeleteSectionClassType from "./DeleteSection";
import OptionChild from "./OptionChild";

export default class OptionsSection {
  main: DeleteSectionClassType;
  container: import("@style-guide/Flex").FlexElementType;

  giveWarning: OptionChild;
  returnPoints?: OptionChild;
  takePoints: OptionChild;

  constructor(main: DeleteSectionClassType) {
    this.main = main;

    this.Render();
    this.RenderGiveWarning();
    this.RenderTakePoints();
    this.RenderReturnPoints();
  }

  Render() {
    this.container = Flex({
      wrap: true,
      marginTop: "xs",
    });
  }

  RenderGiveWarning() {
    this.giveWarning = new OptionChild(this, {
      ...System.data.locale.common.moderating.giveWarning,
    });

    this.container.append(this.giveWarning.container);
  }

  RenderTakePoints() {
    const { contentType } = this.main.contentTypeSection;

    if (contentType === "comment") return;

    this.takePoints = new OptionChild(this, {
      ...System.data.locale.common.moderating.takePoints[contentType],
    });

    this.takePoints.checkbox.checked = true;

    this.container.append(this.takePoints.container);
  }

  RenderReturnPoints() {
    if (this.main.contentTypeSection.contentType !== "question") return;

    this.returnPoints = new OptionChild(this, {
      ...System.data.locale.common.moderating.returnPoints,
    });

    this.container.append(this.returnPoints.container);
  }
}
