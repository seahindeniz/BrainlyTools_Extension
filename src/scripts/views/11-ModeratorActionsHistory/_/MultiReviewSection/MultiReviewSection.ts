import CreateElement from "@components/CreateElement";
import notification from "@components/notification2";
import getCanvasBlob from "@root/helpers/getCanvasBlob";
import HideElement from "@root/helpers/HideElement";
import InsertAfter from "@root/helpers/InsertAfter";
import IsVisible from "@root/helpers/IsVisible";
import type { ActionHistoryNewReviewResponseType } from "@ServerReq/ActionsHistory/NewReview";
import ActionHistoryRevertReview from "@ServerReq/ActionsHistory/RevertReview";
import { Button, Flex, Icon, Spinner, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import md5 from "js-md5";
import { DateTime } from "luxon";
import mimeTypes from "mime-types";
import tippy from "tippy.js";
import type * as ModeratorActionHistoryTypes from "../..";
import {
  REVERT_TIME_LIMIT,
  screenshotWidthLimit,
} from "../ActionEntry/ActionEntry";
import SendMessageSection, {
  createDashList,
} from "../SendMessageSection/SendMessageSection";
import InvalidateAllButton from "./ReviewAllButton/InvalidateAllButton";
import ValidateAllButton from "./ReviewAllButton/ValidateAllButton";

export default class MultiReviewSection {
  main: ModeratorActionHistoryTypes.default;

  container: FlexElementType;
  validateAllButton?: ValidateAllButton;
  invalidateAllButton?: ValidateAllButton;
  #spinner: HTMLDivElement;
  countdownText: Text;
  revertAllButtonContainer: FlexElementType;
  sendMessageButtonContainer: FlexElementType;
  private lastReviewedDataEntries: ModeratorActionHistoryTypes.ReviewDataEntryType[];
  sendMessageSection?: SendMessageSection;
  screenshotCanvas: HTMLCanvasElement;
  screenshotBlob: Blob;
  screenshotName: string;
  screenshotPromise: Promise<void>;

  constructor(main: ModeratorActionHistoryTypes.default) {
    this.main = main;

    this.RefreshLastReviewedDataEntries();
    this.Render();
    this.ToggleReviewButtons();
    this.ToggleRevertAllButton();
    this.ToggleSendMessageButton();
  }

  private RefreshLastReviewedDataEntries() {
    this.lastReviewedDataEntries = this.main.reviewDataEntries.all;
  }

  Render() {
    this.container = Flex({
      marginTop: "s",
      marginBottom: "s",
      justifyContent: "space-around",
    });

    InsertAfter(this.container, document.querySelector("table.activities"));
  }

  private ToggleReviewButtons() {
    if (this.main.actionEntries.find(actionEntry => !actionEntry.dataEntry)) {
      this.ShowReviewButtons();

      return;
    }

    this.HideReviewButtons();
  }

  private ShowReviewButtons() {
    if (!this.validateAllButton) {
      this.validateAllButton = new ValidateAllButton(this);
      this.invalidateAllButton = new InvalidateAllButton(this);
    }

    this.container.append(
      this.validateAllButton.container,
      this.invalidateAllButton.container,
    );
  }

  private HideReviewButtons() {
    HideElement(
      this.validateAllButton?.container,
      this.invalidateAllButton?.container,
    );
  }

  get spinner() {
    if (!this.#spinner) {
      this.RenderSpinner();
    }

    return this.#spinner;
  }

  private RenderSpinner() {
    this.#spinner = Spinner({
      overlay: true,
    });
  }

  HideSpinner() {
    HideElement(this.#spinner);
  }

  ToggleRevertAllButton() {
    if (
      this.main.reviewDataEntries.all.find(dataEntry => dataEntry.isRevertible)
    ) {
      this.ShowRevertAllButton();

      return;
    }

    this.HideRevertAllButton();
  }

  private ShowRevertAllButton() {
    if (!this.revertAllButtonContainer) {
      this.RenderRevertAllButton();
    }

    this.container.append(this.revertAllButtonContainer);
  }

  private HideRevertAllButton() {
    HideElement(this.revertAllButtonContainer);
  }

  private RenderRevertAllButton() {
    this.revertAllButtonContainer = Flex({
      relative: true,
      children: new Button({
        type: "solid-light",
        children: System.data.locale.moderatorActionHistory.revertAll,
        icon: new Icon({
          type: "reload",
        }),
        onClick: this.RevertAll.bind(this),
      }),
    });
  }

  private async RevertAll() {
    try {
      const idList = this.main.reviewDataEntries.all
        .filter(dataEntry => dataEntry.isRevertible)
        .map(dataEntry => dataEntry.data.id);

      this.revertAllButtonContainer.append(this.spinner);

      const resRevert = await ActionHistoryRevertReview({ id: idList });

      if (resRevert.success === false) {
        console.error(resRevert);
        throw Error(resRevert.message);
      }

      idList.forEach(id => {
        const dataEntry = this.main.reviewDataEntries.byId[id];

        if (!dataEntry) return;

        delete this.main.reviewDataEntries.byId[id];

        this.main.reviewDataEntries.all = Object.values(
          this.main.reviewDataEntries.byId,
        );

        dataEntry.actionEntries.forEach(actionEntry => {
          actionEntry.dataEntry = null;

          actionEntry.Unreviewed();
        });
      });

      this.Unreviewed();

      notification({
        type: "success",
        text: System.data.locale.moderatorActionHistory.reviewsWithdrawn,
      });

      this.ToggleReviewButtons();
    } catch (error) {
      if (error) {
        console.error(error);
      }

      notification({
        type: "error",
        text:
          System.data.locale.common.notificationMessages.operationErrorRefresh,
      });
    }

    this.HideSpinner();
  }

  AssignReviewData(
    valid: boolean,
    newData: ActionHistoryNewReviewResponseType[],
  ) {
    const now = DateTime.local();
    const reviewTimeInstance = DateTime.local();
    const reviewTime = reviewTimeInstance.toUTC().toISO();
    const reviewer = {
      id: System.data.Brainly.userData.user.id,
      nick: System.data.Brainly.userData.user.nick,
    };
    const processedReviewDataEntries: ModeratorActionHistoryTypes.ReviewDataEntryType[] = [];

    newData.forEach(data => {
      const end = reviewTimeInstance.plus(REVERT_TIME_LIMIT);
      const dataEntry: ModeratorActionHistoryTypes.ReviewDataEntryType = {
        data: {
          ...data,
          valid,
          reviewTime,
          reviewer,
        },
        hash: data.hash,
        actionEntries: [],
        reviewTimeInstance,
        get isRevertible() {
          return now < end;
        },
      };
      this.main.reviewDataEntries.byId[data.id] = dataEntry;

      processedReviewDataEntries.push(dataEntry);
      this.main.reviewDataEntries.all.push(dataEntry);
    });

    this.main.PlaceActionAndDataEntries();

    return processedReviewDataEntries;
  }

  ToggleSendMessageButton() {
    if (
      this.lastReviewedDataEntries.find(
        dataEntry =>
          dataEntry.isRevertible &&
          dataEntry.data.valid === false &&
          !dataEntry.data.message,
      )
    ) {
      this.ShowSendMessageButton();

      return;
    }

    this.HideSendMessageButton();
  }

  private ShowSendMessageButton() {
    if (!this.sendMessageButtonContainer) {
      this.RenderSendMessageButton();
    }

    this.container.append(this.sendMessageButtonContainer);
  }

  private HideSendMessageButton() {
    HideElement(this.sendMessageButtonContainer);
  }

  private RenderSendMessageButton() {
    this.sendMessageButtonContainer = Flex({
      children: new Button({
        type: "outline",
        toggle: "blue",
        icon: new Icon({
          type: "messages",
        }),
        children: System.data.locale.moderatorActionHistory.informModerator,
        onClick: this.ToggleSendMessageSection.bind(this),
      }),
    });

    tippy(this.sendMessageButtonContainer, {
      placement: "top",
      theme: "light",
      content: Text({
        weight: "bold",
        size: "small",
        children: System.data.locale.moderatorActionHistory.informModeratorTitleForMany.replace(
          /%{nick}/g,
          this.main.moderator.nick,
        ),
      }),
    });
  }

  private ToggleSendMessageSection() {
    if (
      !IsVisible(this.sendMessageButtonContainer) ||
      IsVisible(this.sendMessageSection?.container)
    ) {
      this.HideSendMessageSection();

      return;
    }

    this.ShowSendMessageSection();
  }

  private ShowSendMessageSection() {
    this.sendMessageSection = new SendMessageSection(this, this.questionLinks);

    InsertAfter(this.sendMessageSection.container, this.container);
  }

  private get questionLinks() {
    const dataEntries = this.lastReviewedDataEntries.filter(
      dataEntry => !dataEntry.data.valid,
    );

    if (!dataEntries?.length) return "";

    const links = dataEntries
      .map(dataEntry => {
        if (!dataEntry?.actionEntries?.length) return undefined;

        return dataEntry.actionEntries.reduce((a, b) =>
          a.actionTime < b.actionTime ? a : b,
        )?.questionLink;
      })
      .filter(Boolean);

    if (!links?.length) return "";

    const questionLinks = [...new Set(links)];

    return createDashList(questionLinks);
  }

  private HideSendMessageSection() {
    HideElement(this.sendMessageSection?.container);

    this.sendMessageSection?.Destroy();

    this.sendMessageSection = null;
  }

  get hash() {
    return md5(
      this.lastReviewedDataEntries.map(dataEntry => dataEntry.hash).join(),
    );
  }

  get id() {
    return this.lastReviewedDataEntries
      .filter(
        dataEntry => dataEntry.isRevertible && dataEntry.data.valid === false,
      )
      .map(dataEntry => dataEntry.data.id);
  }

  async TryToTakeScreenshot() {
    this.screenshotPromise = this.TakeScreenshot();
  }

  private async TakeScreenshot() {
    const actionEntries = this.lastReviewedDataEntries
      .filter(dataEntry => !dataEntry.data.valid)
      .map(dataEntry => {
        if (!dataEntry?.actionEntries?.length) return undefined;

        return dataEntry.actionEntries.reduce((a, b) =>
          a.actionTime < b.actionTime ? a : b,
        );
      })
      .filter(Boolean);

    if (actionEntries.length === 0) return;

    await Promise.all(
      actionEntries.map(actionEntry => actionEntry.TryToTakeScreenshot()),
    );

    const canvasHeight = actionEntries.reduce(
      (summedHeight, entry) =>
        entry.screenshotImageInstance.height + summedHeight + 10,
      0,
    );

    this.screenshotCanvas = CreateElement({
      tag: "canvas",
      width: screenshotWidthLimit,
      height: canvasHeight - 10,
    });
    const containerContext = this.screenshotCanvas.getContext("2d");
    let lastStartPoint = 0;

    actionEntries.forEach(entry => {
      containerContext.drawImage(
        entry.screenshotImageInstance,
        0,
        lastStartPoint,
        screenshotWidthLimit,
        entry.screenshotImageInstance.height,
      );

      lastStartPoint += entry.screenshotImageInstance.height + 10;
    });

    this.screenshotBlob = await getCanvasBlob(this.screenshotCanvas);

    const extension = mimeTypes.extension(this.screenshotBlob.type);

    this.screenshotName = `${this.hash}.${extension}`;
    // this.screenshotDataURL = URL.createObjectURL(this.screenshotCanvas);

    // document.body.appendChild(this.screenshotCanvas);
  }

  MessageSent(message: string) {
    this.HideSendMessageSection();
    this.HideSendMessageButton();

    this.lastReviewedDataEntries.forEach(dataEntry => {
      dataEntry.data.message = message;

      dataEntry.actionEntries.forEach(actionEntry => {
        actionEntry.MessageSent();
      });
    });
  }

  Reviewed() {
    this.RefreshLastReviewedDataEntries();
    this.ToggleReviewButtons();
    this.ToggleRevertAllButton();
    this.ToggleSendMessageButton();
    this.HideSendMessageSection();
  }

  Unreviewed() {
    this.Reviewed();
  }
}
