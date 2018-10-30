"use strict";

import ext from "../utils/ext";
import WaitForFn from "../helpers/WaitForFn";
import Notification from "../components/Notification";
import cookie from "js-cookie";
import { Logger } from "./ActionsOfServer";
import { getUserByID } from "./ActionsOfBrainly";
import Inject2body from "../helpers/Inject2body";
import yaml from "js-yaml";

class _System {
	constructor() {
		this.data = {
			Brainly: {
				apiURL: ((window.System && System.data.meta.location.origin) || document.location.origin) + "/api/28",
				get nullAvatar() {
					return `https://${System.data.meta.marketName}/img/avatars/100-ON.png`;
				},
				tokenLong: cookie.get("Zadanepl_cookie[Token][Long]"),
				Routing: {
					prefix: undefined,
					routes: undefined
				},
				style_guide: {
					css: "https://styleguide.brainly.co.id/142.0.0/style-guide.css" + "?treat=.ext_css",
					icons: "https://styleguide.brainly.com/images/icons-1b40deaa8d.js" + "?treat=.ext_js"
				}
			},
			meta: {},
			locale: {},
			config: {
				reasonSign: "Ω",
				extensionServerURL: "https://sahin.in",
				extensionServerAPIURL: "https://sahin.in/BrainlyTools",
				/* extensionServerURL: "http://127.0.0.1:3001",
				extensionServerAPIURL: "http://127.0.0.1:3001/BrainlyTools", */
				availableLanguages: [{
						key: "en_US",
						title: "English"
					},
					{
						key: "id",
						title: `Bahasa Indonesia <span class="is-pulled-right">Zuhh</span>`
					},
					{
						key: "fr",
						title: `Français <span class="is-pulled-right">MichaelS</span>`
					},
					{
						key: "tr",
						title: "Türkçe"
					}
				],
				pinIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" class="sg-icon sg-icon--gray sg-icon--x{size}"><path d="M18.266 4.3l-9.192 9.192 5.237 5.237c.357-1.2.484-2.486.28-3.68l5.657-5.657c.86.01 1.8-.2 2.638-.473L18.266 4.3z" fill="#c0392b"></path><path d="M9.074 13.483L3.417 19.14 2.7 21.26l7.07-7.07-.707-.707z" fill="#bdc3c7"></path><path d="M9.78 14.2L2.7 21.26l2.12-.707 5.657-5.657-.707-.707z" fill="#7f8c8d"></path><path d="M15.062 1.086c-.282.85-.484 1.778-.473 2.638L8.932 9.38c-1.195-.205-2.483-.08-3.68.278l4.53 4.53 9.192-9.192-3.91-3.91z" fill="#e74c3c"></path></svg>`,
				userFlags: {
					list: [{
							file: `/images/hats/hat_0.svg`,
							css: "top: -8px;left: 15px;transform: rotate(-28deg);"

						},
						{
							file: `/images/hats/hat_1.svg`,
							css: {
								img: "top: -10px;left: 37px;transform: rotate(-7deg);"
							}
						},
						{
							file: `/images/hats/hat_2.svg`,
							css: "top: -6px; transform: rotate(-26deg); "

						},
						{
							file: `/images/hats/hat_3.svg`,
							css: "width: 44px;top: -9px;left: 21px;"

						},
						{
							file: `/images/hats/hat_4.svg`,
							css: {
								img: "top: -8px;left: 75px;transform: rotate(25deg);"
							}
						},
						{
							file: `/images/hats/hat_5.svg`,
							css: ""

						},
						{
							file: `/images/hats/hat_6.svg`,
							css: "top: -6px;left: 40px;width: 65px;transform: rotate(-7deg);"

						},
						{
							file: `/images/hats/hat_7.svg`,
							css: "top: -2px; left:33px;width: 50px;transform: rotate(26deg);"

						},
						{
							file: `/images/hats/hat_8.svg`,
							css: "top: -12px; left: 16px; width: 70px; transform: rotate(5deg);"

						},
						{
							file: `/images/hats/hat_9.png`,
							css: "top: -25px; left: 30px; width: 70px; transform: rotate(-6deg);"

						},
					],
					0: [0, 8, 9],
					1: [1, 2, 4],
					2: [3, 5, 6, 7]
				}
			}
		}
		this.routeMasks = {
			profile: null,
			task: null
		};
		this.regexp_BrainlyMarkets = /:\/\/(?:www\.)?((?:eodev|znanija)\.com|zadane\.pl|nosdevoirs\.fr|brainly(?:(?:\-thailand\.com)|(?:\.(?:com+(?:\.br|\.ng|)|co\.(?:id|za)|lat|in|my|ph|ro))))/i
	}
	init() {
		console.log("System initalized");
	}
	randomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	pageLoaded(loadMessage) {
		Console.log(loadMessage);
		Console.log("Brainly Tools loaded in", Number((performance.now() - window.performanceStartTiming).toFixed(2)), "milliseconds");
	}
	checkRoute(index, str) {
		let curr_path = System.data.meta.location.pathname.split("/"),
			result = false;
		if (curr_path.length >= 2) {
			if (typeof str == "undefined") {
				Console.log("str is undefined, check please");
				result = curr_path[index];
			} else if ((curr_path[index] || "") == str) {
				result = true;
			} else {
				let route = System.data.Brainly.Routing.routes[str] || System.data.Brainly.Routing.routes[System.data.Brainly.Routing.prefix + str];
				if (route) {
					let tokens = route.tokens;
					if (!tokens)
						Console.error("Route tokens not found");
					else {
						for (let i = 0;
							(i < tokens.length && typeof tokens != "string"); i++)
							tokens = tokens[tokens.length - 1];
						if (!tokens)
							Console.error("Route tokens not found");
						else {
							if (tokens == "/" + curr_path[index]) {
								result = true;
							}
						}
					}
				}
			}
		}
		return result;
	}
	shareGatheredData2Background(callback) {
		ext.runtime.sendMessage(System.data.meta.extension.id, { action: "setMarketData", data: System.data }, res => {
			if (!res || res != "done") {
				Console.error("I couldn't share the System data variable to background");
			} else {
				callback && callback();
			}
		})
	}
	enableExtensionIcon() {
		ext.runtime.sendMessage(System.data.meta.extension.id, { action: "enableExtensionIcon" })
	}
	changeBadgeColor(status) {
		ext.runtime.sendMessage(System.data.meta.extension.id, { action: "changeBadgeColor", status })
	}
	createProfileLink(nick, id) {
		if (!this.profileLinkRoute) {
			this.profileLinkRoute = (System.data.Brainly.Routing.routes[System.data.Brainly.Routing.prefix + "user_profile"]).tokens.slice().pop().pop();
		}
		if (this.profileLinkRoute) {
			return System.data.meta.location.origin + this.profileLinkRoute + "/" + nick + "-" + id;
		} else
			return "";
	}
	prepareAvatar(user) {
		let avatar = "";

		if (user) {
			if (user.avatar) {
				avatar = user.avatar[64] || user.avatar[100] || user.avatar.src || user.avatar.small || user.avatar.medium;
			}
			if (user.avatars) {
				avatar = user.avatars[64] || user.avatars[100] || user.avatars.src || user.avatars.small || user.avatars.medium;
			}
			if (user[64] || user[100] || user.src || user.small || user.medium) {
				avatar = user[64] || user[100] || user.src || user.small || user.medium;
			}
		}

		avatar = avatar || System.data.Brainly.nullAvatar;

		return avatar;
	}
	createBrainlyLink(type, data) {
		let _return = "";
		if (type === "profile") {
			if (!this.routeMasks.profile)
				this.routeMasks.profile = (System.data.Brainly.Routing.routes[System.data.Brainly.Routing.prefix + "user_profile"]).tokens.slice().pop().pop();

			if (this.routeMasks.profile) {
				/* console.log(System.data.meta.location.origin);
				console.log(this.routeMasks.profile);
				console.log(data.nick);
				console.log((data.id || data.brainlyID)); */
				_return = System.data.meta.location.origin + this.routeMasks.profile + "/" + data.nick + "-" + (data.id || data.brainlyID);
			} else
				_return = "";
		}
		if (type === "task") {
			if (!this.routeMasks.task) {
				this.routeMasks.task = (System.data.Brainly.Routing.routes[System.data.Brainly.Routing.prefix + "task_view"]).tokens.slice().pop().pop();
			}

			if (this.routeMasks.task)
				_return = System.data.meta.location.origin + this.routeMasks.task + "/" + (data.id || data.brainlyID);
			else
				_return = "";
		}

		return _return;
	}
	checkUserP(p, c) {
		if (System.data.Brainly.userData._hash.indexOf(0) > -1) {
			c && c();
		} else {
			if (typeof p == "number") {
				System.data.Brainly.userData._hash.indexOf(p) > -1 && (c && c());
			} else {
				let s = false;
				p.forEach(n => {
					System.data.Brainly.userData._hash.indexOf(n) > -1 && (s = true);
				});
				s && (c && c());
			}
		}
		/*eval(function(p, a, c, k, e, d) {
			e = function(c) { return c };
			if (!''.replace(/^/, String)) {
				while (c--) { d[c] = k[c] || c } k = [function(e) { return d[e] }];
				e = function() { return '\\w+' };
				c = 1
			};
			while (c--) { if (k[c]) { p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]) } }
			return p
		}('4.3.2.5.6.7(8)>-1&&(0&&0());', 9, 9, 'c||Brainly|data|System|userData|_hash|indexOf|p'.split('|'), 0, {}))*/
	}
	log(type, targetUser, data) {
		if (typeof targetUser == "string" || typeof targetUser == "number" ||
			!(targetUser.nick || targetUser._nick) || (targetUser.nick || targetUser._nick) == "" ||
			!targetUser.id || targetUser.id == "" || !(~~targetUser.id > 0)) {
			getUserByID(targetUser, res => {
				Logger(type, { id: res.data.id, nick: res.data.nick }, data);
			});
		} else {
			Logger(type, { id: targetUser.id, nick: (targetUser.nick || targetUser._nick) }, data);
		}
	}
	updateExtension() {
		ext.runtime.sendMessage(System.data.meta.extension.id, { action: "updateExtension" }, status => {
			if (status == "update_available") {
				console.log("update pending...");
			} else if (status == "no_update") {
				console.log("no update found");
			} else if (status == "throttled") {
				console.log("Asking too frequently. It's throttled");
			}
		});
	}
	prepareLangFile(language, callback) {
		Inject2body(`/config/locales/${language}.yml`, localeData => {
			if (Object.prototype.toString.call(localeData) == "[object Error]") {
				if (language != "en_US") {
					this.prepareLangFile("en_US", callback);
				}

				return false;
			}

			localeData = yaml.load(localeData);

			callback && callback(localeData);
		});
	}
}
export default _System;
