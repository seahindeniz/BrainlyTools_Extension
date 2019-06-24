import html2canvas from "html2canvas";
import md5 from "js-md5";
import linkifyHtml from 'linkifyjs/html';
import moment from "moment";
import notification from "../../../components/notification";
import ServerReq from "../../../controllers/Req/Server";

const REPORT_EDIT_TIME_LIMIT = ["1", "hour"]; // see also actionsHistory/index.js

export default class ActionEntry {
  /**
   * @param {import("../index").default} main
   * @param {HTMLTableRowElement} tr
   */
  constructor(main, tr) {
    this.main = main;
    this.$tr = $(tr);
    this.$buttonContainer = $("> td.dataTime", tr);
    this.$entryContent = $("> td:eq(1)", tr);
    this.$moderatedContentOwnerLink = $("a", this.$entryContent);
    this.$questionLink = $("> a", this.$buttonContainer);
    this.questionId = this.$questionLink.text();
    /**
     * @type {string}
     */
    this.questionLink = System.createBrainlyLink("task", { id: this.questionId });
    /**
     * @type {{_id: string, time: Date, target: {hash: string, action: string, message?: string}, user: {_id: string, brainlyID: number, nick: string}}}
     */
    this.details;

    this.GenerateHash();
  }
  get moderatedContentOwner() {
    return {
      nick: this.$moderatedContentOwnerLink.text(),
      link: location.origin + this.$moderatedContentOwnerLink.attr("href")
    }
  }
  get moderatorAction() {
    return this.$moderatedContentOwnerLink.prev().text()
  }
  get moderatorActionDate() {
    let childNodes = this.$buttonContainer.prop("childNodes");

    return childNodes ? childNodes[childNodes.length - 1].data.trim() : "";
  }
  get entryContent() {
    let content = Array.from(this.$entryContent.prop("childNodes")).find(node => node.nodeName == "#text" && node.length > 1 && node.nextSibling != null)
    return content ? content.data.trim() : "";
  }
  GenerateHash() {
    let idText = this.$buttonContainer.text().trim();

    this.hash = md5(idText + this.entryContent)
  }
  RenderDetails() {
    if (!this.details) {
      if (this.main.moderator.id != System.data.Brainly.userData.user.id) {
        this.RenderActionButtons();
        this.RenderButtonSpinner();
        this.BindHandlers();
      }
    } else {
      this.AddStatusClass();
      this.RenderFlagIcon();
      this.InitTimer();
      this.RenderDetailsCell();
    }
  }
  RenderActionButtons() {
    this.$actionButtonsContainer = $(`
    <div class="sg-content-box js-actions">
      <div class="sg-content-box__content">
        <div class="sg-spinner-container">
          <div class="sg-text sg-text--link" title="${System.data.locale.moderatorActionHistory.confirm}">
            <div class="sg-icon sg-icon--mint sg-icon--x26">
              <svg class="sg-icon__svg">
                <use xlink:href="#icon-thumbs_up"></use>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div class="sg-content-box__content">
        <div class="sg-spinner-container">
          <div class="sg-text sg-text--link" title="${System.data.locale.moderatorActionHistory.disapprove}">
            <div class="sg-icon sg-icon--peach sg-icon--x22">
              <svg class="sg-icon__svg">
                <use xlink:href="#icon-x"></use>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>`);

    this.$confirmButtonSpinnerContainer = $(".sg-spinner-container:eq(0)", this.$actionButtonsContainer);
    this.$disapproveButtonSpinnerContainer = $(".sg-spinner-container:eq(1)", this.$actionButtonsContainer);
    this.$actionButtons = $(".sg-text--link", this.$actionButtonsContainer)
    this.$confirmButton = $(".sg-text--link", this.$confirmButtonSpinnerContainer);
    this.$disapproveButton = $(".sg-text--link", this.$disapproveButtonSpinnerContainer);

    this.$actionButtonsContainer.prependTo(this.$buttonContainer);
  }
  RenderButtonSpinner() {
    this.$spinner = $(`
    <div class="sg-spinner-container__overlay">
      <div class="sg-spinner sg-spinner--xsmall"></div>
    </div>`);
  }
  BindHandlers() {
    this.$confirmButton.click(this.confirm.bind(this));
    this.$disapproveButton.click(this.disapprove.bind(this));
  }
  /**
   * @param {MouseEvent} event
   */
  async confirm(event) {
    await this.Confirming();

    if (event.ctrlKey || !event.ctrlKey && confirm(System.data.locale.moderatorActionHistory.notificationMessages.doYouWantToConfirm)) {
      let res = await new ServerReq().ConfirmActionHistoryEntry(this.main.moderator._id, {
        hashList: this.hash,
        content: this.entryContent,
        questionLink: this.questionLink,
        moderatorAction: this.moderatorAction,
        moderatorActionDate: this.moderatorActionDate,
        contentOwner: this.moderatedContentOwner
      });

      this.CheckResponse(res);
    } else
      this.FinishProgress();
  }
  Confirming() {
    if (this.details)
      return Promise.reject();

    this.action = "confirm";

    return this.InProgress();
  }
  InProgress() {
    window.isPageProcessing = true;

    this.ShowSpinner();
    this.DisableButtons();
    this.$tr.addClass("processing");

    return System.Delay(50);
  }
  ShowSpinner() {
    let $spinnerContainer;

    if (this.action == "confirm")
      $spinnerContainer = this.$confirmButtonSpinnerContainer;
    else if (this.action == "disapprove")
      $spinnerContainer = this.$disapproveButtonSpinnerContainer;

    if ($spinnerContainer)
      this.$spinner.appendTo($spinnerContainer);
  }
  DisableButtons() {
    this.$actionButtons.addClass("sg-text--disabled");
  }
  FinishProgress() {
    window.isPageProcessing = false;

    if (!this.details) {
      this.HideSpinner();
      this.ActivateButtons();
    } else {
      this.HideButtons();
    }

    this.$tr.removeClass("processing");
  }
  HideButtons() {
    this.HideElement(this.$actionButtonsContainer);
  }
  HideElement($element) {
    this.main.HideElement($element);
  }
  HideSpinner() {
    this.HideElement(this.$spinner);
    this.$spinnerContainer = undefined;
  }
  ActivateButtons() {
    this.$actionButtons.removeClass("sg-text--disabled");
  }
  /**
   * @param {{success: boolean, data: []}} res
   */
  async CheckResponse(res) {
    if (!res || !res.success)
      this.FinishProgress();
    else {
      this.SetDetails(res.data[0]);
    }
  }
  /**
   * @param {{_id: string, time: string, hash: string}} data
   */
  SetDetails(data) {
    this.details = {
      _id: data._id,
      time: data.time || new Date().toISOString(),
      target: {
        hash: this.hash,
        action: this.action
      },
      user: {
        brainlyID: System.data.Brainly.userData.user.id,
        nick: System.data.Brainly.userData.user.nick
      }
    };

    if (this.action == "confirm")
      this.Confirmed();
    else if (this.action == "disapprove") {
      if (this.main.fixedMessage)
        this.details.target.message = this.main.fixedMessage;

      this.Disapproved();
    }
  }
  Confirmed() {
    this.FinishProgress();
    this.RenderDetails();
  }
  /**
   * @param {MouseEvent} event
   */
  async disapprove(event) {
    await this.Disapproving();

    if (event.ctrlKey || !event.ctrlKey && confirm(System.data.locale.moderatorActionHistory.notificationMessages.doYouWantToDisapprove)) {
      if (!!event)
        await this.InformModerator();

      let res = /* { success: true } // */ await new ServerReq().DisapproveActionHistoryEntry(this.main.moderator._id, {
        hashList: this.hash,
        content: this.entryContent,
        questionLink: this.questionLink,
        message: this.main.fixedMessage,
        moderatorAction: this.moderatorAction,
        moderatorActionDate: this.moderatorActionDate,
        contentOwner: this.moderatedContentOwner
      });

      this.CheckResponse(res);
    } else
      this.FinishProgress();
  }
  Disapproving() {
    this.action = "disapprove";

    return this.InProgress();
  }
  async InformModerator() {
    await this.TakeScreenshot();

    return this.main.OpenModal({
      actionLink: `${System.data.config.extension.shortenedLinkURL}/${this.shortCodeOfScreenshot}`,
      questionLink: this.questionLink
    });
  }
  TakeScreenshot() {
    return new Promise(async (resolve, reject) => {
      try {
        this.main.ChangeVisibilityOfAllEntries(false, this.hash);
        this.main.ChangeVisibilityOtherElementsForScreenshot("hide");

        let shortCode = await this.main.TakeScreenshot(this.hash);

        this.main.ChangeVisibilityOfAllEntries(true, this.hash);
        this.main.ChangeVisibilityOtherElementsForScreenshot("show");

        this.shortCodeOfScreenshot = shortCode;

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
  Disapproved() {
    this.FinishProgress();
    this.RenderDetails();
  }
  RenderDetailsCell() {
    let time = new Date(this.details.time).toLocaleString();
    let reviewerProfileLink = System.createProfileLink(this.details.user);
    let reviwedOnBy = System.data.locale.moderatorActionHistory.reviewedOn[this.details.target.action]
      .replace("%{date}", time)
      .replace("%{nick}", `<a href="${reviewerProfileLink}" target="_blank">${this.details.user.nick}</a>`);

    this.$detailsRow = $(`
    <tr>
      <td class="sg-box--gray-secondary-ultra-light">
        <div class="sg-content-box">
          <div class="sg-content-box__content sg-content-box__content--full">
            <span class="sg-text sg-text--xsmall sg-text--gray">${reviwedOnBy}</span>
          </div>
        </div>
      </td>
    </tr>`);

    this.$detailsContainer = $(".sg-content-box", this.$detailsRow);

    this.ShowDetailsCell();
    this.RenderPM();
  }
  ShowDetailsCell() {
    if (this.$detailsRow) {
      this.$detailsRow.insertAfter(this.$tr);
      this.$buttonContainer.attr("rowspan", 2);
    }
  }
  HideDetailsCell() {
    if (this.$detailsRow) {
      this.HideElement(this.$detailsRow);
      this.$buttonContainer.removeAttr("rowspan");
    }
  }
  RenderPM() {
    if (this.details.target.message) {
      let message = linkifyHtml(this.details.target.message, {
        target: "_blank",
        className: "sg-text sg-text--link sg-text--xsmall sg-text--blue-dark"
      });
      message = message.replace(/\n/gi, "<br />");
      this.$pmContainer = $(`
      <div class="sg-content-box__content sg-content-box__content--full sg-content-box__content--spaced-bottom-large">
        <span class="sg-text sg-text--xsmall sg-text--bold">${System.data.locale.moderatorActionHistory.PM}</span>
        <span class="sg-text sg-text--xsmall">: ${message}</span>
      </div>
      <div class="sg-horizontal-separator"></div>`);

      this.$pmContainer.prependTo(this.$detailsContainer);
    }
  }
  AddStatusClass() {
    if (this.details.target.action == "confirm")
      this.$tr.addClass("confirmed");

    if (this.details.target.action == "disapprove")
      this.$tr.addClass("disapproved");
  }
  RemoveStatusClass() {
    this.$tr.removeClass("confirmed disapproved");
  }
  RenderFlagIcon() {
    let icon;
    let color;

    if (this.details.target.action == "confirm") {
      icon = "check";
      color = "mint";
    }

    if (this.details.target.action == "disapprove") {
      icon = "x";
      color = "peach";
    }

    this.$flagContainer = $(`
    <div class="sg-content-box flag">
      <div class="sg-content-box__content sg-content-box__content--with-centered-text sg-content-box__content--full">
        <svg class="sg-icon sg-icon--x32 sg-icon--${color}">
          <use xlink:href="#icon-${icon}"></use>
        </svg>
      </div>
    </div>`);

    this.$flagContainer.prependTo(this.$buttonContainer);
  }
  HideFlagIcon() {
    this.HideElement(this.$flagContainer);
  }
  InitTimer() {
    if (this.details.user.brainlyID == System.data.Brainly.userData.user.id && this.IsReportCanReversible()) {
      this.runTimer = true;

      this.RenderTimer();
      this.RenderRevertSpinner();
      this.StartTimer();
      this.main.InitTimer();
    }
  }
  RenderTimer() {
    this.$timerContainer = $(`
    <div class="sg-content-box__content">
      <div class="sg-spinner-container">
        <div class="sg-content-box">
          <div class="sg-content-box__content sg-content-box__content--with-centered-text sg-content-box__content--full">
            <div class="sg-label sg-label--small sg-label--secondary sg-actions-list--centered">
              <div class="sg-label__icon">
                <div class="sg-icon sg-icon--gray-secondary sg-icon--x14 sg-icon--reverse">
                  <svg class="sg-icon__svg">
                    <use xlink:href="#icon-reload"></use>
                  </svg>
                </div>
              </div>
              <div class="sg-text sg-text--xsmall sg-text--link sg-text--bold sg-text--peach-dark">${System.data.locale.moderatorActionHistory.revert}</div>
            </div>
          </div>
          <div class="sg-content-box__content sg-content-box__content--with-centered-text sg-content-box__content--full">
            <span class="sg-text sg-text--xsmall sg-text--gray-secondary sg-text--bold">00:00</span>
          </div>
        </div>
      </div>
    </div>`);
    this.$timer = $(".sg-content-box__content:nth-child(2) .sg-text", this.$timerContainer);
    this.$revert = $(".sg-label > .sg-text", this.$timerContainer);
    this.$revertSpinnerContainer = $(".sg-spinner-container", this.$timerContainer);

    this.$timerContainer.appendTo(this.$flagContainer);

    this.BindTimerHandler();
  }
  BindTimerHandler() {
    this.$revert.click(this.RevertReport.bind(this));
  }
  async RevertReport(event) {
    await this.ShowRevertSpinner();

    if (
      (
        !event ||
        (
          event && confirm(System.data.locale.moderatorActionHistory.notificationMessages.doYouWantToRevertThisReport)
        )
      ) && this.IsReportCanReversible()
    ) {
      let resRevert = await new ServerReq().RevertActionHistoryReport(this.details._id);

      if (!resRevert || !resRevert.success) {
        if (resRevert.exception == 408)
          this.CloseTimer();

        return notification(System.data.locale.moderatorActionHistory.notificationMessages.iCouldntRevertThisReport, "error");
      }

      this.CloseTimer();
    }

    this.HideRevertSpinner();
  }
  CloseTimer() {
    this.details = undefined;

    this.FinishTimer();
    this.HideFlagIcon();
    this.HideDetailsCell();
    this.RemoveStatusClass();
    this.RenderDetails();
  }
  RenderRevertSpinner() {
    this.$revertSpinner = $(`
    <div class="sg-spinner-container__overlay">
      <div class="sg-spinner sg-spinner--xsmall"></div>
    </div>`);
  }
  ShowRevertSpinner() {
    this.$revertSpinner.appendTo(this.$revertSpinnerContainer);

    return System.Delay(10);
  }
  HideRevertSpinner() {
    this.HideElement(this.$revertSpinner);
  }
  StartTimer() {
    if (this.runTimer && this.details) {
      let timeLeft = this.IsReportCanReversible();

      if (!timeLeft)
        return this.StopTimer();

      this.$timer.text(timeLeft);
    }
  }
  IsReportCanReversible() {
    let now = moment();
    let end = moment(this.details.time).add(...REPORT_EDIT_TIME_LIMIT);
    let duration = moment.duration(end.diff(now));

    return now < end ? `${duration.minutes()}:${duration.seconds()}` : false;
  }
  StopTimer() {
    this.runTimer = false;

    this.HideTimer();
    this.main.TryToStopTimer();
  }
  FinishTimer() {
    this.StopTimer();
    this.HideElement(this.$timerContainer);
  }
  HideTimer() {
    this.main.HideElement(this.$timerContainer);
  }
  Show() {
    this.$tr.removeClass("js-hidden");
    this.ShowDetailsCell();
  }
  Hide() {
    this.$tr.addClass("js-hidden");
    this.HideDetailsCell();
  }
}
