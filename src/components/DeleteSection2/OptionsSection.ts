import { Flex } from "@style-guide";
import tippy from "tippy.js";
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

    tippy(this.giveWarning.container, {
      content: System.data.locale.common.moderating.giveWarning.title,
    });

    this.container.append(this.giveWarning.container);
  }

  RenderTakePoints() {
    const { contentType } = this.main.contentTypeSection;

    if (contentType === "comment") return;

    this.takePoints = new OptionChild(this, {
      ...System.data.locale.common.moderating.takePoints[contentType],
    });

    tippy(this.takePoints.container, {
      content:
        System.data.locale.common.moderating.takePoints[contentType].title,
    });

    this.takePoints.checkbox.checked =
      typeof this.main.defaults.takePoints === "undefined"
        ? true
        : this.main.defaults.takePoints;

    this.container.append(this.takePoints.container);
  }

  RenderReturnPoints() {
    if (this.main.contentTypeSection.contentType !== "question") return;

    this.returnPoints = new OptionChild(this, {
      ...System.data.locale.common.moderating.returnPoints,
    });

    tippy(this.returnPoints.container, {
      content: System.data.locale.common.moderating.returnPoints.title,
    });

    this.container.append(this.returnPoints.container);
  }
}
