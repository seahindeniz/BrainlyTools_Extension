import Action from "@BrainlyAction";
import notification from "@components/notification2";
import { DeleteReasonSubCategoryType } from "@root/controllers/System";
import HideElement from "@root/helpers/HideElement";
import InsertAfter from "@root/helpers/InsertAfter";
import WaitForElement from "@root/helpers/WaitForElement";
import { Button, Flex, Icon, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import Hammer from "hammerjs";
import tippy from "tippy.js";
import type QuestionPageClassType from "./QuestionPage";
import QuickDeleteButton from "./QuickDeleteButton";

export default class QuestionSection {
  main: QuestionPageClassType;

  searchingForModerationBox: boolean;
  moderationBox: HTMLDivElement;
  moderateButton: HTMLButtonElement;
  questionBox: HTMLDivElement;
  newModerateButton: Button;
  quickActionButtonContainer: FlexElementType;
  actionButtons: Button[];
  confirmButtonContainer: FlexElementType;
  confirmButton: Button;

  constructor(main: QuestionPageClassType) {
    this.main = main;
    this.actionButtons = [];

    this.Init();
  }

  get approvedAnswers() {
    return this.main.data.responses.filter(
      answerData => answerData.approved.approver,
    );
  }

  async Init(showError?: boolean) {
    if (this.searchingForModerationBox) return;

    await this.FindModerationBox(showError);
    this.FindQuestionContainer();

    if (!this.moderationBox) return;

    this.FindModerateButton();
    this.ReplaceModerateButtonWithNew();
    this.RenderQuickActionButtons();
    this.RenderConfirmButton();
  }

  async FindModerationBox(showError: boolean) {
    this.searchingForModerationBox = true;

    try {
      this.moderationBox = (await WaitForElement(
        ":scope > div > .sg-box > .sg-flex",
        { parent: this.main.questionContainer, noError: showError },
      )) as HTMLDivElement;
    } catch (error) {
      console.error(error);
    }

    this.searchingForModerationBox = false;
  }

  FindQuestionContainer() {
    this.questionBox = this.main.questionContainer.querySelector(
      ":scope > div > .brn-qpage-next-question-box",
    );

    if (!this.questionBox) {
      throw Error("Can't find the question box");
    }
  }

  FindModerateButton() {
    this.moderateButton = this.moderationBox.querySelector(":scope > button");

    if (!this.moderateButton) {
      throw Error("Can't find the question's moderate button");
    }
  }

  ReplaceModerateButtonWithNew() {
    if (!this.main.moderatePanelController) return;

    this.newModerateButton = new Button({
      size: "s",
      type: "solid-blue",
      icon: new Icon({
        size: 16,
        type: "pencil",
      }),
      children: this.moderateButton.lastElementChild.innerHTML,
      onClick: this.OpenModeratePanel.bind(this),
    });

    const hammer = new Hammer(this.newModerateButton.element);

    hammer.on("press", () => this.moderateButton.click());

    this.moderationBox.prepend(this.newModerateButton.element);
    this.moderateButton.classList.add("js-hidden");
  }

  OpenModeratePanel(event: MouseEvent) {
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      this.moderateButton.click();

      return;
    }

    this.main.moderatePanelController.Moderate();
  }

  RenderQuickActionButtons() {
    this.quickActionButtonContainer = Flex({
      wrap: true,
    });

    InsertAfter(
      this.quickActionButtonContainer,
      this.moderationBox.firstElementChild,
    );

    if (this.approvedAnswers.length > 0) return;

    System.data.config.quickDeleteButtonsReasons.question.forEach(
      (reasonId, index) => {
        const reason = System.DeleteReason({ id: reasonId, type: "question" });

        if (!reason) return;

        const qdb = new QuickDeleteButton(
          this,
          { type: "solid-mustard" },
          reason,
          index + 1,
        );

        this.actionButtons.push(qdb.button);
        this.quickActionButtonContainer.append(qdb.container);
      },
    );
  }

  RenderConfirmButton() {
    if (!this.main.data.isMarkedAbuse) return;

    this.confirmButtonContainer = Flex({
      children: this.confirmButton = new Button({
        size: "s",
        type: "solid-mint",
        iconOnly: true,
        icon: new Icon({
          type: "check",
          color: "light",
        }),
        onClick: this.Confirm.bind(this),
      }),
    });

    tippy(this.confirmButton.element, {
      content: Text({
        size: "small",
        weight: "bold",
        children: System.data.locale.common.confirm,
      }),
      theme: "light",
    });

    this.quickActionButtonContainer.append(this.confirmButtonContainer);
  }

  async Confirm() {
    if (
      !confirm(
        System.data.locale.userContent.notificationMessages
          .doYouWantToConfirmThisContent,
      )
    )
      return;

    this.confirmButtonContainer.append(this.main.actionButtonSpinner);
    this.DisableActionButtons();

    try {
      const resConfirm = await new Action().ConfirmQuestion(this.main.data.id);

      if (!resConfirm?.success) {
        throw resConfirm.message
          ? { msg: resConfirm.message }
          : resConfirm || Error("No response");
      }

      this.Confirmed();
    } catch (error) {
      console.error(error);
      notification({
        type: "error",
        html:
          error.msg ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
      });
    }

    this.EnableActionButtons();
  }

  Confirmed() {
    HideElement(this.confirmButtonContainer);
    this.questionBox.classList.add("brn-content--confirmed");
    System.log(19, {
      user: window.jsData.question.author,
      data: [window.jsData.question.databaseId],
    });
  }

  async Delete(reason: DeleteReasonSubCategoryType) {
    try {
      this.DisableActionButtons();

      const giveWarning = System.canBeWarned(reason.id);
      const taskData = {
        model_id: this.main.data.id,
        reason_id: reason.category_id,
        reason: reason.text,
        reason_title: reason.title,
        give_warning: giveWarning,
        take_points: giveWarning,
        return_points: !giveWarning,
      };

      // console.log(taskData);
      // const res = { success: true, message: "Failed" };
      // await System.TestDelay();

      const res = await new Action().RemoveQuestion(taskData);

      new Action().CloseModerationTicket(this.main.data.id);

      if (!res?.success) {
        throw res?.message ? { msg: res?.message } : res;
      }

      this.Deleted();
    } catch (error) {
      console.error(error);
      notification({
        type: "error",
        html:
          error.msg ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
      });
    }

    this.EnableActionButtons();
    this.main.HideActionButtonSpinner();
  }

  Deleted() {
    this.questionBox.classList.add("brn-content--deleted");
    this.quickActionButtonContainer.remove();

    this.main.answerSections.all.forEach(answerSection =>
      answerSection.Deleted(),
    );

    const userData = window.jsData.question.author;

    System.log(5, { user: userData, data: [this.main.data.id] });

    this.questionBox
      .querySelector(".brn-qpage-next-question-box__options")
      .remove?.();
  }

  DisableActionButtons() {
    this.actionButtons.forEach(button => button.Disable());
  }

  EnableActionButtons() {
    this.actionButtons.forEach(button => button.Enable());
  }
}
