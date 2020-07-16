/* eslint-disable camelcase */
import Build from "@/scripts/helpers/Build";
import IsVisible from "@/scripts/helpers/IsVisible";
import { Box, Button, Icon, Text, Flex } from "@style-guide";
import momentTz from "moment-timezone";
import notification from "../../../components/notification";
import Action from "../../../controllers/Req/Brainly/Action";
import ContentViewer_Content from "./ContentViewer_Content";
import SelectCheckbox from "./SelectCheckbox";

export default class UserContentRow {
  /**
   * @param {import("./UserContent").default} main
   * @param {number} id
   * @param {HTMLTableRowElement} element
   */
  constructor(main, id, element) {
    this.main = main;
    this.id = id;
    this.element = element;
    this.isBusy = false;
    this.deleted = false;
    this.contents = {
      question: null,
      answers: {},
    };
    this.comment = undefined;

    $(element).prop("that", this);

    this.RenderLinkContainer();
    this.AttachID();
    this.FetchContentWithPromise();
    this.RenderAfterResolve();
    this.RenderContentViewer();
    this.BindHandlers();
  }

  RenderLinkContainer() {
    const questionLink = this.element.querySelector("a[href]");

    if (questionLink instanceof HTMLAnchorElement) {
      this.container = Build(
        Flex({
          direction: "column",
          marginTop: "xs",
          marginBottom: "xs",
        }),
        [
          [
            (this.questionLinkContainerList = Flex()),
            [
              [
                Flex({
                  alignItems: "center",
                }),
                (this.questionLink = Text({
                  tag: "a",
                  size: "xsmall",
                  color: "blue-dark",
                  html: questionLink.innerHTML,
                  href: questionLink.href,
                  target: "_blank",
                })),
              ],
            ],
          ],
        ],
      );

      questionLink.after(this.container);
      questionLink.remove();
    }
  }

  AttachID() {
    if (this.questionLink instanceof HTMLAnchorElement) {
      const url = this.questionLink.href;
      this.element.questionID = System.ExtractId(url);
    }
  }

  async FetchContentWithPromise(refreshContent) {
    if (refreshContent || !this.resPromise) {
      /* this.content = this.main.questions[this.element.questionID] = new Content(this.element.questionID);
      this.content.resPromise = this.content.Fetch(); */
      if (
        !this.main.questions[this.element.questionID] ||
        !this.main.questions[this.element.questionID].resPromise
      ) {
        if (!this.main.questions[this.element.questionID])
          this.main.questions[this.element.questionID] = {};

        this.resPromise = new Action().GetQuestion(this.element.questionID);
        this.main.questions[
          this.element.questionID
        ].resPromise = this.resPromise;
      } else {
        this.resPromise = this.main.questions[
          this.element.questionID
        ].resPromise;
      }

      // return this.CheckContentPromise();
    }
  }

  async RenderAfterResolve() {
    await this.SetContentAfterResolve();

    if (this.res && this.res.success) {
      this.RenderQuestionContent();
      this.RenderAnswers();

      if (this.res.data.task.settings.is_deleted) this.Deleted(true);
    }

    if (this.main.caller === "Questions" || this.main.caller === "Answers") {
      this.isBusy = false;
      if (this.checkbox) this.checkbox.HideSpinner();
    }
  }

  async SetContentAfterResolve() {
    this.res = await this.resPromise;

    return Promise.resolve();
  }

  RenderContentViewer() {
    this.viewer = Flex({
      marginTop: "xs",
      marginBottom: "xs",
      direction: "column",
      children: (this.contentContainer = Box({
        border: false,
        style: "width: 52em;",
      })),
    });
  }

  RenderQuestionContent() {
    if (this.res && this.res.success) {
      const user = this.res.users_data.find(
        _user => _user.id === this.res.data.task.user_id,
      );
      const content = new ContentViewer_Content(this.res.data.task, user);
      this.contents.question = content;

      content.$.appendTo(this.contentContainer);

      this.RenderAttachmentsIcon(content.source);
      this.RenderReportedContentIcon(content.source);
    }

    /* let question = this.content.res.data.task;
    let user = this.content.res.users_data.find(user => user.id == question.user_id);
    let contentData = {
    	content: question.content,
    	user,
    	userProfileLink: System.createProfileLink(user.nick, user.id),
    	avatar: System.prepareAvatar(user.avatars, { returnIcon: true })
    }

    this.contentViewer_Contents.question = new ContentViewer_Content(contentData, question);

    this.contentViewer_Contents.question.$.appendTo(this.$contentContainer);

    this.RenderAttachmentsIcon(question); */
  }

  RenderAnswers() {
    if (
      this.res &&
      this.res.success &&
      this.res.data.responses &&
      this.res.data.responses.length > 0
    ) {
      this.res.data.responses.forEach(this.RenderAnswer.bind(this));
    }
  }

  RenderAnswer(answer) {
    const user = this.res.users_data.find(_user => _user.id === answer.user_id);
    const content = new ContentViewer_Content(answer, user);
    this.contents.answers[answer.id] = content;

    this.RenderAnswerSeparator();
    content.$.appendTo(this.contentContainer);

    if (
      Number(answer.user_id) === Number(window.sitePassedParams[0]) &&
      this.main.caller === "Answers"
    ) {
      this.AttachAnswerID(answer);
      this.RenderBestIcon(answer);
      this.RenderAttachmentsIcon(answer);
      this.RenderApproveIcon(answer);
      this.RenderReportedContentIcon(answer);
    }

    /* let user = this.content.res.users_data.find(user => user.id == answer.user_id);
    let contentData = {
    	content: answer.content,
    	user,
    	userProfileLink: System.createProfileLink(user.nick, user.id),
    	avatar: System.prepareAvatar(user.avatars, { returnIcon: true })
    }
    let content = new ContentViewer_Content(contentData, answer);

    this.RenderAnswerSeparator();
    content.$.appendTo(this.$contentContainer);
    this.contentViewer_Contents.answers[answer.id] = content;

    if (answer.user_id == window.sitePassedParams[0] && this.main.caller == "Answers") {
    	this.AttachAnswer(answer);
    	console.log(this);

    	this.RenderBestIcon(answer);
    	this.RenderApproveIcon(answer);
    } */
  }

  RenderAnswerSeparator() {
    const $separator = $(
      `<div class="sg-horizontal-separator sg-horizontal-separator--spaced"></div>`,
    );

    $separator.appendTo(this.contentContainer);
  }

  AttachAnswerID(answer) {
    const $dateCell = $("td:last", this.element);
    const date = $dateCell.text().trim();

    if (date) {
      const date2 = momentTz(answer.created);
      const date2Str = date2
        /* .utcOffset(System.data.Brainly.defaultConfig.locale
                .OFFSET) */
        .tz(System.data.Brainly.defaultConfig.config.data.config.timezone)
        .format("YYYY-MM-DD HH:mm:ss");

      if (date === date2Str) this.answerID = answer.id;
      else {
        console.log(answer.created);
        console.log(date, date2Str);
      }
    }
  }

  RenderBestIcon(answer) {
    if (!answer.best) return;

    this.RenderIcon({
      type: "solid-mustard",
      icon: new Icon({ type: "excellent" }),
      title: System.data.locale.userContent.bestAnswer,
    });
  }

  RenderApproveIcon(answer) {
    if (
      (this.approved || (answer.approved && answer.approved.date)) &&
      !this.approveIcon
    ) {
      this.approveIcon = this.RenderIcon({
        type: "solid-mint",
        icon: new Icon({
          type: "check",
          size: 18,
        }),
        title: System.data.locale.userContent.approvedAnswer,
      });
    }
  }

  HideApproveIcon() {
    if (this.approveIcon) this.HideElement(this.approveIcon.element);
  }

  /**
   * @param {HTMLElement} element
   */
  // eslint-disable-next-line class-methods-use-this
  HideElement(element) {
    if (element && element.parentElement)
      element.parentElement.removeChild(element);
  }

  RenderAttachmentsIcon(content) {
    if (content.attachments && content.attachments.length > 0) {
      /**
       * @type {import("@style-guide/Button").ButtonPropsType}
       */
      const iconProps = {
        type: "solid-blue",
        icon: new Icon({ type: "attachment" }),
        title: System.data.locale.userContent.hasAttachment.question,
      };

      if (this.main.caller === "Answers" || this.main.caller === "Comments") {
        if (content.responses) {
          iconProps.type = "solid";
          iconProps.className = "separator";
        } else {
          iconProps.title = System.data.locale.userContent.hasAttachment.answer;
        }
      }

      this.RenderIcon(iconProps);
    }
  }

  RenderReportedContentIcon(content) {
    if (
      content.is_marked_abuse ||
      (content.settings && content.settings.is_marked_abuse)
    ) {
      /**
       * @type {import("@style-guide/Button").ButtonPropsType}
       */
      const iconProps = {
        type: "solid-peach",
        icon: new Icon({ type: "report_flag" }),
        title: System.data.locale.userContent.reported.question,
      };

      if (this.main.caller === "Answers" || this.main.caller === "Comments") {
        if (content.responses) {
          iconProps.type = "solid";
          iconProps.className = "separator";
        } else {
          iconProps.title =
            System.data.locale.userContent.reported[
              this.main.caller === "Answers" ? "answer" : "comment"
            ];
        }
      }

      this.RenderIcon(iconProps);
    }
  }

  /**
   *
   * @param {import("@style-guide/Button").ButtonPropsType} props
   */
  RenderIcon({ className, ...props }) {
    /* let icon = IconAsButton({
      action: true,
      active: true,
      disabled: true,
      size: "xxsmall",
      className: `sg-list__icon--spacing-right-small ${className}`,
      ...props
    }); */
    /**
     * @type {import("@style-guide/Button").ButtonPropsType}
     */
    const iconProps = {
      noClick: true,
      iconOnly: true,
      size: "xs",
      className: `sg-list__icon--spacing-right-small ${className}`,
      ...props,
    };
    const icon = new Button(iconProps);

    if (!this.iconContainer) this.RenderIconContainer();

    this.iconContainer.append(icon.element);

    return icon;
  }

  RenderIconContainer() {
    this.iconContainer = Flex({
      alignItems: "center",
      marginRight: "xs",
    });

    this.questionLinkContainerList.prepend(this.iconContainer);
  }

  RenderCheckbox() {
    this.checkbox = new SelectCheckbox(this.element, this.id);

    this.isBusy = true;
    this.checkbox.ShowSpinner();
    // this.main.checkboxes.elements.push(checkbox);
    this.checkbox.onchange = this.main.HideSelectContentWarning.bind(this.main);
  }

  BindHandlers() {
    this.questionLink.addEventListener(
      "click",
      this.ToggleContentViewer.bind(this),
    );
  }

  /**
   * @param {Event} event
   */
  async ToggleContentViewer(event) {
    if (this.res && this.res.success) {
      if (event) event.preventDefault();

      if (this.contentContainer.childNodes.length === 0) {
        this.RenderQuestionContent();
        this.RenderAnswers();
      }

      if (IsVisible(this.viewer)) {
        this.HideElement(this.viewer);
      } else {
        this.container.append(this.viewer);
      }
    }
  }

  Deleted(already) {
    this.deleted = true;
    this.isBusy = false;

    this.checkbox.Disable();
    this.checkbox.HideSpinner();
    this.element.classList.add("removed");
    this.element.classList.remove("already");

    if (already) this.element.classList.add("already");
  }

  UnDelete() {
    this.deleted = false;
    this.isBusy = false;

    this.checkbox.Activate();
    this.element.classList.remove("removed", "already");
  }

  Reported(already) {
    this.reported = true;

    this.element.classList.add("reported");
    this.element.classList.remove("already");

    if (already) this.element.classList.add("already");
  }

  // eslint-disable-next-line class-methods-use-this
  IsNotApproved() {
    /* if (this.approved || (this.contents.answers[this.answerID].source.approved && this.contents.answers[this.answerID].source.approved.date)) {
    	this.Approved();
    }

    return !(this.approved || (this.contents.answers[this.answerID].source.approved && this.contents.answers[this.answerID].source.approved.date)) */
  }

  IsApproved() {
    return (
      this.approved ||
      (this.contents.answers[this.answerID].source.approved &&
        this.contents.answers[this.answerID].source.approved.date)
    );
  }

  Approved(already) {
    this.approved = true;

    this.RenderApproveIcon();
    this.element.classList.add("approved");
    this.element.classList.remove("unapproved", "already");

    if (already) this.element.classList.add("already");
  }

  Unapproved(already) {
    this.approved = false;

    this.HideApproveIcon();
    this.element.classList.add("unapproved");
    this.element.classList.remove("approved", "already");

    if (already) this.element.classList.add("already");
  }

  RowNumber() {
    return Number(
      this.element.children && this.element.children.length > 1
        ? this.element.children[1].innerText
        : 0,
    );
  }

  CheckDeleteResponse(resRemove) {
    const rowNumber = this.RowNumber();

    this.checkbox.HideSpinner();

    if (!resRemove || (!resRemove.success && !resRemove.message)) {
      notification(
        `#${rowNumber} > ${System.data.locale.common.notificationMessages.somethingWentWrong}`,
        "error",
      );
    } else {
      this.Deleted();

      if (!resRemove.success && resRemove.message) {
        this.element.classList.add("already");
        notification(`#${rowNumber} > ${resRemove.message}`, "error");
      }
    }
  }

  async CheckApproveResponse(resApprove) {
    const rowNumber = this.RowNumber();

    this.checkbox.HideSpinner();

    if (!resApprove) {
      notification(
        `#${rowNumber} > ${System.data.locale.common.notificationMessages.somethingWentWrong}`,
        "error",
      );
    } else if (!resApprove.success && resApprove.message) {
      notification(`#${rowNumber} > ${resApprove.message}`, "error");
    } else {
      this.FetchContentWithPromise(true);
      await this.SetContentAfterResolve();
      this.UpdateAnswerContent();
      this.Approved();
      this.contents.answers[this.answerID].RenderApproveIcon();

      if (!resApprove.success && !resApprove.message) {
        this.element.classList.add("already");
        const message = System.data.locale.userContent.notificationMessages.xIsAlreadyApproved.replace(
          "%{row_id}",
          ` #${rowNumber} `,
        );
        notification(`${message}`, "info");
      }
    }
  }

  UpdateAnswerContent() {
    const answer = this.res.data.responses.find(
      response => response.id === this.answerID,
    );
    this.contents.answers[this.answerID].source = answer;
  }

  async CheckUnapproveResponse(resUnapprove) {
    const rowNumber = this.RowNumber();

    this.checkbox.HideSpinner();

    if (!resUnapprove) {
      notification(
        `#${rowNumber} > ${System.data.locale.common.notificationMessages.somethingWentWrong}`,
        "error",
      );
    } else if (!resUnapprove.success && resUnapprove.message) {
      notification(`#${rowNumber} > ${resUnapprove.message}`, "error");
    } else {
      this.FetchContentWithPromise(true);
      await this.SetContentAfterResolve();
      this.UpdateAnswerContent();
      this.Unapproved();
      this.contents.answers[this.answerID].HideApproveIcon();

      if (!resUnapprove.success && !resUnapprove.message) {
        this.element.classList.add("already");
        const message = System.data.locale.userContent.notificationMessages.xIsAlreadyUnapproved.replace(
          "%{row_id}",
          `#${rowNumber} `,
        );
        notification(`${message}`, "info");
      }
    }
  }

  CorrectReportResponse(resReport) {
    const rowNumber = this.RowNumber();

    this.checkbox.HideSpinner();

    if (!resReport) {
      notification(
        `#${rowNumber} > ${System.data.locale.common.notificationMessages.somethingWentWrong}`,
        "error",
      );
    } else if (!resReport.success && resReport.code === 3) {
      this.Deleted();
      notification(`#${rowNumber} > ${resReport.message}`, "error");
    } else {
      this.Reported();

      if (!resReport.success && resReport.message) {
        this.element.classList.add("already");
        notification(`#${rowNumber} > ${resReport.message}`, "info");
      }
    }
  }
}
