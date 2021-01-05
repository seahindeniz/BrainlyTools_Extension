/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle, no-param-reassign, class-methods-use-this */
import Action, { UserType } from "@BrainlyAction";
import type {
  MarketConfigDataType,
  RankDataType,
} from "@BrainlyReq/GetMarketConfig";
import locale from "@root/locales";
import ServerReq from "@ServerReq";
import cookie from "js-cookie";
import extensionConfig from "../configs/_/extension.json";
import ArrayLast from "../helpers/ArrayLast";
import storage from "../helpers/extStorage";
import InjectToDOM from "../helpers/InjectToDOM";

const ROUTES = {
  root: "root",
  profile: "user_profile",
  question: "task_view",
  subject: "subject_dynamic",
};

export type QuickDeleteButtonReasonsType = {
  answer: number[];
  comment: number[];
  question: number[];
};

type AvatarType = {
  src?: string;
  small?: string;
  medium?: string;
  "64"?: string;
  "100"?: string;
};

type IdType = number | string;

export type DeleteReasonType = {
  id: number;
  text: string;
};

export type DeleteReasonSubCategoryType = DeleteReasonType & {
  category_id: number;
  title: string;
};

export type DeleteReasonCategoryType = DeleteReasonType & {
  abuse_category_id: number;
  subcategories: DeleteReasonSubCategoryType[];
};

type ObjectAnyType = {
  [x: string]: any;
};

export type DefaultConfigDataType = {
  MARKET?: string;
  config?: {
    data: MarketConfigDataType & {
      ranksWithId?: {
        [id: number]: RankDataType;
      };
      ranksWithName?: {
        [name: string]: RankDataType;
      };
    };
  };
  locale?: {
    LANGUAGE: string;
    COUNTRY: string;
  };
  comet?: {
    AUTH_HASH: string;
  };
  user?: {
    ME: {
      panel: {
        messages: { count: 0; status: 1 };
        notifications: { count: 0; status: 1 };
        invitations: { count: 121; status: 3 };
      };
      user: {
        id: number;
        nick: string;
        gender: number;
        points: number;
        ranks: { color: string; names: [string]; count: number };
        ranksIds: number[];
        fbId: number;
        activated: string;
        language: string;
        isoLocale: string;
        gradeId: number;
        username: string;
        registrationDatetime: string;
        isDeleted: boolean;
        primaryRankId: number;
        avatarId: number;
        category: number;
        clientType: number;
        modActionsCount: number;
        avatars: {
          "64": string;
          "100": string;
        };
        avatar: string;
        entry: null;
      };
      preferences: {
        stream: {
          subjectIds: [];
          gradeIds: [];
        };
      };
      auth: {
        comet: {
          hash: string;
          authHash: string;
          avatarUrl: string;
        };
      };
      privileges: number[];
      ban: { active: boolean; expires: null };
      tasks: number;
      responses: number;
      comments: number;
      conversationsNotRead: [];
      userCategory: number;
      currentBestAnswers: number;
      subscription: null;
      brainlyPlus: {
        subscription: null;
        trialAllowed: boolean;
      };
    };
  };
};

export type DeleteReasonContentTypeNameType = "answer" | "comment" | "question";

export type MetaDataType = {
  marketTitle?: string;
  extension?: {
    id: string;
    URL: string;
  };
  marketName?: string;
  location?: {
    href: string;
    ancestorOrigins: ObjectAnyType;
    origin: string;
    protocol: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;
  };
  manifest?: {
    URL: string;
    id: string;
  } & browser._manifest.WebExtensionManifest;
  storageKey?: string;
};

export type DeleteReasonPropsType = {
  noRandom?: boolean;
} & (
  | {
      id: number | string;
      name?: never;
      type: DeleteReasonContentTypeNameType;
    }
  | {
      id?: never;
      name: string;
      type: DeleteReasonContentTypeNameType;
    }
);

function _ExtractAvatarURL(entry: AvatarType) {
  return entry[64] || entry[100] || entry.src || entry.small || entry.medium;
}

class _System {
  logStyle: string;
  constants: {
    Brainly: {
      regexp_BrainlyMarkets: RegExp;
      brainlyMarkets: string[];
      githubHighlight: string;
      marketRequestLimit: number;
    };
    config: {
      MAX_FILE_SIZE_OF_EVIDENCE: number;
      MAX_FILE_SIZE_OF_EVIDENCE_IN_MB: number;
      RAINBOW_COLORS: string;
      idExtractRegex: RegExp;
      // TODO replace this with a shadow
      pinIcon: string;
      reasonSign: string;
    };
  };

  data: {
    locale: typeof locale;
    Brainly: {
      apiURL: string;
      nullAvatar: string;
      tokenLong: string;
      Routing: {
        prefix: any;
        routes: any;
      };
      userData: {
        _hash: number[];
        privileges: number[];
        extension: {
          deleteReasonLastModifiedTime: number;
          hash: number[];
          noticeBoard?: boolean;
          previousNicks: string[];
          probatus: boolean;
          secretKey: string;
          newUpdate?: boolean;
          discordServer?: string;
          showDiscordPopup?: boolean;
        };
        user: {
          id: number;
          nick: string;
          gender: number;
          mod_actions_count: number;
        } & {
          [x in "avatar" | "avatars"]: {
            [size in 64 | 100]?: string;
          };
        };
      };
      defaultConfig?: DefaultConfigDataType;
      deleteReasons?: {
        answer: DeleteReasonCategoryType[];
        comment: DeleteReasonCategoryType[];
        question: DeleteReasonCategoryType[];
        __preferences: {
          __id: string;
          confirmation: boolean;
          reasonID: number;
        }[];
        __withIds: {
          __all: {
            [id: number]: {
              type: string;
            };
          };
          __reason: {
            [id: number]: DeleteReasonCategoryType;
          };
          __subReason: {
            [id: number]: DeleteReasonSubCategoryType & {
              type: DeleteReasonContentTypeNameType;
            };
          };
        } & {
          [x in DeleteReasonContentTypeNameType]: {
            __categories: {
              [id: number]: DeleteReasonCategoryType;
            };
          };
        } &
          {
            [x in "__all" | DeleteReasonContentTypeNameType]: {
              [id: number]: DeleteReasonSubCategoryType;
            };
          };
        __withTitles: {
          [x in DeleteReasonContentTypeNameType]: {
            [title: string]: DeleteReasonSubCategoryType;
          };
        };
      };
    };
    meta?: MetaDataType;
    config: {
      extension: typeof extensionConfig;
      marketConfig: ObjectAnyType;
      quickDeleteButtonsReasons?: QuickDeleteButtonReasonsType;
    };
  };

  allModerators?: {
    list: UserType[];
    withNicks: { [nick: string]: UserType };
    withID: { [userId: number]: UserType };
    withRanks: { [rankId: number]: { [id: number]: UserType }[] };
  };

  routeMasks: {
    profile?: string;
    question?: string;
    subject?: string;
  };

  friends: any[];

  profileLinkRoute: string;

  constructor() {
    this.logStyle = `font-size: 11px;color: #4fb3f6;font-family:century gothic;`;
    // eslint-disable-next-line @typescript-eslint/no-this-alias

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
        githubHighlight:
          "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/github.min.css",
        marketRequestLimit: 8,
      },
      config: {
        reasonSign: "߷",
        // https://regex101.com/r/9FfJcD/2
        idExtractRegex: /((?:.*?[-:/"])(?=\d))|(?:[?/"#].*)|(?:[a-z]{1,})|-/gi,
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
            System.data.meta.location.origin || document.location.origin
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
      locale,
      config: {
        extension: extensionConfig,
        marketConfig: {},
      },
      meta: {},
    };
    this.routeMasks = {};
    this.friends = [];

    this.Log(`System library initialized`);
  }

  error(...args: any) {
    this.console("error", ...args);
  }

  Log(...args: any) {
    this.console("log", ...args);
  }

  console(type: "log" | "warn" | "error" | "info", ...args: any[]) {
    const isContainsObject = args.some(
      arg => typeof arg !== "string" && typeof arg !== "number",
    );

    // eslint-disable-next-line no-console
    if (!isContainsObject) console[type](`%c${args.join(" ")}`, this.logStyle);
    else
      args.forEach(arg => {
        if (typeof arg === "string" || typeof arg === "number")
          // eslint-disable-next-line no-console
          console[type](`%c${arg}`, this.logStyle);
        else {
          // eslint-disable-next-line no-console
          console[type](arg);
        }
      });
  }

  Delay(milliseconds: number = this.randomNumber(1000, 4000)): Promise<number> {
    return new Promise(resolve =>
      setTimeout(() => resolve(milliseconds), milliseconds),
    );
  }

  TestDelay(min = 100, max = 500) {
    return this.Delay(this.randomNumber(min, max));
  }

  randomNumber(min = 0, max = 10) {
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

  checkRoute(index: number, str: string | RegExp, pathname?: string) {
    if (!pathname) {
      pathname = this.data.meta.location.pathname;
    }

    const currPath: string[] = pathname.split(/\/|%2F/g);
    let result = false;

    if (currPath.length > 2 && !currPath[0] && !currPath[1]) {
      currPath.shift();
    }

    if (currPath.length >= 2) {
      if (typeof str === "undefined") {
        // console.log("str is undefined, check please");
        // result = currPath[index];
        result = Boolean(currPath[index]);
      } else if ((currPath[index] || "") === str) {
        result = true;
      } else if (str instanceof RegExp) {
        result = str.test(currPath[index]);
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

    return new Promise<any>((resolve, reject) => {
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
    user: { avatar?: AvatarType; avatars?: AvatarType } & AvatarType,
    {
      returnIcon,
      noOrigin,
      replaceOrigin,
    }: {
      returnIcon?: boolean;
      noOrigin?: boolean;
      replaceOrigin?: string;
    } = {},
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
    entry: { avatar?: AvatarType; avatars?: AvatarType } & AvatarType,
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
    id: IdType | { id?: IdType; brainlyID?: IdType; nick?: string },
    nick = "a",
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
    type: keyof typeof ROUTES,
    data?: { id?: IdType; brainlyID?: IdType; nick?: string } | string,
  ) {
    if (type === "root") {
      return `${this.data.meta.location.origin}${data}`;
    }

    if (typeof data !== "object") return undefined;

    let route = this.routeMasks[type];

    if (!route) {
      route = ArrayLast(
        ArrayLast(
          this.data.Brainly.Routing.routes[
            this.data.Brainly.Routing.prefix + ROUTES[type]
          ].tokens,
        ),
      );

      this.routeMasks[type] = route;
    }

    if (type === "profile") {
      if (this.routeMasks.profile && data?.nick) {
        /* console.log(System.data.meta.location.origin);
        console.log(this.routeMasks.profile);
        console.log(data.nick);
        console.log((data.id || data.brainlyID)); */
        return `${this.data.meta.location.origin + this.routeMasks.profile}/${
          data.nick
        }-${data.id || data.brainlyID}`;
      }
    } else if (type === "question") {
      if (this.routeMasks.question && (data?.id || data?.brainlyID))
        return `${this.data.meta.location.origin + this.routeMasks.question}/${
          data.id || data.brainlyID
        }`;
    }

    return "";
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

  async log(type: number, log?: any) {
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

  async PrepareLanguageFile(langName: string): Promise<typeof locale> {
    if (!langName) {
      console.warn("Can't find langName");
    }

    if (!langName || langName.match(/\ben[-_](?:us|au|ca|in|nz|gb|za)|en\b/i))
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

  ExtractId(value: string) {
    if (!value) return NaN;

    const extractId = value.replace(this.constants.config.idExtractRegex, "");

    if (!extractId || extractId?.startsWith("0")) return NaN;

    // Number because returns 0 if is not contains number
    return Number(extractId);
  }

  ExtractIds(list: string | string[], uniqueNumbers?: boolean) {
    let idList: number[] = [];

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

  async StoreUsers(
    users: UserType[],
    handlers?: { each?: (user: any) => void },
  ) {
    this.allModerators = {
      list: users,
      withNicks: {},
      withID: {},
      withRanks: {},
    };

    if (!users?.length) return undefined;

    users.forEach(user => {
      this.allModerators.withNicks[user.nick] = user;
      this.allModerators.withID[user.id] = user;

      if (handlers && handlers.each) handlers.each(user);

      if (!user.ranks_ids.length) return;

      user.ranks_ids.forEach(rank => {
        let currentRank = this.allModerators.withRanks[rank];

        if (!currentRank) {
          currentRank = [];
          this.allModerators.withRanks[rank] = currentRank;
        }

        currentRank.push(user);
      });
    });

    return this.allModerators;
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

  DeleteReason({
    id,
    name,
    type,
    noRandom,
  }: DeleteReasonPropsType): DeleteReasonSubCategoryType {
    if (!id && !name) throw Error("Please specify an id or name");

    if (!type) throw Error("Content type needed");

    if (id && name) throw Error("You can't specify both id and name fields");

    const { deleteReasons } = System.data.Brainly;
    let reasons;

    if (id) {
      reasons = deleteReasons.__withIds[type || "__all"];
    } else if (name) {
      reasons = deleteReasons.__withTitles[type];
    }

    if (!reasons) {
      if (id) throw Error("Unknown delete reason id");

      if (name) throw Error("Unknown delete reason name");
    }

    const reasonKey = id || name;
    let reason: DeleteReasonSubCategoryType = reasons[reasonKey];

    if (!reason) {
      if (noRandom) throw Error(`Can't find a reason entry with: ${reasonKey}`);

      const reasonKeys = Object.keys(reasons).filter(
        key => !key.includes("__"),
      );

      if (reasonKeys.length === 0)
        throw Error(`Market doesn't have any delete reasons for ${type}`);

      const randomN = Math.floor(Math.random() * reasonKeys.length);

      reason = reasons[reasonKeys[randomN]];
    }

    return reason;
  }
}

export default _System;
