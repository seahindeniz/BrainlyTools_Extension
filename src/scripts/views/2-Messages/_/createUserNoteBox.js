import UserNoteBox from "../../../components/UserNoteBox";
import UserTag from "../../../components/UserTag";
import { GetUserByID } from "../../../controllers/ActionsOfBrainly";
import { PassUser } from "../../../controllers/ActionsOfServer";
import WaitForElement from "../../../helpers/WaitForElement";
import WaitForObject from "../../../helpers/WaitForObject";

async function profileLinkContainerFound(targetElm) {
	if (targetElm) {
		if ($(".userNoteBox", targetElm).length == 0) {
			let link = $(selectors.profileLink, targetElm);
			let id = link.attr('href').match(/\-(\d{1,})/)[1];
			let u_name = link.attr('title');

			if (link.length > 0) {
				let resExtUser = await PassUser(id, u_name);

				if (resExtUser && resExtUser.success && resExtUser.data) {
					let $notebox = UserNoteBox(resExtUser.data);

					$notebox.appendTo(targetElm);

					if (resExtUser.data.probatus) {
						let resBrainlyUser = await GetUserByID(id);

						if (resBrainlyUser && resBrainlyUser.success) {
							let tag = new UserTag(id, resExtUser.data)

							tag.$.insertAfter("div.sg-content-box > div.sg-content-box__header > div.sg-actions-list > div.sg-actions-list__hole:nth-child(2)");
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
