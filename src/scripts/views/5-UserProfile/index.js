import WaitForElm from "../../helpers/WaitForElm";
import { getUserByID } from "../../controllers/ActionsOfBrainly";
import { passUser } from "../../controllers/ActionsOfServer";
import UserNoteBox from "../../components/UserNoteBox";
import UserPreviousNicks from "../../components/UserPreviousNicks";
import UserDescription from "../../components/UserDescription";
import UserFlag from "../../components/UserFlag";

System.pageLoaded("User Profile inject OK!");

WaitForElm("#main-right", targetElm => {
	if (profileData && profileData.id && profileData.nick) {
		let $userNoteContainer = $(`<div class="userNoteContainer"><h3 class="bold dark_grey">${System.data.locale.texts.notes.personal_note}</h3></div>`);

		$userNoteContainer.prependTo(targetElm);
		if (System.checkRoute(1, "user_profile")) {
			passUser(profileData.id, profileData.nick, user => {
				if (user) {
					UserNoteBox(user).appendTo($userNoteContainer);
					UserPreviousNicks(user).insertBefore("#main-left > div.personal_info > div.helped_info");
					getUserByID(profileData.id, res => {
						if (res && res.success) {
							UserDescription(res.data.description).insertBefore("#main-left > div.personal_info > div.helped_info");

							if (user.probatus) {
								$("#main-left span.ranking").css("width", "100%").append(UserFlag(res.data.gender, "tag")).children("h2").css("float", "left")
								let $flag = UserFlag(res.data.gender, "img");
								$flag.prependTo("#main-left > div.personal_info");
							}
						}
					});
				}
			});
		} else {
			UserPreviousNicks(System.data.Brainly.userData.extension).insertBefore("#main-left > div.personal_info > div.helped_info");
			getUserByID(profileData.id, res => {
				if (res && res.success) {
					UserDescription(res.data.description).insertBefore("#main-left > div.personal_info > div.helped_info");
					let $flag = UserFlag(res.data.gender, "img");
					$flag.prependTo("#main-left > div.personal_info");
				}
			});
		}

	} else {
		Console.error("Can't find the user profile data");
	}
});
