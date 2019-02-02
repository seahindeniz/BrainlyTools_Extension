"use strict";

import ext from "../utils/ext";
import cookie from "js-cookie";
import { Logger } from "./ActionsOfServer";
import { getUserByID } from "./ActionsOfBrainly";
import InjectToDOM from "../helpers/InjectToDOM";
import extensionConfig from "../../config/_/extension.json";

class _System {
	constructor() {
		this.constants = {
			Brainly: {
				regexp_BrainlyMarkets: /:\/\/(?:www\.)?((?:eodev|znanija)\.com|nosdevoirs\.fr|brainly(?:(?:\.(?:com(?:\.br|[^.])|co\.(?:id)|lat|in|ph|ro|pl))))/i,
				brainlyMarkets: [
					"brainly.com",
					"eodev.com",
					"brainly.pl",
					"brainly.com.br",
					"brainly.co.id",
					"znanija.com",
					"brainly.lat",
					"brainly.in",
					"brainly.ph",
					"nosdevoirs.fr",
					"brainly.ro",
				],
				style_guide: {
					css: `https://styleguide.brainly.co.id/${extensionConfig.STYLE_GUIDE_VERSION}/style-guide.css` + "?treat=.ext_css",
					icons: "https://styleguide.brainly.com/images/icons-1b40deaa8d.js" + "?treat=.ext_js"
				}
			},
			config: {
				reasonSign: "Ω",
				idExtractRegex: /.*-/g,
				MAX_FILE_SIZE_OF_EVIDENCE_IN_MB: 22,
				get MAX_FILE_SIZE_OF_EVIDENCE() {
					return window.System.constants.config.MAX_FILE_SIZE_OF_EVIDENCE_IN_MB * 1024 * 1024;
				},
				RAINBOW_COLORS: "#F15A5A,#F0C419,#4EBA6F,#2D95BF,#955BA5",
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
				}
			},
			meta: {},
			locale: {},
			config: {
				extension: extensionConfig
			}
		}
		this.routeMasks = {
			profile: null,
			task: null
		};

		console.log("System library initalized");
	}
	/**
	 *
	 * @param {number} milliseconds - Specify delay in milliseconds
	 */
	delay(milliseconds) {
		return new Promise((resolve) => setTimeout(resolve, milliseconds));
	}
	/* log(){
		console.log.apply()
	} */
	randomNumber(min, max) {
		return Math.floor((Math.random() * max) + min);
	}
	pageLoaded(loadMessage) {
		Console.log(loadMessage);
		Console.log("Brainly Tools loaded in", Number((performance.now() - window.performanceStartTiming).toFixed(2)), "milliseconds");
		document.documentElement.setAttribute("extension", System.data.meta.manifest.version);
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
	toBackground(action, data) {
		let messageData = {
			action,
			data
		};

		return ext.runtime.sendMessage(System.data.meta.extension.id, messageData);
	}
	ShareSystemDataToBackground() {
		return new Promise(async (resolve, reject) => {
			let res = await this.toBackground("setMarketData", System.data);

			if (!res) {
				reject({ message: "I couldn't share the System data variable to background", res });
			} else {
				console.log("Data shared with background OK!");
				resolve();
			}
		});
	}
	enableExtensionIcon() {
		this.toBackground("enableExtensionIcon")
	}
	changeBadgeColor(status) {
		this.toBackground("changeBadgeColor", status)
	}
	/**
	 * @param {string} nick
	 * @param {number|string} id
	 * @param {boolean} noOrigin
	 */
	createProfileLink(nick, id, noOrigin) {
		let origin = "";

		if (!nick && !id) {
			nick = System.data.Brainly.userData.user.nick
			id = System.data.Brainly.userData.user.id
		}

		if (!this.profileLinkRoute) {
			this.profileLinkRoute = (System.data.Brainly.Routing.routes[System.data.Brainly.Routing.prefix + "user_profile"]).tokens.slice().pop().pop();
		}

		if (!noOrigin) {
			origin = System.data.meta.location.origin;
		}

		if (this.profileLinkRoute) {
			return origin + this.profileLinkRoute + "/" + nick + "-" + id;
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
	checkBrainlyP(p, c) {
		let r = !1;

		if (System.data.Brainly.userData.privileges.indexOf(p) >= 0) {
			c && c();

			r = !0;
		}

		return r;
	}
	checkUserP(p, c) {
		let r = !1;

		if (System.data.Brainly.userData._hash.indexOf(0) > -1) {
			c && c();

			r = !0;
		} else {
			if (typeof p == "number") {
				System.data.Brainly.userData._hash.indexOf(p) > -1 && (c && c(), r = !0);
			} else {
				p.forEach(n => {
					System.data.Brainly.userData._hash.indexOf(n) > -1 && (r = !0);
				});
				r && (c && c());
			}
		}

		return r;
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
	async log(type, targetUser, data) {
		if (typeof targetUser == "string" || typeof targetUser == "number" ||
			!(targetUser.nick || targetUser._nick) || (targetUser.nick || targetUser._nick) == "" ||
			!targetUser.id || targetUser.id == "" || !(~~targetUser.id > 0)) {
			let user = await getUserByID(targetUser);

			Logger(type, { id: user.data.id, nick: user.data.nick }, data);
		} else {
			Logger(type, { id: targetUser.id, nick: (targetUser.nick || targetUser._nick) }, data);
		}
	}
	async updateExtension() {
		let status = await this.toBackground("updateExtension");

		if (status == "update_available") {
			console.warn("update pending...");
		} else if (status == "no_update") {
			console.warn("no update found");
		} else if (status == "throttled") {
			console.warn("Asking too frequently. It's throttled");
		}
	}
	prepareLangFile(language, _resolve) {
		return new Promise(async (resolve, reject) => {
			resolve = _resolve || resolve;

			if (language.match(/\ben[-_](?:us|au|ca|in|nz|gb|za)|en\b/i)) {
				language = "en_US";
			} else if (language.indexOf("-")) {
				language = language.replace(/[-_].*/, "");
			}

			try {
				let fileType = "json";
				let localeData = await InjectToDOM(`/locales/${language}.${fileType}`);

				resolve(localeData);
			} catch (error) {
				if (language != "en_US") {
					this.prepareLangFile("en_US", resolve);
				} else {
					reject("Cannot find the default language file for extension");
				}
			}

			/* if (fileType == "yml") {
				localeData = yaml.load(localeData);
			} */

		});
	}
	canBeWarned(reasonID) {
		let isIt = false;
		let preference = System.data.Brainly.deleteReasons.__preferences.find(pref => pref.reasonID == reasonID);

		if (preference && preference.confirmation) {
			isIt = confirm(`\n\n${System.data.locale.common.notificationMessages.mayRequireWarning}\n\n`);
		}

		return isIt;
	}
	ExtractId(value) {
		let extractId = value.replace(System.constants.config.idExtractRegex, "");
		let id = parseInt(extractId);

		return id;
	}
	ExtractIds(list) {
		return list
			.split(/\r\n|\n/g)
			.filter(Boolean)
			.map(System.ExtractId);
	}
}
export default _System;
