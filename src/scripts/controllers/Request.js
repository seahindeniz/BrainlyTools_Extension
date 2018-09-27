"use strict";
import ext from "../utils/ext";

let countErr = 0;
class Ajax {
	constructor() {}
	BrainlyReq(method, path, data, callback, async, onHata) {
		let that = this;
		if (typeof data === "function") {
			async = onHata;
			onHata = callback;
			callback = data;
			data = null;
		}
		callback = typeof callback === "undefined" ? (function() {}) : callback;
		$(document).ajaxSend(function(xhr, s, settings) {
			if (typeof settings.data === "string") {
				settings.data = settings.data.replace(/(\&data\%5B\_Token\%5D\%5Block\%5D\=.+)/, "");
			}
		});
		$.ajax({
			method: method,
			type: method,
			url: System.data.Brainly.apiURL + path,
			headers: {
				"Content-Type": "application/json",
				"X-B-Token-Long": System.data.Brainly.tokenLong
			},
			async: async,
			dataType: "json",
			data: data ? JSON.stringify(data) : null,
			success: callback
		}).fail(function() {
			if (++countErr < 3) {
				that.BrainlyReq(method, path, data, callback, async, onHata);
			} else {
				if (typeof onHata === "undefined") { //noinspection JSUnresolvedVariable
					//Sistem.fn.alert(Sistem.locale.texts.errors.operation_error, "error");
				} else if (typeof onHata === "function") {
					onHata();
				}
				countErr = 0;
			}
		});
	}
	BrainlyGet() {}
	ExtensionServerReq(method, path, data = null, callback) {
		if (typeof data == "function") {
			callback = data;
			data = null;
		} else if (typeof data != "undefined") {
			data = JSON.stringify(data);
		}

		let headers = {
			"Content-type": "application/json; charset=utf-8"
		};
		if (System.data.Brainly.userData.extension && System.data.Brainly.userData.extension.secretKey) {
			headers["SecretKey"] = System.data.Brainly.userData.extension.secretKey;
		}
		
		let messageData = {
			action: "xmlHttpRequest",
			method,
			path,
			headers,
			data
		};

		ext.runtime.sendMessage(System.data.meta.extension.id, messageData, callback);
	}
	_old_ExtensionServerReq(method, path, data, callback) {
		if (typeof data !== "function") {
			data = JSON.stringify(data);
		} else {
			callback = data;
			data = null;
		}

		var xhr = new XMLHttpRequest();
		xhr.open(method, extensionServerURL + path, true);
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		if (System.data.Brainly.userData.extension && System.data.Brainly.userData.extension.secretKey) {
			xhr.setRequestHeader('SecretKey', System.data.Brainly.userData.extension.secretKey);
		}
		xhr.onload = function() {
			if (xhr && xhr.responseText && xhr.responseText != "") {
				var results = JSON.parse(xhr.responseText);
				callback(results);
			}
		}
		xhr.send(data);
	}
	get(path, callback) {
		let xhr = new XMLHttpRequest();
		xhr.open("GET", path, true);
		xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest');
		xhr.onload = function() {
			if (xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) {
				if (xhr && xhr.responseText) {
					callback(xhr.responseText)
				} else {
					callback(null)
				}
			} else {
				console.log(xhr.readyState, xhr.status);
				callback(null)
			}
		}
		xhr.send(null);
	}
}
export default new Ajax();
