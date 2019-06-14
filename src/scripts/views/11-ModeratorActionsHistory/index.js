import html2canvas from "html2canvas";
import md5 from "js-md5";
import linkifyHtml from 'linkifyjs/html';
import Modal from "../../components/Modal";
import Action from "../../controllers/Req/Brainly/Action";
import ServerReq from "../../controllers/Req/Server";
import IsKeyAlphaNumeric from "../../helpers/IsKeyAlphaNumeric";
import WaitForElement from "../../helpers/WaitForElement";
import ActionEntry from "./_/ActionEntry";

const MAX_MESSAGE_LENGTH = 512;

export default class ModeratorActionHistory {
  constructor() {
    this.details = [];
    /**
     * @type {ActionEntry[]}
     */
    this.entries = [];
    /**
     * @type {{id: number, nick: string, _id: string}}
     */
    this.moderator;
    this.message = "";
    this.fixedMessage = "";
    this.Init();
  }
  get hashList() {
    return this.entries.map(entry => entry.hash);
  }
  get reportableHashList() {
    return this.entries.filter(entry => !entry.details);
  }
  async Init() {
    try {
      if (System.checkUserP(28)) {
        let activities = await WaitForElement(".activities");

        if (activities && activities.length > 0) {
          this.$actionRows = $(".activities tr");
          this.actionRows = this.$actionRows.toArray();

          this.SetModeratorDetails();
          this.PrepareActionIds();
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  async SetModeratorDetails() {
    let resModerator = await new Action().GetUser(window.sitePassedParams[0]);

    if (resModerator && resModerator.success) {
      this.moderator = resModerator.data;

      this.GetEntryDetails();
    }
  }
  PrepareActionIds() {
    this.$actionRows.each((i, tr) => {
      let entry = new ActionEntry(this, tr);

      this.entries.push(entry);
    });
  }
  async GetEntryDetails() {
    let resDetails = await new ServerReq().ActionsHistoryDetails(this.hashList, this.moderator.id, this.moderator.nick);

    if (resDetails && resDetails.success) {
      this.details = resDetails.data.entries;
      this.moderator._id = resDetails.data.user_id
    }

    this.RenderDetails();
    this.RenderActions();
  }
  /**
   * @param {string} hash
   */
  GetEntry(hash) {
    return this.entries.find(entry => entry.hash == hash);
  }
  RenderDetails() {
    this.entries.forEach(entry => {
      entry.details = this.details.find(detail => detail.target.hash == entry.hash);

      entry.RenderDetails();
    })
  }
  RenderActions() {
    if (
      this.details.length < this.$actionRows.length &&
      this.moderator.id != System.data.Brainly.userData.user.id
    ) {
      this.RenderActionButtons();
      this.RenderSpinner();
      this.BindHandlers();
    }
  }
  RenderActionButtons() {
    this.$actionButtonsContainer = $(`
    <div class="sg-content-box sg-content-box--spaced">
      <div class="sg-content-box__content sg-content-box__content--spaced-top-xlarge sg-content-box__content--spaced-bottom-xlarge">
        <div class="sg-actions-list">
          <div class="sg-actions-list__hole">
            <div class="sg-spinner-container">
              <button class="sg-button-secondary">${System.data.locale.moderatorActionHistory.confirmAll}</button>
            </div>
          </div>
          <div class="sg-actions-list__hole">
            <div class="sg-spinner-container">
              <button class="sg-button-secondary sg-button-secondary--peach">${System.data.locale.moderatorActionHistory.disapproveAll}</button>
            </div>
          </div>
        </div>
      </div>
    </div>`);

    this.$confirmButtonSpinnerContainer = $(".sg-spinner-container:eq(0)", this.$actionButtonsContainer);
    this.$disapproveButtonSpinnerContainer = $(".sg-spinner-container:eq(1)", this.$actionButtonsContainer);
    this.$confirmButton = $("button", this.$confirmButtonSpinnerContainer);
    this.$disapproveButton = $("button", this.$disapproveButtonSpinnerContainer);
    this.$actionButtons = $("button", this.$actionButtonsContainer);

    this.$actionButtonsContainer.insertAfter("table.activities");
  }
  RenderSpinner() {
    this.$spinner = $(`
    <div class="sg-spinner-container__overlay">
      <div class="sg-spinner sg-spinner--xsmall"></div>
    </div>`);
  }
  BindHandlers() {
    this.$confirmButton.click(this.Confirm.bind(this));
    this.$disapproveButton.click(this.Disapprove.bind(this));
  }
  async Confirm() {
    await this.Confirming();

    if (!confirm(System.data.locale.moderatorActionHistory.notificationMessages.doYouWantToConfirmUnreviewedActions))
      this.FinishProgress();
    else {
      await this.PrepareReportDetails();

      let res = await new ServerReq().ConfirmActionHistoryEntry(this.moderator._id, {
        hashList: this.reportableEntries,
        content: this.actionLink,
        questionLink: this.questionLink
      });

      this.CheckResponse(res);
    }
  }
  Confirming() {
    this.action = "confirm";

    return this.InProgress("Confirming");
  }
  InProgress(method) {
    this.reportableEntries = this.ReportableEntries();

    if (this.reportableEntries.length == 0)
      return Promise.reject();

    window.isPageProcessing = true;

    this.ShowSpinner();
    this.DisableButtons();
    this.reportableHashList.forEach(hash => this.GetEntry(hash)[method]());

    return System.Delay(50);
  }
  ReportableEntries() {
    return this.reportableHashList.filter(hash => !this.GetEntry(hash).details && hash);
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
    this.$actionButtons.addClass("sg-button-secondary--disabled");
  }
  FinishProgress() {
    window.isPageProcessing = false;

    this.HideSpinner();
    this.ActivateButtons();
    this.reportableHashList.forEach(hash => this.GetEntry(hash).FinishProgress());
  }
  HideSpinner() {
    this.HideElement(this.$spinner);
  }
  /**
   * @param {JQuery<HTMLElement>} $element
   */
  HideElement($element) {
    if ($element && $element.length > 0)
      $element.appendTo("<div />");
  }
  ActivateButtons() {
    this.$actionButtons.removeClass("sg-button-secondary--disabled");
  }
  CheckResponse(res) {
    if (!res || !res.success)
      this.FinishProgress();
    else {
      this.SetDetails(res.data);
    }
  }
  /**
   * @param {Object<string,{_id: string, time: string}>} data
   */
  SetDetails(data) {
    let hashList = Object.keys(data);

    hashList.forEach(hash => {
      let entryData = data[hash];
      let entry = this.GetEntry(hash);

      entry.SetDetails(entryData);
    });

    if (this.action == "confirm")
      this.Confirmed();
    else if (this.action == "disapprove")
      this.Disapproved();
  }
  Confirmed() {
    this.FinishProgress();
  }
  Disapproved() {
    this.FinishProgress();
  }
  /**
   * @param {MouseEvent} event
   */
  async Disapprove(event) {
    try {
      await this.Disapproving();

      if (!confirm(System.data.locale.moderatorActionHistory.notificationMessages.doYouWantToDisapproveUnreviewedActions))
        this.FinishProgress();
      else {
        await this.PrepareReportDetails();

        if (!!event)
          await this.InformModerator();

        let res = await new ServerReq().DisapproveActionHistoryEntry(this.moderator._id, {
          hashList: this.reportableEntries,
          content: this.actionLink,
          questionLink: this.questionLink,
          message: this.fixedMessage
        });

        this.CheckResponse(res);
      }
    } catch (error) {
      console.error(error);
    }
  }
  Disapproving() {
    this.action = "disapprove";

    return this.InProgress("Disapproving");
  }
  async PrepareReportDetails() {
    try {
      this.shortCodeOfScreenshot = await this.TakeScreenshot();
      this.questionLink = await this.PrepareQuestionLinks();

      if (!this.shortCodeOfScreenshot)
        throw { message: `Taking screenshot has failed ${this.shortCodeOfScreenshot.message || ""}` };
      else if (!questionLink)
        throw { message: `Storing question links has failed` };

      this.actionLink = `${System.data.config.extension.shortenedLinkURL}/${this.shortCodeOfScreenshot}`;

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async InformModerator() {
    return this.OpenModal({
      actionLink: this.actionLink,
      questionLink: this.questionLink
    });
  }
  TakeScreenshot(hash) {
    return new Promise(async (resolve, reject) => {
      try {
        this.ChangeVisibilityOtherElementsForScreenshot("hide");

        let element = document.querySelector("#container");
        var useWidth = element.scrollWidth;
        var useHeight = element.scrollHeight;
        let canvas = await html2canvas(document.body, {
          width: useWidth - 130,
          height: useHeight,
          x: 55,
          y: 0,
        });

        if (!hash)
          hash = md5(this.reportableEntries.join())

        canvas.toBlob(async (blob) => {
          blob.name = `${hash}.png`;
          this.screenshot = blob;
          //this.PreviewScreenshot(blob);
          let resScreenshot = await new ServerReq().ActionHistoryEntryImage(blob);

          this.ChangeVisibilityOtherElementsForScreenshot("show");
          resolve(resScreenshot && resScreenshot.data && resScreenshot.data.shortCode);
        }, "image/png");
      } catch (error) {
        reject(error);
      }
    });
  }
  /**
   * @param {"hide"|"show"} method
   */
  ChangeVisibilityOtherElementsForScreenshot(method) {
    if (method == "hide")
      $("#container").css({
        padding: 0,
        margin: 0
      });
    else
      $("#container").removeAttr("style");

    this.$actionButtonsContainer[method]();
    this.ChangeVisibilityOfReportedEntries(method == "show");
    $("#main-panel, #moderate-functions-panel, #footer, .tasksPagination, noscript")[method]();
  }
  /**
   * @param {boolean} makeItVisible
   */
  ChangeVisibilityOfReportedEntries(makeItVisible) {
    this.entries.forEach(entry => {
      if (entry.details) {
        if (makeItVisible)
          entry.Show();
        else
          entry.Hide();
      }
    })
  }
  /**
   * @param {boolean} makeItVisible
   * @param {string} excludedHash
   */
  ChangeVisibilityOfAllEntries(makeItVisible, excludedHash) {
    this.entries.forEach(entry => {
      if (excludedHash != entry.hash) {
        if (makeItVisible)
          entry.Show();
        else
          entry.Hide();
      }
    })
  }
  PrepareQuestionLinks() {
    return new Promise(async (resolve, reject) => {
      try {
        let links = [];

        this.reportableEntries.forEach(hash => {
          let link = this.GetEntry(hash).questionLink;

          if (!links.includes(link))
            links.push(link);
        })

        if (links.length == 1)
          return resolve(links[0]);

        let resLinks = await new ServerReq().ActionHistoryEntryLinks(links);

        resolve(`${System.data.config.extension.shortenedLinkURL}/${resLinks.shortCode}`);
      } catch (error) {
        reject(error);
      }
    });
  }
  /**
   * @param {Blob} blob
   */
  PreviewScreenshot(blob) {
    let $imgcontainer = $("<div></div>");
    $imgcontainer.attr("style", "position: absolute; top: 100px; left:100px; z-index:9999;");
    $imgcontainer.appendTo("body");

    let newImg = document.createElement('img');
    let url = URL.createObjectURL(blob);

    newImg.onload = () => {
      URL.revokeObjectURL(url);
    };

    newImg.src = url;
    $imgcontainer.append(newImg);
  }
  OpenModal({ actionLink, questionLink } = {}) {
    return new Promise((resolve, reject) => {
      if (!this.modal)
        this.RenderModal();

      this.modalResolve = resolve;
      this.modalReject = reject;
      this.actionLink = actionLink;
      this.questionLink = questionLink;

      this.modal.Open();
      this.$textarea
        .val(System.data.locale.moderatorActionHistory.sampleMessage.replace(/%\{(.*?)}/gi, "$$$1"))
        .change()
        .focus();
    })
  }
  RenderModal() {
    let wouldYouLikeToInform = System.data.locale.moderatorActionHistory.notificationMessages.wouldYouLikeToInform.replace(/%\{nick}/gi, `<b>${this.moderator.nick}</b>`);
    this.modal = new Modal({
      header: `
      <div class="sg-actions-list sg-actions-list--space-between">
        <div class="sg-actions-list__hole">
          <div class="sg-label sg-label--small sg-label--secondary">
            <div class="sg-text">${wouldYouLikeToInform}</div>
          </div>
        </div>
      </div>`,
      content: `
      <div class="sg-content-box">
        <div class="sg-content-box__content">
          <textarea class="sg-textarea sg-textarea--full-width sg-textarea--xtall" placeholder="${System.data.locale.common.writeSomething}" max="${MAX_MESSAGE_LENGTH}"></textarea>
        </div>
        <div class="sg-content-box__content sg-content-box__content--spaced-bottom">
          <div class="sg-actions-list sg-actions-list--no-wrap sg-actions-list--to-right">
            <div class="sg-actions-list__hole">
              <p class="sg-text sg-text--xsmall sg-text--gray sg-text--bold">
                <span class="sg-text--mint">0</span>/${MAX_MESSAGE_LENGTH}
              </p>
            </div>
          </div>
        </div>
        <div class="sg-content-box__content sg-content-box__content--spaced-top-large">
          <blockquote class="sg-text sg-text--break-words"></blockquote>
        </div>
      </div>`,
      actions: `
      <div class="sg-actions-list sg-actions-list--space-between">
        <div class="sg-actions-list__hole">
          <div class="sg-spinner-container">
            <button class="sg-button-secondary">${System.data.locale.messages.groups.send}</button>
          </div>
        </div>
        <div class="sg-actions-list__hole">
          <button class="sg-button-secondary sg-button-secondary--dark">${System.data.locale.common.no}</button>
        </div>
      </div>`,
      size: "large"
    });

    this.message = "";
    this.$textarea = $("textarea", this.modal.$content);
    this.$preview = $("blockquote", this.modal.$content);
    this.$noButton = $("button:eq(1)", this.modal.$actions);
    this.$sendButton = $("button:eq(0)", this.modal.$actions);
    this.$counter = $("p > .sg-text--mint", this.modal.$content);
    this.$sendButtonSpinnerContainer = $(".sg-spinner-container", this.modal.$actions);

    this.RenderSendButtonSpinner();
    this.BindModalHandlers();
  }
  RenderSendButtonSpinner() {
    this.$sendButtonSpinner = $(`
    <div class="sg-spinner-container__overlay">
      <div class="sg-spinner sg-spinner--xsmall"></div>
    </div>`);
  }
  BindModalHandlers() {
    this.$noButton.click(this.CancelModal.bind(this));
    this.modal.$close.click(this.CancelModal.bind(this));
    this.$sendButton.click(() => {
      this.FixMessage();
      this.SendMessage();
    });
    this.$textarea.on({
      "keydown": this.LimitMessage.bind(this),
      "input change": this.UpdatePreview.bind(this)
    });
  }
  CancelModal() {
    this.message = "";
    this.fixedMessage = "";

    this.modal.Close();
    this.modalResolve(null);
  }
  FixMessage() {
    this.message = this.$textarea.val();
    this.fixedMessage = this.message
      .replace(/\$n/gi, this.moderator.nick || "")
      .replace(/\$a/gi, this.actionLink || "")
      .replace(/\$q/gi, this.questionLink || "");
    /* let groups;
    this.fixedMessage = this.message
    .replace(/(?<a>\s|^)\$n(?<c>\s|$)/gi, (...args) => ((groups = {}, groups = args[args.length - 1]), `${groups.a}${this.moderator.nick || ""}${groups.c}`))
    .replace(/(?<a>\s|^)\$a(?<c>\s|$)/gi, (...args) => ((groups = {}, groups = args[args.length - 1]), `${groups.a}${this.actionLink || ""}${groups.c}`))
    .replace(/(?<a>\s|^)\$q(?<c>\s|$)/gi, (...args) => ((groups = {}, groups = args[args.length - 1]), `${groups.a}${this.questionLink || ""}${groups.c}`)); */

    this.UpdateCounter();
  }
  UpdateCounter() {
    //console.log(this.ComputeVariableLength());
    this.$counter.text(this.fixedMessage.length);
  }
  ComputeVariableLength() {
    if (this.message) {
      let typedLen = {
        nick: (this.message.match(/\$n/gi) || []).length,
        action: (this.message.match(/\$a/gi) || []).length,
        question: (this.message.match(/\$q/gi) || []).length
      }
      let valuesLen = {
        nick: this.moderator.nick.length,
        action: this.actionLink.length,
        question: this.questionLink.length
      };
      console.log(typedLen);
      console.log(valuesLen);

      return (
        typedLen.nick * valuesLen.nick +
        typedLen.action * valuesLen.action +
        typedLen.question * valuesLen.question
      )
    }
  }
  /**
   * @param {JQuery.KeyDownEvent} event
   */
  LimitMessage(event) {
    if (
      this.fixedMessage.length >= MAX_MESSAGE_LENGTH &&
      IsKeyAlphaNumeric(event)
    )
      return event.preventDefault() || true;
  }
  UpdatePreview(event) {
    this.FixMessage();

    if (this.LimitMessage(event))
      return false;

    let message = this.fixedMessage.replace(/\n/g, "<br>");

    if (System.checkBrainlyP(150))
      message = linkifyHtml(message, {
        target: "_blank",
        className: "sg-text sg-text--link sg-text--blue-dark"
      });

    this.$preview.html(message);
  }
  async SendMessage() {
    this.ShowSendButtonSpinner();

    try {
      let resSend = /* { success: true }; // */ await new Action().SendMessage({ user_id: this.moderator.id }, this.fixedMessage);

      if (!resSend || !resSend.success)
        throw resSend.message || "Can't send message";

      this.modal.Close();
      this.modalResolve(this.message);
    } catch (error) {
      this.modal.notification(error);
      this.modalReject(error);
    }

    this.HideSendButtonSpinner();
  }
  ShowSendButtonSpinner() {
    this.$sendButtonSpinner.appendTo(this.$sendButtonSpinnerContainer);
  }
  HideSendButtonSpinner() {
    this.HideElement(this.$sendButtonSpinner);
  }
  InitTimer() {
    if (!this._loop_timer)
      this._loop_timer = setInterval(this.RunTimer.bind(this), 1000);
  }
  RunTimer() {
    this.entries.forEach(entry => entry.StartTimer())
  }
  TryToStopTimer() {
    let entriesHasTimersRunning = this.entries.filter(entry => !!entry.runTimer);

    if (entriesHasTimersRunning.length == 0) {
      clearInterval(this._loop_timer);

      this._loop_timer = undefined;
    }
  }
}

new ModeratorActionHistory();
