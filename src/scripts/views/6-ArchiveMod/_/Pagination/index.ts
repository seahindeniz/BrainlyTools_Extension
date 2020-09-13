import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import InsertAfter from "@root/helpers/InsertAfter";
import ServerReq, { ModerateAllPageNumbersType } from "@ServerReq";
import { Flex, Spinner } from "@style-guide";
import PerfectScrollbar from "perfect-scrollbar";
import type ArchiveModClassType from "../..";
import Page from "./Page";

const PAGE_NUMBER_RENDER_LIMIT = 500;

export default class Pagination {
  main: ArchiveModClassType;
  promisePageNumbers: Promise<ModerateAllPageNumbersType>;
  loaderBar: Element;
  container: HTMLElement;
  firstPageContainer: HTMLElement;
  lastPageContainer: HTMLElement;
  pageNumberContainer: HTMLElement;
  content: HTMLElement;
  spinner: HTMLElement;
  pageNumbers: number[];
  lastPageNumber: number;
  pages: Page[];
  selectedPageNumber: Page;
  pScrollBar: PerfectScrollbar;

  constructor(main: ArchiveModClassType) {
    this.main = main;
    this.pages = [];
    this.selectedPageNumber = undefined;

    this.GetPageNumbers();
    this.FindLoaderBar();
    this.Render();
    this.RenderSpinner();
    this.BindListener();
  }

  GetPageNumbers() {
    this.promisePageNumbers = new ServerReq().GetModerateAllPages();
  }

  FindLoaderBar() {
    this.loaderBar = document.querySelector(".content > .loader");
  }

  Render() {
    if (!this.loaderBar) return;

    this.container = Build(Flex(), [
      (this.firstPageContainer = Flex({ alignItems: "center" })),
      [
        (this.pageNumberContainer = Flex({
          style: {
            position: "relative",
            // width: "990px",
          },
        })),
        (this.content = Flex({
          fullWidth: true,
          marginTop: "xs",
          marginBottom: "s",
        })),
      ],
      (this.lastPageContainer = Flex({ alignItems: "center" })),
    ]);

    this.pScrollBar = new PerfectScrollbar(this.pageNumberContainer, {
      suppressScrollY: false,
    });

    this.Show();
    this.TryToRenderPageNumbers();
  }

  async TryToRenderPageNumbers() {
    const resPageNumbers = await this.promisePageNumbers;

    if (!resPageNumbers || !resPageNumbers.success || !resPageNumbers.data)
      throw Error("Can't fetch the page numbers from extension server");

    if (!window.$Z) throw Error("Can't find the Zadanium framework");

    const pageNumbers = resPageNumbers.data;
    this.pageNumbers = pageNumbers;
    this.lastPageNumber = pageNumbers.pop();

    this.RenderFirstPage();

    if (!this.lastPageNumber) return;

    this.RenderLastPage();
    this.RenderPageNumbers();
  }

  RenderFirstPage() {
    const firstPage = new Page(this, NaN, 1);

    firstPage.container.ChangeMargin({
      marginBottom: "xs",
    });

    firstPage.Highlight();
    this.pages.unshift(firstPage);
    this.firstPageContainer.append(firstPage.container);
  }

  RenderLastPage() {
    const lastPage = new Page(
      this,
      this.lastPageNumber,
      this.pageNumbers.length + 2,
    );

    lastPage.container.ChangeMargin({
      marginBottom: "xs",
    });

    this.pages.push(lastPage);
    this.lastPageContainer.append(lastPage.container);
  }

  async RenderPageNumbers() {
    if (this.pageNumbers.length === 0) return;

    let index = this.content.childElementCount + 1;

    this.pageNumbers.slice(0, PAGE_NUMBER_RENDER_LIMIT).forEach(pageNumber => {
      const page = new Page(this, pageNumber, ++index);

      page.Show();
    });

    this.pageNumbers.splice(0, PAGE_NUMBER_RENDER_LIMIT);

    this.UpdateHeights();
  }

  UpdateHeights() {
    this.pScrollBar.update();

    const { height } = this.pageNumberContainer.style;
    this.firstPageContainer.style.height = height;
    this.lastPageContainer.style.height = height;
  }

  RenderSpinner() {
    this.spinner = Spinner({
      overlay: true,
    });
  }

  BindListener() {
    this.pageNumberContainer.addEventListener(
      "ps-x-reach-end",
      this.RenderPageNumbers.bind(this),
    );
  }

  ShowSpinner() {
    this.container.append(this.spinner);
  }

  HideSpinner() {
    HideElement(this.spinner);
  }

  Show() {
    InsertAfter(this.container, this.loaderBar);
  }

  Hide() {
    HideElement(this.container);
  }
}
