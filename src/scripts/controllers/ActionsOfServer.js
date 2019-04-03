import Request from "./Request";
import notification from "../components/notification";
import md5 from "js-md5";
import storage from "../helpers/extStorage";

function userAuth(reLogin = false) {
	return new Promise(async (resolve, reject) => {
		let data = {
			//clientID: System.data.meta.manifest.clientID,
			clientVersion: System.data.meta.manifest.version,
			//isoLocale: System.data.Brainly.userData.user.iso_locale,
			marketName: System.data.meta.marketName,
			crypted: md5(System.data.Brainly.tokenLong),
			user: {
				id: System.data.Brainly.userData.user.id,
				nick: System.data.Brainly.userData.user.nick
			}
		}

		storage("setL", { authData: null });

		let resAuth = await Request.ExtensionServer("POST", "/auth", data);

		if (!resAuth) {
			System.changeBadgeColor("error");
			notification(System.data.locale.core.notificationMessages.extensionServerError + "<br>" + System.data.locale.core.notificationMessages.ifErrorPersists, "error", true);
			reject();
		} else if (!resAuth.data.probatus) {
			System.changeBadgeColor("error");
			notification(System.data.locale.core.notificationMessages.accessPermissionDenied, "error", true);
			reLogin && location.reload(true);
			reject(System.data.locale.core.notificationMessages.accessPermissionDenied.replace(/<br.*?>/gi, "\n"));
		} else {
			resAuth.data.hash = JSON.parse(atob(resAuth.data.hash));

			resolve(resAuth.data);
		}
	});
}

export function Auth() {
	return new Promise(async (resolve, reject) => {
		try {
			let authData = await storage("getL", "authData");

			if (!authData || !authData.hash) {
				authData = await userAuth();

				System.SetUserData(authData);
			} else {
				System.SetUserDataToSystem(authData);
				userAuth(true).then(System.SetUserData.bind(System))
			}

			Console.info("Auth OK!");
			resolve();
		} catch (error) {
			reject(error);
		}
	});
}

export function GetDeleteReasons() {
	return Request.ExtensionServer("GET", `/deleteReasons/${System.data.meta.marketName}`);
}

export function GetUser(id, nick) {
	let promise = Request.ExtensionServer("GET", `/user/${id}/${nick}`);

	promise.catch(() => {
		notification(System.data.locale.common.notificationMessages.cannotShareUserInfoWithServer, "error");
	});

	return promise;
}

export function PutUser(data) {
	return Request.ExtensionServer("PUT", "/user", data);
}

export function UpdateNote(data) {
	return Request.ExtensionServer("PUT", "/note", data);
}

export function GetAnnouncements() {
	return Request.ExtensionServer("GET", "/announcements");
}

export function CreateAnnouncement(data) {
	return Request.ExtensionServer("POST", "/announcements", data);
}

export function UpdateAnnouncement(data) {
	return Request.ExtensionServer("PUT", "/announcements", data);
}

export function RemoveAnnouncement(data) {
	if (typeof data == "string" || typeof data == "number") {
		data = { id: data };
	}
	return Request.ExtensionServer("DELETE", "/announcements", data);
}

export function AnnouncementRead(id) {
	return Request.ExtensionServer("PUT", `/announcement/${id}`);
}

export function CreateShortLink(data) {
	return Request.ExtensionServer("POST", "/urlshortener", data);
}

export function Logger(type, log) {
	let logData = {
		type,
		log
	}

	return Request.ExtensionServer("PUT", "/logger", logData);
}

export function GetUsers() {
	return Request.ExtensionServer("GET", "/users");
}

export function GetMessageGroups() {
	return Request.ExtensionServer("GET", "/messageGroups");
}

export function CreateMessageGroup(data) {
	return Request.ExtensionServer("POST", "/messageGroups", data);
}

export function GetMessages(_id) {
	return Request.ExtensionServer("GET", `/messageGroup/${_id}`);
}

export function MessageSended(data) {
	return Request.ExtensionServer("POST", "/messageGroup", data);
}

export function UpdateMessageGroup(_id, data) {
	return Request.ExtensionServer("PUT", `/messageGroup/${_id}`, data);
}

export function GetModerateAllPages() {
	return Request.ExtensionServer("GET", `/moderateAllPages`);
}

export function UpdateDeleteReasonsPreferences(data) {
	return Request.ExtensionServer("PUT", `/deleteReasonsPreferences`, data);
}

export function RemoveDeleteReasonPreference(id) {
	return Request.ExtensionServer("DELETE", `/deleteReasonsPreferences/${id}`);
}

export function AccountDeleteReport(data) {
	return Request.ExtensionServerAjax("POST", "/accountDeleteReport", data);
}

export function GetAccountDeleteReports() {
	return Request.ExtensionServer("GET", `/accountDeleteReports`);
}

export function FindDeleteReport(filter, value) {
	return Request.ExtensionServer("GET", `/accountDeleteReports/${filter}/${value}`);
}

export function GetShortenedLinks() {
	return Request.ExtensionServer("GET", `/urlshortener`);
}

export function FindShortenedLink(value) {
	return Request.ExtensionServer("GET", `/urlshortener/${value}`);
}

export function GivePrivilege(privilege) {
	return Request.ExtensionServerAjax("PUT", "/users/give", { privilege });
}

export function RevokePrivilege(privilege) {
	return Request.ExtensionServerAjax("PUT", "/users/revoke", { privilege });
}

export function UpdateNoticeBoard(content) {
	return Request.ExtensionServer("PUT", "/noticeBoard", { content });
}

export function GetNoticeBoardContent() {
	return Request.ExtensionServer("GET", "/noticeBoard");
}

export function ReadNoticeBoard() {
	return Request.ExtensionServer("PUT", "/noticeBoard/read");
}
