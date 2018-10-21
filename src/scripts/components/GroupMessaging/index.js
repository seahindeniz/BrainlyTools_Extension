import groupLi from "./groupLi";
import renderGroupModal from "./groupModal";
import renderGroupChatbox from "./GroupChatbox";
import { GetMessageGroups, GetMessages, UpdateMessageGroup } from "../../controllers/ActionsOfServer";
import Notification from "../../components/Notification";
import moment from "moment";

const __groups = System.data.locale.messages.groups;
window.selectors = {
	conversationsList: "ul.js-conversations",
	groupLiNotPinnedFirst: "ul.js-conversations > li:not(.pinned):first",
	chatbox: "section.brn-chatbox",
	chatbox_content: "section.brn-chatbox > .sg-content-box",
	tipText: ".brn-messages__conversations .brn-messages__tip"
}
const startRefreshTimes = () => {
	let refreshTimes = () => {
		let $time = $(".js-time");
		$time.each((i, el) => {
			let time = el.dateTime;
			if (time && time != "") {
				let _moment = moment(el.dateTime);
				el.innerText = _moment.fromNow();
				el.title = _moment.format('LLLL');
			}
		});
	};

	refreshTimes();
	setInterval(refreshTimes, 1000);
}
const renderGroupConversations = () => {
	let $conversationsList = $(selectors.conversationsList),
		$chatBox = $(selectors.chatbox);

	$conversationsList.html("");
	$conversationsList.off("scroll");
	$(selectors.chatbox + ">*").remove();
	$(selectors.tipText).html(__groups.pinTip.replace("%{pin}", System.data.config.pinIcon.replace(/\{size\}/g, 16)));

	GetMessageGroups(groups => {
		if (groups && groups.success && groups.data && groups.data.length > 0) {
			groups.data.reverse();
			groups.data.forEach(group => {
				let $groupLi = groupLi(group);

				if (group.pinned) {
					$groupLi.prependTo($conversationsList);
				} else {
					$groupLi.appendTo($conversationsList);
				}
			});
			$($conversationsList).on("click", ">li.js-group-conversation", function(e) {
				let group_id = this.dataset.groupId;

				if (group_id) {
					if (e.target.classList.contains("js-pin")) {
						let pinned = !(this.classList.contains("pinned"));

						UpdateMessageGroup(group_id, {
							pinned
						}, res => {
							if (res && res.success) {
								if (!(this.classList.contains("pinned"))) {
									$(this).prependTo($conversationsList);
								} else {
									$(this).insertBefore(selectors.groupLiNotPinnedFirst);
								}
								this.classList.toggle("pinned");
							}
						});
					} else {
						GetMessages(group_id, res => {
							if (!res || !res.success || !res.data) {
								Notification(__groups.notificationMessages.cantFecthGroupData, "error");

								return false;
							}

							let $groupChatbox = renderGroupChatbox.bind(this)(res.data);

							let $chatBox_content = $(`<div class="sg-content-box"></div>`);

							$(">*", $chatBox).remove();
							$chatBox_content.appendTo($chatBox);

							$chatBox.addClass("js-group-chatbox").removeClass("js-chatbox");
							$groupChatbox.appendTo($chatBox_content);
						});
					}
				}
			});
			startRefreshTimes();
		}
	})
}

export default $conversationsHeader => {
	let $groupMessageLink = $(`<a class="sg-headline sg-headline--small" href="#">${__groups.title}</a>`);
	let $messagesHeader = $("h2", $conversationsHeader);

	$groupMessageLink.appendTo($conversationsHeader);

	$groupMessageLink.click(e => {
		e.preventDefault();

		let $createGroupLink = $(`<a class="sg-headline sg-headline--small" href="#">${__groups.createGroup}</a>`);

		$createGroupLink.click(e => {
			e.preventDefault();
			renderGroupModal();
		});
		$createGroupLink.appendTo($conversationsHeader);

		$messagesHeader.remove();
		$groupMessageLink.removeAttr("href");
		$groupMessageLink.off("click");

		renderGroupConversations();
	});
}
