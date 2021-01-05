// eslint-disable-next-line import/no-extraneous-dependencies
import Button, { JQueryButtonElementType } from "@components/Button";
import Modal from "@components/Modal";
// eslint-disable-next-line import/no-extraneous-dependencies
import template from "backtick-template";
import Components from "..";
import SendMessageToBrainlyIds from "../../../../../../../controllers/Req/Brainly/Action/SendMessageToBrainlyIds";
import IsKeyAlphaNumeric from "../../../../../../../helpers/IsKeyAlphaNumeric";
import AllUsersSection from "./Sections/AllUsers/AllUsers";
import IdListSection from "./Sections/IdList";
import ModeratorsSection from "./Sections/Moderators/Moderators";
import ResultsSection from "./Sections/Results";
// @ts-ignore
import templateModalContent from "./templates/ModalContent.html";

const MAX_MESSAGE_LENGTH = 512;

function LimitMessage(event: JQuery.KeyDownEvent) {
  const len = event.target.value.length;

  if (len >= MAX_MESSAGE_LENGTH && IsKeyAlphaNumeric(event))
    event.preventDefault();
}

export default class MassMessageSender extends Components {
  SendMessages: SendMessageToBrainlyIds;
  deletedUsers: number[];

  modal: Modal;
  $message: JQuery<HTMLElement>;
  $messageSpinner: JQuery<HTMLElement>;
  $targetRadios: JQuery<HTMLElement>;
  $targetRadiosContainer: JQuery<HTMLElement>;
  $buttonContainer: JQuery<HTMLElement>;
  $targetsSection: JQuery<HTMLElement>;
  $targetContainer: JQuery<HTMLElement>;
  $characterCount: JQuery<HTMLElement>;
  $spinner: JQuery<HTMLElement>;

  SelectedSection: AllUsersSection | ModeratorsSection | IdListSection;

  AllUsersSection: AllUsersSection;
  ModeratorsSection: ModeratorsSection;
  IdListSection: IdListSection;
  ResultsSection: ResultsSection;
  $sendButtonContainer: JQuery<HTMLElement>;
  $sendButton: JQueryButtonElementType;
  $continueButtonContainer: JQuery<HTMLElement>;
  $continueButton: JQueryButtonElementType;
  $stopButtonContainer: JQuery<HTMLElement>;
  $stopButton: JQueryButtonElementType;
  StoppedSection: JQuery<HTMLElement>;

  constructor(main) {
    super(main);

    this.SendMessages = new SendMessageToBrainlyIds({
      EachBefore: this.BeforeSending.bind(this),
      Each: this.MessageSent.bind(this),
      Done: this.SendingDone.bind(this),
    });
    /**
     * @type {number[]}
     */
    this.deletedUsers = [];
    this.liLinkContent = System.data.locale.core.MessageSender.text;

    this.RenderListItem();
    this.RenderModal();
    this.RenderSpinner();
    this.RenderAllUsersSection();
    this.RenderModeratorsSection();
    this.RenderIdListSection();
    this.RenderResultsSection();
    this.RenderSendButton();
    this.RenderContinueButton();
    this.RenderStopButton();
    this.BindHandlers();
  }

  RenderModal() {
    this.modal = new Modal({
      header: `
			<div class="sg-actions-list sg-actions-list--space-between">
				<div class="sg-actions-list__hole">
					<div class="sg-text sg-text--peach">${System.data.locale.core.MessageSender.text}</div>
				</div>
      </div>`,
      // TODO use components here
      content: template(templateModalContent, { MAX_MESSAGE_LENGTH }),
      actions: `<div class="sg-actions-list"></div>`,
      size: "large",
    });

    this.$message = $("textarea", this.modal.$modal);
    this.$messageSpinner = this.$message.parent();
    this.$targetRadios = $(`input[name="target"]`, this.modal.$modal);
    this.$targetRadiosContainer = $(
      `> .sg-content-box > .sg-content-box__actions .sg-content-box__actions > .sg-actions-list`,
      this.modal.$content,
    );
    this.$buttonContainer = $(".sg-actions-list", this.modal.$actions);
    this.$targetsSection = $(
      "> .sg-content-box > .sg-content-box__actions",
      this.modal.$content,
    );
    this.$targetContainer = $(
      `> .sg-content-box > .sg-content-box__content:eq(1)`,
      this.$targetsSection,
    );
    this.$characterCount = $(
      "> .sg-content-box > .sg-content-box__content > .sg-actions-list > .sg-actions-list__hole > .sg-text > span",
      this.modal.$content,
    );
  }

  RenderSpinner() {
    this.$spinner = $(
      `<div class="sg-spinner-container__overlay"><div class="sg-spinner"></div></div>`,
    );
  }

  RenderAllUsersSection() {
    this.AllUsersSection = new AllUsersSection(this);
  }

  RenderModeratorsSection() {
    this.ModeratorsSection = new ModeratorsSection(this);
  }

  RenderIdListSection() {
    this.IdListSection = new IdListSection(this);
  }

  RenderResultsSection() {
    this.ResultsSection = new ResultsSection();
  }

  RenderSendButton() {
    this.$sendButtonContainer = $(`<div class="sg-actions-list__hole"></div>`);

    this.$sendButton = Button({
      type: "solid-mint",
      text: System.data.locale.common.send,
    });

    this.$sendButton.appendTo(this.$sendButtonContainer);
  }

  RenderContinueButton() {
    this.$continueButtonContainer = $(
      `<div class="sg-actions-list__hole"></div>`,
    );

    this.$continueButton = Button({
      type: "solid-blue",
      text: System.data.locale.common.continue,
    });

    this.$continueButton.appendTo(this.$continueButtonContainer);
  }

  RenderStopButton() {
    this.$stopButtonContainer = $(`<div class="sg-actions-list__hole"></div>`);

    this.$stopButton = Button({
      type: "solid-peach",
      text: System.data.locale.common.stop,
    });

    this.$stopButton.appendTo(this.$stopButtonContainer);
  }

  BindHandlers() {
    this.li.addEventListener("click", this.OpenModal.bind(this));
    this.modal.$close.on("click", this.modal.Close.bind(this.modal));
    this.$message.on({
      keydown: LimitMessage.bind(this),
      input: this.UpdateCharCount.bind(this),
    });
    this.$targetRadios.on("change", this.SwitchTarget.bind(this));
    this.$sendButton.on("click", this.StartSending.bind(this));
    this.$stopButton.on("click", this.StopSending.bind(this));
    this.$continueButton.on("click", this.ContinueSending.bind(this));
  }

  OpenModal() {
    this.modal.Open();
    this.ModeratorsSection.RenderModerators();
  }

  /**
   * @param {JQuery.KeyPressEvent} event
   */
  UpdateCharCount(event) {
    const len = event.target.value.length;

    this.$characterCount.text(len);
    this.$message.removeClass("error");

    if (len > MAX_MESSAGE_LENGTH)
      this.$characterCount
        .removeClass("sg-text--mint")
        .addClass("sg-text--peach-dark");
    else
      this.$characterCount
        .removeClass("sg-text--peach-dark")
        .addClass("sg-text--mint");
  }

  /**
   * @param {JQuery.ChangeEvent} event
   */
  SwitchTarget(event) {
    this.ShowSendButton();
    this.HideModeratorsSection();
    this.HideIdInputSection();
    this.HideAllUsersSection();
    this.ModeratorsSection.ClearUserList();

    if (event.target.id === "allUsers") this.ShowAllUsersSection();
    else if (event.target.id === "moderators") this.ShowModeratorsSection();
    else if (event.target.id === "idList") this.ShowIdInputSection();
  }

  ShowSendButton() {
    this.HideStopButton();
    this.$sendButtonContainer.appendTo(this.$buttonContainer);
  }

  HideSendButton() {
    this.HideElement(this.$sendButtonContainer);
    this.$sendButton.text(System.data.locale.core.MessageSender.startOver);
  }

  ShowContinueButton() {
    this.$continueButtonContainer.appendTo(this.$buttonContainer);
  }

  HideContinueButton() {
    this.HideElement(this.$continueButtonContainer);
  }

  ShowStopButton() {
    this.HideSendButton();
    this.$stopButtonContainer.appendTo(this.$buttonContainer);
  }

  HideStopButton() {
    this.HideElement(this.$stopButtonContainer);
  }

  ShowAllUsersSection() {
    this.SelectedSection = this.AllUsersSection;

    this.AllUsersSection.$.appendTo(this.$targetContainer);
  }

  HideAllUsersSection() {
    this.HideElement(this.AllUsersSection.$);
  }

  ShowModeratorsSection() {
    this.SelectedSection = this.ModeratorsSection;

    this.ModeratorsSection.ChangeRank();
    this.ModeratorsSection.$.appendTo(this.$targetContainer);
  }

  HideModeratorsSection() {
    this.HideElement(this.ModeratorsSection.$);
  }

  ShowIdInputSection() {
    this.SelectedSection = this.IdListSection;

    this.IdListSection.$.appendTo(this.$targetContainer);
  }

  HideIdInputSection() {
    this.HideElement(this.IdListSection.$);
  }

  StartSending() {
    const { message } = this;
    let { idList } = this.SelectedSection;

    if (idList?.length > 0)
      idList = idList.filter(
        id => id !== System.data.Brainly.defaultConfig.user.ME.user.id,
      );

    if (!message || message.length > MAX_MESSAGE_LENGTH)
      this.ShowWrongMessageLengthError();
    else if (!idList || idList.length === 0) {
      if ("ShowEmptyIdListError" in this.SelectedSection)
        this.SelectedSection.ShowEmptyIdListError();
    } else {
      window.isPageProcessing = true;

      this.ShowSpinner();
      this.ShowStopButton();
      this.HideSendButton();
      this.HideContinueButton();
      this.ShowResultsSection();
      this.ResultsSection.ResetValues();
      this.SendMessages.Start(idList, message);
    }
  }

  get message() {
    return String(this.$message.val()).trim();
  }

  ShowWrongMessageLengthError() {
    this.modal.notification(
      System.data.locale.messages.notificationMessages.wrongMessageLength.replace(
        "%{max_value}",
        String(MAX_MESSAGE_LENGTH),
      ),
      "error",
    );
    this.$message.addClass("error").trigger("focus");
  }

  ShowSpinner() {
    this.SelectedSection.ShowSpinner();
    this.$spinner.appendTo(this.$messageSpinner);
  }

  HideSpinner() {
    this.HideElement(this.$spinner);
    this.SelectedSection.HideSpinner();
  }

  ShowResultsSection() {
    this.ResultsSection.$.insertAfter(this.$targetsSection);
  }

  HideResultsSection() {
    this.HideElement(this.ResultsSection.$);
  }

  async StopSending(isDone?: boolean) {
    window.isPageProcessing = false;

    this.SetStoppedSection();
    this.HideSpinner();
    this.SendMessages.Stop();

    if (isDone === true) {
      this.$sendButton.text(System.data.locale.common.send);
    }

    await System.Delay(300);
    this.ShowSendButton();

    if (isDone !== true) {
      this.ShowContinueButton();
    }
  }

  SetStoppedSection() {
    this.StoppedSection = $(":checked", this.$targetRadiosContainer);
  }

  async ContinueSending() {
    this.SendMessages.content = this.message;

    this.SwitchTarget({
      target: {
        id: this.StoppedSection.prop("checked", true).attr("id"),
      },
    });
    await System.Delay(10);
    this.ShowSpinner();
    this.ShowStopButton();
    this.HideSendButton();
    this.HideContinueButton();
    this.SendMessages.StartSending();
  }

  BeforeSending(user) {
    if (!("BeforeSending" in this.SelectedSection)) return;

    this.SelectedSection.BeforeSending(user);
  }

  MessageSent(user) {
    this.CheckErrorStatus(user);
    this.UpdateResultsNumbers(user);
    this.SelectedSection.MessageSent(user);
  }

  CheckErrorStatus(user) {
    if (user.validation_errors) {
      this.StopSending();

      if (user.validation_errors) {
        const error = user.validation_errors.content;
        let errorMessage =
          System.data.locale.common.notificationMessages.somethingWentWrong;

        if (error.vulgarism) {
          errorMessage =
            System.data.locale.messages.notificationMessages
              .messageContainsSwear;
        } else if (error.length) {
          errorMessage = "";

          this.ShowWrongMessageLengthError();
        }

        this.modal.notification(errorMessage, "error");
      }
    }
  }

  UpdateResultsNumbers(user) {
    if (!user.exception_type) {
      this.ResultsSection.IncreaseSent();
    } else if (user.exception_type === 500) {
      this.ResultsSection.IncreaseUsersNotFound();
    } else {
      this.ResultsSection.IncreaseErrors();
    }
  }

  SendingDone() {
    this.StopSending(true);
    this.HideContinueButton();
  }
}
