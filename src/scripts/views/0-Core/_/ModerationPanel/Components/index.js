import { MenuListItem } from "@/scripts/components/style-guide";

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
    this.liContent = undefined;
  }
  RenderListItem() {
    this.li = MenuListItem({
      children: this.liLinkContent,
    });
    this.liLink = this.li.firstElementChild;

    this.li.setAttribute("style", "display: table; width: 100%;");
    this.main.ul.append(this.li);

    this.RenderLiContent();

    if (this.liContent)
      this.li.append(this.liContent);
  }
  RenderLiContent() {}
}
