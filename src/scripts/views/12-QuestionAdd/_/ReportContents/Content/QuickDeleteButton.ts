// @flow

import notification from "@/scripts/components/notification2";
import { Button, Flex, Text } from "@style-guide";
import type { ButtonColorType } from "@style-guide/Button";
import type { FlexElementType } from "@style-guide/Flex";
import type ContentClassType from "./Content";

const BUTTON_COLOR: {
  Question: ButtonColorType;
  Answer: ButtonColorType;
  Comment: ButtonColorType;
} = {
  Question: { type: "solid-mustard" },
  Answer: { type: "solid-peach" },
  Comment: { type: "solid" },
};

type DeleteReasonType = {
  category_id: number;
  id: number;
  text: string;
  title: string;
};

export default class QuickDeleteButton {
  main: ContentClassType;
  reason: DeleteReasonType;
  buttonText: string | number;

  container: FlexElementType;
  button: Button;

  constructor(
    main: ContentClassType,
    reason: DeleteReasonType,
    buttonText: string | number,
  ) {
    this.main = main;
    this.reason = reason;
    this.buttonText = buttonText;

    this.Render();
    this.BindListener();
  }

  Render() {
    this.container = Flex({
      marginTop: "xxs",
      marginBottom: "xxs",
      marginLeft: "xs",
      children: this.button = new Button({
        ...BUTTON_COLOR[this.main.contentType],
        iconOnly: true,
        icon: Text({
          color: "white",
          weight: "bold",
          text: this.buttonText,
        }),
        title: `${this.reason.title}:\n\n${this.reason.text}`,
      }),
    });
  }

  BindListener() {
    this.button.element.addEventListener(
      "click",
      this.DeleteContent.bind(this),
    );
  }

  async DeleteContent() {
    try {
      const message = System.data.locale.common.moderating.doYouWantToDeleteWithReason
        .replace("%{reason_title}", this.reason.title)
        .replace("%{reason_message}", this.reason.text);

      await this.Deleting();

      if (!confirm(message)) {
        this.NotDeleting();

        return;
      }

      const resDelete = { success: true, message: undefined };
      await System.TestDelay();

      console.log(resDelete);

      this.main.has = "failed";

      if (!resDelete)
        notification({
          html: System.data.locale.common.notificationMessages.operationError,
          type: "error",
        });
      else if (!resDelete.success) {
        notification({
          html:
            resDelete.message ||
            System.data.locale.common.notificationMessages.somethingWentWrong,
          type: "error",
        });
      } else {
        this.main.has = "deleted";

        this.main.quickDeleteButtonContainer.remove();

        System.log(
          this.main.data.model_type_id === 1
            ? 5
            : this.main.data.model_type_id === 2
            ? 6
            : 7,
          {
            user: {
              id: this.main.users.reported.data.id,
              nick: this.main.users.reported.data.nick,
            },
            data: [this.main.data.model_id],
          },
        );
      }
    } catch (error) {
      console.error(error);
    }

    this.main.ChangeBoxColor();
    this.main.NotConfirming();
  }

  Deleting() {
    this.button.Disable();
    this.button.element.append(this.main.buttonSpinner);

    return this.main.DisableActions();
  }

  NotDeleting() {
    this.button.Enable();
    this.main.NotOperating();
  }
}
