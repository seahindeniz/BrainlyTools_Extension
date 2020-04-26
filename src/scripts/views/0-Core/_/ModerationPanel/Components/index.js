import { MenuListItem } from "@/scripts/components/style-guide";
import IsVisible from "@/scripts/helpers/IsVisible";

export default class {
  /**
   * @param {import("..").default} main
   */
  constructor(main) {
    this.main = main;
    /**
     * @type {HTMLLIElement}
     */
    this.li = undefined;
    this.liLink = undefined;
    /**
     * @type {import("@style-guide/helpers/AddChildren").ChildrenParamType}
     */
    this.liLinkContent = undefined;
  }

  RenderListItem() {
    this.li = MenuListItem({
      children: this.liLinkContent,
    });
    this.liLink = this.li.firstElementChild;

    this.li.setAttribute("style", "display: table; width: 100%;");
    this.main.ul.append(this.li);

    this.RenderLiContent();

    // @ts-ignore
    if (this.liContent) this.li.append(this.liContent);
  }

  // eslint-disable-next-line class-methods-use-this
  RenderLiContent() {}

  /**
   * @param {HTMLElement} element
   */
  // eslint-disable-next-line class-methods-use-this
  HideElement(element) {
    if (!element || !IsVisible(element)) return;

    element.parentElement.removeChild(element);
  }
}
