import { MenuListItem } from "@style-guide";
import HideElement from "@root/helpers/HideElement";
import type { ChildrenParamType } from "@style-guide/helpers/AddChildren";
import type ModerationPanelClassType from "..";

export default class {
  main: ModerationPanelClassType;
  li: HTMLLIElement;
  liLink: HTMLElement;
  liLinkHref: string;
  liLinkContent: ChildrenParamType;
  liContent: HTMLElement;

  HideElement: typeof HideElement;

  constructor(main: ModerationPanelClassType) {
    this.main = main;
    this.HideElement = HideElement;
  }

  RenderListItem() {
    this.li = MenuListItem({
      href: this.liLinkHref,
      children: this.liLinkContent,
    });
    this.liLink = this.li.firstElementChild as HTMLElement;

    this.li.setAttribute("style", "display: table; width: 100%;");
    this.main.ul.append(this.li);

    this.RenderLiContent();

    // @ts-ignore
    if (this.liContent) this.li.append(this.liContent);
  }

  // eslint-disable-next-line class-methods-use-this
  RenderLiContent() {
    //
  }
}
