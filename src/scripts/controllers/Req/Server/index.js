// @flow

import md5 from "js-md5";
import Request from "..";
import notification from "../../../components/notification2";
import storage from "../../../helpers/extStorage";

/**
 * @typedef {{
 *  success: boolean,
 *  exception?: number,
 *  message?: string,
 * }} CommonResponsePropsType
 *
 * @typedef {{
 *  _id: string,
 *  probatus: boolean,
 *  previousNicks: string[],
 *  privileges?: number[],
 *  note: string,
 *  secretKey: string,
 *  hash: string,
 * }} UserDetailsType
 *
 * @typedef {{[x: string]: *}} QueryStringType
 */

export type ModerateAllPageNumbersType = {
  success?: boolean,
  data?: number[],
};

export default class ServerReq {
  constructor() {
    /**
     * @type {URL}
     */
    this.url = new URL(System.data.config.extension.serverAPIURL);
  }

  /**
   * @param {QueryStringType} [queryString]
   */
  GET(queryString) {
    this.QueryString(queryString);
    return this.BackGate("GET");
  }

  /**
   * @param {{}} [data]
   */
  POST(data) {
    return this.BackGate("POST", data);
  }

  /**
   * @param {{}} [data]
   */
  PUT(data) {
    return this.BackGate("PUT", data);
  }

  /**
   * @param {{}} [data]
   */
  DELETE(data) {
    return this.BackGate("DELETE", data);
  }

  /**
   * @param {QueryStringType} queryString
   */
  QueryString(queryString) {
    if (queryString) {
      const qStrings = Object.entries(queryString);

      if (qStrings.length > 0)
        qStrings.forEach(qString => {
          this.url.searchParams.append(...qString);
        });
    }
  }

  /**
   * @param {string} method
   * @param {{}} [data]
   */
  BackGate(method, data) {
    /* if (data)
      data = JSON.stringify(data); */

    const messageData = {
      method,
      url: this.url.href,
      body: data,
    };

    if (
      System.data.Brainly.userData.extension &&
      System.data.Brainly.userData.extension.secretKey
    )
      messageData.headers = {
        SecretKey: System.data.Brainly.userData.extension.secretKey,
      };

    return System.toBackground("xmlHttpRequest", messageData);
  }

  FrontGate() {
    this.request = new Request();
    this.request.url = new URL(System.data.config.extension.serverAPIURL);
    this.request.headers.SecretKey =
      System.data.Brainly.userData.extension.secretKey;

    return this.request;
  }

  /**
   * @param {string | number} path
   */
  P(path) {
    if (this.url.pathname.endsWith("/") && String(path).startsWith("/"))
      path = String(path).substr(1);
    else if (!this.url.pathname.endsWith("/") && !String(path).startsWith("/"))
      path = `/${path}`;

    this.url.pathname += path;

    return this;
  }

  SetAuthData() {
    return new Promise(async (resolve, reject) => {
      try {
        let authData = await storage("getL", "authData");

        if (!authData || !authData.hash) {
          authData = await this.Auth();

          System.SetUserData(authData);
        } else {
          System.SetUserDataToSystem(authData);
          this.Auth(true).then(System.SetUserData.bind(System));
        }

        System.Log("Auth OK!");
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  Auth(reLogin = false) {
    return new Promise(async (resolve, reject) => {
      const data = {
        // clientID: System.data.meta.manifest.clientID,
        clientVersion: System.data.meta.manifest.version,
        // isoLocale: System.data.Brainly.userData.user.iso_locale,
        marketName: System.data.meta.marketName,
        crypted: md5(System.data.Brainly.tokenLong),
        user: {
          id: System.data.Brainly.userData.user.id,
          nick: System.data.Brainly.userData.user.nick,
        },
      };

      storage("setL", { authData: null });

      const resAuth = await this.auth().POST(data);

      if (!resAuth || !(resAuth instanceof Object) || !resAuth.data) {
        System.changeBadgeColor("error");
        notification({
          type: "error",
          permanent: true,
          html: `${System.data.locale.core.notificationMessages.extensionServerError}<br>${System.data.locale.core.notificationMessages.ifErrorPersists}`,
        });
        reject();
      } else if (!resAuth.data.probatus) {
        System.changeBadgeColor("error");
        notification({
          type: "error",
          permanent: true,
          html: System.data.locale.core.notificationMessages.accessPermissionDenied.replace(
            "\n",
            "<br>",
          ),
        });
        reLogin && location.reload(true);
        reject(
          System.data.locale.core.notificationMessages.accessPermissionDenied,
        );
      } else {
        resAuth.data.hash = JSON.parse(atob(resAuth.data.hash));

        resolve(resAuth.data);
      }
    });
  }

  HelloWorld() {
    return this.helloWorld().GET();
  }

  GetDeleteReasons() {
    return this.deleteReasons()
      .P(System.data.Brainly.userData.extension.deleteReasonLastModifiedTime)
      .GET();
  }

  /**
   * @param {number | {id: number, nick: string}} id
   * @param {string} [nick]
   * @returns {Promise<{data: UserDetailsType} & CommonResponsePropsType>}
   */
  GetUser(id, nick) {
    if (id instanceof Object && id.hasOwnProperty("id")) {
      nick = id.nick;
      id = id.id;
    }

    if (!id || isNaN(Number(id))) throw `Invalid user id: ${id}`;

    if (typeof id === "number") {
      const promise = this.user().P(id).P(nick).GET();

      promise.catch(() =>
        notification({
          type: "error",
          html:
            System.data.locale.common.notificationMessages
              .cannotShareUserInfoWithServer,
        }),
      );

      return promise;
    }
  }

  PutUser(data) {
    return this.user().PUT(data);
  }

  UpdateNote(data) {
    return this.note().PUT(data);
  }

  GetAnnouncements() {
    return this.announcements().GET();
  }

  CreateAnnouncement(data) {
    return this.announcements().POST(data);
  }

  UpdateAnnouncement(data) {
    return this.announcements().PUT(data);
  }

  RemoveAnnouncement(id) {
    return this.announcements().DELETE({ id });
  }

  AnnouncementRead(id) {
    return this.announcement().P(id).PUT();
  }

  CreateShortLink(url) {
    return this.urlshortener().POST({ url });
  }

  Logger(type, log) {
    return this.logger().PUT({ type, log });
  }

  GetUsers() {
    return this.users().GET();
  }

  GetMessageGroups() {
    return this.messageGroups().GET();
  }

  CreateMessageGroup(data) {
    return this.messageGroups().POST(data);
  }

  GetMessages(id) {
    return this.messageGroup().P(id).GET();
  }

  MessageSended(data) {
    return this.messageGroup().POST(data);
  }

  UpdateMessageGroup(id, data) {
    return this.messageGroup().P(id).PUT(data);
  }

  GetModerateAllPages(): Promise<ModerateAllPageNumbersType> {
    return this.moderateAllPages().GET();
  }

  GetDeleteReasonPreferences() {
    return this.deleteReasonsPreferences().GET();
  }

  UpdateDeleteReasonsPreferences(data) {
    return this.deleteReasonsPreferences().PUT(data);
  }

  /**
   * @param {number} id
   */
  RemoveDeleteReasonPreference(id) {
    return this.deleteReasonsPreferences().P(id).DELETE();
  }

  /**
   * @param {FormData} data
   * @param {function(): void} [onUploadProgress]
   */
  AccountDeleteReport(data, onUploadProgress) {
    return this.FrontGate()
      .Axios({ onUploadProgress })
      .P("accountDeleteReport")
      .POST(data);
  }

  GetAccountDeleteReports() {
    return this.accountDeleteReports().GET();
  }

  /**
   * @param {number} filter
   * @param {string} value
   */
  FindDeleteReport(filter, value) {
    return this.accountDeleteReports().P(filter).P(value).GET();
  }

  GetShortenedLinks() {
    return this.urlshortener().GET();
  }

  /**
   * @param {string} value
   */
  FindShortenedLink(value) {
    return this.urlshortener().P(value).GET();
  }

  /**
   * @param {number} privilege
   */
  GivePrivilege(privilege) {
    return this.FrontGate().JSON().P("users").P("give").PUT({ privilege });
  }

  /**
   * @param {number} privilege
   */
  RevokePrivilege(privilege) {
    return this.FrontGate().JSON().P("users").P("revoke").PUT({ privilege });
  }

  GetNoticeBoardContent() {
    return this.noticeBoard().GET();
  }

  /**
   * @param {string} content
   */
  UpdateNoticeBoard(content) {
    return this.noticeBoard().PUT({ content });
  }

  ReadNoticeBoard() {
    return this.noticeBoard().read().PUT();
  }

  /**
   * @param {{each?: function, done?: function}} [handlers]
   */
  GetAllModerators(handlers = {}) {
    return new Promise(async (resolve, reject) => {
      const resSupervisors = await this.moderatorList().GET();

      if (!resSupervisors || !resSupervisors.success)
        return reject("Can't fetch moderators list from extension server");

      handlers = {
        done: resolve,
        ...handlers,
      };

      System.StoreUsers(resSupervisors.data, handlers);
    });
  }

  /**
   * @param {string[]} hashList
   * @param {number} id
   * @param {string} nick
   */
  ActionsHistoryDetails(hashList, id, nick) {
    return this.actionsHistory().details().POST({ hashList, id, nick });
  }

  /**
   * @param {string} _id
   * @param {ReportActionParams} data
   */
  ConfirmActionHistoryEntry(_id, data) {
    return this.ReportActionHistoryEntry("confirm", _id, data);
  }

  /**
   * @param {string} _id
   * @param {ReportActionParams} data
   */
  DisapproveActionHistoryEntry(_id, data) {
    return this.ReportActionHistoryEntry("disapprove", _id, data);
  }

  /**
   * @typedef {{
   *  hashList: string | string[],
   *  actionLink?: string,
   *  content?: string,
   *  questionLink?: string,
   *  message?: string,
   *  moderatorAction?: string,
   *  moderatorActionDate?: string,
   *  contentOwner?: {
   *    nick?: string,
   *    id?: number | string,
   *    link?: string,
   *  }
   * }} ReportActionParams
   * @param {string} action
   * @param {string} _id
   * @param {ReportActionParams} data
   */
  ReportActionHistoryEntry(action, _id, data) {
    if (typeof data.hashList === "string") data.hashList = [data.hashList];

    return this.actionsHistory()[action]().P(_id).PUT(data);
  }

  RevertActionHistoryReport(_id) {
    if (!_id) throw "Id not found";

    return this.actionsHistory().revert().P(_id).PUT();
  }

  /**
   * @param {File | Blob} screenshot
   */
  ActionHistoryEntryImage(screenshot) {
    const formData = new FormData();

    if ("name" in screenshot)
      formData.append("file", screenshot, screenshot.name);

    return this.FrontGate()
      .Axios()
      .P("actionsHistory")
      .P("image")
      .POST(formData);
  }

  ActionHistoryEntryLinks(links) {
    return this.actionsHistory().storeLinks().POST({ links });
  }

  /**
   * @param {{
   *  user_id: string,
   *  report_id: string,
   *  message?: string,
   * }} param0
   */
  ReportUser({ user_id, report_id, message }) {
    return this.user().report().POST({ user_id, report_id, message });
  }

  /**
   * @param {number | string} id
   * @returns {Promise<{
   *  success?: boolean,
   *  data?: {
   *    keywordList: string[],
   *    groupData?: {
   *      group_id: number,
   *      button_content: string,
   *      button_link: string,
   *      button_icon: import("@style-guide/Icon").IconTypeType
   *    }
   *  },
   * }>}
   */
  GetKeywordsForFreelancer(id) {
    return this.freelancerData().P(id).GET();
  }

  auth() {
    return this.P("auth");
  }

  helloWorld() {
    return this.P("hello_world");
  }

  deleteReasons() {
    return this.P("deleteReasons");
  }

  user() {
    return this.P("user");
  }

  users() {
    return this.P("users");
  }

  note() {
    return this.P("note");
  }

  announcement() {
    return this.P("announcement");
  }

  announcements() {
    return this.P("announcements");
  }

  urlshortener() {
    return this.P("urlshortener");
  }

  logger() {
    return this.P("logger");
  }

  messageGroup() {
    return this.P("messageGroup");
  }

  messageGroups() {
    return this.P("messageGroups");
  }

  moderateAllPages() {
    return this.P("moderateAllPages");
  }

  deleteReasonsPreferences() {
    return this.P("deleteReasonsPreferences");
  }

  accountDeleteReport() {
    return this.P("accountDeleteReport");
  }

  accountDeleteReports() {
    return this.P("accountDeleteReports");
  }

  give() {
    return this.P("give");
  }

  revoke() {
    return this.P("revoke");
  }

  noticeBoard() {
    return this.P("noticeBoard");
  }

  read() {
    return this.P("read");
  }

  moderatorList() {
    return this.P("moderatorList");
  }

  actionsHistory() {
    return this.P("actionsHistory");
  }

  details() {
    return this.P("details");
  }

  confirm() {
    return this.P("confirm");
  }

  disapprove() {
    return this.P("disapprove");
  }

  revert() {
    return this.P("revert");
  }

  storeLinks() {
    return this.P("storeLinks");
  }

  report() {
    return this.P("report");
  }

  freelancerData() {
    return this.P("freelancerData");
  }
}
