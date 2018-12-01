import Request from "./Request";
import notification from "../components/Notification";
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

export function GetDeleteReasons(callback) {
	return Request.ExtensionServer("GET", `/deleteReasons/${System.data.meta.marketName}`, res => {
		if (res && res.success) {
			callback(res.data);
		}
	});
	/*$.get("admin/del_reasons/reasons/1", res => {
		Console.log($("table tr[id]", `<div>${res}</div>`));
	});*/
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

export function updateNote(data, callback) {
	Request.ExtensionServer("PUT", "/note", data, callback);
}

export function GetAnnouncements(callback) {
	Request.ExtensionServer("GET", "/announcements", callback);
}

export function CreateAnnouncement(data, callback) {
	Request.ExtensionServer("POST", "/announcements", data, callback);
}

export function UpdateAnnouncement(data, callback) {
	Request.ExtensionServer("PUT", "/announcements", data, callback);
}

export function RemoveAnnouncement(data, callback) {
	if (typeof data == "string" || typeof data == "number") {
		data = { id: data };
	}
	Request.ExtensionServer("DELETE", "/announcements", data, callback);
}

export function AnnouncementRead(data, callback) {
	if (typeof data == "string" || typeof data == "number") {
		data = { id: data };
	}
	Request.ExtensionServer("PUT", "/announcement", data, callback);
}

export function CreateShortLink(data, callback) {
	Request.ExtensionServer("POST", "/urlshortener", data, callback);
}

export function Logger(type, targetUser, data) {
	let logData = {
		type,
		targetUser,
		data
	}

	Request.ExtensionServer("PUT", "/logger", logData);
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

export function UpdateDeleteReasonsPreferences(data, callback) {
	Request.ExtensionServer("PUT", `/deleteReasonsPreferences`, data, callback);
}
//export default ActionsOfServer;
