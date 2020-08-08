import WaitForElement from "@root/scripts/helpers/WaitForElement";
import ServerReq from "@ServerReq";
import Conversation from "./_/Conversation";
import renderGroupMessaging from "./_/GroupMessaging";

System.pageLoaded("Messages inject OK!");

window.isPageProcessing = false;
window.selectors = {
  profileLinkContainerSub: " div.sg-content-box__header > div.sg-actions-list",
  get profileLinkContainer() {
    return `section.brn-messages__chatbox:not(.js-group-chatbox)${selectors.profileLinkContainerSub}`;
  },
  profileLink: ".sg-actions-list__hole:nth-child(2) a",
  messagesContainer: "#private-messages-container",
  conversationsHeader:
    "#private-messages-container > section.brn-messages__conversations > div.sg-content-box > div.sg-content-box__header",
  textarea: "footer.brn-chatbox__footer textarea",
};

window.addEventListener("beforeunload", event => {
  const textarea = document.querySelector(selectors.textarea);

  if (textarea instanceof HTMLTextAreaElement) {
    const value = textarea.value || "";

    if (value.trim() != "") {
      event.returnValue =
        System.data.locale.messages.notificationMessages.unsendedMessage;

      event.preventDefault();
    }
  }
});

export default class Messages {
  constructor() {
    /**
     * @type {{[x: string]: Conversation}}
     */
    this.conversations = {};

    this.ObserveHeader();
    localStorage.setItem("message-info-box-closed", "true");

    if (System.checkUserP(8)) {
      new ServerReq().GetAllModerators();
      new renderGroupMessaging();
    }
  }

  async ObserveHeader() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (
          mutation.target &&
          mutation.target instanceof HTMLElement &&
          mutation.target.id === "private-messages-container" &&
          mutation.addedNodes.length > 0
        ) {
          mutation.addedNodes.forEach(node => {
            if (node instanceof HTMLElement) {
              this.InitConversation(node);
            }
          });
        }
      });
    });

    const pmc = document.querySelector("#private-messages-container");

    observer.observe(pmc, { childList: true, subtree: true });

    const chatBox = await WaitForElement(
      "#private-messages-container .js-chatbox",
    );

    if (!chatBox) return;

    this.InitConversation(chatBox);
  }

  /**
   * @param {HTMLElement} chatBox
   */
  InitConversation(chatBox) {
    const conversationId = System.ExtractId(location.pathname);

    if (!this.conversations[conversationId])
      this.conversations[conversationId] = new Conversation(
        this,
        conversationId,
        chatBox,
      );
  }
}

new Messages();
