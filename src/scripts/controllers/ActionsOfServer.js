import Request from "./Request";
import Notification from "../components/Notification";
import md5 from "js-md5";
import Storage from "../helpers/extStorage";

const ActionsOfServer = {
	userAuth(callback) {
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
		let authRequestHandler = res => {
			if (!res) {
				Notification(System.data.locale.core.notificationMessages.extensionServerError + "<br>" + System.data.locale.core.notificationMessages.ifErrorPersists, "error", true);
			} else if (!res.data.probatus) {
				callback && Notification(System.data.locale.core.notificationMessages.accessPermissionDenied, "error", true);
			} else {
				System.data.Brainly.userData.extension = res.data;

				Storage.setL({ authData: res.data });
				callback && callback(JSON.parse(atob(res.data.hash)));
			}

		};

		Storage.setL({ authData: null });
		Request.ExtensionServerReq("POST", "/auth", data, authRequestHandler);
	},
	Auth(callback) {
		Storage.getL("authData", authData => {
			if (authData && authData.hash) {
				System.data.Brainly.userData.extension = authData;

				callback && callback(JSON.parse(atob(authData.hash)));
				ActionsOfServer.userAuth(() => {
					if (!System.data.Brainly.userData.extension.probatus) {
						location.reload(true);
					}
				});
			} else {
				ActionsOfServer.userAuth(callback);
			}
		});
	},
	GetDeleteReasons(callback) {
		Request.ExtensionServerReq("GET", "/deleteReasons", res => {
			if (res && res.success) {
				callback(res.data.deleteReasons);
			}
		});
		/*$.get("admin/del_reasons/reasons/1", res => {
			Console.log($("table tr[id]", `<div>${res}</div>`));
		});*/
	},
	passUser(id, nick, callback) {
		let data = {
			id,
			nick
		}
		Request.ExtensionServerReq("PUT", "/user", data, res => {
			if (res && res.success) {
				callback(res.data);
			} else {
				Notification(System.data.locale.common.notificationMessages.cannotShareUserInfoWithServer, "error");
			}
		});
	},
	PutUser(data, callback) {
		Request.ExtensionServerReq("PUT", "/user", data, callback);
	},
	updateNote(data, callback) {
		Request.ExtensionServerReq("PUT", "/note", data, callback);
	},
	GetAnnouncements(callback) {
		Request.ExtensionServerReq("GET", "/announcements", callback);
	},
	CreateAnnouncement(data, callback) {
		Request.ExtensionServerReq("POST", "/announcements", data, callback);
	},
	UpdateAnnouncement(data, callback) {
		Request.ExtensionServerReq("PUT", "/announcements", data, callback);
	},
	RemoveAnnouncement(data, callback) {
		if (typeof data == "string" || typeof data == "number") {
			data = { id: data };
		}
		Request.ExtensionServerReq("DELETE", "/announcements", data, callback);
	},
	AnnouncementRead(data, callback) {
		if (typeof data == "string" || typeof data == "number") {
			data = { id: data };
		}
		Request.ExtensionServerReq("PUT", "/announcement", data, callback);
	},
	CreateShortLink(data, callback) {
		Request.ExtensionServerReq("POST", "/urlshortener", data, callback);
	},
	Logger(type, targetUser, data) {
		let logData = {
			type,
			targetUser,
			data
		}

		Request.ExtensionServerReq("PUT", "/logger", logData);
	},
	GetUsers(callback) {
		Request.ExtensionServerReq("GET", "/users", callback);
	},
}
export default ActionsOfServer;
