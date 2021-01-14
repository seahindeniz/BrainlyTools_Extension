import { Button, Icon } from "@style-guide";
import easyScroll from "easy-scroll";

export default class JumpToBottomButton {
  button: Button;
  isFooterVisible: boolean;
  arrowDownIcon: Icon;
  arrowUpIcon: Icon;

  constructor() {
    this.Render();
    this.ObserveFooter();
  }

  Render() {
    this.arrowDownIcon = new Icon({
      type: "arrow_down",
    });
    this.arrowUpIcon = new Icon({
      type: "arrow_up",
    });

    this.button = new Button({
      type: "outline",
      size: "m",
      icon: this.arrowDownIcon,
      iconOnly: true,
      onClick: this.Jump.bind(this),
      style: {
        position: "fixed",
        bottom: "5px",
        left: "5px",
      },
    });

    document.body.append(this.button.element);
  }

  ObserveFooter() {
    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;

        this.isFooterVisible = entry.isIntersecting;

        this.SwitchButtonIcon();
      },
      {
        rootMargin: "0px",
        threshold: 0.1,
      },
    );

    observer.observe(document.querySelector(".brn-footer"));
  }

  SwitchButtonIcon() {
    if (this.isFooterVisible) {
      this.button.ChangeIcon(this.arrowUpIcon);
    } else {
      this.button.ChangeIcon(this.arrowDownIcon);
    }
  }

  Jump() {
    let direction = "top";

    if (!this.isFooterVisible) {
      direction = "bottom";
    }

    easyScroll({
      scrollableDomEle: window,
      direction,
      duration: 500,
      easingPreset: "easeInQuad",
    });
  }
}
