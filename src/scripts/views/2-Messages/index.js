import WaitForElm from "../../helpers/WaitForElm";
import WaitForFn from "../../helpers/WaitForFn";
import { passUser } from "../../controllers/ActionsOfServer";
import { getUserByID } from "../../controllers/ActionsOfBrainly";
import UserNoteBox from "../../components/UserNoteBox";
import UserFlag from "../../components/UserFlag";
import renderGroupMessaging from "../../components/GroupMessaging"

System.pageLoaded("Messages inject OK!");

const selectors = {
	profileLinkContainerSub: " div.sg-content-box__header > div.sg-actions-list",
	get profileLinkContainer() {
		return "section.brn-messages__chatbox:not(.js-group-chatbox)" + selectors.profileLinkContainerSub;
	},
	profileLink: ".sg-actions-list__hole:nth-child(2) a",
	messagesContainer: "#private-messages-container",
	conversationsHeader: "#private-messages-container > section.brn-messages__conversations > div.sg-content-box > div.sg-content-box__header"
}
let profileLinkContainerFound = function(targetElm) {
	//if (!$(this).parent().is('.mesaj_grubu')) {
	if (targetElm) {
		if ($(".userNoteBox", targetElm).length == 0) {
			let link = $(selectors.profileLink, targetElm);
			let id = link.attr('href').match(/\-(\d{1,})/)[1];
			let u_name = link.attr('title');
			if (link.length > 0) {
				passUser(id, u_name, user => {
					if (user) {
						UserNoteBox(user).appendTo(targetElm);
						if (user.probatus) {
							getUserByID(id, res => {
								if (res && res.success) {
									UserFlag(res.data.gender, "tag").insertAfter("div.sg-content-box > div.sg-content-box__header > div.sg-actions-list > div.sg-actions-list__hole:nth-child(2)");
								}
							});
						}
					}
				});
			}
		}
	}
}

let observeFound = () => {
	$(selectors.messagesContainer).observe('added', '.brn-chatbox:not(.js-group-chatbox)', function() {
		profileLinkContainerFound($(selectors.profileLinkContainerSub, this));
	});
}

WaitForElm(selectors.profileLinkContainer, (targetElm) => {
	profileLinkContainerFound(targetElm);
	WaitForFn('$().observe', observeFound);
});
WaitForElm(selectors.conversationsHeader, $conversationsHeader => {
	renderGroupMessaging($conversationsHeader);
});
