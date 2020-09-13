/* eslint-disable no-underscore-dangle */
import notification from "@components/notification2";
import ServerReq from "@ServerReq";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import {
  Button,
  ContentBox,
  ContentBoxContent,
  Flex,
  Icon,
  Spinner,
  SpinnerContainer,
  Text as TextComponent,
} from "@style-guide";
import { FlexElementType } from "@style-guide/Flex";
import { TextElement } from "@style-guide/Text";
import md5 from "js-md5";
import linkifyHtml from "linkifyjs/html";
// @ts-ignore
import moment from "moment";
import type ModeratorActionsHistoryClassType from "..";

const REPORT_EDIT_TIME_LIMIT = ["1", "hour"];

export default class ActionEntry {
  main: ModeratorActionsHistoryClassType;
  $tr: JQuery<HTMLElement>;
  $buttonContainer: JQuery<HTMLTableDataCellElement>;
  $entryContent: JQuery<HTMLTableDataCellElement>;
  $moderatedContentOwnerLink: JQuery<HTMLAnchorElement>;
  $questionLink: JQuery<HTMLAnchorElement>;
  questionId: string;
  questionLink: string;
  details: {
    _id?: string;
    time: string;
    target: { hash: string; action: string; message?: string };
    user: { _id?: string; brainlyID: number; nick: string };
  };

  hash: string;
  actionButtonsContainer: HTMLDivElement;
  confirmButtonSpinnerContainer: HTMLDivElement;
  confirmButton: Button;
  disapproveButtonSpinnerContainer: HTMLDivElement;
  disapproveButton: Button;
  spinner: HTMLDivElement;
  action: "confirm" | "disapprove";
  $spinnerContainer: JQuery<HTMLElement>;
  shortCodeOfScreenshot: string;
  $detailsRow: JQuery<HTMLElement>;
  $detailsContainer: JQuery<HTMLElement>;
  $pmContainer: JQuery<HTMLElement>;
  $flagContainer: JQuery<HTMLElement>;
  runTimer: boolean;
  timerContainer: FlexElementType;
  revertSpinnerContainer: HTMLElement;
  revert: TextElement<"div">;
  timer: TextElement<"div">;
  revertSpinner: HTMLElement;

  constructor(main: ModeratorActionsHistoryClassType, tr: HTMLElement) {
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
    this.questionLink = System.createBrainlyLink("question", {
      id: this.questionId,
    });

    this.GenerateHash();
  }

  get moderatedContentOwner() {
    return {
      nick: this.$moderatedContentOwnerLink.text(),
      link: location.origin + this.$moderatedContentOwnerLink.attr("href"),
    };
  }

  get moderatorAction() {
    return this.$moderatedContentOwnerLink.prev().text();
  }

  get moderatorActionDate() {
    const childNodes = this.$buttonContainer.prop("childNodes");

    return String(
      childNodes ? childNodes[childNodes.length - 1].data.trim() : "",
    );
  }

  get entryContent() {
    const content = Array.from(
      this.$entryContent.prop("childNodes") as Text[],
    ).find(
      node =>
        node instanceof Text && node.length > 1 && node.nextSibling != null,
    );

    return content ? content.nodeValue.trim() : "";
  }

  GenerateHash() {
    const idText = this.$buttonContainer.text().trim();

    this.hash = md5(idText + this.entryContent);
  }

  RenderDetails() {
    if (!this.details) {
      if (this.main.moderator.id !== System.data.Brainly.userData.user.id) {
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
    this.actionButtonsContainer = Build(ContentBox(), [
      [
        ContentBoxContent(),
        [
          [
            (this.confirmButtonSpinnerContainer = SpinnerContainer()),
            (this.confirmButton = new Button({
              type: "solid-inverted",
              size: "s",
              title: System.data.locale.moderatorActionHistory.confirm,
              icon: new Icon({
                type: "check",
                size: 32,
                color: "mint",
              }),
            })),
          ],
        ],
      ],
      [
        ContentBoxContent({
          spacedTop: true,
        }),
        [
          [
            (this.disapproveButtonSpinnerContainer = SpinnerContainer()),
            (this.disapproveButton = new Button({
              type: "solid-inverted",
              size: "s",
              title: System.data.locale.moderatorActionHistory.disapprove,
              icon: new Icon({
                type: "close",
                size: 30,
                color: "peach",
              }),
            })),
          ],
        ],
      ],
    ]);

    this.$buttonContainer.prepend(this.actionButtonsContainer);
  }

  RenderButtonSpinner() {
    this.spinner = Spinner({
      overlay: true,
      size: "xsmall",
    });
  }

  BindHandlers() {
    this.confirmButton.element.addEventListener(
      "click",
      this.confirm.bind(this),
    );
    this.disapproveButton.element.addEventListener(
      "click",
      this.disapprove.bind(this),
    );
  }

  /**
   * @param {MouseEvent} event
   */
  async confirm(event) {
    await this.Confirming();

    if (
      event.ctrlKey ||
      (!event.ctrlKey &&
        confirm(
          System.data.locale.moderatorActionHistory.notificationMessages
            .doYouWantToConfirm,
        ))
    ) {
      const res = await new ServerReq().ConfirmActionHistoryEntry(
        this.main.moderator._id,
        {
          hashList: this.hash,
          content: this.entryContent,
          questionLink: this.questionLink,
          moderatorAction: this.moderatorAction,
          moderatorActionDate: this.moderatorActionDate,
          contentOwner: this.moderatedContentOwner,
        },
      );

      this.CheckResponse(res);
    } else this.FinishProgress();
  }

  Confirming() {
    if (this.details) return Promise.reject();

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
    let spinnerContainer;

    if (this.action === "confirm")
      spinnerContainer = this.confirmButtonSpinnerContainer;
    else if (this.action === "disapprove")
      spinnerContainer = this.disapproveButtonSpinnerContainer;

    if (spinnerContainer) spinnerContainer.append(this.spinner);
  }

  DisableButtons() {
    this.confirmButton.Disable();
    this.disapproveButton.Disable();
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
    HideElement(this.actionButtonsContainer);
  }

  HideSpinner() {
    HideElement(this.spinner);

    this.$spinnerContainer = undefined;
  }

  ActivateButtons() {
    this.confirmButton.Enable();
    this.disapproveButton.Enable();
  }

  /**
   * @typedef {{_id: string, time: string, hash: string}} Details
   * @param {{success: boolean, data: Details[]}} res
   */
  async CheckResponse(res) {
    if (!res || !res.success) this.FinishProgress();
    else {
      this.SetDetails(res.data[0]);
    }
  }

  /**
   * @param {Details} data
   */
  SetDetails(data) {
    this.details = {
      _id: data._id,
      time: String(data.time || new Date().toISOString()),
      target: {
        hash: this.hash,
        action: this.action,
      },
      user: {
        brainlyID: System.data.Brainly.userData.user.id,
        nick: System.data.Brainly.userData.user.nick,
      },
    };

    if (this.action === "confirm") this.Confirmed();
    else if (this.action === "disapprove") {
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

    if (
      event.ctrlKey ||
      (!event.ctrlKey &&
        confirm(
          System.data.locale.moderatorActionHistory.notificationMessages
            .doYouWantToDisapprove,
        ))
    ) {
      if (event) await this.InformModerator();

      const res = await new ServerReq().DisapproveActionHistoryEntry(
        this.main.moderator._id,
        {
          hashList: this.hash,
          content: this.entryContent,
          questionLink: this.questionLink,
          message: this.main.fixedMessage,
          moderatorAction: this.moderatorAction,
          moderatorActionDate: this.moderatorActionDate,
          contentOwner: this.moderatedContentOwner,
        },
      );

      this.CheckResponse(res);
    } else this.FinishProgress();
  }

  Disapproving() {
    this.action = "disapprove";

    return this.InProgress();
  }

  async InformModerator() {
    await this.TakeScreenshot();

    return this.main.OpenModal({
      actionLink: `${System.data.config.extension.shortenedLinkURL}/${this.shortCodeOfScreenshot}`,
      questionLink: this.questionLink,
    });
  }

  async TakeScreenshot() {
    this.main.ChangeVisibilityOfAllEntries(false, this.hash);
    this.main.ChangeVisibilityOtherElementsForScreenshot("hide");

    const shortCode = await this.main.TakeScreenshot(this.hash);

    this.main.ChangeVisibilityOfAllEntries(true, this.hash);
    this.main.ChangeVisibilityOtherElementsForScreenshot("show");

    this.shortCodeOfScreenshot = shortCode;
  }

  Disapproved() {
    this.FinishProgress();
    this.RenderDetails();
  }

  RenderDetailsCell() {
    const time = new Date(this.details.time).toLocaleString();
    const reviewerProfileLink = System.createProfileLink(this.details.user);
    const reviwedOnBy = System.data.locale.moderatorActionHistory.reviewedOn[
      this.details.target.action
    ]
      .replace("%{date}", time)
      .replace(
        "%{nick}",
        `<a href="${reviewerProfileLink}" target="_blank">${this.details.user.nick}</a>`,
      );

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
      HideElement(this.$detailsRow);
      this.$buttonContainer.removeAttr("rowspan");
    }
  }

  RenderPM() {
    if (this.details.target.message) {
      let message = linkifyHtml(this.details.target.message, {
        target: "_blank",
        className: "sg-text sg-text--link sg-text--xsmall sg-text--blue-dark",
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
    if (this.details.target.action === "confirm")
      this.$tr.addClass("confirmed");

    if (this.details.target.action === "disapprove")
      this.$tr.addClass("disapproved");
  }

  RemoveStatusClass() {
    this.$tr.removeClass("confirmed disapproved");
  }

  RenderFlagIcon() {
    let icon;
    let color;

    if (this.details.target.action === "confirm") {
      icon = "check";
      color = "mint";
    }

    if (this.details.target.action === "disapprove") {
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
    HideElement(this.$flagContainer);
  }

  InitTimer() {
    if (
      this.details.user.brainlyID === System.data.Brainly.userData.user.id &&
      this.IsReportCanReversible()
    ) {
      this.runTimer = true;

      this.RenderTimer();
      this.RenderRevertSpinner();
      this.StartTimer();
      this.main.InitTimer();
    }
  }

  RenderTimer() {
    this.timerContainer = Build(Flex(), [
      [
        (this.revertSpinnerContainer = SpinnerContainer({ fullWidth: true })),
        [
          [
            Flex({
              direction: "column",
            }),
            [
              [
                Flex({ fullWidth: true }),
                [
                  [
                    Flex({
                      marginRight: "xxs",
                      alignItems: "center",
                    }),
                    new Icon({
                      size: 14,
                      reverse: true,
                      type: "reload",
                      color: "gray-secondary",
                    }),
                  ],
                  [
                    Flex({
                      alignItems: "center",
                    }),
                    (this.revert = TextComponent({
                      tag: "div",
                      href: null,
                      size: "xsmall",
                      weight: "bold",
                      color: "peach-dark",
                      html: System.data.locale.moderatorActionHistory.revert,
                    })),
                  ],
                ],
              ],
              [
                Flex({ fullWidth: true, justifyContent: "center" }),
                (this.timer = TextComponent({
                  tag: "div",
                  text: "00:00",
                  size: "xsmall",
                  weight: "bold",
                  color: "gray-secondary",
                })),
              ],
            ],
          ],
        ],
      ],
    ]);

    this.$flagContainer.append(this.timerContainer);

    this.BindTimerHandler();
  }

  BindTimerHandler() {
    this.revert.addEventListener("click", this.RevertReport.bind(this));
  }

  async RevertReport(event) {
    await this.ShowRevertSpinner();

    if (
      (!event ||
        (event &&
          confirm(
            System.data.locale.moderatorActionHistory.notificationMessages
              .doYouWantToRevertThisReport,
          ))) &&
      this.IsReportCanReversible()
    ) {
      const resRevert = await new ServerReq().RevertActionHistoryReport(
        this.details._id,
      );

      if (!resRevert || !resRevert.success) {
        if (resRevert.exception === 408) this.CloseTimer();

        notification({
          html:
            System.data.locale.moderatorActionHistory.notificationMessages
              .iCouldntRevertThisReport,
          type: "error",
        });

        return;
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
    this.revertSpinner = Spinner({
      overlay: true,
      size: "xsmall",
    });
  }

  ShowRevertSpinner() {
    this.revertSpinnerContainer.append(this.revertSpinner);

    return System.Delay(10);
  }

  HideRevertSpinner() {
    HideElement(this.revertSpinner);
  }

  StartTimer() {
    if (!this.runTimer || !this.details) return;

    const timeLeft = this.IsReportCanReversible();

    if (!timeLeft) {
      this.StopTimer();

      return;
    }

    this.timer.innerText = timeLeft;
  }

  IsReportCanReversible() {
    moment.locale(navigator.language);

    const now = moment();
    const end = moment(this.details.time).add(...REPORT_EDIT_TIME_LIMIT);
    const duration = moment.duration(end.diff(now));

    return now < end ? `${duration.minutes()}:${duration.seconds()}` : false;
  }

  StopTimer() {
    this.runTimer = false;

    this.HideTimer();
    this.main.TryToStopTimer();
  }

  FinishTimer() {
    this.StopTimer();
    HideElement(this.timerContainer);
  }

  HideTimer() {
    HideElement(this.timerContainer);
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
