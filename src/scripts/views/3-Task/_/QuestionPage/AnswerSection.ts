import notification from "@components/notification2";
import Action from "@BrainlyAction";
import { DeleteReasonSubCategoryType } from "@root/controllers/System";
import HideElement from "@root/helpers/HideElement";
import InsertAfter from "@root/helpers/InsertAfter";
import WaitForElement from "@root/helpers/WaitForElement";
import { Button, Flex, Icon, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import tippy from "tippy.js";
import type { AnswerDataType } from "./QuestionData";
import type QuestionPageClassType from "./QuestionPage";
import QuickDeleteButton from "./QuickDeleteButton";

export default class AnswerSection {
  main: QuestionPageClassType;
  data: AnswerDataType;
  index: number;

  moderationBox: HTMLDivElement;
  answerBox: HTMLDivElement;
  quickActionButtonContainer: FlexElementType;
  actionButtons: Button[];
  confirmButtonContainer: FlexElementType;
  confirmButton: Button;
  extraDetails: {
    databaseId: number;
    user: {
      nick: string;
      avatar: string;
    };
    userId: number;
    confirmed: boolean;
    thanks: number;
    rating: number;
    attachments: [];
  };

  constructor(
    main: QuestionPageClassType,
    data: AnswerDataType,
    index: number,
  ) {
    this.main = main;
    this.data = data;
    this.index = index;
    this.actionButtons = [];
    this.extraDetails = window.jsData.question.answers.find(
      answer => answer.databaseId === data.id,
    );

    this.Init();
  }

  async Init() {
    await this.FindModerationBox();
    this.RenderQuickActionButtons();
    this.RenderConfirmButton();
  }

  async FindModerationBox() {
    const moderationBoxes = Array.from(
      await WaitForElement(".js-question-answers > div > .sg-box > .sg-flex", {
        multiple: true,
      }),
    ) as HTMLDivElement[];

    this.moderationBox = moderationBoxes[this.index];

    if (!this.moderationBox) {
      throw Error("Cannot find answer moderation box");
    }

    const answerBoxes = document.querySelectorAll(
      ".js-question-answers > div > .js-answer",
    );

    this.answerBox = answerBoxes[this.index] as HTMLDivElement;

    if (!this.answerBox) {
      throw Error("Cannot find answer box");
    }
  }

  RenderQuickActionButtons() {
    this.quickActionButtonContainer = Flex({
      wrap: true,
    });

    InsertAfter(
      this.quickActionButtonContainer,
      this.moderationBox.firstElementChild,
    );

    System.data.config.quickDeleteButtonsReasons.answer.forEach(
      (reasonId, index) => {
        const reason = System.DeleteReason({ id: reasonId, type: "answer" });

        if (!reason) return;

        const qdb = new QuickDeleteButton(
          this,
          { type: "solid-peach" },
          reason,
          index + 1,
        );

        this.actionButtons.push(qdb.button);
        this.quickActionButtonContainer.append(qdb.container);
      },
    );
  }

  RenderConfirmButton() {
    if (!this.data.settings.isMarkedAbuse) return;

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
      const resConfirm = await new Action().ConfirmAnswer(this.data.id);

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
    this.answerBox.classList.add("brn-content--confirmed");

    System.log(20, {
      user: {
        nick: this.extraDetails.user.nick,
        id: this.data.userId,
      },
      data: [this.data.id],
    });
  }

  DisableActionButtons() {
    this.actionButtons.forEach(button => button.Disable());
  }

  EnableActionButtons() {
    this.actionButtons.forEach(button => button.Enable());
  }

  async Delete(reason: DeleteReasonSubCategoryType) {
    try {
      this.DisableActionButtons();

      const giveWarning = System.canBeWarned(reason.id);
      const taskData = {
        model_id: this.data.id,
        reason_id: reason.category_id,
        reason: reason.text,
        reason_title: reason.title,
        give_warning: giveWarning,
        take_points: giveWarning,
      };

      const res = await new Action().RemoveAnswer(taskData);

      new Action().CloseModerationTicket(this.main.data.id);

      if (!res?.success) {
        throw res?.message ? { msg: res?.message } : res;
      }

      this.Deleted();

      System.log(6, {
        user: {
          id: this.extraDetails.userId,
          nick: this.extraDetails.user.nick,
        },
        data: [this.data.id],
      });
    } catch (error) {
      console.error(error);
      notification({
        type: "error",
        html:
          error.msg ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
      });
    }

    this.main.HideActionButtonSpinner();
    this.EnableActionButtons();
  }

  Deleted() {
    this.quickActionButtonContainer.remove();
    this.answerBox.classList.add("brn-content--deleted");
  }
}
