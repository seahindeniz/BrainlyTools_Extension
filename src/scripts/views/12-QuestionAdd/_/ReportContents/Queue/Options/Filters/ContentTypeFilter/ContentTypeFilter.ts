import type { ContentTypeType } from "@components/ModerationPanel/ContentSection/ContentSection";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import { Flex, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type FiltersClassType from "../Filters";
import ContentTypeOption from "./ContentTypeOption";

export default class ContentTypeFilter {
  main: FiltersClassType;

  container: FlexElementType;
  optionContainer: FlexElementType;
  options: {
    [contentType in ContentTypeType]: ContentTypeOption;
  };

  selectedOption?: ContentTypeOption;
  contentWrapper: FlexElementType;

  constructor(main: FiltersClassType) {
    this.main = main;

    this.Render();

    this.options = {
      Question: new ContentTypeOption(this, "Question"),
      Answer: new ContentTypeOption(this, "Answer"),
      // Comment: new ContentTypeOption(this, "Comment"),
    };
  }

  Render() {
    this.container = Flex();
    this.contentWrapper = Build(
      Flex({
        marginTop: "s",
      }),
      [
        [
          Flex({
            marginRight: "xs",
            alignItems: "center",
          }),
          Text({
            noWrap: true,
            size: "small",
            weight: "bold",
            text: `${System.data.locale.reportedContents.options.filter.filters.contentType.name}: `,
          }),
        ],
        (this.optionContainer = Flex({
          grow: true,
          wrap: true,
        })),
      ],
    );

    this.main.container.append(this.container);
  }

  Show() {
    this.container.append(this.contentWrapper);
  }

  Hide() {
    HideElement(this.contentWrapper);
  }

  Changed() {
    this.main.main.main.filter.byName.contentType.SetQuery(
      this.selectedOption?.contentType,
    );
  }
}
