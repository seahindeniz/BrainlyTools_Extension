import Action from "./";
import FillRange from "../../../../helpers/FillRange";

/**
 * @typedef {function({}): void} Noop
 */
function noop() {};

export default class SendMessageToBrainlyIds {
  /**
   * @param {{EachBefore?: Noop, Each?: Noop, Done?: Noop, Error?: Noop}} handlers
   */
  constructor(handlers = {
    EachBefore: noop,
    Each: noop,
    Done: noop,
    Error: noop
  }) {
    this.handlers = handlers;
    this.sendLimit = 0;
    this.activeConnections = 0;
  }
  /**
   * @param {string|number[]} idList
   * @param {string} content
   */
  Start(idList, content) {
    this.idList = this.FixIdList(idList);
    this.processedIdList = [];
    this.content = content;

    this.StartSending();
  }
  /**
   * @param {string|number[]} idList
   * @returns {number[]}
   */
  FixIdList(idList) {
    if (!(idList instanceof Array)) {
      let range = idList.split(":");
      idList = FillRange(...range);
    } else
      idList = idList.map(Number).filter(Boolean);

    return [...new Set(idList)]; // Remove duplicates and return
  }
  StartSending() {
    this._loop = setInterval(this.TryToSend.bind(this));
    this._loop_resetLimit = setInterval(() => { this.sendLimit = 0 }, 1000);
  }
  TryToSend() {
    if (this.sendLimit < 4) {
      let user_id = this.idList.shift();

      if (!user_id)
        return this.Stop();

      this.sendLimit++;
      this.activeConnections++;

      this.Send(user_id);
    }
  }
  Stop() {
    clearInterval(this._loop);
    clearInterval(this._loop_resetLimit);
  }
  async Send(id) {
    let user = {
      id
    };

    this.handlers.EachBefore(user);

    try {
      let resConversation = await new Action().GetConversationID(user.id);

      if (!resConversation || !resConversation.success) {
        user.exception_type = resConversation.exception_type;

        if (resConversation.message)
          user.message = resConversation.message;
      } else {
        user.conversation_id = resConversation.data.conversation_id;
        user.time = Date.now();

        this.processedIdList.push(user);

        let resSend = await new Action()
          //.HelloWorld();
          .SendMessage({
            conversation_id: user.conversation_id
          }, this.content);
        /* await System.TestDelay();
        let resSend = {
          success: true,
          exception_type: 501,
          message: "Deleted user"
        }; */

        if (!resSend || !resSend.success) {
          user.exception_type = resSend.exception_type;

          if (resSend.message)
            user.message = resSend.message;

          if (resSend.validation_errors)
            user.validation_errors = resSend.validation_errors;
        }
      }
    } catch (error) {
      if (!user.exception_type)
        user.exception_type = 1;

      console.error(error);
    }

    this.HandleResponse(user);
  }
  HandleResponse(user) {
    this.activeConnections--;
    this.handlers.Each(user);

    if (
      this.activeConnections == 0 &&
      this.idList.length == 0
    )
      this.Finish();
  }
  Finish() {
    this.handlers.Done(this.processedIdList);
  }
  Promise() {
    this.promise = new Promise((resolve, reject) => (this.handlers.Done =
      resolve, this.handlers.Error = reject));

    return this.promise;
  }
}
