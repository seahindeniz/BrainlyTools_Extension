import Action from "@BrainlyAction";
import type { ModeratorDataType } from "@BrainlyReq/LiveModerationFeed";
import CreateElement from "@components/CreateElement";
import notification from "@components/notification2";
import { DeleteReasonSubCategoryType } from "@root/controllers/System";
import HideElement from "@root/helpers/HideElement";
import InsertAfter from "@root/helpers/InsertAfter";
import replaceLatexWithURL from "@root/helpers/replaceLatexWithURL";
import WaitForElement from "@root/helpers/WaitForElement";
import { Avatar, Button, Flex, Icon, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import Hammer from "hammerjs";
import tippy from "tippy.js";
import type { AnswerDataType } from "./QuestionData";
import type QuestionPageClassType from "./QuestionPage";
import QuickDeleteButton from "./QuickDeleteButton";

export default class AnswerSection {
  main: QuestionPageClassType;
  data: AnswerDataType;

  searchingForModerationBox: boolean;
  mainContainer: HTMLDivElement;
  moderationBox: HTMLDivElement;
  moderateButton: HTMLButtonElement;
  answerBox: HTMLDivElement;
  newModerateButton: Button;
  quickActionButtonContainer: FlexElementType;
  actionButtons: Button[];
  confirmButtonContainer?: FlexElementType;
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

  moderatorInfoContainer?: FlexElementType;

  constructor(main: QuestionPageClassType, data: AnswerDataType) {
    this.main = main;
    this.data = data;

    this.actionButtons = [];
    this.extraDetails = window.jsData.question.answers.find(
      answer => answer.databaseId === data.id,
    );

    this.Init();
  }

  async Init() {
    if (this.searchingForModerationBox) return;

    this.FindMainContainer();

    if (!this.mainContainer)
      throw new Error("Can't find main answer container");

    this.FindModerationBox();

    this.FindModerateButton();
    this.ReplaceModerateButtonWithNew();
    this.RenderQuickActionButtons();
    this.RenderConfirmButton();
    this.FetchAndRenderUsersRank();
  }

  FindMainContainer() {
    this.searchingForModerationBox = true;

    this.mainContainer = this.main.answerContainers.find(answerContainer => {
      if (answerContainer.dataset.ext) return false;

      const nickContainer = answerContainer.querySelector<HTMLSpanElement>(
        ":scope > .js-answer > .brn-qpage-next-answer-box__author .brn-qpage-next-answer-box-author__description .sg-text",
      );

      if (nickContainer?.innerText !== this.extraDetails.user.nick) {
        if (System.data.config.extension.env === "development")
          console.log(
            "Nick isn't similar",
            nickContainer?.innerText,
            this.extraDetails.user.nick,
          );

        return false;
      }

      const ratingCountText = answerContainer.querySelector<HTMLSpanElement>(
        ":scope > .js-answer > .brn-qpage-next-answer-box__actions > .brn-qpage-next-answer-box__rating .brn-qpage-next-rating > .sg-flex:last-child > .sg-text",
      );

      const ratingCount = ratingCountText.innerText.replace(/\(| .*$/g, "");

      if (!ratingCount) throw new Error("Can't find rating count");

      if (Number(ratingCount) !== this.data.marksCount) {
        if (System.data.config.extension.env === "development")
          console.log(
            "ratingCount isn't similar",
            ratingCount,
            this.data.marksCount,
          );

        return false;
      }

      const thanksCountContainer = answerContainer.querySelector<HTMLSpanElement>(
        ".brn-qpage-next-answer-box__thanks > button > span.sg-button__text > span",
      );

      const thanksCount = thanksCountContainer.innerText;

      if (!thanksCount) throw new Error("Can't find thanks count");

      if (Number(thanksCount) !== this.data.thanks) {
        if (System.data.config.extension.env === "development")
          console.log(
            "thanksCount isn't similar",
            thanksCount,
            this.data.thanks,
          );

        return false;
      }

      const avatarImg = answerContainer.querySelector<HTMLImageElement>(
        ".brn-qpage-next-answer-box-author__avatar img",
      );

      if (
        (!avatarImg && this.extraDetails.user.avatar) ||
        (avatarImg?.src && avatarImg.src !== this.extraDetails.user.avatar)
      ) {
        console.log(
          "Avatar doesn't match",
          avatarImg?.src,
          this.extraDetails.user.avatar,
        );

        return false;
      }

      const contentContainer = answerContainer.querySelector<HTMLDivElement>(
        ".js-answer-content",
      );

      if (!contentContainer) throw new Error("Can't find content container");

      const contentOnPage = replaceLatexWithURL(contentContainer.innerHTML, {
        noDecode: true,
        noTitle: true,
      });
      const processedContent = replaceLatexWithURL(this.data.content, {
        noDecode: true,
        noTitle: true,
      })
        .replace(/<br ?\/?>/gi, "<br>")
        .replace(/<\/?div>?/gi, "")
        .replace(/\xa0/g, "&nbsp;");

      if (contentOnPage !== processedContent) {
        if (System.data.config.extension.env === "development") {
          console.log("contentOnPage isn't similar");
          console.log(contentOnPage);
          console.log(this.data.content);

          console.log(processedContent);
        }

        return false;
      }

      return true;
    });

    if (this.mainContainer) this.mainContainer.dataset.ext = "true";

    // console.warn(
    //   "answerContainer",
    //   this.mainContainer,
    //   this.extraDetails.user.nick,
    // );

    this.searchingForModerationBox = false;
  }

  async FindModerationBox() {
    this.moderationBox = this.mainContainer.querySelector(
      ":scope > div.sg-box > .sg-flex",
    );

    if (!this.moderationBox)
      throw new Error("Can't find main answer's moderation box'");

    this.answerBox = this.mainContainer.querySelector(":scope > div.js-answer");

    if (!this.answerBox) throw new Error("Can't find main answer box'");
  }

  FindModerateButton() {
    this.moderateButton = this.moderationBox.querySelector(
      ":scope > div:first-child > button",
    );

    if (!this.moderateButton) {
      throw Error(`Can't find the moderate button of answer ${this.data.id}`);
    }

    const emptyDiv = this.moderateButton.parentElement;

    this.moderationBox.prepend(this.moderateButton);

    emptyDiv.remove();
  }

  ReplaceModerateButtonWithNew() {
    if (!this.main.moderatePanelController) return;

    this.newModerateButton = new Button({
      size: "s",
      type: "solid-blue",
      icon: new Icon({
        size: 16,
        type: "ext-shield",
      }),
      children: this.moderateButton.lastElementChild.innerHTML,
      onClick: this.OpenModeratePanel.bind(this),
    });

    const hammer = new Hammer(this.newModerateButton.element);

    hammer.on("press", () => this.moderateButton.click());

    this.moderationBox.prepend(this.newModerateButton.element);
    this.moderateButton.classList.add("js-hidden");
  }

  OpenModeratePanel(event: MouseEvent) {
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      this.moderateButton.click();

      return;
    }

    this.main.moderatePanelController.Moderate();
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
    if (
      !this.data.settings.isMarkedAbuse ||
      (System.checkBrainlyP(146) && !System.checkUserP(38))
    )
      return;

    this.confirmButtonContainer = Flex({
      children: (this.confirmButton = new Button({
        size: "s",
        type: "solid-mint",
        iconOnly: true,
        icon: new Icon({
          type: "check",
          color: "light",
        }),
        onClick: this.Confirm.bind(this),
      })),
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

      new Action().CloseModerationTicket(this.main.data.id);

      if (!resConfirm) {
        throw Error("No response");
      }

      if (resConfirm.success === false) {
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
        take_points: true,
      };

      const res = await new Action().RemoveAnswer(taskData);

      new Action().CloseModerationTicket(this.main.data.id);

      if (!res) {
        throw Error("No response");
      }

      if (res.success === false) {
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
    this.quickActionButtonContainer?.remove();
    this.answerBox.classList.add("brn-content--deleted");

    const answerActions = this.answerBox.querySelector(
      ".brn-qpage-next-answer-box__actions",
    );

    if (answerActions instanceof HTMLElement) {
      answerActions.remove();
    }
  }

  async FetchAndRenderUsersRank() {
    const rankContainer = await WaitForElement<"div">(
      ".brn-qpage-next-answer-box-author__description ul.brn-horizontal-list " +
        "> li.brn-horizontal-list__item:nth-child(1) > div",
      {
        parent: this.answerBox,
      },
    );

    if (!rankContainer) throw Error("Can't find rank container");

    const resUser = await new Action().GetUser(this.data.userId);

    if (!resUser.success) return;

    if (!resUser.data.ranks_ids.includes(resUser.data.primary_rank_id))
      resUser.data.ranks_ids.push(resUser.data.primary_rank_id);

    let specialRanks = resUser.data.ranks_ids
      .filter(rankId => {
        const rank =
          System.data.Brainly.defaultConfig.config.data.ranksWithId[rankId];

        return rank.type !== 3;
      })
      .map(
        rankId =>
          System.data.Brainly.defaultConfig.config.data.ranksWithId[rankId],
      );

    if (specialRanks.length === 0) return;

    let primaryRank = specialRanks.find(rank => rank.type === 5);

    if (!primaryRank)
      primaryRank =
        System.data.Brainly.defaultConfig.config.data.ranksWithId[
          resUser.data.primary_rank_id
        ];

    specialRanks = specialRanks.sort((specialRank1, specialRank2) =>
      specialRank1.type < specialRank2.type ? -1 : 1,
    );

    rankContainer.innerHTML = primaryRank.name;
    rankContainer.style.color = `#${primaryRank.color}`;

    if (specialRanks.length === 0) return;

    tippy(rankContainer, {
      content: Flex({
        children: specialRanks.map(specialRank =>
          Text({
            children: specialRank.name,
            size: "small",
            weight: "bold",
            style: {
              color: `#${specialRank.color}`,
            },
          }),
        ),
        direction: "column",
      }),
      placement: "bottom",
      theme: "light",
    });
  }

  TicketReserved(moderator: ModeratorDataType) {
    if (!this.moderatorInfoContainer) {
      this.RenderModeratorInfoContainer();
    } else {
      this.moderatorInfoContainer.innerHTML = "";
    }

    const nickText = Text({
      weight: "bold",
      size: "small",
      children: moderator.nick,
    });

    const avatarContainer = Flex({
      relative: true,
      marginLeft: "xs",
      children: [
        new Avatar({
          size: "xs",
          imgSrc: moderator?.avatar,
          title: moderator.nick,
          alt: moderator.nick,
        }),
        CreateElement({
          tag: "div",
          className: "brn-answering-user__dot-container",
          children: new Icon({
            size: 24,
            color: "blue",
            type: "ext-shield",
          }),
        }),
      ],
    });

    this.moderatorInfoContainer.append(nickText, avatarContainer);
  }

  RenderModeratorInfoContainer() {
    this.moderatorInfoContainer = Flex({
      tag: "div",
      marginTop: "xxs",
      marginRight: "xs",
      alignItems: "center",
      className: "brn-feed-item__moderator-info",
    });

    InsertAfter(
      this.moderatorInfoContainer,
      this.moderationBox.firstElementChild,
    );
  }
}
