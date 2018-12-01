import WaitForElement from "../../../helpers/WaitForElement";
import WaitForObject from "../../../helpers/WaitForObject";
import { passUser } from "../../../controllers/ActionsOfServer";
import { getUserByID } from "../../../controllers/ActionsOfBrainly";
import UserNoteBox from "../../../components/UserNoteBox";
import UserFlag from "../../../components/UserFlag";

async function profileLinkContainerFound(targetElm) {
	//if (!$(this).parent().is('.mesaj_grubu')) {
	if (targetElm) {
		if ($(".userNoteBox", targetElm).length == 0) {
			let link = $(selectors.profileLink, targetElm);
			let id = link.attr('href').match(/\-(\d{1,})/)[1];
			let u_name = link.attr('title');

			if (link.length > 0) {
				let passedUser = await passUser(id, u_name);

				if (passedUser) {
					let $notebox = UserNoteBox(passedUser);

					$notebox.appendTo(targetElm);

					if (passedUser.probatus) {
						let user = await getUserByID(id);

						if (user && user.success) {
							UserFlag(user.data.gender, "tag").insertAfter("div.sg-content-box > div.sg-content-box__header > div.sg-actions-list > div.sg-actions-list__hole:nth-child(2)");
						}
					}
				}
			}
		}
	}
}

async function createUserNoteBox() {
	let targetElm = await WaitForElement(selectors.profileLinkContainer);

	profileLinkContainerFound(targetElm);

	let _$_observe = await WaitForObject("$().observe");

	if (_$_observe) {
		$(selectors.messagesContainer).observe('added', '.brn-chatbox:not(.js-group-chatbox)', function() {
			profileLinkContainerFound($(selectors.profileLinkContainerSub, this));
		});
	}
}

export default createUserNoteBox;
