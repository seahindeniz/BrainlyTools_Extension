import WaitForElement from "../../helpers/WaitForElement";
import { getUserByID } from "../../controllers/ActionsOfBrainly";
import { passUser } from "../../controllers/ActionsOfServer";
import UserNoteBox from "../../components/UserNoteBox";
import UserPreviousNicks from "../../components/UserPreviousNicks";
import UserBio from "../../components/UserBio";
import FriendsManager from "./_/FriendsManager";
import RenderFlags from "./_/RenderFlags";
import AccountDeleteReporter from "./_/AccountDeleteReporter";

System.pageLoaded("User Profile inject OK!");

let probatus, gender;

UserProfile();
async function UserProfile() {
	let mainRight = await WaitForElement("#main-right");

	if (!(profileData && profileData.id && profileData.nick)) {
		Console.error("Can't find the user profile data");
	} else {
		userInfosFromExtensionServer(mainRight);
		userInfosFromBrainlyServer();
		FriendsManager();
		new AccountDeleteReporter();
	}
}

async function userInfosFromExtensionServer(mainRight) {
	let user = await passUser(profileData.id, profileData.nick);
	let $userNoteContainer = $(`<div class="userNoteContainer"><h3 class="bold dark_grey" title="${System.data.locale.common.personalNote.title}">${System.data.locale.common.personalNote.placeholder}</h3></div>`);

	if (user) {
		probatus = user.probatus;

		RenderFlags(probatus, gender);
		UserPreviousNicks(user).insertAfter("#main-left > div.personal_info > div.clear");
		$userNoteContainer
			.append(UserNoteBox(user))
			.prependTo(mainRight);

	}
}

async function userInfosFromBrainlyServer() {
	let res = await getUserByID(profileData.id);

	if (res && res.success && res.data) {
		gender = res.data.gender;

		RenderFlags(probatus, gender);
		UserBio(res.data.description);
	}
}
