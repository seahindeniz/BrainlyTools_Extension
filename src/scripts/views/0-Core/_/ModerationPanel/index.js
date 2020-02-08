import { Flex, MenuList } from "@style-guide";
import WaitForObject from "../../../../helpers/WaitForObject";
import MassContentDeleter from "./MassContentDeleter";
import MassManageUsers from "./MassManageUsers";
import MassMessageSender from "./MassMessageSender";
import MassModerateContents from "./MassModerateContents";
import MassModerateReportedContents from "./MassModerateReportedContents";
import NoticeBoard from "./NoticeBoard";
import PointChanger from "./PointChanger";
import ReportedCommentsDeleter from "./ReportedCommentsDeleter";
import SearchUser from "./SearchUser";

/**
 * @typedef {typeof SearchUser |
 * typeof NoticeBoard |
 * typeof MassMessageSender |
 * typeof PointChanger |
 * typeof MassModerateContents |
 * typeof MassModerateReportedContents |
 * typeof MassManageUsers |
 * typeof ReportedCommentsDeleter |
 * typeof MassContentDeleter
 * } ComponentsType
 */

const SELECTOR = {
  STATISTICS: "#moderate-functions-panel > div.statistics",
  NEW_PANEL: ".brn-moderation-panel__list",
  NEW_PANEL_BUTTON: ".brn-moderation-panel__button",
  OLD_PANEL: "#moderate-functions-panel > div.panel > div.content-scroll",
  OLD_PANEL_COVERING_TEXT: `
  #moderate-functions-panel > div.panel > div.covering-text`,
  PANELS: ".brn-moderation-panel__list, #moderate-functions",
}

class ModerationPanel {
  constructor() {
    this.$statistics = $(SELECTOR.STATISTICS);
    this.$newPanel = $(SELECTOR.NEW_PANEL);
    this.$newPanelButton = $(SELECTOR.NEW_PANEL_BUTTON);
    this.$oldPanel = $(SELECTOR.OLD_PANEL);
    this.$oldPanelCoveringText = $(SELECTOR.OLD_PANEL_COVERING_TEXT);
    this.components = {
      immediately: [{
          constructor: SearchUser,
        },
        {
          constructor: NoticeBoard,
          condition: (
            System.checkUserP(20) ||
            System.data.Brainly.userData.extension.noticeBoard !== null
          )
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
        }
      ],
      afterDeleteReasons: [{
          constructor: ReportedCommentsDeleter,
          condition: 17,
        },
        {
          constructor: MassContentDeleter,
          condition: 7,
        },
        {
          constructor: MassModerateContents,
          condition: 29,
        },
        {
          constructor: MassModerateReportedContents,
          condition: 18,
        },
      ]
    };

    this.RenderList();
    this.InitComponents();
    this.InitComponentsAfterDeleteReasonsLoaded();
    this.RenderResizeTrackingElement();
    this.BindHandlers();
  }
  RenderList() {
    this.listContainer = Flex({
      marginBottom: "s",
      children: (
        this.ul = MenuList({
          size: "small",
        })
      )
    });

    let panel = document.querySelector(SELECTOR.PANELS);

    if (panel)
      panel.prepend(this.listContainer);
  }
  /**
   * @param {"immediately" | "afterDeleteReasons"} [groupName]
   */
  InitComponents(groupName = "immediately") {
    this.components[groupName].forEach(
      /**
       * @param {{
       *  constructor: ComponentsType,
       *  condition?: number | number [] | boolean
       * }} componentLayer
       */
      componentLayer => {
        if (
          !("condition" in componentLayer) ||
          (
            componentLayer.condition === true ||
            (
              (
                typeof componentLayer.condition == "number" ||
                componentLayer.condition instanceof Array
              ) &&
              System.checkUserP(componentLayer.condition)
            )
          )
        ) {
          new componentLayer.constructor(this);
        }
      });
  }
  async InitComponentsAfterDeleteReasonsLoaded() {
    await WaitForObject(
      "System.data.Brainly.deleteReasons.__withTitles.comment", {
        noError: true
      }
    );
    this.InitComponents("afterDeleteReasons");
  }
  RenderResizeTrackingElement() {
    this.$resizeOverlay = $(`
		<div class="resizeOverlay">
			<style></style>
		</div>`);

    this.$resizeStyle = $("style", this.$resizeOverlay);
    this.$resizeOverlay.appendTo(document.body);
  }
  BindHandlers() {
    this.$newPanelButton.click(this.DelayedHeightFix.bind(this));
    this.$oldPanelCoveringText.click(this.DelayedHeightFix.bind(this));
    window.addEventListener("load", this.FixPanelsHeight.bind(this));
    window.addEventListener('scroll', this.FixPanelsHeight.bind(this))

    if ("ResizeObserver" in window) {
      new ResizeObserver(this.FixPanelsHeight.bind(this))
        .observe(this.$resizeOverlay[0])
    } else {
      window.addEventListener('resize', this.FixPanelsHeight.bind(this))
    }
  }
  async DelayedHeightFix() {
    await System.Delay(15);
    this.FixPanelsHeight();
  }
  FixPanelsHeight() {
    this.FixNewPanelsHeight();
    this.FixOldPanelsHeight();
  }
  FixNewPanelsHeight() {
    if (this.$newPanel.length > 0) {
      let height = window.innerHeight - 226;

      if (this.$newPanel[0].scrollHeight < height)
        height = this.$newPanel[0].scrollHeight;

      this.$newPanel.css("cssText", `height: ${height}px`);
    }
  }
  FixOldPanelsHeight() {
    if (this.$oldPanel.length > 0) {
      let height = window.innerHeight - 115;

      if (this.$statistics.is(":visible"))
        height -= 160;

      if (this.$oldPanel[0].scrollHeight < height)
        height = this.$oldPanel[0].scrollHeight;

      this.$resizeStyle.html(`
#html .mint .panel .covering-text,
#html .mint .panel .content-scroll {
	height: ${height}px !important;
}`);
    }
  }
}

export default ModerationPanel
