import Request from "./Request";
import notification from "../components/notification";
import md5 from "js-md5";
import Storage from "../helpers/extStorage";

export async function userAuth(resolve, reject) {
	let data = {
		clientID: System.data.meta.manifest.clientID,
		clientVersion: System.data.meta.manifest.version,
		isoLocale: System.data.Brainly.userData.user.iso_locale,
		marketName: System.data.meta.marketName,
		crypted: md5(System.data.Brainly.tokenLong),
		user: {
			id: System.data.Brainly.userData.user.id,
			nick: System.data.Brainly.userData.user.nick
		}
	}

	Storage.setL({ authData: null });

	let res = await Request.ExtensionServer("POST", "/auth", data);

	if (!res) {
		notification(System.data.locale.core.notificationMessages.extensionServerError + "<br>" + System.data.locale.core.notificationMessages.ifErrorPersists, "error", true);
		reject();
	} else if (!res.data.probatus) {
		notification(System.data.locale.core.notificationMessages.accessPermissionDenied, "error", true);
		!resolve && location.reload(true);
		reject();
	} else {
		System.data.Brainly.userData.extension = res.data;

		Storage.setL({ authData: res.data });
		resolve && resolve(JSON.parse(atob(res.data.hash)));
	}
}

export function Auth() {
	return new Promise((resolve, reject) => {
		Storage.getL("authData", authData => {
			if (authData && authData.hash) {
				System.data.Brainly.userData.extension = authData;

				resolve(JSON.parse(atob(authData.hash)));
				userAuth(null, reject);
			} else {
				userAuth(resolve, reject);
			}
		});
	});
}

export function GetDeleteReasons() {
	return Request.ExtensionServer("GET", `/deleteReasons/${System.data.meta.marketName}`);
}

export function passUser(id, nick) {
	return new Promise((resolve, reject) => {

		let data = {
			id,
			nick
		}

		let passPromise = Request.ExtensionServer("PUT", "/user", data);

		passPromise.then(res => {
			if (res && res.success) {
				resolve(res.data);
			}
		})
		passPromise.catch((why) => {
			notification(System.data.locale.common.notificationMessages.cannotShareUserInfoWithServer, "error");
			reject(why);
		});

	});
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

export function AnnouncementRead(data) {
	if (typeof data == "string" || typeof data == "number") {
		data = { id: data };
	}

	return Request.ExtensionServer("PUT", "/announcement", data);
}

export function CreateShortLink(data) {
	return Request.ExtensionServer("POST", "/urlshortener", data);
}

export function Logger(type, targetUser, data) {
	let logData = {
		type,
		targetUser,
		data
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

export function AccountDeleteReport(data) {
	return Request.ExtensionServerAjax("POST", "/accountDeleteReport", data);
}
//export default ActionsOfServer;
