"use strict";

import cookie from "js-cookie";
import extensionConfig from "../../config/_/extension.json";
import ArrayLast from "../helpers/ArrayLast";
import storage from "../helpers/extStorage";
import InjectToDOM from "../helpers/InjectToDOM";
import ext from "../utils/ext";
import { GetUserByID } from "./ActionsOfBrainly";
import { Logger } from "./ActionsOfServer";

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
          css: `https://styleguide.brainly.com/${extensionConfig.STYLE_GUIDE_VERSION}/style-guide.css` + "?treat=.ext_css",
          icons: "https://styleguide.brainly.com/images/icons-1b40deaa8d.js" + "?treat=.ext_js"
        },
        githubHighlight: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/github.min.css",
      },
      config: {
        reasonSign: "Ω",
        idExtractRegex: /((?:.*[-|\/|a-z])(?=\d))|(?:[\/|\?].*)/g,
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
      }

    }
    this.data = {
      Brainly: {
        apiURL: ((window.System && System.data.meta.location.origin) || document.location.origin) + "/api/28",
        get nullAvatar() {
          return `/img/avatars/100-ON.png`;
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
   * @param {number} milliseconds - Specify delay in milliseconds
   */
  Delay(milliseconds = System.randomNumber(1000, 4000)) {
    return new Promise(resolve => setTimeout(() => resolve(milliseconds), milliseconds));
  }
  TestDelay() {
    return this.Delay(System.randomNumber(100, 500))
  }
  randomNumber(min, max) {
    return Math.floor((Math.random() * max) + min);
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
  toBackground(action, data) {
    let messageData = {
      action,
      marketName: System.data.meta.marketName,
      data
    };

    if (System.data.meta.extension && System.data.meta.extension.id) {
      return ext.runtime.sendMessage(System.data.meta.extension.id, messageData);
    } else {
      return ext.runtime.sendMessage(messageData);
    }
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
  prepareAvatar(user, { returnIcon, noOrigin, replaceOrigin } = {}) {
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

    if (avatar && returnIcon) {
      avatar = `<img class="sg-avatar__image sg-avatar__image--icon" src="${avatar}">`;
    } else if (!avatar) {
      if (returnIcon)
        avatar =
        `<div class="sg-icon sg-icon--gray-secondary sg-icon--x32">
					<svg class="sg-icon__svg">
						<use xlink:href="#icon-profile"></use>
					</svg>
				</div>`
      else {
        if (replaceOrigin)
          avatar = `https://${replaceOrigin}`;
        else if (!noOrigin)
          avatar = `https://${System.data.meta.marketName}`;

        avatar += System.data.Brainly.nullAvatar
      }
    }

    return avatar;
  }
  /**
   * @param {string} nick
   * @param {number|string} id
   * @param {boolean} noOrigin
   */
  createProfileLink(nick, id, noOrigin) {
    let origin = "";

    if (Object.prototype.toString.call(nick) == "[object Object]") {
      id = nick.id;
      nick = nick.nick;
    }

    if (!nick && !id) {
      nick = System.data.Brainly.userData.user.nick
      id = System.data.Brainly.userData.user.id
    }

    if (!this.profileLinkRoute)
      this.profileLinkRoute = ArrayLast(ArrayLast(System.data.Brainly.Routing.routes[System.data.Brainly.Routing.prefix + "user_profile"].tokens));

    if (!noOrigin) {
      origin = System.data.meta.location.origin;
    }

    if (this.profileLinkRoute) {
      return origin + this.profileLinkRoute + "/" + nick + "-" + id;
    } else
      return "";
  }
  createBrainlyLink(type, data) {
    let _return = "";

    if (type === "profile") {
      if (!this.routeMasks.profile)
        this.routeMasks.profile = ArrayLast(ArrayLast(System.data.Brainly.Routing.routes[System.data.Brainly.Routing.prefix + "user_profile"].tokens));

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
        this.routeMasks.task = ArrayLast(ArrayLast(System.data.Brainly.Routing.routes[System.data.Brainly.Routing.prefix + "task_view"].tokens));
      }

      if (this.routeMasks.task)
        _return = System.data.meta.location.origin + this.routeMasks.task + "/" + (data.id || data.brainlyID);
      else
        _return = "";
    }

    return _return;
  }
  checkBrainlyP(p) {
    let r = !1;

    if (typeof p == "number") {
      System.data.Brainly.userData.privileges.includes(p) && (r = !0);
    } else if (p instanceof Array) {
      p.forEach(n => {
        System.data.Brainly.userData.privileges.includes(n) && (r = !0);
      });
    }

    return r;
  }
  checkUserP(p) {
    let r = !1;

    if (System.data.Brainly.userData._hash.includes(0))
      r = !0;
    else {
      if (typeof p == "number") {
        System.data.Brainly.userData._hash.includes(p) && (r = !0);
      } else {
        p.forEach(n => {
          System.data.Brainly.userData._hash.includes(n) && (r = !0);
        });
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
  async log(type, log) {
    if (
      log &&
      log.user &&
      (
        !(
          log.user.nick ||
          log.user._nick
        ) ||

        !log.user.id ||
        ~~log.user.id != 0
      )
    ) {
      let user = await GetUserByID(log.user.id);
      log.user.nick = user.data.nick;
      log.user.id = user.data.id;
    }

    Logger(type, log);
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
      } //else if (language.indexOf("-")) { language = language.replace(/[-_].*/, ""); }

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

    if (preference && preference.confirmation != null) {
      if (preference.confirmation) {
        isIt = confirm(`\n\n${System.data.locale.common.notificationMessages.mayRequireWarning}\n\n`);
      } else {
        isIt = true;
      }
    }

    return isIt;
  }
  /**
   * @param {string} value
   * @returns {number}
   */
  ExtractId(value) {
    let extractId = value.replace(System.constants.config.idExtractRegex, "");
    // Number because returns 0 if is not contains number
    let id = Number(extractId);

    if (id)
      return id;
  }
  /**
   * @param {string|[]} list
   * @returns {[]}
   */
  ExtractIds(list) {
    if (typeof list == "string") {
      list = list.split(/\r\n|\n/g);
    }

    return list
      .filter(Boolean)
      .map(System.ExtractId)
      .filter(Boolean);
  }
  SetUserData(data) {
    storage("setL", { authData: data });

    this.SetUserDataToSystem(data);
  }
  SetUserDataToSystem(data) {
    System.data.Brainly.userData.extension = data;
    System.data.Brainly.userData._hash = data.hash;
  }
  OpenExtensionOptions(params) {
    this.toBackground("OpenExtensionOptions", params)
  }
}
export default _System;
