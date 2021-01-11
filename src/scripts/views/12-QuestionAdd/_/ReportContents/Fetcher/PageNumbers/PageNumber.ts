import { Button } from "@style-guide";
import type PageNumbersClassType from "./PageNumbers";

export default class PageNumber {
  main: PageNumbersClassType;
  // element: import("@style-guide/Flex").FlexElementType;
  button: Button;
  pageNumber: number;
  lastId: number;

  constructor(main: PageNumbersClassType, pageNumber: number, lastId: number) {
    this.main = main;
    this.pageNumber = pageNumber;
    this.lastId = lastId;

    this.Render();
  }

  Render() {
    /* this.element = Flex({
      marginLeft: "xxs",
      marginRight: "xxs",
      marginTop: "xs",
      marginBottom: "s",
      children: ,
    }); */
    this.button = new Button({
      text: this.pageNumber,
      type: "solid-inverted",
      className: "ext-page-number",
      onClick: this.Select.bind(this),
      // title: this.lastId, // TODO remove this
    });

    this.main.pageNumbersContainer?.append(this.button.element);
  }

  Select() {
    if (!this.main.main.IsSafeToFetchReports()) return;

    this.Highlight();

    this.main.main.FetchReports({
      resetStore: true,
      lastId: Number.isNaN(this.lastId) ? undefined : this.lastId,
    });
  }

  Unselect() {
    this.button.ChangeType({ type: "outline" }).Enable();
  }

  Highlight() {
    if (this.main.selectedPageNumber) {
      this.main.selectedPageNumber.Unselect();

      this.main.selectedPageNumber = null;
    }

    this.main.selectedPageNumber = this;

    this.button.ChangeType({ type: "solid-mint" }).Disable();
  }
}
