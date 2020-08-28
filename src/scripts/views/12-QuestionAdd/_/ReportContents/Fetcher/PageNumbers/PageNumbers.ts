import Build from "@root/scripts/helpers/Build";
import HideElement from "@root/scripts/helpers/HideElement";
import InsertAfter from "@root/scripts/helpers/InsertAfter";
import IsVisible from "@root/scripts/helpers/IsVisible";
import ServerReq from "@ServerReq";
import { Flex } from "@style-guide";
import { FlexElementType } from "@style-guide/Flex";
import PerfectScrollbar from "perfect-scrollbar";
import type FetcherClassType from "../Fetcher";
import PageNumber from "./PageNumber";

export default class PageNumbers {
  main: FetcherClassType;

  container: FlexElementType;
  firstPageNumber: PageNumber;
  pageNumbersWrapper: FlexElementType;
  lastPageNumber: PageNumber;
  pScrollBar: PerfectScrollbar;
  lastIds: number[];
  pageNumbers: PageNumber[];
  selectedPageNumber: PageNumber;
  pageNumbersContainer: FlexElementType;

  constructor(main: FetcherClassType) {
    this.main = main;

    this.pageNumbers = [];

    this.Render();
    this.FetchPageNumbers();
  }

  Render() {
    this.firstPageNumber = new PageNumber(this, 1, NaN);
    this.container = Build(
      Flex({
        borderTop: true,
        justifyContent: "center",
        style: {
          width: "100%",
        },
      }),
      [
        this.firstPageNumber.button.element,
        [
          (this.pageNumbersWrapper = Flex({
            style: {
              position: "relative",
            },
          })),
          (this.pageNumbersContainer = Flex({
            fullWidth: true,
          })),
        ],
      ],
    );

    this.firstPageNumber.Highlight();
    this.Show();
  }

  Show() {
    if (IsVisible(this.container)) return;

    InsertAfter(this.container, this.main.main.actionsContainer);
  }

  Hide() {
    HideElement(this.container);
  }

  async FetchPageNumbers() {
    const resPageNumbers = await new ServerReq().GetModerateAllPages();

    if (!resPageNumbers || !resPageNumbers.success || !resPageNumbers.data)
      throw Error("Can't fetch the page numbers from extension server");

    this.lastIds = resPageNumbers.data;

    if (this.lastIds.length === 0) return;

    if (this.lastIds.length > 1) {
      this.RenderLastPageNumber();
    }

    this.RenderPageNumbers();

    this.pScrollBar = new PerfectScrollbar(this.pageNumbersWrapper, {
      suppressScrollY: false,
    });
  }

  RenderLastPageNumber() {
    const lastPageId = this.lastIds.pop();
    this.lastPageNumber = new PageNumber(
      this,
      this.lastIds.length + 2,
      lastPageId,
    );

    this.container.append(this.lastPageNumber.button.element);
  }

  RenderPageNumbers() {
    this.lastIds.forEach((lastId, index) => {
      const pageNumber = new PageNumber(this, index + 2, lastId);

      this.pageNumbers.push(pageNumber);
    });
  }
}
