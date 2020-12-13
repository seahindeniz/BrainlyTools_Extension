/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
import Action from "@BrainlyAction";
import FillRange from "@root/helpers/FillRange";

type NoopType = () => void;
type HandlersType = {
  EachBefore?: (user: { [x: string]: any }) => void;
  Each?: (user: { [x: string]: any }) => void;
  Done?: (user: number[]) => void;
  Error?: NoopType;
};

export type SendMessageUserType = {
  id: number;
  conversation_id?: number;
  time: number;
  exception_type?: number;
  message?: string;
  validation_errors: string;
};

function FixIdList(idList: string | number[]) {
  if (!(idList instanceof Array)) {
    const range = idList.split(":");

    idList = FillRange(...range);
  } else idList = idList.map(Number).filter(Boolean);

  return [...new Set(idList)]; // Remove duplicates and return
}

export default class SendMessageToBrainlyIds {
  handlers: HandlersType;
  sendLimit: number;
  activeConnections: number;

  idList: number[];
  processedIdList: number[];
  content: string;

  #loop: number;
  #loopResetLimit: number;

  promise: Promise<any>;

  constructor(handlers: HandlersType = {}) {
    this.handlers = handlers;
    this.sendLimit = 0;
    this.activeConnections = 0;
  }

  Start(idList: string | number[], content: string) {
    this.idList = FixIdList(idList);
    this.processedIdList = [];
    this.content = content;

    this.StartSending();
  }

  StartSending() {
    this.#loop = setInterval(this.TryToSend.bind(this));
    this.#loopResetLimit = window.setInterval(() => {
      this.sendLimit = 0;
    }, 1000);
  }

  TryToSend() {
    if (this.sendLimit < 4) {
      const userId = this.idList.shift();

      if (!userId) {
        this.Stop();

        return;
      }

      this.sendLimit++;
      this.activeConnections++;

      this.Send(userId);
    }
  }

  Stop() {
    clearInterval(this.#loop);
    clearInterval(this.#loopResetLimit);
  }

  async Send(id: number) {
    const user: SendMessageUserType = {
      id,
      time: undefined,
      message: undefined,
      exception_type: undefined,
      conversation_id: undefined,
      validation_errors: undefined,
    };

    if (
      this.handlers.EachBefore &&
      typeof this.handlers?.EachBefore === "function"
    )
      this.handlers?.EachBefore(user);

    try {
      const resConversation = await new Action().GetConversationID(user.id);

      if (!resConversation || !resConversation.success) {
        user.exception_type = resConversation.exception_type;

        if (resConversation.message) user.message = resConversation.message;
      } else {
        user.conversation_id = resConversation.data.conversation_id;
        user.time = Date.now();

        this.processedIdList.push(user.id);

        const resSend = await new Action()
          // .HelloWorld();
          .SendMessage(
            {
              conversation_id: user.conversation_id,
            },
            this.content,
          );
        /* await System.TestDelay();
        let resSend = {
          success: true,
          exception_type: 501,
          message: "Deleted user"
        }; */

        if (!resSend || !resSend.success) {
          user.exception_type = resSend.exception_type;

          if (resSend.message) user.message = resSend.message;

          if (resSend.validation_errors)
            user.validation_errors = resSend.validation_errors;
        }
      }
    } catch (error) {
      if (!user.exception_type) user.exception_type = 1;

      console.error(error);
    }

    this.HandleResponse(user);
  }

  HandleResponse(user) {
    this.activeConnections--;
    this.handlers.Each(user);

    if (this.activeConnections === 0 && this.idList.length === 0) this.Finish();
  }

  Finish() {
    this.handlers.Done(this.processedIdList);
  }

  Promise() {
    this.promise = new Promise((resolve, reject) => {
      this.handlers.Done = resolve;
      this.handlers.Error = reject;
    });

    return this.promise;
  }
}
