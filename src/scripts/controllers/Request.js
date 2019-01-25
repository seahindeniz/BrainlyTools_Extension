"use strict";
import ext from "../utils/ext";

let prepareAjax = () => {
	$(document).ajaxSend(function(xhr, s, settings) {
		if (typeof settings.data === "string") {
			settings.data = settings.data.replace(/(\&data\%5B\_Token\%5D\%5Block\%5D\=.+)/, "");
		} else if (settings.data instanceof FormData) {
			settings.data.delete("data[_Token][lock]");
		}
	});

	prepareAjax = $.noop;
}

let holdRequests = [];
const Request = {
	Brainly(options, _resolve, _reject) {
		return new Promise((resolve, reject) => {
			let that = this;
			let { method, path, data, callback, countErr = 0 } = options;
			let xhr = new XMLHttpRequest();

			if (_resolve && _reject) {
				resolve = _resolve;
				reject = _reject;
			}

			xhr.open(method, path, true);
			xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest');
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.setRequestHeader('X-B-Token-Long', System.data.Brainly.tokenLong);

			xhr.onload = function(e) {
				console.log("onload:", e, xhr);
				if (xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) {
					if (xhr && xhr.responseText) {
						resolve(JSON.parse(xhr.responseText))
					} else {
						resolve(null)
					}
				} else {
					if (xhr.getResponseHeader("cf-chl-bypass") == "1") {
						callback.forceStop && callback.forceStop();
						holdRequests.push({ method, path, data, callback, countErr });
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
						setTimeout(() => that.Brainly({ ...options, countErr }, resolve, reject), 500);
					} else {
						if (callback && typeof callback.error === "function") {
							callback.error(xhr);
						}

						reject(xhr);
						options.countErr = 0;
					}
				}
			}
			xhr.onerror = function(e) {
				console.log("onerror:", e);
				reject({
					status: this.status,
					statusText: xhr.statusText
				});
			};
			xhr.send(data);
		});
	},
	BrainlyAPI(method, path, data) {
		//return new Promise((resolve, reject) => {
		let requestData = {
			method,
			path: System.data.Brainly.apiURL + path
		};

		if (data) {
			if (data.model_id) {
				//data.model_id = 9999999
			}
			requestData.data = JSON.stringify(data);
		}

		return this.Brainly(requestData); //.then(resolve).catch(reject);
		//});
	},
	get(path) {
		// fetch api kullanmayı dene aşağıda
		return new Promise((resolve, reject) => {
			let xhr = new XMLHttpRequest();

			xhr.open("GET", path, true);
			xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest');

			xhr.onload = function() {
				if (xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) {
					if (xhr && xhr.responseText) {
						resolve(xhr.responseText)
					} else {
						resolve(null)
					}
				} else {
					console.log(xhr.readyState, xhr.status);
					resolve(null)
				}
			}
			xhr.onerror = function() {
				reject({
					status: this.status,
					statusText: xhr.statusText
				});
			};

			xhr.send();
		});
	},
	BrainlySaltGet(path, data) {
		let that = this;

		var xhr = new XMLHttpRequest();

		return $.ajax({
			method: "GET",
			url: System.data.meta.location.origin + path,
			beforeSend: function(xhr) {
				xhr.setRequestHeader('X-Requested-With', { toString: function() { return ''; } });
			},
			xhr: () => xhr,
			success: (data, textStatus, jqXHR) => {
				jqXHR.responseURL = xhr.responseURL;
				//callback && callback(data, textStatus, jqXHR);
			}
		});
	},
	/**
	 *
	 * @param {string} method
	 * @param {string} path
	 * @param {{}} data
	 * @returns {Promise}
	 */
	ExtensionServer(method, path, data) {
		if (data) {
			data = JSON.stringify(data);
		}

		let messageData = {
			action: "xmlHttpRequest",
			method,
			path,
			data,
			headers: {
				"Content-type": "application/json; charset=utf-8"
			}
		};

		if (System.data.Brainly.userData.extension && System.data.Brainly.userData.extension.secretKey) {
			messageData.headers["SecretKey"] = System.data.Brainly.userData.extension.secretKey;
		}

		return ext.runtime.sendMessage(System.data.meta.extension.id, messageData);
	},
	ExtensionServerAjax2(method, path, data) {
		var deferred = $.Deferred();

		let ajaxData = {
			url: System.data.config.extension.serverAPIURL + path,
			data: data,
			type: method,
			/* success: deferred.resolve,
			error: deferred.reject, */
			xhr: function() {
				let xhr = $.ajaxSettings.xhr();

				xhr.onload = function(a, b, c) {
					console.log(a, b, c, this);
				};
				/* xhr.onerror = deferred.reject;
				xhr.onabort = deferred.reject; */
				//xhr.upload.onprogress = deferred.notify;

				return xhr;
			}
		}

		if (System.data.Brainly.userData.extension && System.data.Brainly.userData.extension.secretKey) {
			ajaxData.headers = { SecretKey: System.data.Brainly.userData.extension.secretKey };
		}

		if (data instanceof FormData) {
			ajaxData.processData = false;
			ajaxData.contentType = false;
		} else {
			ajaxData.data = JSON.stringify(data);
			ajaxData.contentType = "application/json";
		}

		prepareAjax && prepareAjax();
		$.ajax(ajaxData);
		return deferred //.promise();
	},
	ExtensionServerAjax(method, path, data) {
		var deferred = $.Deferred();
		var xhr = new XMLHttpRequest();

		xhr.open(method, System.data.config.extension.serverAPIURL + path);

		if (data instanceof FormData) {
			/* 	xhr.setRequestHeader("Content-Type", "multipart/form-data");
				xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); */
		} else {
			data = JSON.stringify(data);
			xhr.setRequestHeader("Content-Type", "application/json");
		}

		if (System.data.Brainly.userData.extension && System.data.Brainly.userData.extension.secretKey) {
			xhr.setRequestHeader('SecretKey', System.data.Brainly.userData.extension.secretKey);
		}

		xhr.onload = function() {
			if (this.status >= 200 && this.status < 300) {
				let response = xhr.response;

				if (xhr.getResponseHeader('content-type').indexOf("application/json") >= 0) {
					response = JSON.parse(response);
				}

				deferred.resolve(response);
			} else {
				deferred.reject({
					status: this.status,
					statusText: xhr.statusText
				});
			}
		};

		xhr.upload.onprogress = deferred.notify;

		xhr.onerror = deferred.reject;

		xhr.send(data);

		return deferred.promise();
		//});
	}
}
export default Request;
