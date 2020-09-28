import ServerReq from "@ServerReq";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import InsertAfter from "@root/helpers/InsertAfter";
import IsVisible from "@root/helpers/IsVisible";
import { Flex, Input, Text } from "@style-guide";
import { FlexElementType } from "@style-guide/Flex";
import PerfectScrollbar from "perfect-scrollbar";
import tippy from "tippy.js";
import type FetcherClassType from "../Fetcher";
import PageNumber from "./PageNumber";

const PAGE_NUMBER_THRESHOLD = 200;

export default class PageNumbers {
  main: FetcherClassType;

  container: FlexElementType;
  firstPageNumber: PageNumber;
  pageNumbersWrapper: FlexElementType;
  pScrollBar: PerfectScrollbar;
  lastIds: number[];
  pageNumbers: PageNumber[];
  selectedPageNumber: PageNumber;
  pageNumbersContainer: FlexElementType;
  pageNumberInput: Input;

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
        [Flex(), this.firstPageNumber.button.element],
        [
          (this.pageNumbersWrapper = Flex({
            style: {
              overflow: "hidden",
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
      if (this.lastIds.length < PAGE_NUMBER_THRESHOLD) {
        this.RenderLastPageNumber();
      } else {
        this.RenderPageNumberInput();
      }
    }

    this.pScrollBar = new PerfectScrollbar(this.pageNumbersWrapper, {
      suppressScrollY: false,
    });

    this.RenderPageNumbers();

    this.Show();
  }

  RenderLastPageNumber() {
    const lastPageId = this.lastIds.pop();
    const lastPageNumber = new PageNumber(
      this,
      this.lastIds.length + 2,
      lastPageId,
    );

    const lastPageContainer = Flex({
      children: lastPageNumber.button.element,
    });

    this.container.append(lastPageContainer);
  }

  RenderPageNumberInput() {
    const title = System.data.locale.reportedContents.options.filter.pageNumberInputTitle
      .replace("%{MIN_N}", "1")
      .replace("%{MAX_N}", String(this.lastIds.length + 2));

    this.pageNumberInput = new Input({
      title,
      type: "number",
      min: 1,
      max: this.lastIds.length + 2,
      placeholder: "...",
      onChange: this.PageNumberChanged.bind(this),
      onInput: this.CheckNumberIsInRange.bind(this),
    });

    // this.pageNumberInput.input.addEventListener("key")

    tippy(this.pageNumberInput.input, {
      theme: "light",
      content: Text({
        weight: "bold",
        children: title,
      }),
    });

    const lastPageContainer = Flex({
      alignItems: "center",
      marginBottom: "xs",
      children: this.pageNumberInput.element,
    });

    this.container.append(lastPageContainer);
  }

  CheckNumberIsInRange(event: KeyboardEvent) {
    const value = this.pageNumberInput.input.value.trim();
    const givenPageNumber = Number(value);

    if (
      value === "" ||
      (givenPageNumber > 0 && givenPageNumber <= this.lastIds.length + 2)
    )
      return;

    this.pageNumberInput.input.value = String(
      givenPageNumber < 1 ? 1 : this.lastIds.length + 2,
    );

    event.preventDefault();
  }

  PageNumberChanged() {
    const givenPageNumber = Number(this.pageNumberInput.input.value);

    if (Number.isNaN(givenPageNumber)) return;

    this.main.FetchReports({
      resetStore: true,
      lastId: this.lastIds[givenPageNumber - 2],
    });
  }

  RenderPageNumbers() {
    // interval loop used here to avoid having event blocked rendering
    let index = 0;
    const loop = setInterval(() => {
      const lastId = this.lastIds[index];

      if (!lastId || index > PAGE_NUMBER_THRESHOLD - 2) {
        clearInterval(loop);

        return;
      }

      this.pScrollBar.update();

      const pageNumber = new PageNumber(this, index + 2, lastId);

      this.pageNumbers.push(pageNumber);

      index++;
    }, 0);
  }
}
