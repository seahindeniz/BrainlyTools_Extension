import UserNoteBox from "../../../components/UserNoteBox";
import UserTag from "../../../components/UserTag";
import Action from "../../../controllers/Req/Brainly/Action";
import ServerReq from "../../../controllers/Req/Server";
import WaitForElement from "../../../helpers/WaitForElement";
import WaitForObject from "../../../helpers/WaitForObject";

async function profileLinkContainerFound(targetElm) {
  if (targetElm) {
    if ($(".userNoteBox", targetElm).length == 0) {
      let $link = $(selectors.profileLink, targetElm);

      if ($link.length > 0) {
        let id = System.ExtractId($link.attr('href'));
        let nick = $link.attr('title');
        let resExtUser = await new ServerReq().GetUser(id, nick);

        if (resExtUser && resExtUser.success && resExtUser.data) {
          let $notebox = UserNoteBox(resExtUser.data);

          $notebox.appendTo(targetElm);

          if (resExtUser.data.probatus) {
            let resBrainlyUser = await new Action().GetUserProfile(id);

            if (resBrainlyUser && resBrainlyUser.success) {
              let tag = new UserTag(id, resExtUser.data)

              tag.$.insertAfter("div.sg-content-box > div.sg-content-box__header > div.sg-actions-list > div.sg-actions-list__hole:nth-child(2)");
            }
          }
        }
      }
    }
  }
}

async function createUserNoteBox() {
  let targetElm = await WaitForElement(selectors.profileLinkContainer);

  profileLinkContainerFound(targetElm);

  let _$_observe = await WaitForObject("$().observe");

  if (_$_observe) {
    $(selectors.messagesContainer).observe('added', '.brn-chatbox:not(.js-group-chatbox)', function() {
      profileLinkContainerFound($(selectors.profileLinkContainerSub, this));
    });
  }
}

export default createUserNoteBox;
