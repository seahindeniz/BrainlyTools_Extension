import { ContentTypeType } from "@components/ModerationPanel/ContentSection/ContentSection";
import HideElement from "@root/helpers/HideElement";
import { Button, Flex } from "@style-guide";
import { ButtonColorType } from "@style-guide/Button";
import type ContentTypeFilterClassType from "./ContentTypeFilter";

const BUTTON_COLOR: {
  [contentType in ContentTypeType]: ButtonColorType;
} = {
  Question: { type: "solid-blue" },
  Answer: { type: "solid-mint" },
};

export default class ContentTypeOption {
  main: ContentTypeFilterClassType;
  contentType: ContentTypeType;
  container: import("@style-guide/Flex").FlexElementType;
  button: Button;

  constructor(main: ContentTypeFilterClassType, contentType: ContentTypeType) {
    this.main = main;
    this.contentType = contentType;

    this.Render();
  }

  Render() {
    this.container = Flex({
      marginRight: "s",
      children: (this.button = new Button({
        type: "solid-light",
        onClick: this.Selected.bind(this),
        children:
          System.data.locale.reportedContents.filtersPanel.filters.contentType[
            this.contentType
          ],
      })),
    });

    this.main.optionContainer.append(this.container);
  }

  Selected() {
    if (this.main.selectedOption) {
      if (this.main.selectedOption === this) {
        this.Deselected();
        this.main.Changed();

        return;
      }

      this.main.selectedOption.Deselected();
    }

    this.main.selectedOption = this;

    this.button.ChangeType(BUTTON_COLOR[this.contentType]);
    this.main.Changed();
  }

  Deselected() {
    this.main.selectedOption = null;

    this.button.ChangeType({ type: "solid-light" });
  }

  Hide() {
    this.Deselected();
    HideElement(this.main.selectedOption.container);
  }
}
