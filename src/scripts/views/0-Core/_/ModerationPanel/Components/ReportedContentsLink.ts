import { Text } from "@style-guide";
import Components from ".";

export default class extends Components {
  constructor(main) {
    super(main);

    this.liLinkHref = System.createBrainlyLink(
      "root",
      "/question/add?reported-contents",
    );
    this.liLinkContent = [
      System.data.locale.reportedContents.name,
      Text({
        tag: "span",
        size: "xsmall",
        color: "peach-dark",
        children: ` (${System.data.locale.common.beta})`,
      }),
    ];

    this.RenderListItem();
  }
}
