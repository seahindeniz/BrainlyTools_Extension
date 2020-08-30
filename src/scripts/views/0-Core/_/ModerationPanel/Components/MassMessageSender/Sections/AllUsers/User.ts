/* eslint-disable camelcase */
// @ts-ignore
import CreateElement from "@components/CreateElement";
import { SendMessageUserType } from "@root/controllers/Req/Brainly/Action/SendMessageToBrainlyIds";
import { Text } from "@style-guide";
import { TextColorType } from "@style-guide/Text";
import type AllUsersClassType from "./AllUsers";
// import moment from "moment";

const ERROR = "peach-dark";
const SUCCESS = "mint-dark";
const USER_NOT_FOUND = "lavender-dark";

export default class User {
  main: AllUsersClassType;
  user: SendMessageUserType;
  statusColor: TextColorType;

  container: HTMLTableRowElement;

  constructor(main: AllUsersClassType, user: SendMessageUserType) {
    this.main = main;
    this.user = user;

    this.SetStatusColor();
    this.Render();
    this.RenderExceptionMessage();
  }

  SetStatusColor() {
    /**
     * @type {}
     */
    this.statusColor = SUCCESS;

    if (this.user.exception_type) this.statusColor = ERROR;

    if (this.user.exception_type === 500) this.statusColor = USER_NOT_FOUND;
  }

  Render() {
    // const time = moment().format("LTS");
    this.container = CreateElement({
      tag: "tr",
      children: Text({
        tag: "td",
        size: "small",
        text: this.user.id,
        color: this.statusColor,
      }),
    });

    if (this.user.exception_type)
      this.main.failLogsContainer.append(this.container);
    else this.main.successLogsContainer.append(this.container);
  }

  RenderExceptionMessage() {
    if (this.user.exception_type || this.user.message) {
      let { message } = this.user;

      if (this.user.exception_type === 500)
        message = System.data.locale.core.notificationMessages.userNotFound;

      if (!message)
        message = System.data.locale.core.MessageSender.unknownError;

      const messageContainer = Text({
        tag: "td",
        size: "small",
        text: message,
        color: this.statusColor,
        align: "RIGHT",
      });

      this.container.append(messageContainer);
    }
  }
}
