import WaitForElement from "@root/scripts/helpers/WaitForElement";
import ServerReq from "@ServerReq";
import moment from "moment";
import notification from "../../../../components/notification2";
import GroupChatbox from "./GroupChatbox";
import groupLi from "./groupLi";
import RenderGroupModal from "./groupModal";

const groupsLocale = System.data.locale.messages.groups;

class GroupMessaging {
  selectors: {
    conversationsList: string;
    groupLiNotPinnedFirst: string;
    chatbox: string;
    chatboxContent: string;
    tipText: string;
  };

  $conversationsHeader: HTMLElement;
  groupChatbox: GroupChatbox;
  $conversationsList: JQuery<HTMLElement>;

  constructor() {
    this.selectors = {
      conversationsList: "ul.js-conversations",
      groupLiNotPinnedFirst: "ul.js-conversations > li:not(.pinned):first",
      chatbox: "section.brn-chatbox",
      chatboxContent: "section.brn-chatbox > .sg-content-box",
      tipText: ".brn-messages__conversations .brn-messages__tip",
    };
    window.selectors = {
      ...window.selectors,
      ...this.selectors,
    };

    this.RenderGroupsLink();
  }

  async RenderGroupsLink() {
    this.$conversationsHeader = await WaitForElement(
      selectors.conversationsHeader,
    );
    const $groupMessageLink = $(
      `<h2 class="sg-text sg-text--bold sg-text--link">${groupsLocale.title}</h2>`,
    );
    const $topMessagesHeaderText = $("h2", this.$conversationsHeader);

    $groupMessageLink.appendTo(this.$conversationsHeader);

    $groupMessageLink.on("click", () => {
      this.RefreshTimeElements(true);
      this.RenderCreateAGroupLink();
      this.RenderConversationsList();
      this.RenderChatbox();

      $topMessagesHeaderText.remove();
      $groupMessageLink.off("click");
      $groupMessageLink.removeClass("sg-text--link");
    });
  }

  async RefreshTimeElements(keepRefreshing = false) {
    const $time = $(".js-time");

    $time.each((i, element) => {
      // eslint-disable-next-line dot-notation
      const time = element["dateTime"];

      if (time && time !== "") {
        const timeInstance = moment(time);
        element.innerText = timeInstance.fromNow();
        element.title = timeInstance.format("LLLL");
      }
    });

    if (keepRefreshing) {
      await System.Delay(1000);
      this.RefreshTimeElements(true);
    }
  }

  RenderCreateAGroupLink() {
    const $createGroupLink = $(
      `<h2 class="sg-text sg-text--bold sg-text--link">${groupsLocale.createGroup}</h2>`,
    );

    $createGroupLink.appendTo(this.$conversationsHeader);

    $createGroupLink.on("click", async () => {
      try {
        const groupData = new RenderGroupModal();
        const $groupLi = groupLi(groupData);

        $groupLi.insertBefore(window.selectors.groupLiNotPinnedFirst);
        this.groupChatbox.InitGroup(groupData, $groupLi);
      } catch (error) {
        if (error) console.error(error);
      }
    });
  }

  async RenderConversationsList() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    this.$conversationsList = $(selectors.conversationsList);

    this.$conversationsList.html("");
    this.$conversationsList.off("scroll");
    this.$conversationsList.attr(
      "data-empty-message",
      groupsLocale.notificationMessages.youHaventCreatedAGroupYet,
    );
    $(`${selectors.chatbox}>*`).remove();
    $(selectors.tipText).html(
      groupsLocale.pinTip.replace(
        "%{pin}",
        ` ${System.constants.config.pinIcon.replace(/\{size\}/g, "16")} `,
      ),
    );

    $(this.$conversationsList).on(
      "click",
      ">li.js-group-conversation",
      function (e) {
        const { groupId } = this.dataset;

        if (groupId) {
          if (e.target.classList.contains("js-pin")) {
            that.PinConversationListItem(groupId, this);
          } else {
            that.GroupMessages(groupId, this);
          }
        }
      },
    );

    this.LoadMessageGroups();
  }

  async LoadMessageGroups() {
    const groups = await new ServerReq().GetMessageGroups();

    if (groups && groups.success && groups.data && groups.data.length > 0) {
      groups.data.reverse();
      groups.data.forEach(this.RenderListItem.bind(this));
      this.RefreshTimeElements();
    }
  }

  RenderListItem(group) {
    const $groupLi = groupLi(group);

    if (group.pinned) {
      $groupLi.prependTo(this.$conversationsList);
    } else {
      $groupLi.appendTo(this.$conversationsList);
    }
  }

  async GroupMessages(group_id, _groupLi) {
    const resMessages = await new ServerReq().GetMessages(group_id);

    if (!resMessages || !resMessages.success || !resMessages.data) {
      notification({
        html: groupsLocale.notificationMessages.cantFetchGroupData,
        type: "error",
      });

      return;
    }

    this.OpenChatbox(resMessages.data, _groupLi);
  }

  async PinConversationListItem(group_id, element) {
    const isPinned = !element.classList.contains("pinned");

    const resUpdatedGroup = await new ServerReq().UpdateMessageGroup(group_id, {
      pinned: isPinned,
    });

    if (resUpdatedGroup && resUpdatedGroup.success) {
      if (isPinned) {
        $(element).prependTo(this.$conversationsList);
      } else {
        $(element).insertBefore(selectors.groupLiNotPinnedFirst);
      }

      element.classList.toggle("pinned");
    }
  }

  RenderChatbox() {
    this.groupChatbox = new GroupChatbox();
    const $chatboxContainer = $(selectors.chatbox);

    $chatboxContainer
      .html("")
      .removeClass("js-chatbox")
      .append(this.groupChatbox.$)
      .addClass("js-group-chatbox");
  }

  OpenChatbox(data, _groupLi) {
    this.groupChatbox.InitGroup(data, _groupLi);
    this.RefreshTimeElements();
  }
}

export default GroupMessaging;
