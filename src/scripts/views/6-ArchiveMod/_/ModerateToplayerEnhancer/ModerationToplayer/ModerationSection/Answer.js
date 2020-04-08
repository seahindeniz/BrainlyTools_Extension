import notification from "@/scripts/components/notification2";
import {
  Button,
  Flex,
  SpinnerContainer
} from "@/scripts/components/style-guide";
import Action from "@/scripts/controllers/Req/Brainly/Action";
import Build from "@/scripts/helpers/Build";
import ModerationSection from ".";

export default class AnswerSection extends ModerationSection {
  /**
   * @param {import("..").default} main
   * @param {import("..").AnswerEntryType} data
   */
  constructor(main, data) {
    super(main, data);

    this.contentType = "answer";

    this.RenderDeleteButtons({
      type: "destructive",
    });

    if (this.report && System.checkBrainlyP(146))
      this.RenderConfirmButton();
  }
  RenderConfirmButton() {
    this.confirmButtonContainer = Build(Flex({
      marginLeft: "xs",
      children: this.confirmButtonSpinnerContainer,
    }), [
      [
        this.confirmButtonSpinnerContainer = SpinnerContainer(),
        this.confirmButton = Button({
          size: "xsmall",
          text: System.data.locale.common.confirm,
          type: "solid-mint",
        })
      ]
    ]);

    this.buttonContainer.append(this.confirmButtonContainer)
    this.confirmButton.addEventListener("click", this.Confirm.bind(
      this));
  }
  async Confirm() {
    try {
      await this.ShowConfirmButtonSpinner();

      if (
        this.processing ||
        !confirm(System.data.locale.userContent.notificationMessages
          .doYouWantToConfirmThisContent)
      )
        return super.HideSpinner();

      this.processing = true;
      let resConfirm = await new Action().ConfirmAnswer(this.data.id);
      this.processing = false;

      if (!resConfirm)
        throw "Empty response";

      if (!resConfirm.success)
        throw { msg: resConfirm.message, res: resConfirm };

      this.Confirmed();
    } catch (error) {
      console.error(error);
      this.main.main.toplayerZdnObject.setMessage(error.msg || System.data
        .locale.common.notificationMessages.operationError, "failure");
    }

    super.HideSpinner();
  }
  ShowConfirmButtonSpinner() {
    return super.ShowSpinner(this.confirmButtonSpinnerContainer);
  }
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

    let removableElements = this.container
      .querySelectorAll(".to-correct, .to-correct2, .wrong");

    if (removableElements && removableElements.length > 0)
      removableElements.forEach(element => element.remove());

    if (this.report)
      this.report.remove();

    System.log(20, {
      user: this.main.zdnObject.data.user,
      data: [this.data.id],
    });
  }
}
