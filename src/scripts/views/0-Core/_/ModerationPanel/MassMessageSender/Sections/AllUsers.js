import { GetUserByID } from "../../../../../../controllers/ActionsOfBrainly";
import moment from "moment";

const ERROR = "sg-box--peach";
const USER_NOT_FOUND = "sg-box--dark";
const SUCCESS = "sg-box--blue-secondary";

class User {
  constructor(data) {
    this.data = data;

    this.Render();
    this.RenderSpinner();
  }
  Render() {
    let time = moment().format('LTS');;
    this.$ = $(`
		<li class="sg-list__element">
			<div class="sg-spinner-container sg-box--full">
				<div class="sg-box sg-box--no-min-height sg-box--xxsmall-padding sg-box--no-border sg-box--full">
					<div class="sg-box__hole">
						<span class="sg-text sg-text--small sg-text--gray sg-text--bold">${this.data.id} - ${time}</span>
					</div>
				</div>
			</div>
		</li>`);

    this.$box = $(".sg-box", this.$);
    this.$spinnerContainer = $(".sg-spinner-container", this.$);
  }
  RenderSpinner() {
    this.$spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--small"></div></div>`);
  }
  ShowSpinner() {
    this.$spinner.appendTo(this.$spinnerContainer);
  }
  HideSpinner() {
    this.$spinner.appendTo("<div />");
  }
  Mark(status) {
    let _class = SUCCESS;

    if (status == 500) {
      _class = USER_NOT_FOUND;
    } else if (status) {
      _class = ERROR;
    }

    this.RemoveMarks();
    this.$box.addClass(_class);
  }
  RemoveMarks() {
    this.$box.removeClass(`${ERROR} ${SUCCESS} ${USER_NOT_FOUND}`);
  }
}

class AllUsers {
  constructor(main) {
    this.main = main;
    this.delayTimer;
    this.logElements = {};

    this.Render();
    this.RenderLogs();
    this.RenderSpinner();
    this.BindEvents();
  }
  Render() {
    this.$ = $(`
		<div class="sg-actions-list">
			<div class="sg-actions-list__hole sg-actions-list__hole--equal-width">
				<div class="sg-spinner-container sg-box--full">
					<input type="text" class="sg-input sg-input--full-width" placeholder="${System.data.locale.core.MessageSender.lastRegisteredUserId}">
				</div>
			</div>
			<div class="sg-actions-list__hole sg-actions-list__hole--equal-width"></div>
		</div>`);

    this.$userId = $("input", this.$);
    this.$spinnerContainer = $(".sg-spinner-container", this.$);
    this.$logsContainer = $(".sg-actions-list__hole:eq(1)", this.$);
  }
  RenderLogs() {
    this.$logsWrapper = $(`
		<div class="sg-select sg-textarea--xxtall sg-textarea--full-width" style="overflow: auto; padding: 3px;">
			<ul class="sg-list sg-list--spaced-elements"></ul>
		</div>`);

    this.$logs = $("ul", this.$logsWrapper);
  }
  RenderSpinner() {
    this.$spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--small"></div></div>`);
  }
  BindEvents() {
    this.$userId.on("input", this.CheckInputValue.bind(this));
  }
  CheckInputValue() {
    let id = this.UserId();

    this.ClearDelay();

    if (this.IsNotEmpty(id))
      this.delayTimer = setTimeout(() => this.VerifyUserId(~~id), 1000);
  }
  UserId() {
    let value = this.$userId.val().trim();

    return System.ExtractId(value);
  }
  ClearDelay() {
    if (this.delayTimer)
      clearTimeout(this.delayTimer);
  }
  IsNotEmpty(value) {
    let state = "valid";
    let isEmpty = !value || value === "" || !this.IsPosInt(value) || !(~~value > 0);

    this.$userId.attr("class", "sg-input sg-input--full-width");

    if (isEmpty)
      state = "invalid";

    this.$userId.addClass(`sg-input--${state}`);

    return !isEmpty
  }
  IsPosInt(value) {
    return /^\+?\d+$/.test(value);
  }
  async VerifyUserId(id) {
    let user = await GetUserByID(id);
    let state = "success";

    if (!user || !user.success || !user.data) {
      state = "error";

      if (user.message) {
        this.main.modal.notification(user.message, "error");
      }
    }

    this.$userId.addClass(state);
  }
  get idList() {
    let id = this.UserId();

    if (id && id > 0 && this.$userId.is(".success"))
      return `${id}:1`;
  }
  ShowEmptyIdListError() {
    this.main.modal.notification(System.data.locale.core.notificationMessages.youNeedToEnterValidId, "error");
    this.$userId.focus().addClass(`error`);
  }
  ShowSpinner() {
    this.ShowLogs();
    this.$spinner.appendTo(this.$spinnerContainer);
  }
  HideSpinner() {
    this.main.HideElement(this.$spinner);
  }
  ShowLogs() {
    this.$logsWrapper.appendTo(this.$logsContainer);
  }
  BeforeSending(data) {
    let log = this.logElements[data.id] = new User(data);

    log.ShowSpinner();
    log.$.prependTo(this.$logs);
    this.ClearLastLog();
  }
  ClearLastLog() {
    let $logs = $("> *", this.$logs);

    if ($logs.length > 300) {
      $logs.last().remove();
    }
  }
  MessageSend(data) {
    /**
     * @type {User}
     */
    let log = this.logElements[data.id];

    log.HideSpinner();
    log.Mark(data.exception_type);
  }
}

export default AllUsers
