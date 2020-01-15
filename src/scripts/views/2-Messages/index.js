import WaitForElement from "@/scripts/helpers/WaitForElement";
import ServerReq from "@ServerReq";
import Conversation from "./_/Conversation";
import renderGroupMessaging from "./_/GroupMessaging";

System.pageLoaded("Messages inject OK!");

window.isPageProcessing = false;
window.selectors = {
  profileLinkContainerSub: " div.sg-content-box__header > div.sg-actions-list",
  get profileLinkContainer() {
    return "section.brn-messages__chatbox:not(.js-group-chatbox)" +
      selectors.profileLinkContainerSub;
  },
  profileLink: ".sg-actions-list__hole:nth-child(2) a",
  messagesContainer: "#private-messages-container",
  conversationsHeader: "#private-messages-container > section.brn-messages__conversations > div.sg-content-box > div.sg-content-box__header",
  textarea: "footer.brn-chatbox__footer textarea"
}

window.addEventListener("beforeunload", event => {
  let textarea = document.querySelector(selectors.textarea);

  if (textarea instanceof HTMLTextAreaElement) {
    let value = textarea.value || "";

    if (value.trim() != "") {
      event.returnValue = System.data.locale.messages
        .notificationMessages.unsendedMessage;

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

    if (System.checkUserP(8)) {
      new ServerReq().GetAllModerators();
      new renderGroupMessaging();
    }
  }
  async ObserveHeader() {
    let observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (
          mutation.target &&
          mutation.target instanceof HTMLElement &&
          mutation.target.id == "private-messages-container" &&
          mutation.addedNodes.length > 0
        ) {
          mutation.addedNodes.forEach(node => {
            if (node instanceof HTMLElement) {
              this.InitConversation(node);
            }
          });
        }
      })
    });

    let pmc = document.querySelector("#private-messages-container");

    observer.observe(pmc, { childList: true, subtree: true });

    let chatBoxes = await WaitForElement(
      "#private-messages-container .js-chatbox");

    if (chatBoxes && chatBoxes.length > 0) {
      let chatBox = chatBoxes[0];

      if (chatBox instanceof HTMLElement)
        this.InitConversation(chatBox);
    }
  }
  /**
   * @param {HTMLElement} chatBox
   */
  InitConversation(chatBox) {
    let conversationId = System.ExtractId(location.pathname);

    if (!this.conversations[conversationId])
      new Conversation(this, conversationId, chatBox);
  }
}

new Messages();
