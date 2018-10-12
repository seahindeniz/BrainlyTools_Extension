import ConversationLi from "./ConversationLi";
import renderCreateGroup from "./CreateGroup";
import { GetMessageGroups } from "../../controllers/ActionsOfServer";

const selectors = {
	messagesList: "ul.js-conversations"
}
/**
 * Grup mesaj eklemeye tıkladıktan sonra yeni bir modal aç. 
 * Modal içerisinde select ile ne tip kullanıcılar olacağını belirt
 * > Kişi seçerek
 * > Tüm moderatörler
 * > Belirli Moderatör rankleri ve alt rank gruplarına özel ikinci olarak eklenecek alt rank grupları
 */

const renderGroupConversations = () => {
	let $messagesList = $(selectors.messagesList);

	$messagesList.html("");

	GetMessageGroups(groups => {
		console.log(groups);
		if (groups && groups.success && groups.data && groups.data.length > 0) {
			groups.data.forEach(group => {
				let $groupLi = ConversationLi(group);

				$groupLi.appendTo($messagesList);
			});
		}
	})
}

export default $conversationsHeader => {
	let $groupMessageLink = $(`<a class="sg-headline sg-headline--small" href="#">${System.data.locale.messages.groups.title}</a>`);
	let $messagesHeader = $("h2", $conversationsHeader);

	$groupMessageLink.appendTo($conversationsHeader);

	$groupMessageLink.click(e => {
		e.preventDefault();

		let $createGroupLink = renderCreateGroup();

		$createGroupLink.appendTo($conversationsHeader);

		$messagesHeader.remove();
		$groupMessageLink.removeAttr("href");
		$groupMessageLink.off("click");

		renderGroupConversations();
	});
}
