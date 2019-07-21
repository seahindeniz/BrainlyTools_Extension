import md5 from "js-md5";
import Request from "../";
import notification from "../../../components/notification";
import storage from "../../../helpers/extStorage";

export default class ServerReq {
  constructor() {
    this.path = "";
  }
  Server() {
    this.path = System.data.config.extension.serverAPIURL;
  }
  GET() {
    return this.BackGate("GET");
  }
  POST(data) {
    return this.BackGate("POST", data);
  }
  PUT(data) {
    return this.BackGate("PUT", data);
  }
  DELETE(data) {
    return this.BackGate("DELETE", data);
  }
  /**
   * @param {string} method
   * @param {{}} data
   * @returns {Promise}
   */
  BackGate(method, data) {
    if (data)
      data = JSON.stringify(data);

    let messageData = {
      method,
      path: this.path,
      data,
    };

    if (System.data.Brainly.userData.extension && System.data.Brainly.userData.extension.secretKey)
      messageData.headers = {
        SecretKey: System.data.Brainly.userData.extension.secretKey
      };

    return System.toBackground("xmlHttpRequest", messageData);
  }
  FrontGate() {
    this.request = new Request();
    this.request.path = System.data.config.extension.serverAPIURL;

    return this.request;
  }
  P(path) {
    this.path += `/${path}`;

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
      let data = {
        //clientID: System.data.meta.manifest.clientID,
        clientVersion: System.data.meta.manifest.version,
        //isoLocale: System.data.Brainly.userData.user.iso_locale,
        marketName: System.data.meta.marketName,
        crypted: md5(System.data.Brainly.tokenLong),
        user: {
          id: System.data.Brainly.userData.user.id,
          nick: System.data.Brainly.userData.user.nick
        }
      }

      storage("setL", { authData: null });

      let resAuth = await this.auth().POST(data);

      if (!resAuth) {
        System.changeBadgeColor("error");
        notification(`${System.data.locale.core.notificationMessages.extensionServerError}<br>${System.data.locale.core.notificationMessages.ifErrorPersists}`, "error", true);
        reject();
      } else if (!resAuth.data.probatus) {
        System.changeBadgeColor("error");
        notification(System.data.locale.core.notificationMessages.accessPermissionDenied, "error", true);
        reLogin && location.reload(true);
        reject(System.data.locale.core.notificationMessages.accessPermissionDenied.replace(/<br.*?>/gi, "\n"));
      } else {
        resAuth.data.hash = JSON.parse(atob(resAuth.data.hash));

        resolve(resAuth.data);
      }
    });
  }
  GetDeleteReasons() {
    return this.deleteReasons().P(System.data.meta.marketName).GET();
  }
  GetUser(id, nick) {
    let promise = this.user().P(id).P(nick).GET();

    promise.catch(() => notification(System.data.locale.common.notificationMessages.cannotShareUserInfoWithServer, "error"));

    return promise;
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
  GetModerateAllPages() {
    return this.moderateAllPages().GET();
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
   * @param {function} onUploadProgress
   */
  AccountDeleteReport(data, onUploadProgress) {
    return this.FrontGate().Axios({ onUploadProgress }).SKey().P("accountDeleteReport").POST(data);
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
    return this.FrontGate().SKey().JSON().P("users").P("give").PUT({ privilege });
  }
  /**
   * @param {number} privilege
   */
  RevokePrivilege(privilege) {
    return this.FrontGate().SKey().JSON().P("users").P("revoke").PUT({ privilege });
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
   * @param {{each?: function, done?: function}} handlers
   */
  GetAllModerators(handlers) {
    return new Promise(async (resolve, reject) => {
      let resSupervisors = await this.moderatorList().GET();

      if (!resSupervisors || !resSupervisors.success)
        return reject("Can't fetch moderators list from extension server");

      handlers = {
        done: resolve,
        ...handlers
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
   * @param {{hashList: string[], content:string, questionLink: string}} data
   */
  ConfirmActionHistoryEntry(_id, data) {
    return this.ReportActionHistoryEntry("confirm", _id, data);
  }
  /**
   * @param {string} _id
   * @param {{hashList: string[], content:string, questionLink: string, message?: string}} data
   */
  DisapproveActionHistoryEntry(_id, data) {
    return this.ReportActionHistoryEntry("disapprove", _id, data);
  }
  /**
   * @param {string} action
   * @param {string} _id
   * @param {{hashList: string[], content:string, questionLink: string, message?: string}} data
   */
  ReportActionHistoryEntry(action, _id, data) {
    if (typeof data.hashList == "string")
      data.hashList = [data.hashList];

    return this.actionsHistory()[action]().P(_id).PUT(data);
  }
  RevertActionHistoryReport(_id) {
    if (!_id) throw "Id not found";

    return this.actionsHistory().revert().P(_id).PUT();
  }
  /**
   * @param {Blob} screenshot
   */
  ActionHistoryEntryImage(screenshot) {
    let formData = new FormData();

    formData.append('file', screenshot, screenshot.name);

    return this.FrontGate().Axios().SKey().P("actionsHistory").P("image").POST(formData);
  }
  ActionHistoryEntryLinks(links) {
    return this.actionsHistory().storeLinks().POST({ links });
  }

  auth() {
    return this.P("auth");
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
}
