"use strict";

let extensionServerURL = "https://sahin.in/BrainlyTools"
extensionServerURL = "http://127.0.0.1:3001/BrainlyTools"
class Ajax {
	constructor() { }
	BrainlyPost(url, data, callback, async, onHata) {
		if (typeof data === "function") {
			async = onHata;
			onHata = callback;
			callback = data;
			data = {};
		}
		callback = typeof callback === "undefined" ? (function () { }) : callback;
		$(document).ajaxSend(function (xhr, s, settings) {
			if (typeof settings.data === "string") {
				settings.data = settings.data.replace(/(\&data\%5B\_Token\%5D\%5Block\%5D\=.+)/, "");
			}
		});
		$.ajax({
			method: "POST",
			type: "POST",
			url: Sistem.define.ApiUrl + url,
			headers: {
				"Content-Type": "application/json",
				"X-B-Token-Long": Sistem.depo.long,
				"X-B-Token-Short": Sistem.depo.short
			},
			async: async,
			dataType: "json",
			data: JSON.stringify(data),
			success: callback
		}).fail(function () {
			countErr++;
			if (countErr < 3) {
				Sistem.fn.eodevpost(url, data, callback, async, onHata);
			} else {
				if (typeof onHata === "undefined") { //noinspection JSUnresolvedVariable
					Sistem.fn.alert(Sistem.locale.texts.errors.operation_error, "error");
				} else if (typeof onHata === "function") {
					onHata();
				}
				countErr = 0;
			}
		});
	}
	BrainlyGet() { }
	ExtensionServerReq(method, path, data, callback) {
		if (typeof data !== "function") {
			data = JSON.stringify(data);
		}
		else {
			callback = data;
			data = null;
		}

		var xhr = new XMLHttpRequest();
		xhr.open(method, extensionServerURL + path, true);
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.onload = function () {
			if (xhr && xhr.responseText && xhr.responseText != "") {
				var results = JSON.parse(xhr.responseText);
				/*if (xhr.readyState == 4 && xhr.status == "201") {
					callback(results);
				} else {
				}*/
				callback(results);
			}
		}
		xhr.send(data);
	}
	get(path, callback) {
		let xhr = new XMLHttpRequest();
		xhr.open("GET", path, true);
		xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest');
		xhr.onload = function () {
			if (xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) {
				if (xhr && xhr.responseText) {
					callback(xhr.responseText)
				}
				else {
					callback(null)
				}
			}
			else {
				console.log(xhr.readyState, xhr.status);
				callback(null)
			}
		}
		xhr.send(null);
	}
}
export default new Ajax();