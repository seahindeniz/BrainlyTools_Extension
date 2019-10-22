import ServerReq from "@ServerReq";
import createUserNoteBox from "./_/createUserNoteBox";
import renderGroupMessaging from "./_/GroupMessaging";

System.pageLoaded("Messages inject OK!");

window.isPageProcessing = false;
window.selectors = {
  profileLinkContainerSub: " div.sg-content-box__header > div.sg-actions-list",
  get profileLinkContainer() {
    return "section.brn-messages__chatbox:not(.js-group-chatbox)" + selectors.profileLinkContainerSub;
  },
  profileLink: ".sg-actions-list__hole:nth-child(2) a",
  messagesContainer: "#private-messages-container",
  conversationsHeader: "#private-messages-container > section.brn-messages__conversations > div.sg-content-box > div.sg-content-box__header",
  textarea: "footer.brn-chatbox__footer textarea"
}

Messages();

function Messages() {
  createUserNoteBox();

  if (System.checkUserP(8)) {
    new ServerReq().GetAllModerators();
    new renderGroupMessaging();
  }

  window.addEventListener("beforeunload", () => {
    let $textarea = $(selectors.textarea);
    let value = $textarea.val() || "";

    if (value.trim() != "") {
      event.returnValue = System.data.locale.messages.notificationMessages.unsendedMessage;

      event.preventDefault();
    }
  });
}
