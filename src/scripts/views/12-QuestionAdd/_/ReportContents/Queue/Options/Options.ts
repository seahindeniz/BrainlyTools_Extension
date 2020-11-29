import { Button, Flex, Icon, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import tippy, { Instance, Props } from "tippy.js";
import type QueueClassType from "../Queue";
import ButtonVisibility from "./ButtonVisibility";
import Density from "./Density";
import LazyQueue from "./LazyQueue";
import LoadLimiter from "./LoadLimiter";
import ToggleAutoQueueLoader from "./ToggleAutoQueueLoader";

export default class Options {
  main: QueueClassType;

  optionsButtonContainer: FlexElementType;
  optionsButton: Button;

  container: FlexElementType;
  optionContainer: FlexElementType;

  option: {
    density: Density;
    lazyQueue: LazyQueue;
    toggleAutoQueueLoader: ToggleAutoQueueLoader;
    loadLimiter: LoadLimiter;
    buttonVisibility?: ButtonVisibility;
    // contentFilters: Filters;
  };

  containerTippy: Instance<Props>;

  constructor(main: QueueClassType) {
    this.main = main;

    this.RenderOptionsButton();

    this.option = {
      density: new Density(this),
      lazyQueue: new LazyQueue(this),
      toggleAutoQueueLoader: new ToggleAutoQueueLoader(this),
      loadLimiter: new LoadLimiter(this),
      buttonVisibility:
        System.checkUserP([1, 2, 45]) && new ButtonVisibility(this),
      // contentFilters: new Filters(this),
    };
  }

  RenderOptionsButton() {
    this.optionsButtonContainer = Flex({
      children: this.optionsButton = new Button({
        size: "l",
        iconOnly: true,
        type: "solid-blue",
        icon: new Icon({
          type: "settings",
          color: "adaptive",
        }),
      }),
    });

    this.containerTippy = tippy(this.optionsButton.element, {
      theme: "light",
      trigger: "click",
      maxWidth: "none",
      interactive: true,
      placement: "bottom",
      content: this.optionContainer = Flex({
        marginTop: "xs",
        marginBottom: "xs",
        direction: "column",
      }),
    });

    tippy(this.optionsButton.element, {
      theme: "light",
      maxWidth: "none",
      content: Text({
        size: "small",
        weight: "bold",
        children: System.data.locale.reportedContents.options.name,
      }),
    });

    this.main.main.popupMenuContainer.append(this.optionsButtonContainer);
  }
}
