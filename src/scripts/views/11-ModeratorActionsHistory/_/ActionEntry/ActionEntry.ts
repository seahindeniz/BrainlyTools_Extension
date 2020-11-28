/* eslint-disable import/no-duplicates */
/* eslint-disable no-underscore-dangle */
import Action from "@BrainlyAction";
import { LogSection } from "@components";
import notification from "@components/notification2";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import InsertAfter from "@root/helpers/InsertAfter";
import InsertBefore from "@root/helpers/InsertBefore";
import IsVisible from "@root/helpers/IsVisible";
import ActionHistoryRevertReview from "@ServerReq/ActionsHistory/RevertReview";
import {
  Avatar,
  Box,
  Breadcrumb,
  Button,
  Flex,
  Icon,
  Label,
  Spinner,
  Text as TextComponent,
} from "@style-guide";
import { FlexElementType } from "@style-guide/Flex";
import md5 from "js-md5";
import linkifyHtml from "linkifyjs/html";
import { DateTime, Duration, DurationObject } from "luxon";
import mimeTypes from "mime-types";
import tippy, { Instance, Props } from "tippy.js";
import * as htmlToImage from "../../../../../../../html-to-image/lib";
import type ModeratorActionsHistoryClassType from "../../index";
import type { ReviewDataEntryType } from "../../index";
import SendMessageSection from "../SendMessageSection/SendMessageSection";
import InvalidateButton from "./Review/InvalidateButton";
import ValidateButton from "./Review/ValidateButton";

// const currentTimeInstance = DateTime.local();
let templateAnchor = TextComponent({
  href: "#",
  underlined: true,
});
const MESSAGE_ANCHOR_CLASSNAMES = templateAnchor.className;
templateAnchor = null;

export const screenshotWidthLimit = 855;
export const REVERT_TIME_LIMIT: DurationObject = {
  hours: 1,
  // seconds: 5,
};

type StateType = "valid" | "invalid";

export default class ActionEntry {
  main: ModeratorActionsHistoryClassType;
  private readonly rowElement: HTMLTableRowElement;

  private dataTimeCell: HTMLTableCellElement;
  actionTime: DateTime;
  questionLink: string;
  private questionId: number;
  private detailCell: HTMLTableCellElement;
  private targetUser: { nick: string; id: number; profileLink: string };
  hash: string;

  private container: FlexElementType;
  private newDetailContainer: Box;
  private actionsContainer: FlexElementType;
  private _is: StateType;
  private validateButton?: ValidateButton;
  private invalidateButton?: InvalidateButton;
  private toggleDetailsButtonContainer?: FlexElementType;
  private toggleDetailsButton?: Button;
  private logSection?: LogSection;
  private detailsContainer?: FlexElementType;
  private statusIconContainer: FlexElementType;
  private revertButtonContainer: FlexElementType;

  dataEntry: ReviewDataEntryType;

  private countdownText: Text;
  private statusIconTippy: Instance<Props>;
  screenshotPromise: Promise<void>;
  private sendMessageButtonContainer: FlexElementType;
  private sendMessageSection: SendMessageSection;
  screenshotBlob: Blob;
  private screenshotDataURL: string;
  screenshotImageInstance: HTMLImageElement;
  private reviewDetailsContainer: FlexElementType;
  screenshotName: string;
  private _spinner: HTMLDivElement;
  private sendMessageButton: Button;

  constructor(
    main: ModeratorActionsHistoryClassType,
    rowElement: HTMLTableRowElement,
  ) {
    this.main = main;
    this.rowElement = rowElement;

    this.Init();
  }

  private Init() {
    this.FindDataTimeCell();
    this.FindIdLink();
    this.FindDetailCell();
    this.SetTargetUserDetails();
    this.GenerateHash();
    this.Render();
    this.RelocateDetailCellContent();
  }

  private FindDataTimeCell() {
    this.dataTimeCell = this.rowElement.querySelector<HTMLTableCellElement>(
      ":scope > td.dataTime",
    );

    if (!this.dataTimeCell) {
      console.warn(this.rowElement);
      throw Error("Can't find data cell");
    }

    const actionTimeText = Array.from(this.dataTimeCell.childNodes)
      .reverse()
      .find(node => node instanceof Text) as Text;
    const actionTimeString = actionTimeText.nodeValue.trim();
    this.actionTime = DateTime.fromSQL(actionTimeString);
  }

  private FindIdLink() {
    const questionAnchor = this.dataTimeCell.querySelector("a");

    if (!questionAnchor) {
      console.warn(this.dataTimeCell);
      throw Error("Can't find question link");
    }

    this.questionLink = questionAnchor.href;
    this.questionId = Number(questionAnchor.innerText);
  }

  private FindDetailCell() {
    this.detailCell = this.rowElement.querySelector<HTMLTableCellElement>(
      ":scope > td:nth-child(2)",
    );

    if (!this.detailCell) {
      console.warn(this.rowElement);
      throw Error("Can't find detail cell");
    }
  }

  private SetTargetUserDetails() {
    const targetUserAnchor = this.detailCell.querySelector("a");

    if (!targetUserAnchor) {
      console.warn(this.detailCell);
      throw Error("Can't find target user link");
    }

    this.targetUser = {
      nick: targetUserAnchor.innerText,
      id: System.ExtractId(targetUserAnchor.href),
      profileLink: targetUserAnchor.href,
    };
  }

  private get entryContent() {
    const textNodes = Array.from(this.detailCell.childNodes).filter(
      node => node instanceof Text || node instanceof HTMLBRElement,
    ) as Text[];

    if (!textNodes.length) return "";

    return textNodes
      .map(node => (node instanceof HTMLBRElement ? "\n" : node.nodeValue))
      .join("")
      .trim();
  }

  private GenerateHash() {
    const content = this.entryContent;
    // const idDateString = this.dataTimeCell.innerText.trim();

    this.hash = md5(this.targetUser.id + content);
  }

  private Render() {
    this.container = Build(Flex(), [
      [
        Flex({ grow: true, marginBottom: "xs", marginTop: "xs" }),
        (this.newDetailContainer = new Box({
          border: false,
          padding: "xs",
        })),
      ],
    ]);
  }

  private RelocateDetailCellContent() {
    const nodes = Array.from(this.detailCell.childNodes);

    this.newDetailContainer.element.append(...nodes);
    this.detailCell.append(this.container);
  }

  RenderActions() {
    if (this.actionsContainer) return;

    this.actionsContainer = Build(
      Flex({
        alignItems: "flex-end",
        direction: "column",
        justifyContent: "space-evenly",
        marginLeft: "xs",
      }),
      [
        [
          (this.toggleDetailsButtonContainer = Flex({ marginTop: "xxs" })),
          (this.toggleDetailsButton = new Button({
            size: "xs",
            type: "outline",
            iconOnly: true,
            icon: new Icon({
              type: "bulleted_list",
            }),
            onClick: this.ToggleDetails.bind(this),
          })),
        ],
      ],
    );

    tippy(this.toggleDetailsButtonContainer, {
      placement: "top",
      theme: "light",
      content: TextComponent({
        weight: "bold",
        size: "small",
        children: System.data.locale.moderatorActionHistory.toggleDetails,
      }),
    });

    this.ShowActionButtons();
    // this.ShowReviewButtons();
  }

  private ShowActionButtons() {
    this.container.append(this.actionsContainer);
  }

  private HideActionButtons() {
    HideElement(this.actionsContainer);
  }

  private ShowReviewButtons() {
    if (!System.checkUserP([28, 39])) return;

    if (!this.validateButton) {
      this.validateButton = new ValidateButton(this);
      this.invalidateButton = new InvalidateButton(this);
    }

    this.actionsContainer.prepend(
      this.validateButton.container,
      this.invalidateButton.container,
    );
  }

  private HideReviewButtons() {
    HideElement(
      this.validateButton?.container,
      this.invalidateButton?.container,
    );
  }

  get spinner() {
    if (!this._spinner) {
      this.RenderSpinner();
    }

    return this._spinner;
  }

  private RenderSpinner() {
    this._spinner = Spinner({
      overlay: true,
    });
  }

  HideSpinner() {
    HideElement(this._spinner);
  }

  set is(is) {
    this._is = is;

    if (is) this.rowElement.dataset.status = is;
    else delete this.rowElement.dataset.status;
  }

  get is() {
    return this._is;
  }

  Reviewed() {
    this.HideReviewButtons();
    this.RenderLabels();
    this.CheckIfHasInvalidatedBefore();
  }

  private RenderLabels() {
    if (this.statusIconContainer) return;

    this.statusIconContainer = Flex({
      direction: "column",
      alignItems: "center",
      marginBottom: "xxs",
      children: [
        new Label({
          type: "solid",
          children: System.data.locale.moderatorActionHistory[this.is],
          color: this.is === "valid" ? "mint" : "peach",
          icon: new Icon({
            type: this.is === "valid" ? "ext-thumbs-up" : "ext-thumbs-down",
          }),
        }),
        this.dataEntry.data.message &&
          Flex({
            marginTop: "xxs",
            children: new Label({
              // type: "solid",
              children: System.data.locale.moderatorActionHistory.informed,
              color: "mustard",
              icon: new Icon({
                type: "messages",
              }),
            }),
          }),
      ],
    });

    this.statusIconTippy = tippy(this.statusIconContainer, {
      placement: "top",
      theme: "light",
      content: TextComponent({
        weight: "bold",
        size: "small",
        children: System.data.locale.moderatorActionHistory.statusTitle[this.is]
          .replace("%{nick}", this.dataEntry.data.reviewer.nick)
          .replace(
            "%{date}",
            this.dataEntry.reviewTimeInstance.toLocaleString(
              DateTime.DATETIME_FULL,
            ),
          ),
      }),
    });

    InsertBefore(this.statusIconContainer, this.toggleDetailsButtonContainer);

    this.ShowRevertButton();
  }

  private ShowRevertButton() {
    if (
      !this.dataEntry.isRevertible ||
      (this.dataEntry.data.reviewer.id !==
        System.data.Brainly.userData.user.id &&
        !System.checkUserP(39))
    )
      return;

    if (!this.revertButtonContainer) {
      this.RenderRevertButton();
    }

    this.ShowSendMessageButton();
    this.statusIconContainer.append(this.revertButtonContainer);
  }

  private RenderRevertButton() {
    this.countdownText = document.createTextNode("--:--");

    this.revertButtonContainer = Flex({
      marginTop: "xxs",
      relative: true,
      children: new Button({
        size: "s",
        type: "solid-light",
        children: Flex({
          direction: "column",
          alignItems: "flex-start",
          children: [
            System.data.locale.moderatorActionHistory.revert,
            TextComponent({
              weight: "bold",
              color: "peach-dark",
              size: "xsmall",
              children: this.countdownText,
            }),
          ],
        }),
        icon: new Icon({
          type: "reload",
        }),
        onClick: this.RevertReview.bind(this),
      }),
    });

    this.UpdateCounter();
  }

  private RemoveRevertButton() {
    HideElement(this.revertButtonContainer);

    this.countdownText = null;
    this.revertButtonContainer = null;
  }

  private async RevertReview() {
    try {
      this.revertButtonContainer.append(this.spinner);

      const { id } = this.dataEntry.data;
      const resRevert = await ActionHistoryRevertReview({ id });

      if (resRevert.success === false) {
        console.error(resRevert);
        throw Error(resRevert.message);
      }

      notification({
        type: "success",
        text: System.data.locale.moderatorActionHistory.reviewWithdrawn,
      });

      delete this.main.reviewDataEntries.byId[id];

      this.main.reviewDataEntries.all = Object.values(
        this.main.reviewDataEntries.byId,
      );
      this.dataEntry.actionEntries.forEach(actionEntry => {
        actionEntry.dataEntry = null;

        actionEntry.Unreviewed();
      });

      this.main.multiReviewSection.Unreviewed();
    } catch (error) {
      console.error(error);

      notification({
        type: "error",
        text: System.data.locale.common.notificationMessages.operationError,
      });
    }

    this.HideSpinner();
  }

  Unreviewed() {
    this.statusIconContainer?.remove();
    this.statusIconTippy?.destroy();
    this.ShowActionButtons();
    this.ShowReviewButtons();
    this.HideSendMessageButton();

    this.is = undefined;
    this.statusIconContainer = null;
    this.statusIconTippy = null;

    this.main.multiReviewSection?.ToggleRevertAllButton();
    this.CheckIfHasInvalidatedBefore();
  }

  private CheckIfHasInvalidatedBefore() {
    if (
      this.dataEntry ||
      !this.main.reviewDataEntries.all.find(
        dataEntry => dataEntry.hash === this.hash,
      )
    ) {
      this.newDetailContainer.ChangeColor();
      return;
    }

    this.newDetailContainer.ChangeColor("peach-secondary-light");
  }

  ShowSendMessageButton() {
    if (
      !this.dataEntry.isRevertible ||
      this.is !== "invalid" ||
      this.dataEntry.data.message
    ) {
      this.HideSendMessageButton();

      return;
    }

    if (!this.sendMessageButtonContainer) {
      this.RenderSendMessageButton();
    }

    InsertBefore(
      this.sendMessageButtonContainer,
      this.toggleDetailsButtonContainer,
    );
  }

  private HideSendMessageButton() {
    HideElement(this.sendMessageButtonContainer);
  }

  private RenderSendMessageButton() {
    this.sendMessageButtonContainer = Flex({
      marginTop: "xxs",
      children: this.sendMessageButton = new Button({
        size: "xs",
        type: "outline",
        toggle: "blue",
        iconOnly: true,
        icon: new Icon({
          type: "messages",
        }),
        onClick: this.ToggleSendMessageSection.bind(this),
      }),
    });

    tippy(this.sendMessageButtonContainer, {
      placement: "top",
      theme: "light",
      content: TextComponent({
        weight: "bold",
        size: "small",
        children: System.data.locale.moderatorActionHistory.informModeratorTitle.replace(
          /%{nick}/g,
          this.main.moderator.nick,
        ),
      }),
    });
  }

  private ToggleSendMessageSection() {
    if (IsVisible(this.sendMessageSection?.container)) {
      this.HideSendMessageSection();

      return;
    }

    this.ShowSendMessageSection();
  }

  private async ShowSendMessageSection() {
    this.HideDetails();

    if (!this.sendMessageSection) {
      await this.TryToTakeScreenshot();
      this.sendMessageSection = new SendMessageSection(this, this.questionLink);
    }

    if (this.screenshotPromise) await this.screenshotPromise;

    this.sendMessageButton.ChangeType({ type: "solid-blue" });
    InsertAfter(this.sendMessageSection?.container, this.container);
  }

  private HideSendMessageSection() {
    if (!this.sendMessageSection?.container) return;

    HideElement(this.sendMessageSection.container);
    this.sendMessageButton.ChangeType({ type: "outline", toggle: "blue" });
  }

  private ToggleDetails() {
    if (IsVisible(this.logSection?.container)) {
      this.HideDetails();

      return;
    }

    this.ShowDetails();
  }

  private HideDetails() {
    this.toggleDetailsButton.ChangeType({ type: "outline" });
    HideElement(this.detailsContainer);

    this.HideReviewDetails();
  }

  private HideReviewDetails() {
    if (!this.reviewDetailsContainer) return;

    this.reviewDetailsContainer.remove();

    this.reviewDetailsContainer = null;
  }

  private ShowDetails() {
    this.HideSendMessageSection();

    if (!this.logSection) {
      this.RenderLogSection();
    }

    this.RenderReviewDetails();
    this.toggleDetailsButton.ChangeType();
    this.detailCell.append(this.detailsContainer);
  }

  private RenderLogSection() {
    this.logSection = new LogSection(this.questionId);
    this.detailsContainer = Flex({
      marginTop: "s",
      marginBottom: "s",
      direction: "column",
      children: this.logSection.container,
    });
  }

  private async RenderReviewDetails() {
    if (
      !this.dataEntry &&
      !this.main.reviewDataEntries.all.find(
        dataEntry => dataEntry.hash === this.hash,
      )
    )
      return;

    this.reviewDetailsContainer = Build(
      // console.log(
      Flex({
        direction: "column",
        marginBottom: "m",
      }),
      [
        [
          Flex(),
          TextComponent({
            weight: "extra-bold",
            children: System.data.locale.moderatorActionHistory.reviewDetails,
          }),
        ],
        ...[
          this.dataEntry,
          ...this.main.reviewDataEntries.all.filter(
            dataEntry =>
              dataEntry.hash === this.hash && dataEntry !== this.dataEntry,
          ),
        ].map(dataEntry => {
          if (!dataEntry) return undefined;

          const is: StateType = dataEntry.data.valid ? "valid" : "invalid";

          const avatarContainer = Flex();
          const nickBreadcrumb = new Breadcrumb({
            elements: [
              TextComponent({
                tag: "span",
                size: "small",
                weight: "bold",
                text: dataEntry.data.reviewer.nick,
                target: "_blank",
                href: System.createProfileLink(dataEntry.data.reviewer),
              }),
            ],
          });

          let user = this.main.fetchedUsers[dataEntry.data.reviewer.id];

          let reviewTime = "";

          if (
            dataEntry.reviewTimeInstance > DateTime.local().minus({ days: 1 })
          )
            reviewTime = dataEntry.reviewTimeInstance.toRelative();
          else
            reviewTime = dataEntry.reviewTimeInstance.toLocaleString(
              DateTime.DATETIME_FULL,
            );

          const container = Build(Flex({ marginTop: "xs" }), [
            [
              new Box({
                border: true,
                borderColor: "gray-secondary-lightest",
                padding: "s",
              }),
              [
                [
                  Flex({
                    alignItems: "center",
                    justifyContent: "space-between",
                  }),
                  [
                    [
                      Flex(), // user details container
                      [
                        [
                          avatarContainer, // avatar container
                          Avatar({
                            title: dataEntry.data.reviewer.nick,
                            imgSrc: user?.avatar?.[64],
                          }),
                        ],
                        [
                          Flex({
                            marginLeft: "xxs",
                            direction: "column",
                          }), // nick - rank container
                          [
                            nickBreadcrumb.element,
                            TextComponent({
                              tag: "i",
                              size: "xsmall",
                              color: "gray-secondary",
                              children: reviewTime,
                            }),
                          ],
                        ],
                      ],
                    ],
                    [
                      Flex(),
                      new Label({
                        type: "solid",
                        children: System.data.locale.moderatorActionHistory[is],
                        color: is === "valid" ? "mint" : "peach",
                        icon: new Icon({
                          type:
                            is === "valid"
                              ? "ext-thumbs-up"
                              : "ext-thumbs-down",
                        }),
                      }),
                    ],
                  ],
                ],
                dataEntry.data.message && [
                  Flex({ marginTop: "s", marginLeft: "s", marginRight: "s" }), // details container,
                  TextComponent({
                    tag: "span",
                    whiteSpace: "pre-line",
                    breakWords: true,
                    children: linkifyHtml(dataEntry.data.message, {
                      target: "_blank",
                      className: MESSAGE_ANCHOR_CLASSNAMES,
                    }),
                  }),
                ],
              ],
            ],
          ]);

          (async () => {
            if (!user) {
              const resUser = await new Action().GetUser(
                dataEntry.data.reviewer.id,
              );

              if (resUser.success === false) return;

              user = resUser.data;
              this.main.fetchedUsers[dataEntry.data.reviewer.id] = user;
            }

            avatarContainer.innerHTML = "";

            avatarContainer.append(
              Avatar({
                title: user.nick,
                imgSrc: user.avatar?.["64"],
              }),
            );

            const rankTexts = user.ranks_ids.map(rankId => {
              const rank =
                System.data.Brainly.defaultConfig.config.data.ranksWithId[
                  rankId
                ];

              if (!rank) return undefined;

              return TextComponent({
                tag: "span",
                weight: "bold",
                size: "xsmall",
                text: rank.name,
                style: {
                  color: `#${rank.color}`,
                },
              });
            });

            nickBreadcrumb.RenderChildren(...rankTexts);
          })();

          return container;
        }),
      ],
    );

    this.detailsContainer.prepend(this.reviewDetailsContainer);
  }

  async TryToTakeScreenshot() {
    if (
      this.screenshotPromise ||
      this.screenshotImageInstance ||
      this.is === "valid" ||
      this.dataEntry?.data.message
    )
      return;

    this.HideDetails();
    this.HideActionButtons();

    this.screenshotPromise = this.TakeScreenshot();

    await this.screenshotPromise;

    await this.InitScreenshotImage();
    // document.body.appendChild(this.screenshotCanvas);
    this.ShowActionButtons();
  }

  private async TakeScreenshot() {
    this.rowElement.classList.add("taking-screenshot");

    await System.Delay(50);

    this.screenshotBlob = await htmlToImage.toBlob(this.rowElement, {
      backgroundColor: "#ffffff",
    });
    this.screenshotDataURL = URL.createObjectURL(this.screenshotBlob);
    this.screenshotName = `${this.hash}.${mimeTypes.extension(
      this.screenshotBlob.type,
    )}`;

    this.rowElement.classList.remove("taking-screenshot");
  }

  private InitScreenshotImage(): Promise<void> {
    return new Promise(resolve => {
      this.screenshotImageInstance = new Image();

      this.screenshotImageInstance.addEventListener("load", () => {
        resolve();
      });

      this.screenshotImageInstance.setAttribute("src", this.screenshotDataURL);
    });
  }

  RenderTimes() {
    this.UpdateCounter();
  }

  private UpdateCounter() {
    if (!this.dataEntry || !this.countdownText) return;

    const now = DateTime.local();
    const end = this.dataEntry.reviewTimeInstance.plus(REVERT_TIME_LIMIT);

    if (now >= end) {
      this.Irreversible();

      return;
    }

    const remaining = end.diff(now).toObject();

    this.countdownText.nodeValue = Duration.fromObject(remaining).toFormat(
      "mm:ss",
    );
  }

  private Irreversible() {
    this.HideSendMessageButton();
    // this.HideSendMessageSection();
    this.RemoveRevertButton();
  }

  get id() {
    return this.dataEntry?.data.id;
  }

  MessageSent(message?: string) {
    if (message) {
      this.dataEntry.data.message = message;
    }

    this.HideSendMessageSection();
    this.HideSendMessageButton();
  }
}
