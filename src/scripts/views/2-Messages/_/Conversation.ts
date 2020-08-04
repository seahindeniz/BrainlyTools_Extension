import ServerReq from "@ServerReq";
import notification from "@/scripts/components/notification2";
import UserNoteBox from "@/scripts/components/UserNoteBox";
import UserTag from "@/scripts/components/UserTag";

export default class {
  /**
   * @param {import("../index").default} main
   * @param {number} conversationId
   * @param {HTMLElement} chatBox
   */
  constructor(main, conversationId, chatBox) {
    this.main = main;
    this.conversationId = conversationId;
    this.chatBox = chatBox;
    this.user = {
      details: {
        /**
         * @type {number}
         */
        id: undefined,
        /**
         * @type {string}
         */
        nick: undefined,
      },
      data: {
        /**
         * @type {import("@ServerReq").UserDetailsType}
         */
        extension: undefined,
        brainly: undefined,
      }
    };

    if (!this.headerBox) {
      this.headerBox = chatBox.querySelector(".sg-content-box__header");
      this.headerSubList = this.headerBox.firstElementChild;

      this.SetUserDetails();
    }

    this.LoadComponents();
  }
  SetUserDetails() {
    if (this.headerBox && this.headerBox instanceof HTMLElement) {
      let profileLink = this.headerBox.querySelector("a");
      this.user.details = {
        nick: profileLink.title,
        id: System.ExtractId(profileLink.href),
      };
    }
  }
  LoadComponents() {
    this.LoadComponentsAfterExtensionUserLoad();
  }
  async LoadComponentsAfterExtensionUserLoad() {
    try {
      await this.SetExtensionUserDetails();
      this.RenderUserNoteBox();
      this.RenderStatusLabel();
    } catch (error) {
      if (error.msg) {
        notification({
          html: error.msg,
          type: "error",
        });
      }

      console.error(error);
    }
  }
  async SetExtensionUserDetails() {
    let resExtUser = await new ServerReq().GetUser(this.user.details);

    if (!resExtUser || !resExtUser.data)
      throw {
        msg: resExtUser.message ||
          System.data.locale.common.notificationMessages
          .cannotShareUserInfoWithServer_RefreshPage
      }

    this.user.data.extension = resExtUser.data;

    return Promise.resolve();
  }
  RenderUserNoteBox() {
    if (!this.userNoteBox) {
      this.userNoteBox = UserNoteBox(this.user.data.extension);

      this.headerSubList.append(this.userNoteBox);
    } else {
      /**
       * @type {HTMLTextAreaElement}
       */
      // @ts-ignore
      let textarea = this.userNoteBox.firstElementChild;

      textarea.value = this.user.data.extension.note || "";
    }
  }
  RenderStatusLabel() {
    let statusLabel = new UserTag(this.user.details.id, this.user.data
      .extension);

    let reportButtonContainer = this.headerSubList.children[2];
    this.headerSubList.insertBefore(statusLabel.container,
      reportButtonContainer)
  }
}
