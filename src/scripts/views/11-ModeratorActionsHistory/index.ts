/* eslint-disable no-underscore-dangle */
import HideElement from "@root/scripts/helpers/HideElement";
import WaitForElement from "@root/scripts/helpers/WaitForElement";
import ServerReq from "@ServerReq";
import html2canvas from "html2canvas";
import md5 from "js-md5";
import linkifyHtml from "linkifyjs/html";
import Button, { JQueryButtonElementType } from "../../components/Button";
import Modal from "../../components/Modal";
import notification from "../../components/notification2";
import Action from "../../controllers/Req/Brainly/Action";
import IsKeyAlphaNumeric from "../../helpers/IsKeyAlphaNumeric";
import ActionEntry from "./_/ActionEntry";

const MAX_MESSAGE_LENGTH = 512;

export default class ModeratorActionHistory {
  details: any[];
  entries: any[];
  moderator: { id: number; nick: string; _id?: string };
  message: string;
  fixedMessage: string;
  actionLink: string;
  $actionRows: JQuery<HTMLElement>;
  actionRows: any;
  $confirmButton: JQueryButtonElementType;
  $disapproveButton: JQueryButtonElementType;
  $actionButtonsContainer: JQuery<HTMLElement>;
  $confirmButtonSpinnerContainer: JQuery<HTMLElement>;
  $disapproveButtonSpinnerContainer: JQuery<HTMLElement>;
  $spinner: JQuery<HTMLElement>;
  questionLink: any;
  action: string;
  reportableEntries: any;
  shortCodeOfScreenshot: string;
  screenshot: Blob;
  modal: any;
  modalResolve: (value?: unknown) => void;
  modalReject: (reason?: any) => void;
  $textarea: any;
  $preview: JQuery<HTMLElement>;
  $counter: JQuery<HTMLElement>;
  $noButtonContainer: JQuery<HTMLElement>;
  $sendButtonSpinnerContainer: JQuery<HTMLElement>;
  $noButton: JQueryButtonElementType;
  $sendButton: JQueryButtonElementType;
  $sendButtonSpinner: JQuery<HTMLElement>;
  loopTimer: any;

  constructor() {
    this.details = [];
    /**
     * @type {ActionEntry[]}
     */
    this.entries = [];
    this.message = "";
    this.fixedMessage = "";

    this.Init();
  }

  get hashList() {
    return this.entries.map(entry => entry.hash);
  }

  ReportableEntries() {
    return this.entries.filter(entry => !entry.details);
  }

  get reportableHashList() {
    return this.ReportableEntries().map(entry => entry.hash);
  }

  async Init() {
    try {
      if (!System.checkUserP(28)) return;

      const activities = await WaitForElement(".activities");

      if (!activities) return;

      this.$actionRows = $(".activities tr");
      this.actionRows = this.$actionRows.toArray();

      this.SetModeratorDetails();
      this.PrepareActionIds();
    } catch (error) {
      console.error(error);
    }
  }

  async SetModeratorDetails() {
    // @ts-ignore
    const resModerator = await new Action().GetUser(window.sitePassedParams[0]);

    if (resModerator && resModerator.success) {
      this.moderator = resModerator.data;

      this.GetEntryDetails();
    }
  }

  PrepareActionIds() {
    this.$actionRows.each((i, tr) => {
      const entry = new ActionEntry(this, tr);

      this.entries.push(entry);
    });
  }

  async GetEntryDetails() {
    const resDetails = await new ServerReq().ActionsHistoryDetails(
      this.hashList,
      this.moderator.id,
      this.moderator.nick,
    );

    if (resDetails && resDetails.success) {
      this.details = resDetails.data.entries;
      this.moderator._id = resDetails.data.user_id;
    }

    this.RenderDetails();
    this.RenderActions();
  }

  /**
   * @param {string} hash
   */
  GetEntry(hash) {
    return this.entries.find(entry => entry.hash === hash);
  }

  RenderDetails() {
    this.entries.forEach(entry => {
      entry.details = this.details.find(
        detail => detail.target.hash === entry.hash,
      );

      entry.RenderDetails();
    });
  }

  RenderActions() {
    if (
      this.details.length < this.$actionRows.length &&
      this.moderator.id !== System.data.Brainly.userData.user.id
    ) {
      this.RenderActionButtons();
      this.RenderSpinner();
      this.BindHandlers();
    }
  }

  RenderActionButtons() {
    this.$confirmButton = Button({
      type: "solid-mint",
      size: "small",
      text: System.data.locale.moderatorActionHistory.confirmAll,
    });
    this.$disapproveButton = Button({
      type: "solid-peach",
      size: "small",
      text: System.data.locale.moderatorActionHistory.disapproveAll,
    });
    this.$actionButtonsContainer = $(`
    <div class="sg-content-box sg-content-box--spaced">
      <div class="sg-content-box__content sg-content-box__content--spaced-top-xlarge sg-content-box__content--spaced-bottom-xlarge">
        <div class="sg-actions-list">
          <div class="sg-actions-list__hole">
            <div class="sg-spinner-container"></div>
          </div>
          <div class="sg-actions-list__hole">
            <div class="sg-spinner-container"></div>
          </div>
        </div>
      </div>
    </div>`);

    this.$confirmButtonSpinnerContainer = $(
      ".sg-spinner-container:eq(0)",
      this.$actionButtonsContainer,
    );
    this.$disapproveButtonSpinnerContainer = $(
      ".sg-spinner-container:eq(1)",
      this.$actionButtonsContainer,
    );

    this.$confirmButton.appendTo(this.$confirmButtonSpinnerContainer);
    this.$disapproveButton.appendTo(this.$disapproveButtonSpinnerContainer);
    this.$actionButtonsContainer.insertAfter("table.activities");
  }

  RenderSpinner() {
    this.$spinner = $(`
    <div class="sg-spinner-container__overlay">
      <div class="sg-spinner sg-spinner--xsmall"></div>
    </div>`);
  }

  BindHandlers() {
    this.$confirmButton.on("click", this.Confirm.bind(this));
    this.$disapproveButton.on("click", this.Disapprove.bind(this));
  }

  async Confirm() {
    await this.Confirming();

    if (
      !confirm(
        System.data.locale.moderatorActionHistory.notificationMessages
          .doYouWantToConfirmUnreviewedActions,
      )
    )
      this.FinishProgress();
    else {
      await this.PrepareReportDetails();

      const res = await new ServerReq().ConfirmActionHistoryEntry(
        this.moderator._id,
        {
          hashList: this.reportableHashList,
          actionLink: this.actionLink,
          questionLink: this.questionLink,
        },
      );

      this.CheckResponse(res);
    }
  }

  Confirming() {
    this.action = "confirm";

    return this.InProgress("Confirming");
  }

  InProgress(method) {
    this.reportableEntries = this.ReportableEntries();

    if (this.reportableEntries.length === 0) return Promise.reject();

    if (this.reportableEntries.length === 1) {
      this.entries.forEach(
        entry =>
          entry.hash === this.reportableEntries[0].hash && entry[this.action],
      );
      throw Error("No entry");
    }

    window.isPageProcessing = true;

    this.ShowSpinner();
    this.DisableButtons();
    this.reportableHashList.forEach(hash => this.GetEntry(hash)[method]());

    return System.Delay(50);
  }

  ShowSpinner() {
    let $spinnerContainer;

    if (this.action === "confirm")
      $spinnerContainer = this.$confirmButtonSpinnerContainer;
    else if (this.action === "disapprove")
      $spinnerContainer = this.$disapproveButtonSpinnerContainer;

    if ($spinnerContainer) this.$spinner.appendTo($spinnerContainer);
  }

  DisableButtons() {
    this.$confirmButton.Disable();
    this.$disapproveButton.Disable();
  }

  FinishProgress() {
    window.isPageProcessing = false;

    this.HideSpinner();
    this.ActivateButtons();
    this.reportableHashList.forEach(hash =>
      this.GetEntry(hash).FinishProgress(),
    );
  }

  HideSpinner() {
    HideElement(this.$spinner);
  }

  ActivateButtons() {
    this.$confirmButton.Enable();
    this.$disapproveButton.Enable();
  }

  CheckResponse(res) {
    if (!res || !res.success) {
      this.FinishProgress();
      notification({
        html:
          res.message ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
        type: "error",
      });
    } else {
      this.SetDetails(res.data);
    }
  }

  /**
   * @param {{hash: string, time: string, _id: string}[]} data
   */
  SetDetails(data) {
    data.forEach(log => {
      const entry = this.GetEntry(log.hash);

      entry.SetDetails(log);
    });

    if (this.action === "confirm") this.Confirmed();
    else if (this.action === "disapprove") this.Disapproved();
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

      if (
        !confirm(
          System.data.locale.moderatorActionHistory.notificationMessages
            .doYouWantToDisapproveUnreviewedActions,
        )
      )
        this.FinishProgress();
      else {
        await this.PrepareReportDetails();

        if (event) await this.InformModerator();

        const res = await new ServerReq().DisapproveActionHistoryEntry(
          this.moderator._id,
          {
            hashList: this.reportableHashList,
            actionLink: this.actionLink,
            questionLink: this.questionLink,
            message: this.fixedMessage,
          },
        );

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
    this.questionLink = await this.PrepareQuestionLinks();

    if (!this.questionLink) {
      throw Error(`Storing question links has failed`);
    }
  }

  async InformModerator() {
    this.shortCodeOfScreenshot = await this.TakeScreenshot();

    if (!this.shortCodeOfScreenshot)
      throw Error(`Taking screenshot has failed`);

    this.actionLink = `${System.data.config.extension.shortenedLinkURL}/${this.shortCodeOfScreenshot}`;

    return this.OpenModal({
      actionLink: this.actionLink,
      questionLink: this.questionLink,
    });
  }

  TakeScreenshot(hash?: string): Promise<string> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        this.ChangeVisibilityOtherElementsForScreenshot("hide");

        const element = document.querySelector("#container");
        const useWidth = element.scrollWidth;
        const useHeight = element.scrollHeight;
        const canvas = await html2canvas(document.body, {
          width: useWidth - 130,
          height: useHeight,
          x: 55,
          y: 0,
        });

        // eslint-disable-next-line no-param-reassign
        if (!hash) hash = md5(this.reportableHashList.join());

        canvas.toBlob(async blob => {
          // @ts-ignore
          blob.name = `${hash}.png`;
          this.screenshot = blob;
          // this.PreviewScreenshot(blob);
          const resScreenshot = await new ServerReq().ActionHistoryEntryImage(
            blob,
          );

          this.ChangeVisibilityOtherElementsForScreenshot("show");
          resolve(
            resScreenshot && resScreenshot.data && resScreenshot.data.shortCode,
          );
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
    if (method === "hide")
      $("#container").css({
        padding: 0,
        margin: 0,
      });
    else $("#container").removeAttr("style");

    // @ts-expect-error
    this.$actionButtonsContainer[method]();
    this.ChangeVisibilityOfReportedEntries(method === "show");
    // @ts-expect-error
    $(
      "#main-panel, #moderate-functions-panel, #footer, .tasksPagination, noscript",
    )[method]();
  }

  /**
   * @param {boolean} makeItVisible
   */
  ChangeVisibilityOfReportedEntries(makeItVisible) {
    this.entries.forEach(entry => {
      if (entry.details) {
        if (makeItVisible) entry.Show();
        else entry.Hide();
      }
    });
  }

  /**
   * @param {boolean} makeItVisible
   * @param {string} excludedHash
   */
  ChangeVisibilityOfAllEntries(makeItVisible, excludedHash) {
    this.entries.forEach(entry => {
      if (excludedHash !== entry.hash) {
        if (makeItVisible) entry.Show();
        else entry.Hide();
      }
    });
  }

  async PrepareQuestionLinks() {
    const links = [];

    this.reportableEntries.forEach(entry => {
      const link = entry.questionLink;

      if (!links.includes(link)) links.push(link);
    });

    if (links.length === 1) return links[0];

    const resLinks = await new ServerReq().ActionHistoryEntryLinks(links);

    return `${System.data.config.extension.shortenedLinkURL}/${resLinks.shortCode}`;
  }

  /* PreviewScreenshot(blob: Blob) {
    const $imgcontainer = $("<div></div>");
    $imgcontainer.attr(
      "style",
      "position: absolute; top: 100px; left:100px; z-index:9999;",
    );
    $imgcontainer.appendTo("body");

    const newImg = document.createElement("img");
    const url = URL.createObjectURL(blob);

    newImg.onload = () => {
      URL.revokeObjectURL(url);
    };

    newImg.src = url;
    $imgcontainer.append(newImg);
  } */

  OpenModal({ actionLink = undefined, questionLink = undefined } = {}) {
    return new Promise((resolve, reject) => {
      if (!this.modal) this.RenderModal();

      this.modalResolve = resolve;
      this.modalReject = reject;
      this.actionLink = actionLink;
      this.questionLink = questionLink;

      this.modal.Open();
      this.$textarea
        .val(
          System.data.locale.moderatorActionHistory.sampleMessage.replace(
            /%\{(.*?)}/gi,
            "$$$1",
          ),
        )
        .change()
        .focus();
    });
  }

  RenderModal() {
    const wouldYouLikeToInform = System.data.locale.moderatorActionHistory.notificationMessages.wouldYouLikeToInform.replace(
      /%\{nick}/gi,
      `<b>${this.moderator.nick}</b>`,
    );
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
          <div class="sg-spinner-container"></div>
        </div>
        <div class="sg-actions-list__hole"></div>
      </div>`,
      size: "large",
    });

    this.message = "";
    this.$textarea = $("textarea", this.modal.$content);
    this.$preview = $("blockquote", this.modal.$content);
    this.$counter = $("p > .sg-text--mint", this.modal.$content);
    this.$noButtonContainer = $(
      ".sg-actions-list__hole:nth-child(2)",
      this.modal.$actions,
    );
    this.$sendButtonSpinnerContainer = $(
      ".sg-spinner-container",
      this.modal.$actions,
    );

    this.RenderNoButton();
    this.RenderSendButton();
    this.RenderSendButtonSpinner();
    this.BindModalHandlers();
  }

  RenderNoButton() {
    this.$noButton = Button({
      size: "small",
      text: System.data.locale.common.no,
    });

    this.$noButton.appendTo(this.$noButtonContainer);
  }

  RenderSendButton() {
    this.$sendButton = Button({
      type: "solid-mint",
      size: "small",
      text: System.data.locale.common.send,
    });

    this.$sendButton.prependTo(this.$sendButtonSpinnerContainer);
  }

  RenderSendButtonSpinner() {
    this.$sendButtonSpinner = $(`
    <div class="sg-spinner-container__overlay">
      <div class="sg-spinner sg-spinner--xsmall"></div>
    </div>`);
  }

  BindModalHandlers() {
    this.$noButton.on("click", this.CancelModal.bind(this));
    this.modal.$close.on("click", this.CancelModal.bind(this));
    this.$sendButton.on("click", () => {
      this.FixMessage();
      this.SendMessage();
    });
    this.$textarea.on({
      keydown: this.LimitMessage.bind(this),
      "input change": this.UpdatePreview.bind(this),
    });
  }

  CancelModal() {
    this.message = "";
    this.fixedMessage = "";

    this.modal.Close();
    this.modalResolve(null);
  }

  FixMessage() {
    this.message = String(this.$textarea.val());
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
    // console.log(this.ComputeVariableLength());
    this.$counter.text(this.fixedMessage.length);
  }

  ComputeVariableLength() {
    if (!this.message) return 0;

    const typedLen = {
      nick: (this.message.match(/\$n/gi) || []).length,
      action: (this.message.match(/\$a/gi) || []).length,
      question: (this.message.match(/\$q/gi) || []).length,
    };
    const valuesLen = {
      nick: this.moderator.nick.length,
      action: this.actionLink.length,
      question: this.questionLink.length,
    };
    console.log(typedLen);
    console.log(valuesLen);

    return (
      typedLen.nick * valuesLen.nick +
      typedLen.action * valuesLen.action +
      typedLen.question * valuesLen.question
    );
  }

  /**
   * @param {} event
   */
  LimitMessage(event: JQuery.KeyDownEvent) {
    if (
      this.fixedMessage.length >= MAX_MESSAGE_LENGTH &&
      IsKeyAlphaNumeric(event)
    ) {
      event.preventDefault();

      return true;
    }

    return false;
  }

  UpdatePreview(event) {
    this.FixMessage();

    if (this.LimitMessage(event)) return;

    let message = this.fixedMessage.replace(/\n/g, "<br>");

    if (System.checkBrainlyP(150))
      message = linkifyHtml(message, {
        target: "_blank",
        className: "sg-text sg-text--link sg-text--blue-dark",
      });

    this.$preview.html(message);
  }

  async SendMessage() {
    this.ShowSendButtonSpinner();

    try {
      const resSend = await new Action().SendMessage(
        { user_id: this.moderator.id },
        this.fixedMessage,
      );
      // .HelloWorld({ user_id: this.moderator.id });

      if (!resSend || !resSend.success)
        throw resSend.message || "Can't send message";

      this.modal.Close();
      this.modalResolve(this.message);
    } catch (error) {
      this.modal.notification({ html: error, type: "error" });
      this.modalReject(error);
    }

    this.HideSendButtonSpinner();
  }

  ShowSendButtonSpinner() {
    this.$sendButtonSpinner.appendTo(this.$sendButtonSpinnerContainer);
  }

  HideSendButtonSpinner() {
    HideElement(this.$sendButtonSpinner);
  }

  InitTimer() {
    if (!this.loopTimer)
      this.loopTimer = setInterval(this.RunTimer.bind(this), 1000);
  }

  RunTimer() {
    this.entries.forEach(entry => entry.StartTimer());
  }

  TryToStopTimer() {
    const entriesHasTimersRunning = this.entries.filter(
      entry => !!entry.runTimer,
    );

    if (entriesHasTimersRunning.length === 0) {
      clearInterval(this.loopTimer);

      this.loopTimer = undefined;
    }
  }
}

// eslint-disable-next-line no-new
new ModeratorActionHistory();
