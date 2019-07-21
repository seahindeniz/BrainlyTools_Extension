import moment from "moment";
import notification from "../../../../components/notification";
import ServerReq from "../../../../controllers/Req/Server";
import WaitForElement from "../../../../helpers/WaitForElement";
import GroupChatbox from "./GroupChatbox";
import groupLi from "./groupLi";
import renderGroupModal from "./groupModal";

const __groups = System.data.locale.messages.groups;

class GroupMessaging {
  constructor() {
    this.selectors = {
      conversationsList: "ul.js-conversations",
      groupLiNotPinnedFirst: "ul.js-conversations > li:not(.pinned):first",
      chatbox: "section.brn-chatbox",
      chatbox_content: "section.brn-chatbox > .sg-content-box",
      tipText: ".brn-messages__conversations .brn-messages__tip"
    };
    window.selectors = {
      ...window.selectors,
      ...this.selectors
    };

    this.RenderGroupsLink();
  }
  async RenderGroupsLink() {
    this.$conversationsHeader = await WaitForElement(selectors.conversationsHeader);
    let $groupMessageLink = $(`<h2 class="sg-text sg-text--bold sg-text--link">${__groups.title}</h2>`);
    let $topMessagesHeaderText = $("h2", this.$conversationsHeader);

    $groupMessageLink.appendTo(this.$conversationsHeader);

    $groupMessageLink.click(() => {
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
    let $time = $(".js-time");

    $time.each((i, element) => {
      let time = element.dateTime;

      if (time && time != "") {
        let _moment = moment(element.dateTime);
        element.innerText = _moment.fromNow();
        element.title = _moment.format('LLLL');
      }
    });

    if (keepRefreshing) {
      await System.Delay(1000);
      this.RefreshTimeElements(true);
    }
  }
  RenderCreateAGroupLink() {
    let $createGroupLink = $(`<h2 class="sg-text sg-text--bold sg-text--link">${__groups.createGroup}</h2>`);

    $createGroupLink.appendTo(this.$conversationsHeader);

    $createGroupLink.click(async () => {
      try {
        let groupData = await new renderGroupModal();
        let $groupLi = groupLi(groupData);

        $groupLi.insertBefore(window.selectors.groupLiNotPinnedFirst);
        this.groupChatbox.InitGroup(groupData, $groupLi);

      } catch (error) {
        if (error)
          console.error(error);
      }
    });
  }
  async RenderConversationsList() {
    let that = this;
    this.$conversationsList = $(selectors.conversationsList);

    this.$conversationsList.html("");
    this.$conversationsList.off("scroll");
    this.$conversationsList.attr("data-empty-message", __groups.notificationMessages.youHaventCreatedAGroupYet);
    $(selectors.chatbox + ">*").remove();
    $(selectors.tipText).html(__groups.pinTip.replace("%{pin}", ` ${System.constants.config.pinIcon.replace(/\{size\}/g, 16)} `));

    $(this.$conversationsList).on("click", ">li.js-group-conversation", async function(e) {
      let groupId = this.dataset.groupId;

      if (groupId) {
        if (e.target.classList.contains("js-pin")) {
          that.PinConversationListItem(groupId, this);
        } else {
          that.GroupMessages(groupId, this);
        }
      }
    });

    this.LoadMessageGroups();
  }
  async LoadMessageGroups() {
    let groups = await new ServerReq().GetMessageGroups();

    if (groups && groups.success && groups.data && groups.data.length > 0) {
      groups.data.reverse();
      groups.data.forEach(this.RenderListItem.bind(this));
      this.RefreshTimeElements();
    }
  }
  RenderListItem(group) {
    let $groupLi = groupLi(group);

    if (group.pinned) {
      $groupLi.prependTo(this.$conversationsList);
    } else {
      $groupLi.appendTo(this.$conversationsList);
    }
  }
  async GroupMessages(group_id, groupLi) {
    let resMessages = await new ServerReq().GetMessages(group_id);

    if (!resMessages || !resMessages.success || !resMessages.data)
      return notification(__groups.notificationMessages.cantFecthGroupData, "error");

    this.OpenChatbox(resMessages.data, groupLi);
  }
  async PinConversationListItem(group_id, element) {
    let isPinned = !(element.classList.contains("pinned"));

    let resUpdatedGroup = await new ServerReq().UpdateMessageGroup(group_id, {
      pinned: isPinned
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
    let $chatboxContainer = $(selectors.chatbox);

    $chatboxContainer
      .html("")
      .removeClass("js-chatbox")
      .append(this.groupChatbox.$)
      .addClass("js-group-chatbox");
  }
  OpenChatbox(data, groupLi) {
    this.groupChatbox.InitGroup(data, groupLi);
    this.RefreshTimeElements();
  }
}

export default GroupMessaging;
