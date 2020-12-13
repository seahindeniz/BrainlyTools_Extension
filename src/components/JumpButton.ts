import HideElement from "@root/helpers/HideElement";
import IsVisible from "@root/helpers/IsVisible";
import { Button, Flex, Icon } from "@style-guide";
import { IconTypeType } from "@style-guide/Icon";
import easyScroll from "easy-scroll";

function StartScrolling() {
  let direction = "top";
  const numberOfMiddleOfOverlay =
    (document.documentElement.scrollHeight -
      document.documentElement.clientHeight) /
    2;
  const numberOfCurrentPosition = document.documentElement.scrollTop;

  if (numberOfCurrentPosition < numberOfMiddleOfOverlay) {
    direction = "bottom";
  }

  easyScroll({
    scrollableDomEle: document.documentElement,
    direction,
    duration: 300,
    easingPreset: "easeInQuad",
  });
}

export default class JumpButton {
  #jumpButtonContainer: import("@style-guide/Flex").FlexElementType;
  #jumpButtonIcon: Icon;

  constructor() {
    this.ToggleVisibilityOfJumpButton();
    window.addEventListener(
      "scroll",
      this.ToggleVisibilityOfJumpButton.bind(this),
    );
  }

  Render() {
    this.#jumpButtonContainer = Flex({
      relative: true,
      className: "ext-jump-button",
      children: new Button({
        type: "outline",
        iconOnly: true,
        onClick: StartScrolling.bind(this),
        icon: (this.#jumpButtonIcon = new Icon({
          type: "arrow_down",
          color: "adaptive",
        })),
      }),
    });
  }

  TryToChangeJumpButtonIconType() {
    const numberOfMiddleOfOverlay =
      (document.documentElement.scrollHeight -
        document.documentElement.clientHeight) /
      2;
    const numberOfCurrentPosition = document.documentElement.scrollTop;

    let jumpButtonIconType: IconTypeType = "arrow_up";

    if (numberOfCurrentPosition < numberOfMiddleOfOverlay) {
      jumpButtonIconType = "arrow_down";
    }

    if (this.#jumpButtonIcon.type === jumpButtonIconType) return;

    this.#jumpButtonIcon.ChangeType(jumpButtonIconType);
  }

  ToggleVisibilityOfJumpButton() {
    if (
      document.documentElement.scrollHeight <=
      document.documentElement.clientHeight
    ) {
      HideElement(this.#jumpButtonContainer);

      return;
    }

    if (!this.#jumpButtonContainer) {
      this.Render();
    }

    this.TryToChangeJumpButtonIconType();

    if (!IsVisible(this.#jumpButtonContainer)) {
      document.body.append(this.#jumpButtonContainer);
    }
  }
}
