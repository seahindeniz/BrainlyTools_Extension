import CreateElement from "@components/CreateElement";
import IsVisible from "@root/helpers/IsVisible";
import WaitForElement from "@root/helpers/WaitForElement";
import { Flex, MenuList } from "@style-guide";
import WaitForObject from "../../../../../helpers/WaitForObject";
import MassContentDeleter from "./Components/MassContentDeleter";
import MassManageUsers from "./Components/MassManageUsers";
import MassMessageSender from "./Components/MassMessageSender";
import NoticeBoard from "./Components/NoticeBoard";
import PointChanger from "./Components/PointChanger";
import ReportedCommentsDeleter from "./Components/ReportedCommentsDeleter";
import ReportedContentsLink from "./Components/ReportedContentsLink";
import SearchUser from "./Components/SearchUser";

type ComponentsType = {
  [x in "immediately" | "afterDeleteReasons"]: {
    constructor:
      | typeof SearchUser
      | typeof NoticeBoard
      | typeof MassMessageSender
      | typeof PointChanger
      | typeof MassManageUsers
      | typeof ReportedCommentsDeleter
      | typeof MassContentDeleter
      | typeof ReportedContentsLink;
    condition?: boolean | number | number[];
  }[];
};

function FixNewPanelsHeight() {
  const newPanel: HTMLDivElement = document.querySelector(
    ".brn-moderation-panel__list",
  );

  if (!newPanel) return;

  let height = window.innerHeight - 226;

  if (newPanel.scrollHeight < height) {
    height = newPanel.scrollHeight;
  }

  newPanel.style.cssText = `height: ${height}px`;
}

class ModerationPanel {
  components: ComponentsType;

  panel: HTMLDivElement;
  ul: HTMLUListElement;

  resizeOverlay: HTMLDivElement;
  resizeStyle: HTMLStyleElement;

  constructor() {
    this.components = {
      immediately: [
        {
          constructor: SearchUser,
        },
        {
          constructor: ReportedContentsLink,
          condition: 99,
        },
        {
          constructor: NoticeBoard,
          condition:
            System.checkUserP(20) ||
            System.data.Brainly.userData.extension?.noticeBoard !== undefined,
        },
        {
          constructor: MassMessageSender,
          condition: 9,
        },
        {
          constructor: PointChanger,
          condition: System.checkUserP(13) && System.checkBrainlyP(41),
        },
        {
          constructor: MassManageUsers,
          condition: [27, 30, 31, 32],
        },
      ],
      afterDeleteReasons: [
        {
          constructor: ReportedCommentsDeleter,
          condition: 17,
        },
        {
          constructor: MassContentDeleter,
          condition: 7,
        },
      ],
    };

    this.Init();
  }

  async Init() {
    this.panel = await WaitForElement<"div">(
      ".brn-moderation-panel__list, #moderate-functions",
      { noError: true },
    );

    this.RenderList();
    this.InitComponents();
    this.InitComponentsAfterDeleteReasonsLoaded();
    this.RenderResizeTrackingElement();
    this.BindHandlers();
  }

  RenderList() {
    const listContainer = Flex({
      marginBottom: "s",
      children: (this.ul = MenuList({
        size: "small",
      })),
    });

    this.panel.prepend(listContainer);
  }

  InitComponents(groupName: keyof ComponentsType = "immediately") {
    const group = this.components[groupName];

    if (!group) return;

    group.forEach(componentLayer => {
      if (
        !("condition" in componentLayer) ||
        componentLayer.condition === true ||
        ((typeof componentLayer.condition === "number" ||
          componentLayer.condition instanceof Array) &&
          System.checkUserP(componentLayer.condition))
      ) {
        // eslint-disable-next-line no-new
        new componentLayer.constructor(this);
      }
    });
  }

  async InitComponentsAfterDeleteReasonsLoaded() {
    await WaitForObject(
      "System.data.Brainly.deleteReasons.__withTitles.comment",
      {
        noError: true,
      },
    );
    this.InitComponents("afterDeleteReasons");
  }

  RenderResizeTrackingElement() {
    this.resizeOverlay = CreateElement({
      tag: "div",
      className: "resizeOverlay",
      children: (this.resizeStyle = CreateElement({
        tag: "style",
      })),
    });

    document.body.append(this.resizeOverlay);
  }

  BindHandlers() {
    const newPanelButton = document.querySelector(
      ".brn-moderation-panel__button",
    );
    const oldPanelCoveringText = document.querySelector(
      "#moderate-functions-panel > div.panel > div.covering-text",
    );

    if (newPanelButton)
      newPanelButton.addEventListener(
        "click",
        this.DelayedHeightFix.bind(this),
      );

    if (oldPanelCoveringText)
      oldPanelCoveringText.addEventListener(
        "click",
        this.DelayedHeightFix.bind(this),
      );

    window.addEventListener("load", this.FixPanelsHeight.bind(this));
    window.addEventListener("scroll", this.FixPanelsHeight.bind(this));

    if (window.ResizeObserver) {
      new ResizeObserver(this.FixPanelsHeight.bind(this)).observe(
        this.resizeOverlay,
      );
    } else {
      window.addEventListener("resize", this.FixPanelsHeight.bind(this));
    }
  }

  async DelayedHeightFix() {
    await System.Delay(15);
    this.FixPanelsHeight();
  }

  FixPanelsHeight() {
    FixNewPanelsHeight();
    this.FixOldPanelsHeight();
  }

  FixOldPanelsHeight() {
    const oldPanel = document.querySelector(
      "#moderate-functions-panel > div.panel > div.content-scroll",
    );

    if (!oldPanel) return;

    let height = window.innerHeight - 115;

    const statistics = document.querySelector(
      "#moderate-functions-panel > div.statistics",
    );

    if (IsVisible(statistics)) {
      height -= 160;
    }

    if (oldPanel.scrollHeight < height) {
      height = oldPanel.scrollHeight;
    }

    this.resizeStyle.innerHTML = `
#html .mint .panel .covering-text,
#html .mint .panel .content-scroll {
	height: ${height}px !important;
}`;
  }
}

export default ModerationPanel;
