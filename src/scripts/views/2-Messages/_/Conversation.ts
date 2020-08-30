import ServerReq, { UserDetailsType } from "@root/controllers/Req/Server";
import notification from "@components/notification2";
import UserNoteBox from "@components/UserNoteBox";
import UserTag from "@components/UserTag";
import type MessagesClassType from "..";

export default class {
  main: MessagesClassType;
  conversationId: number;
  chatBox: HTMLElement;
  user: {
    details: {
      id: number;
      nick: string;
    };
    data: {
      extension: UserDetailsType;
      brainly: any;
    };
  };

  headerBox: HTMLElement;
  headerSubList: HTMLElement;
  userNoteBox: HTMLDivElement;

  constructor(
    main: MessagesClassType,
    conversationId: number,
    chatBox: HTMLElement,
  ) {
    this.main = main;
    this.conversationId = conversationId;
    this.chatBox = chatBox;
    this.user = {
      details: {
        id: undefined,
        nick: undefined,
      },
      data: {
        extension: undefined,
        brainly: undefined,
      },
    };

    if (!this.headerBox) {
      this.headerBox = chatBox.querySelector(".sg-content-box__header");
      this.headerSubList = this.headerBox.firstElementChild as HTMLElement;

      this.SetUserDetails();
    }

    this.LoadComponents();
  }

  SetUserDetails() {
    if (this.headerBox && this.headerBox instanceof HTMLElement) {
      const profileLink = this.headerBox.querySelector("a");
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
    const resExtUser = await new ServerReq().GetUser(this.user.details);

    if (!resExtUser || !resExtUser.data)
      // eslint-disable-next-line no-throw-literal
      throw {
        msg:
          resExtUser.message ||
          System.data.locale.common.notificationMessages
            .cannotShareUserInfoWithServer_RefreshPage,
      };

    this.user.data.extension = resExtUser.data;

    return Promise.resolve();
  }

  RenderUserNoteBox() {
    if (!this.userNoteBox) {
      this.userNoteBox = UserNoteBox(this.user.data.extension);

      this.headerSubList.append(this.userNoteBox);
    } else {
      const textarea = this.userNoteBox
        .firstElementChild as HTMLTextAreaElement;

      textarea.value = this.user.data.extension.note || "";
    }
  }

  RenderStatusLabel() {
    const statusLabel = new UserTag(
      this.user.details.id,
      this.user.data.extension,
    );

    const reportButtonContainer = this.headerSubList.children[2];
    this.headerSubList.insertBefore(
      statusLabel.container,
      reportButtonContainer,
    );
  }
}
