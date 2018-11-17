"use strict";
import ext from "../utils/ext";

let prepareAjax = () => {
	$(document).ajaxSend(function(xhr, s, settings) {
		if (typeof settings.data === "string") {
			settings.data = settings.data.replace(/(\&data\%5B\_Token\%5D\%5Block\%5D\=.+)/, "");
		}
	});

	prepareAjax = null;
}
let holdRequests = [];
const Request = {
	Brainly(options) {
		let that = this;
		let { method, path, data, callback, onError, countErr = 0, tryAgain } = options;
		let reqData = {
			method: method,
			type: method,
			url: path,
			headers: {
				"Content-Type": "application/json",
				"X-B-Token-Long": System.data.Brainly.tokenLong,
				accept: "text/plain, */*; q=0.01"
			},
			data
		};

		if (typeof callback == "function") {
			reqData.success = callback;
		} else if (typeof callback == "object") {
			reqData.success = callback.success;
		}

		if (options.ajaxOptions) {
			reqData = { ...reqData, ...options.ajaxOptions }
		}

		prepareAjax && prepareAjax();

		let ajaxR = $.ajax(reqData);

		tryAgain && console.log("tryAgain:", countErr);
		ajaxR.fail(function(e) {
			if (e.getResponseHeader("cf-chl-bypass") == "1") {
				callback.forceStop && callback.forceStop();
				holdRequests.push({ method, path, data, callback, onError, countErr, tryAgain: true });
				System.toBackground("openCaptchaPopup", System.data.meta.location.origin, res => {
					if (res == "true") {
						holdRequests.forEach(holding => {
							that.Brainly(holding);
						});

						holdRequests = [];

						callback.forceStop && callback.forceStop(true);
					}
				});
			} else if (++countErr < 3) {
				setTimeout(() => that.Brainly({ method, path, data, callback, onError, countErr, tryAgain: true }), 500);
			} else {
				if (typeof onError === "function") {
					onError(e);
				}
				if (typeof callback.error === "function") {
					callback.error(e);
				}
				reqData.countErr = 0;
			}
		});
	},
	BrainlyAPI(method, path, data, callback, onError, countErr) {
		if (typeof data === "function") {
			countErr = onError || 0;
			onError = callback;
			callback = data;
			data = null;
		}

		callback = callback || function() {};
		let requestData = {
			method,
			path: System.data.Brainly.apiURL + path,
			callback,
			onError,
			countErr,
			ajaxOptions: {
				dataType: "json"
			}
		};

		if (data) {
			requestData.data = JSON.stringify(data);
		}

		this.Brainly(requestData);
	},
	BrainlySaltGet(path, data, callback, onError) {
		let that = this;
		if (typeof data === "function") {
			onError = callback;
			callback = data;
			data = null;
		}
		callback = typeof callback === "undefined" ? (function() {}) : callback;

		var xhr = new XMLHttpRequest();
		$.ajax({
			method: "get",
			url: System.data.meta.location.origin + path,
			beforeSend: function(xhr) {
				xhr.setRequestHeader('X-Requested-With', { toString: function() { return ''; } });
			},
			xhr: () => xhr,
			success: (data, textStatus, jqXHR) => {
				jqXHR.responseURL = xhr.responseURL;
				callback && callback(data, textStatus, jqXHR);
			}
		}).fail(onError);
	},
	ExtensionServer(method, path, data, callback) {
		if (typeof data == "function") {
			callback = data;
			data = undefined;
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
	},
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
export default Request;
