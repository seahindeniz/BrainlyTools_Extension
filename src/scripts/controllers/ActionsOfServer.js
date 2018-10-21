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
		Request.ExtensionServer("POST", "/auth", data, authRequestHandler);
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
		Request.ExtensionServer("GET", "/deleteReasons", res => {
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
		Request.ExtensionServer("PUT", "/user", data, res => {
			if (res && res.success) {
				callback(res.data);
			} else {
				Notification(System.data.locale.common.notificationMessages.cannotShareUserInfoWithServer, "error");
			}
		});
	},
	PutUser(data, callback) {
		Request.ExtensionServer("PUT", "/user", data, callback);
	},
	updateNote(data, callback) {
		Request.ExtensionServer("PUT", "/note", data, callback);
	},
	GetAnnouncements(callback) {
		Request.ExtensionServer("GET", "/announcements", callback);
	},
	CreateAnnouncement(data, callback) {
		Request.ExtensionServer("POST", "/announcements", data, callback);
	},
	UpdateAnnouncement(data, callback) {
		Request.ExtensionServer("PUT", "/announcements", data, callback);
	},
	RemoveAnnouncement(data, callback) {
		if (typeof data == "string" || typeof data == "number") {
			data = { id: data };
		}
		Request.ExtensionServer("DELETE", "/announcements", data, callback);
	},
	AnnouncementRead(data, callback) {
		if (typeof data == "string" || typeof data == "number") {
			data = { id: data };
		}
		Request.ExtensionServer("PUT", "/announcement", data, callback);
	},
	CreateShortLink(data, callback) {
		Request.ExtensionServer("POST", "/urlshortener", data, callback);
	},
	Logger(type, targetUser, data) {
		let logData = {
			type,
			targetUser,
			data
		}

		Request.ExtensionServer("PUT", "/logger", logData);
	},
	GetUsers(callback) {
		Request.ExtensionServer("GET", "/users", callback);
	},
	GetMessageGroups(callback) {
		Request.ExtensionServer("GET", "/messageGroups", callback);
	},
	CreateMessageGroup(data, callback) {
		Request.ExtensionServer("POST", "/messageGroups", data, callback);
	},
	GetMessages(_id, callback) {
		Request.ExtensionServer("GET", `/messageGroup/${_id}`, callback);
	},
	MessageSended(data, callback) {
		Request.ExtensionServer("POST", "/messageGroup", data, callback);
	},
	UpdateMessageGroup(_id, data, callback) {
		Request.ExtensionServer("PUT", `/messageGroup/${_id}`, data, callback);
	},
}
export default ActionsOfServer;
