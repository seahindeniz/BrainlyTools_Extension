/* eslint-disable import/no-duplicates */
import { Button, Flex, SpinnerContainer } from "@style-guide";
import Action from "@BrainlyAction";
import Build from "@root/helpers/Build";
import ModerationSection from ".";
import type ModerationToplayerClassType from "..";
import type { AnswerEntryType } from "..";

export default class AnswerSection extends ModerationSection {
  confirmButtonContainer: import("@style-guide/Flex").FlexElementType;
  confirmButtonSpinnerContainer: HTMLElement;
  confirmButton: Button;

  constructor(main: ModerationToplayerClassType, data: AnswerEntryType) {
    super(main, data);

    this.contentType = "answer";

    this.RenderDeleteButtons({
      type: "solid-peach",
    });

    this.RenderConfirmButton();
  }

  RenderConfirmButton() {
    if (!this.report || (System.checkBrainlyP(146) && !System.checkUserP(38)))
      return;

    this.confirmButtonContainer = Build(
      Flex({
        marginLeft: "xs",
        children: this.confirmButtonSpinnerContainer,
      }),
      [
        [
          (this.confirmButtonSpinnerContainer = SpinnerContainer()),
          (this.confirmButton = new Button({
            size: "xs",
            text: System.data.locale.common.confirm,
            type: "solid-mint",
            onClick: this.Confirm.bind(this),
          })),
        ],
      ],
    );

    this.buttonContainer.append(this.confirmButtonContainer);
  }

  async Confirm() {
    try {
      await this.ShowConfirmButtonSpinner();

      if (
        this.processing ||
        !confirm(
          System.data.locale.userContent.notificationMessages
            .doYouWantToConfirmThisContent,
        )
      ) {
        super.HideSpinner();

        return;
      }

      this.processing = true;
      const resConfirm = await new Action().ConfirmAnswer(this.data.id);
      this.processing = false;

      if (!resConfirm) throw Error("Empty response");

      if (resConfirm.success === false)
        // eslint-disable-next-line no-throw-literal
        throw { msg: resConfirm.message, res: resConfirm };

      this.Confirmed();
    } catch (error) {
      console.error(error);
      this.main.main.toplayerZdnObject.setMessage(
        error.msg ||
          System.data.locale.common.notificationMessages.operationError,
        "failure",
      );
    }

    super.HideSpinner();
  }

  ShowConfirmButtonSpinner() {
    return super.ShowSpinner(this.confirmButtonSpinnerContainer);
  }

  // eslint-disable-next-line class-methods-use-this
  Delete(data) {
    return new Action().RemoveAnswer(data, true);
  }

  Deleted() {
    super.Deleted();
    System.log(6, {
      user: this.main.zdnObject.data.user,
      data: [this.data.id],
    });
  }

  Confirmed() {
    this.container.classList.add("accepted");
    this.container.classList.remove("reported");

    const removableElements = this.container.querySelectorAll(
      ".to-correct, .to-correct2, .wrong",
    );

    if (removableElements && removableElements.length > 0)
      removableElements.forEach(element => element.remove());

    if (this.report) this.report.remove();

    System.log(20, {
      user: this.main.zdnObject.data.user,
      data: [this.data.id],
    });
  }
}
