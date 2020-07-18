// @flow
/* eslint-disable no-underscore-dangle, no-param-reassign, class-methods-use-this */
import locale from "@/locales";
import ServerReq from "@ServerReq";
import cookie from "js-cookie";
// @ts-ignore
import extensionConfig from "../../configs/_/extension.json";
import ArrayLast from "../helpers/ArrayLast";
import storage from "../helpers/extStorage";
import InjectToDOM from "../helpers/InjectToDOM";
import Action from "./Req/Brainly/Action";

type AvatarType = {
  src?: string,
  small?: string,
  medium?: string,
  "64"?: string,
  "100"?: string,
};

type IdType = number | string;

function _ExtractAvatarURL(entry: AvatarType) {
  return entry[64] || entry[100] || entry.src || entry.small || entry.medium;
}

class _System {
  logStyle: string;
  constants: {
    Brainly: {
      regexp_BrainlyMarkets: RegExp,
      brainlyMarkets: string[],
      style_guide: {
        icons: string,
      },
      githubHighlight: string,
      marketRequestLimit: number,
    },
    config: {
      MAX_FILE_SIZE_OF_EVIDENCE: number,
      MAX_FILE_SIZE_OF_EVIDENCE_IN_MB: number,
      RAINBOW_COLORS: string,
      idExtractRegex: RegExp,
      pinIcon: string,
      reasonSign: string,
    },
  };

  data: {
    locale: typeof locale,
    Brainly: {
      apiURL: string,
      nullAvatar: string,
      tokenLong: string,
      Routing: {
        prefix: any,
        routes: any,
      },
      userData: any,
    },
    meta: {
      marketTitle: string,
      extension: {
        id: string,
        URL: string,
      },
      marketName: string,
      location: {
        href: string,
        ancestorOrigins: {},
        origin: string,
        protocol: string,
        host: string,
        hostname: string,
        port: string,
        pathname: string,
        search: string,
        hash: string,
      },
      manifest: {
        URL: string,
        id: string,
      } & browser._manifest.WebExtensionManifest,
      storageKey: string,
    },
    config: {
      extension: {
        serverAPIURL: string,
        serverURL: string,
        shortenedLinkURL: string,
        uploadedFilesURL: string,
        languages: {
          [key: string]: {
            name: string,
            progress: number,
            author?: string,
          },
        },
      },
      ...
    },
  };

  routeMasks: {
    profile: any,
    task: any,
  };

  friends: any[];

  profileLinkRoute: string;

  constructor() {
    this.logStyle = `font-size: 11px;color: #4fb3f6;font-family:century gothic;`;
    const that = this;
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
          icons:
            "https://styleguide.brainly.com/images/icons-dbb19c2ba8.js" +
            "?treat=.ext_js",
        },
        githubHighlight:
          "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/github.min.css",
        marketRequestLimit: 8,
      },
      config: {
        reasonSign: "߷",
        idExtractRegex: /((?:.*?[-/])(?=\d))|(?:[?/].*)|(?:[a-z]{1,})/gi,
        MAX_FILE_SIZE_OF_EVIDENCE_IN_MB: 22,
        MAX_FILE_SIZE_OF_EVIDENCE: 22 * 1024 * 1024,
        RAINBOW_COLORS: "#F15A5A,#F0C419,#4EBA6F,#2D95BF,#955BA5",
        pinIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" class="sg-icon sg-icon--gray sg-icon--x{size}"><path d="M18.266 4.3l-9.192 9.192 5.237 5.237c.357-1.2.484-2.486.28-3.68l5.657-5.657c.86.01 1.8-.2 2.638-.473L18.266 4.3z" fill="#c0392b"></path><path d="M9.074 13.483L3.417 19.14 2.7 21.26l7.07-7.07-.707-.707z" fill="#bdc3c7"></path><path d="M9.78 14.2L2.7 21.26l2.12-.707 5.657-5.657-.707-.707z" fill="#7f8c8d"></path><path d="M15.062 1.086c-.282.85-.484 1.778-.473 2.638L8.932 9.38c-1.195-.205-2.483-.08-3.68.278l4.53 4.53 9.192-9.192-3.91-3.91z" fill="#e74c3c"></path></svg>`,
      },
    };
    this.data = {
      Brainly: {
        get apiURL() {
          return `${
            that.data.meta.location.origin || document.location.origin
          }/api/28`;
        },
        nullAvatar: `/img/avatars/100-ON.png`,
        tokenLong: cookie.get("Zadanepl_cookie[Token][Long]"),
        Routing: {
          prefix: undefined,
          routes: undefined,
        },
        userData: undefined,
      },
      meta: {},
      locale,
      config: {
        extension: extensionConfig,
      },
    };
    this.routeMasks = {
      profile: null,
      task: null,
    };
    this.friends = [];

    console.log(`%cSystem library initialized`, this.logStyle);
  }

  Log(...args: any) {
    const isContainsObject = args.filter(
      arg => typeof arg !== "string" || typeof arg !== "number",
    );

    if (!isContainsObject) console.log(`%c${args.join(" ")}`, this.logStyle);
    else
      args.forEach(arg => {
        if (typeof arg === "string" || typeof arg === "number")
          console.log(`%c${arg}`, this.logStyle);
        else console.log(arg);
      });
  }

  Delay(milliseconds: number = this.randomNumber(1000, 4000)): Promise<number> {
    return new Promise(resolve =>
      setTimeout(() => resolve(milliseconds), milliseconds),
    );
  }

  TestDelay(min: number = 100, max: number = 500) {
    return this.Delay(this.randomNumber(min, max));
  }

  randomNumber(min: number = 0, max: number = 10) {
    if (min > max) [min, max] = [max, min];

    return Math.floor(Math.random() * ++max + min);
  }

  pageLoaded(loadMessage: string) {
    this.Log(loadMessage);
    this.Log(
      // @ts-ignore
      `Brainly Tools loaded in ${Number(
        (performance.now() - window.performanceStartTiming).toFixed(2),
      )} milliseconds`,
    );
  }

  checkRoute(index: number, str: string) {
    const currPath: string[] = this.data.meta.location.pathname.split("/");
    let result = false;

    if (currPath.length >= 2) {
      if (typeof str === "undefined") {
        console.log("str is undefined, check please");
        result = currPath[index];
      } else if ((currPath[index] || "") === str) {
        result = true;
      } else {
        const route =
          this.data.Brainly.Routing.routes[str] ||
          this.data.Brainly.Routing.routes[
            this.data.Brainly.Routing.prefix + str
          ];

        if (route) {
          let { tokens } = route;

          if (!tokens) console.error("Route tokens not found");
          else {
            for (
              let i = 0;
              i < tokens.length && typeof tokens !== "string";
              i++
            )
              tokens = tokens[tokens.length - 1];
            if (!tokens) console.error("Route tokens not found");
            else if (tokens === `/${currPath[index]}`) {
              result = true;
            }
          }
        }
      }
    }
    return result;
  }

  toBackground(action: string, data?: any) {
    const messageData = {
      action,
      marketName: this.data.meta.marketName,
      data,
    };

    return new Promise<void>((resolve, reject) => {
      try {
        window.chrome.runtime.sendMessage(
          this.data.meta.extension && this.data.meta.extension.id,
          messageData,
          resolve,
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async ShareSystemDataToBackground() {
    const res = await this.toBackground("setMarketData", this.data);

    if (!res) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: "I couldn't share the System data variable to background",
        res,
      };
    }

    this.Log("Data shared with background OK!");

    return Promise.resolve();
  }

  enableExtensionIcon() {
    this.toBackground("enableExtensionIcon");
  }

  changeBadgeColor(status: string) {
    this.toBackground("changeBadgeColor", status);
  }

  prepareAvatar(
    user: { avatar?: AvatarType, avatars?: AvatarType } & AvatarType,
    {
      returnIcon,
      noOrigin,
      replaceOrigin,
    }: { returnIcon: boolean, noOrigin: boolean, replaceOrigin: string } = {},
  ): string {
    let avatar = "";

    if (user) {
      if (user.avatar) {
        avatar =
          user.avatar[64] ||
          user.avatar[100] ||
          user.avatar.src ||
          user.avatar.small ||
          user.avatar.medium;
      }

      if (user.avatars) {
        avatar =
          user.avatars[64] ||
          user.avatars[100] ||
          user.avatars.src ||
          user.avatars.small ||
          user.avatars.medium;
      }

      if (user[64] || user[100] || user.src || user.small || user.medium)
        avatar = user[64] || user[100] || user.src || user.small || user.medium;
    }

    if (avatar && returnIcon) {
      avatar = `<img class="sg-avatar__image sg-avatar__image--icon" src="${avatar}">`;
    } else if (!avatar) {
      if (returnIcon)
        avatar = `<div class="sg-icon sg-icon--gray-secondary sg-icon--x32">
					<svg class="sg-icon__svg">
						<use xlink:href="#icon-profile"></use>
					</svg>
				</div>`;
      else {
        if (replaceOrigin) avatar = `https://${replaceOrigin}`;
        else if (!noOrigin) avatar = `https://${this.data.meta.marketName}`;

        if (avatar !== undefined) avatar += this.data.Brainly.nullAvatar;
        else avatar = "";
      }
    }

    return avatar;
  }

  ExtractAvatarURL(
    entry: { avatar?: AvatarType, avatars?: AvatarType } & AvatarType,
  ) {
    let avatarURL = "";

    if (entry) {
      avatarURL = _ExtractAvatarURL(entry);

      if (!avatarURL && entry.avatar)
        avatarURL = _ExtractAvatarURL(entry.avatar);

      if (!avatarURL && entry.avatars)
        avatarURL = _ExtractAvatarURL(entry.avatars);
    }

    return avatarURL;
  }

  createProfileLink(
    id: IdType | { id?: IdType, brainlyID?: IdType, nick?: string },
    nick?: string = "a",
    noOrigin?: boolean,
  ) {
    let origin = "";

    if (id instanceof Object && id.nick) {
      nick = id.nick;
      id = id.id || id.brainlyID;
    }

    if (!nick && !id) {
      nick = this.data.Brainly.userData.user.nick;
      id = this.data.Brainly.userData.user.id;
    }

    if (isNaN(Number(id)))
      try {
        id = this.DecryptId(String(id));
      } catch (error) {
        //
      }

    if (!this.profileLinkRoute)
      this.profileLinkRoute = ArrayLast(
        ArrayLast(
          this.data.Brainly.Routing.routes[
            `${this.data.Brainly.Routing.prefix}user_profile`
          ].tokens,
        ),
      );

    if (!noOrigin) {
      origin = this.data.meta.location.origin;
    }

    if (this.profileLinkRoute && id)
      return `${origin + this.profileLinkRoute}/${nick}-${String(id)}`;

    return "";
  }

  createBrainlyLink(
    type: "profile" | "question",
    data?: { id?: IdType, brainlyID: IdType, nick: string },
  ) {
    let _return = "";

    if (type === "profile") {
      if (!this.routeMasks.profile)
        this.routeMasks.profile = ArrayLast(
          ArrayLast(
            this.data.Brainly.Routing.routes[
              `${this.data.Brainly.Routing.prefix}user_profile`
            ].tokens,
          ),
        );

      if (this.routeMasks.profile && data?.nick) {
        /* console.log(System.data.meta.location.origin);
        console.log(this.routeMasks.profile);
        console.log(data.nick);
        console.log((data.id || data.brainlyID)); */
        _return = `${
          this.data.meta.location.origin + this.routeMasks.profile
        }/${data.nick}-${data.id || data.brainlyID}`;
      } else _return = "";
    }
    if (type === "question") {
      if (!this.routeMasks.task) {
        this.routeMasks.task = ArrayLast(
          ArrayLast(
            this.data.Brainly.Routing.routes[
              `${this.data.Brainly.Routing.prefix}task_view`
            ].tokens,
          ),
        );
      }

      if (this.routeMasks.task && (data?.id || data?.brainlyID))
        _return = `${this.data.meta.location.origin + this.routeMasks.task}/${
          data.id || data.brainlyID
        }`;
      else _return = "";
    }

    return _return;
  }

  checkBrainlyP(p: number | number[]) {
    let r = !1;

    if (typeof p === "number") {
      if (this.data.Brainly.userData.privileges.includes(p)) r = !0;
    } else if (p instanceof Array) {
      p.forEach(n => {
        if (this.data.Brainly.userData.privileges.includes(n)) r = !0;
      });
    }

    return r;
  }

  checkUserP(p: number | number[], exc0?: boolean) {
    let r = !1;

    if (!exc0 && this.data.Brainly.userData._hash.includes(0)) r = !0;
    else if (p instanceof Array)
      p.forEach(n => {
        if (this.data.Brainly.userData._hash.includes(n)) r = !0;
      });
    else if (this.data.Brainly.userData._hash.includes(p)) r = !0;

    return r;
    /* eval(function(p, a, c, k, e, d) {
    	e = function(c) { return c };
    	if (!''.replace(/^/, String)) {
    		while (c--) { d[c] = k[c] || c } k = [function(e) { return d[e] }];
    		e = function() { return '\\w+' };
    		c = 1
    	};
    	while (c--) { if (k[c]) { p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]) } }
    	return p
    }('4.3.2.5.6.7(8)>-1&&(0&&0());', 9, 9, 'c||Brainly|data|System|userData|_hash|indexOf|p'.split('|'), 0, {})) */
  }

  async log(type: number, log: any) {
    if (
      log &&
      log.user &&
      (!(log.user.nick || log.user._nick) ||
        !log.user.id ||
        ~~log.user.id !== 0)
    ) {
      const user = await new Action().GetUserProfile(log.user.id);
      log.user.nick = user.data.nick;
      log.user.id = user.data.id;
    }

    new ServerReq().Logger(type, log);
  }

  async updateExtension() {
    const status = await this.toBackground("updateExtension");

    if (status === "update_available") {
      console.warn("update pending...");
    } else if (status === "no_update") {
      console.warn("no update found");
    } else if (status === "throttled") {
      console.warn("Asking too frequently. It's throttled");
    }
  }

  async PrepareLanguageFile(langName: string): Promise<boolean> {
    if (langName.match(/\ben[-_](?:us|au|ca|in|nz|gb|za)|en\b/i))
      langName = "en_US";

    try {
      const data = await InjectToDOM(`/locales/${langName}.json`);

      return data;
    } catch (error) {
      if (langName === "en_US")
        throw Error("Cannot find the default language file of extension");

      // eslint-disable-next-line no-console
      console.warn("Missing language file, switching to default language");
      return this.PrepareLanguageFile("en_US");
    }
  }

  canBeWarned(reasonID) {
    let isIt = false;
    const preference = this.data.Brainly.deleteReasons.__preferences.find(
      pref => pref.reasonID === reasonID,
    );

    if (preference && preference.confirmation != null) {
      if (preference.confirmation) {
        isIt = confirm(
          `\n\n${this.data.locale.common.notificationMessages.mayRequireWarning}\n\n`,
        );
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
    if (!value) return NaN;

    const extractId = value.replace(this.constants.config.idExtractRegex, "");
    // Number because returns 0 if is not contains number
    const id = Number(extractId);

    return id;
  }

  /**
   * @param {string | string[]} list
   * @param {boolean} [uniqueNumbers]
   */
  ExtractIds(list, uniqueNumbers) {
    /**
     * @type {number[]}
     */
    let idList = [];

    if (typeof list === "string") {
      list = list
        .replace(this.constants.config.idExtractRegex, "")
        .split(/\r\n|\n/g);
    }

    if (list instanceof Array && list.length > 0) {
      if (!uniqueNumbers) idList = list.map(Number);
      else
        list.forEach(strId => {
          if (strId !== "") {
            const id = Number(strId);

            if (!idList.includes(id)) idList.push(id);
          }
        });
    }

    return idList;
  }

  DecryptId(id = "") {
    if (!id) return NaN;

    const data = atob(id);

    return Number(data.replace(/.*:/, ""));
  }

  SetUserData(data) {
    storage("setL", { authData: data });

    this.SetUserDataToSystem(data);
  }

  SetUserDataToSystem(data) {
    this.data.Brainly.userData.extension = data;
    this.data.Brainly.userData._hash = data.hash;
  }

  OpenExtensionOptions(params) {
    this.toBackground("OpenExtensionOptions", params);
  }

  /**
   * @param {number[]} users
   * @param {{each?: function, done?: function}} handlers
   */
  async StoreUsers(users, handlers) {
    if (typeof users === "string") users = this.ParseUsers(users);

    if (users && users instanceof Array && users.length > 0) {
      const resUsers = await new Action().GetUsers(users);
      this.allModerators = {
        list: resUsers.data,
        withNicks: {},
        withID: {},
        withRanks: {},
      };

      if (resUsers.data && resUsers.data.length > 0) {
        resUsers.data.forEach(user => {
          this.allModerators.withNicks[user.nick] = user;
          this.allModerators.withID[user.id] = user;

          if (handlers && handlers.each) handlers.each(user);

          if (user.ranks_ids && user.ranks_ids.length > 0) {
            user.ranks_ids.forEach(rank => {
              let currentRank = this.allModerators.withRanks[rank];

              if (!currentRank) {
                currentRank = [];
                this.allModerators.withRanks[rank] = currentRank;
              }

              currentRank.push(user);
            });
          }
        });
      }

      if (handlers.done) handlers.done(this.allModerators);
    }
  }

  /**
   * @param {string} html
   */
  ParseUsers(html) {
    let ids = [];
    const matchResult = html.match(/=\d{1,}/gim);

    if (matchResult && matchResult.length > 0)
      ids = matchResult.map(id => ~~id.replace(/\D/gim, ""));

    return ids;
  }

  /**
   * @param {{
   *  id?: number | string,
   *  name?: string,
   *  type: "question" | "answer" | "comment",
   *  noRandom?: boolean
   * }} param0
   */
  DeleteReason({ id, name, type, noRandom }) {
    if (!type) throw Error("Content type needed");

    if (!id && !name) throw Error("Please specify an id or name");

    if (id && name) throw Error("You can't specify both id and name fields");

    const { deleteReasons } = System.data.Brainly;
    let reasonGroup;

    if (id) reasonGroup = deleteReasons.__withIds;

    if (name) reasonGroup = deleteReasons.__withTitles;

    const reasons = reasonGroup[type];

    if (!reasons) throw Error("Unknown content type");

    const reasonKey = id || name;
    let reason = reasons[reasonKey];

    if (!reason) {
      if (noRandom) throw Error(`Can't find a reason entry with: ${reasonKey}`);
      else {
        const reasonKeys = Object.keys(reasons).filter(
          key => !key.includes("__"),
        );

        if (reasonKeys.length === 0)
          throw Error(`Market doesn't have any delete reasons for ${type}`);

        const randomN = Math.floor(Math.random() * reasonKeys.length);
        reason = reasons[reasonKeys[randomN]];
      }
    }

    return reason;
  }
}

export default _System;
