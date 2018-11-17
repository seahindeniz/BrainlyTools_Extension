"use strict";

import notification from "../helpers/extensionNotification";

let activeSessions = {};

let notifyHandlers = {
	"message.receive": function(arg) {
		let sender = arg.users_data.find(user => user.id == arg.data.user_id);
		let notificationData = {
			type: "message",
			id: sender.id,
			nick: sender.nick,
			title: this.market.data.locale.common.notificationMessages.xSendYouANewMessage.replace("%{userName}", sender.nick),
			message: arg.data.content,
			iconUrl: System.prepareAvatar(sender),
			buttons: [{
				title: this.market.data.locale.common.show
			}],
			buttons_evt: [{
				origin: this.market.data.meta.location.origin + "/messages",
				path: "/" + arg.data.conversation_id
			}]
		};

		notification(notificationData);
	},

	"notify.receive": function(arg) {
		let notificationData = {
			type: "notify",
			id: this.market.data.Brainly.userData.user.id,
			title: this.market.data.locale.common.notificationMessages.newNotification,
			message: arg.message.replace(/<span="quote">(.*)<\/span>/gim, "\n$1\n").replace(/<.*?>(.*?)<\/.*?>/gim, "$1"),
			iconUrl: System.prepareAvatar(arg.person)
		};
		if (arg.url != "javascript:void(0)") {

			notificationData.buttons = [{
				title: this.market.data.locale.common.show
			}];
			notificationData.buttons_evt = [{
				fullPath: this.market.data.meta.location.origin + arg.url
			}];
		}

		notification(notificationData);
	}
}

class NotifierSocket {
	constructor(authHash, config) {
		this.authHash = authHash;
		this.config = config;
		this.ws = null;
		this.market = {
			data: System.data
		}

		this.openSocket();
	}
	openSocket() {
		let that = this;
		let xhr = new XMLHttpRequest();
		xhr.open('GET', `https://${this.config.cometSslServerAddress}:${this.config.cometSslServerPort}/socket.io/1/?t=${Date.now()}`);
		xhr.onreadystatechange = function(e) {
			if ((this.status >= 200 && this.status < 300 || this.status === 304) && this.readyState === XMLHttpRequest.DONE) {
				let res = this.response;
				let token = res.replace(/:.*/, "");
				//let user = __default_config.user.myObject.user;
				if (!token !== "") {
					that.ws = new WebSocket(`wss://${that.config.cometSslServerAddress}:${that.config.cometSslServerPort}/socket.io/1/websocket/${token}`);

					that.socketHandle();
				}
			}
		};
		xhr.send();
	}
	socketHandle() {
		if (!this.ws) {
			console.error("There is no active connected socket found");
		} else {
			//this.ws.onopen = () => {};

			this.ws.onmessage = evt => {
				if (evt.data && evt.data != "") {
					let message = evt.data.split(':::');

					let resData = this.messageHandlers(message[0], message[1]);

					if (resData) {
						this.ws.send(`5:::${JSON.stringify(resData)}`);
					}
				}
			};

			this.ws.onclose = function() {
				console.log("Connection is closed, restarting..");
				this.openSocket();
			};
		}
	}
	messageHandlers(i, data) {
		if (i == 1) {
			let authHash = this.market.data.Brainly.defaultConfig.comet.AUTH_HASH || this.market.data.Brainly.defaultConfig.user.ME.auth.comet.authHash;
			let user = this.market.data.Brainly.userData.user;

			return {
				name: "auth",
				args: [{
					auth_hash: authHash,
					avatar: System.prepareAvatar(user),
					client: "desktop",
					gender: user.gender,
					nick: user.nick,
					uid: user.id,
					version: "2.1",
				}]
			}
		}
		if (i == 5 && data && data != "") {
			try {
				data = JSON.parse(data);

				console.log(data);
				this.notifyHandle(data.name, data.args);

			} catch (error) {

			}
		}
	}
	notifyHandle(type, args) {
		if (!args || args.length == 0) {
			console.error("No argument found");

			return false;
		}

		let handler = notifyHandlers[type];

		if (typeof handler == "function") {
			args.forEach(arg => {
				handler.bind(this)(arg);
			});
		}
	}
}
const BrainlyNotificationSocket = isActive => {
	if (isActive) {
		let marketName = System.data.meta.marketName;
		let authHash = System.data.Brainly.defaultConfig.comet.AUTH_HASH || System.data.Brainly.defaultConfig.user.ME.auth.comet.authHash;
		let activeSession = activeSessions[marketName];

		if (!activeSession || activeSession.hash != authHash) {
			let config = System.data.Brainly.defaultConfig.config.data.config;
			activeSessions[marketName] = {
				hash: authHash
			};

			new NotifierSocket(authHash, config);
		}
		/* else {
			wsHandle(activeSession.ws);
		} */

	}
};

export default BrainlyNotificationSocket;
