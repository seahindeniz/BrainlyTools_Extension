import HideElement from "@root/helpers/HideElement";
import { Flex, Spinner } from "@style-guide";
import BanUserSection from "./Actions/BanUser";
import type UserClassType from "./User";

export default class MoreSection {
  #container: import("@style-guide/Flex").FlexElementType;
  #overlayedSpinner: HTMLDivElement;
  sections: {
    banUser?: BanUserSection;
  };

  constructor(public main: UserClassType) {
    this.sections = {};
  }

  private Render() {
    this.#container = Flex({
      className: "moreSectionContainer",
      marginTop: "m",
      marginBottom: "xs",
      direction: "column",
      spaceBetween: {
        axis: "y",
        size: "xxs",
      },
    });
  }

  get container() {
    console.warn("Get more section container");

    if (!this.#container) {
      this.Render();
    }

    return this.#container;
  }

  async InitActions() {
    await this.main.profilePagePromise;

    this.InitActionsAfterUserProfileFetched();
  }

  InitActionsAfterUserProfileFetched() {
    if (!this.main.banDetails) {
      if (!this.sections.banUser)
        this.sections.banUser = new BanUserSection(this);
    } else {
      delete this.sections.banUser;
    }

    if (Object.keys(this.sections).length === 0) {
      this.main.HideMoreButton();
      this.main.HideMoreSection();

      return;
    }

    this.main.ShowMoreButton();
  }

  Show() {
    this.main.container.element.append(this.#container);
  }

  Hide() {
    HideElement(this.#container);
  }

  get overlayedSpinner() {
    if (!this.#overlayedSpinner) {
      this.RenderOverlayedSpinner();
    }

    return this.#overlayedSpinner;
  }

  RenderOverlayedSpinner() {
    this.#overlayedSpinner = Spinner({
      overlay: true,
    });
  }

  HideSpinner() {
    HideElement(this.#overlayedSpinner);
  }
}
