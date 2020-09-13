/* eslint-disable no-underscore-dangle */
import HideElement from "@root/helpers/HideElement";
import ServerReq from "@ServerReq";
import autosize from "autosize";
import Button, { JQueryButtonElementType } from "@components/Button";
import Progress from "@components/Progress";
import SendMessageToBrainlyIds from "../../../../../controllers/Req/Brainly/Action/SendMessageToBrainlyIds";
import ScrollToDown from "../../../../../helpers/ScrollToDown";
import RenderGroupModal from "./groupModal";

class GroupChatbox {
  SendMessage: SendMessageToBrainlyIds;
  $: JQuery<HTMLElement>;
  $messagesContainer: JQuery<HTMLElement>;
  $title: JQuery<HTMLElement>;
  $progressHole: JQuery<HTMLElement>;
  $buttonsContainer: JQuery<HTMLElement>;
  $editGroupButtonContainer: JQuery<HTMLElement>;
  $deleteGroupButtonContainer: JQuery<HTMLElement>;
  $groupsButtonContainer: JQuery<HTMLElement>;
  $messageInputSection: JQuery<HTMLElement>;
  $messageInput: JQuery<HTMLElement>;
  $sendButtonSpinnerContainer: JQuery<HTMLElement>;
  $sendButton: JQueryButtonElementType;
  $sendButtonSpinner: JQuery<HTMLElement>;
  $groupsButton: JQueryButtonElementType;
  $editGroupButton: JQueryButtonElementType;
  $deleteGroupButton: JQueryButtonElementType;
  group: any;
  groupLi: any;

  constructor() {
    this.SendMessage = new SendMessageToBrainlyIds();

    this.Render();
    this.RenderMessageInput();
    this.RenderSendButton();
    this.RenderSendButtonSpinner();
    this.RenderGroupsButton();
    this.RenderEditGroupButton();
    this.RenderDeleteGroupButton();
    this.BindHandlers();
  }

  Render() {
    this.$ = $(`
    <div class="sg-content-box">
      <div class="sg-content-box__header">
        <div class="sg-actions-list">
          <div class="sg-actions-list__hole sg-hide-for-medium-up"></div>
          <div class="sg-actions-list__hole">
            <span class="sg-text sg-text--link sg-text--bold"></span>
          </div>
          <div class="sg-actions-list__hole sg-actions-list__hole--to-right">
            <div class="sg-actions-list sg-actions-list--no-wrap">
              <div class="sg-actions-list__hole sg-actions-list__hole--spaced-xsmall"></div>
              <div class="sg-actions-list__hole sg-actions-list__hole--spaced-xsmall"></div>
            </div>
          </div>
          <div class="sg-actions-list__hole sg-box--full progress"></div>
        </div>
      </div>
      <div class="sg-content-box__content">
        <div class="sg-horizontal-separator"></div>
        <section class="brn-chatbox__chat js-group-chat"></section>
      </div>
    </div>`);

    this.$messagesContainer = $(".js-group-chat", this.$);
    this.$title = $(".sg-actions-list__hole:nth-child(2) > .sg-text", this.$);
    this.$progressHole = $(
      ".sg-actions-list > .sg-actions-list__hole.progress",
      this.$,
    );
    this.$buttonsContainer = $(
      "> .sg-content-box__header > .sg-actions-list > .sg-actions-list__hole:nth-child(3)",
      this.$,
    );
    this.$editGroupButtonContainer = $(
      ".sg-actions-list__hole:nth-child(1)",
      this.$buttonsContainer,
    );
    this.$deleteGroupButtonContainer = $(
      ".sg-actions-list__hole:nth-child(2)",
      this.$buttonsContainer,
    );
    this.$groupsButtonContainer = $(
      "> .sg-content-box__header > .sg-actions-list > .sg-actions-list__hole:nth-child(1)",
      this.$,
    );
  }

  RenderMessageInput() {
    this.$messageInputSection = $(`
    <div class="sg-content-box__content">
      <footer class="brn-chatbox__footer">
        <div class="sg-horizontal-separator"></div>
        <div class="sg-content-box sg-content-box--spaced-top js-chatbox-footer">
          <div class="sg-textarea sg-textarea--auto-height sg-textarea--short">
            <div class="sg-actions-list sg-actions-list--no-wrap">
              <div class="sg-actions-list__hole sg-actions-list__hole--grow">
                <textarea class="sg-textarea sg-textarea--nested" maxlength="512" placeholder="${System.data.locale.messages.groups.writeSomething}" style="display:none;"></textarea>
              </div>
              <div class="sg-actions-list__hole sg-actions-list__hole--to-end">
                <div class="sg-spinner-container"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>`);

    this.$messageInput = $("textarea", this.$messageInputSection);
    this.$sendButtonSpinnerContainer = $(
      ".sg-spinner-container",
      this.$messageInputSection,
    );

    autosize(this.$messageInput);
  }

  RenderSendButton() {
    this.$sendButton = Button({
      type: "solid-blue",
      size: "small",
      text: System.data.locale.common.send,
    });

    this.$sendButton.prependTo(this.$sendButtonSpinnerContainer);
  }

  RenderSendButtonSpinner() {
    this.$sendButtonSpinner = $(
      `<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--small"></div></div>`,
    );
  }

  RenderGroupsButton() {
    this.$groupsButton = Button({
      size: "xsmall",
      text: System.data.locale.messages.groups.title,
      moreClass: "js-open-conversation-list",
    });

    this.$groupsButton.appendTo(this.$groupsButtonContainer);
  }

  RenderEditGroupButton() {
    this.$editGroupButton = Button({
      type: "solid-blue",
      size: "xsmall",
      icon: {
        type: "pencil",
      },
      text: System.data.locale.common.edit,
      title: System.data.locale.messages.groups.editGroup,
    });
  }

  RenderDeleteGroupButton() {
    this.$deleteGroupButton = Button({
      type: "solid-peach",
      size: "xsmall",
      icon: {
        type: "close",
      },
      text: System.data.locale.common.delete,
      title: System.data.locale.messages.groups.deleteGroup,
    });
  }

  BindHandlers() {
    this.$editGroupButton.on("click", this.EditGroup.bind(this));
    this.$deleteGroupButton.on("click", this.DeleteGroup.bind(this));

    this.$messageInput.on({
      keydown: e => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
        }
      },
      keyup: e => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();

          if (!window.isPageProcessing) {
            this.Send();
          }
        }
      },
    });
    this.$sendButton.on("click", this.Send.bind(this));
  }

  EditGroup() {
    // eslint-disable-next-line no-new
    new RenderGroupModal(this.group, this.groupLi);
  }

  InitGroup(group, groupLi) {
    this.group = group;
    this.groupLi = groupLi;

    this.HideChatbox();
    this.PrepareChatbox();
  }

  PrepareChatbox() {
    this.$title.html(this.group.title);

    this.RefreshChatbox();
    this.ShowChatbox();
    this.PrepareMessageMedia(this.group.messages);
  }

  HideChatbox() {
    this.HideEditGroupButton();
    this.HideDeleteGroupButton();
    this.HideMessageInputSection();
  }

  HideEditGroupButton() {
    HideElement(this.$editGroupButton);
  }

  HideDeleteGroupButton() {
    HideElement(this.$deleteGroupButton);
  }

  HideMessageInputSection() {
    HideElement(this.$messageInputSection);
  }

  ShowChatbox() {
    this.ShowEditGroupButton();
    this.ShowDeleteGroupButton();
    this.ShowMessageInputSection();
  }

  ShowEditGroupButton() {
    this.$editGroupButton.appendTo(this.$editGroupButtonContainer);
  }

  ShowDeleteGroupButton() {
    this.$deleteGroupButton.appendTo(this.$deleteGroupButtonContainer);
  }

  ShowMessageInputSection() {
    this.$messageInputSection.appendTo(this.$);
  }

  RefreshChatbox() {
    this.$messagesContainer.html("");
    this.$progressHole.html("");
  }

  PrepareMessageMedia(message) {
    if (message) {
      if (message instanceof Array) {
        if (message.length > 0) {
          message.forEach(this.RenderMessageMedia.bind(this));
        }
      } else {
        this.RenderMessageMedia(message);
      }
    }
  }

  RenderMessageMedia(data) {
    const { user } = System.data.Brainly.userData;
    const avatar = System.prepareAvatar(user);
    const profileLink = System.createProfileLink(user);
    const { message } = data;

    if (message) {
      message.replace(/\r\n|\n/gm, "<br>");
    }

    this.$messagesContainer.append(`
		<article class="sg-media message sg-media--to-right">
			<div class="sg-media__aside">
				<div class="sg-avatar sg-avatar--xsmall  ">
					<a href="${profileLink}" title="${user.nick}">
						<img class="sg-avatar__image" src="${avatar}" alt="${user.nick}" title="${user.nick}"></a>
				</div>
			</div>
			<div class="sg-media__wrapper">
				<div class="sg-media__content sg-media__content--small">
					<div class="sg-text sg-text--xsmall sg-text--gray-secondary sg-text--emphasised">
						<ul class="sg-breadcrumb-list sg-breadcrumb-list--adaptive sg-breadcrumb-list--short">
							<li class="sg-breadcrumb-list__element">
								<a class="sg-text sg-text--xsmall sg-text--gray-secondary sg-text--emphasised" href="${profileLink}">
									${user.nick}
								</a>
							</li>
							<li class="sg-breadcrumb-list__element">
								<time class="js-time" datetime="${data.time}"></time>
							</li>
						</ul>
					</div>
				</div>
				<div class="sg-media__content brn-container--4of5">
					<div class="sg-content-box sg-content-box--spaced-top-xxsmall">
						<div class="sg-box sg-box--blue sg-box--no-min-height sg-box--no-border-small">
							<span class="sg-text sg-text--break-words sg-text--white">${message}</span>
						</div>
					</div>
				</div>
			</div>
		</article>`);

    ScrollToDown(this.$messagesContainer.get(0));
  }

  async Send() {
    window.isPageProcessing = true;

    let sendedMessagesCount = 0;
    const message = String(this.$messageInput.val());
    const membersLen = this.group.members.length;
    const $groupLiMessateContent = $(".js-message-content", this.groupLi);

    const progress = new Progress({
      type: "success",
      label: System.data.locale.common.progressing,
      max: membersLen,
    });

    this.ShowSendButtonSpinner();
    this.$messageInput.prop("disabled", true);
    progress.$container.appendTo(this.$progressHole.html(""));

    const doInEachSending = () => {
      progress.update(++sendedMessagesCount);
      progress.UpdateLabel(`${sendedMessagesCount} - ${membersLen}`);
    };

    this.SendMessage.handlers.Each = doInEachSending;
    const idList = this.group.members.map(member => ~~member.brainlyID);
    this.SendMessage.Start(idList, message);
    const membersWithConversationIds = await this.SendMessage.Promise();
    console.log("membersWithConversationIds:", membersWithConversationIds);

    // this.CheckForImproperMember(membersWithConversationIds);

    window.isPageProcessing = false;

    this.HideSendButtonSpinner();
    progress.UpdateLabel(
      `(${membersLen}) - ${System.data.locale.common.allDone}`,
    );

    autosize.update(this.$messageInput.val("").prop("disabled", false));

    this.RenderMessageMedia({ message, time: new Date().toISOString() });

    $groupLiMessateContent
      .text(message.substring(0, 60))
      .attr("title", message);

    new ServerReq().MessageSended({
      _id: this.group._id,
      message,
      members: membersWithConversationIds,
    });
  }

  ShowSendButtonSpinner() {
    this.$sendButtonSpinner.appendTo(this.$sendButtonSpinnerContainer);
  }

  HideSendButtonSpinner() {
    HideElement(this.$sendButtonSpinner);
  }

  async DeleteGroup() {
    if (confirm(System.data.locale.common.notificationMessages.areYouSure)) {
      const resUpdated = await new ServerReq().UpdateMessageGroup(
        this.group._id,
        { remove: true },
      );

      if (resUpdated && resUpdated.success) {
        this.HideChatbox();
        this.groupLi.remove();
      }
    }
  }

  /* CheckForImproperMember(members) {
    // dönen listeyi kontrol et ve eğer içerisinde mesaj gönderilemeyen bir kullanıcı varsa, olası sebebini exception koduyla veya deleted olarak kullanıcıdan gruptan kaldırmasını iste.
    // 500 kullanılmayan veya silinen hesaplar için. 504 engellenmiş hesaplar için
    // new renderGroupModal(this.group, this.groupLi);
    const improperMembers = [];

    if (member && members.length > 0) {
      members.forEach(member => {
        if (member.exception) {
          improperMembers.push(member);
        }
      });
    }

    if (improperMembers.length > 0) {
    }
  } */
}

export default GroupChatbox;
