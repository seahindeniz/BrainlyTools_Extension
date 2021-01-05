import Action from "@BrainlyAction";
import type { RankDataType } from "@BrainlyReq/GetMarketConfig";
import CreateElement from "@components/CreateElement";
import notification from "@components/notification2";
import Progress from "@components/Progress";
import {
  Button,
  Checkbox,
  Flex,
  Icon,
  Spinner,
  Text,
} from "@components/style-guide";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import IsVisible from "@root/helpers/IsVisible";
import WaitForElement from "@root/helpers/WaitForElement";
import type { FlexElementType } from "@style-guide/Flex";
import sortablejs from "sortablejs";
import RemoveJunkNotifications from "../../0-Core/_/RemoveJunkNotifications";

class RankManager {
  user: any;
  ranks: {
    data: RankDataType;
    checkbox: HTMLInputElement;
    rankContainer: FlexElementType;
  }[];

  deleteAllRanksForm: HTMLElement;
  deleteAllRanksLi: JQuery<any>;
  manageLi: HTMLLIElement;
  manageLink: HTMLAnchorElement;
  container: FlexElementType;
  rankContainer: FlexElementType;
  saveButton: Button;
  progress: Progress;
  progressContainer: FlexElementType;
  spinner: HTMLDivElement;

  constructor(user: any) {
    this.user = user;
    this.ranks = [];

    this.FindTheDeleteRanksForm();
  }

  async FindTheDeleteRanksForm() {
    this.deleteAllRanksForm = await WaitForElement(
      `[action="/ranks/delete_user_special_ranks"]`,
      {
        noError: true,
      },
    );
    this.deleteAllRanksLi = $(this.deleteAllRanksForm).parent();

    this.RenderLink();
  }

  RenderLink() {
    this.manageLi = CreateElement({
      tag: "li",
      children: (this.manageLink = CreateElement({
        tag: "a",
        href: "#",
        children: [
          CreateElement({
            tag: "font",
            color: "red",
            children: System.constants.config.reasonSign,
          }),
          ` ${System.data.locale.userProfile.rankManager.title}`,
        ],
        onClick: event => {
          event.preventDefault();
          this.TogglePanel();
        },
      })),
    });

    this.deleteAllRanksLi.append(this.manageLi);
  }

  TogglePanel() {
    if (IsVisible(this.container)) {
      this.ClosePanel();
    } else {
      this.OpenPanel();
    }
  }

  ClosePanel() {
    HideElement(this.container);
    this.progress.forceClose(true);
  }

  OpenPanel() {
    if (!this.container) {
      this.Init();
    }

    this.manageLi.append(this.container);
  }

  Init() {
    this.RenderPanel();
    this.RenderProgressBar();
    this.RenderSpinner();
    this.RenderRanks();
    this.BindHandlers();
    this.UpdateInputTitle();
  }

  RenderPanel() {
    this.container = Build(Flex({ direction: "column" }), [
      [
        Flex({ marginTop: "s", marginBottom: "s" }),
        Text({
          weight: "bold",
          html: System.data.locale.userProfile.rankManager.title,
        }),
      ],
      (this.rankContainer = Flex({ direction: "column" })),
      [
        Flex({
          marginTop: "s",
          marginBottom: "s",
        }),
        (this.saveButton = new Button({
          size: "s",
          fullWidth: true,
          type: "solid-mint",
          text: System.data.locale.common.save,
        })),
      ],
    ]);
  }

  RenderProgressBar() {
    this.progress = new Progress({
      type: "success",
      label: "",
      max: 2,
      fullWidth: true,
    });
    this.progressContainer = Flex({
      marginBottom: "s",
      children: this.progress.$container[0],
    });
  }

  RenderSpinner() {
    this.spinner = Spinner({ overlay: true });
  }

  RenderRanks() {
    /**
     * @type {{ranks: RankType[]}}
     */
    let { ranks } = System.data.Brainly.defaultConfig.config.data;

    ranks = ranks.sort(
      (a, b) =>
        this.user.ranks_ids.indexOf(b.id) - this.user.ranks_ids.indexOf(a.id),
    );
    ranks = ranks.sort(a => (this.user.ranks_ids.includes(a.id) ? -1 : 1));

    ranks.forEach((rank: RankDataType, i) => {
      if (!rank || rank.type !== 5) return;

      const userHasRank = this.user.ranks_ids.includes(rank.id);
      const checkbox = new Checkbox({
        id: `p-${rank.id}`,
        checked: userHasRank,
      });

      const rankContainer = Build(
        Flex({
          wrap: false,
          tag: "label",
          marginBottom:
            i + 1 !== System.data.Brainly.defaultConfig.config.data.ranks.length
              ? "xs"
              : "",
        }),
        [
          [
            Flex({ margin: "xxs", fullWidth: true }),
            [
              [Flex({ marginRight: "xs", alignItems: "center" }), checkbox],
              [
                Flex({
                  direction:
                    rank.description && rank.name !== rank.description
                      ? "column"
                      : "",
                  alignItems:
                    rank.description && rank.name !== rank.description
                      ? "flex-start"
                      : "center",
                  fullWidth: true,
                }),
                [
                  [
                    Flex(),
                    Text({
                      html: rank.name,
                      weight: "bold",
                      color: "blue-dark",
                      href: `/admin/ranks/edit/${rank.id}`,
                      size: "small",
                      title: rank.description,
                      target: "_blank",
                    }),
                  ],
                  rank.description &&
                    rank.name !== rank.description && [
                      Flex({ fullWidth: true, direction: "column" }),
                      Text({
                        tag: "i",
                        size: "xsmall",
                        color: "gray",
                        html: rank.description,
                      }),
                    ],
                ],
              ],
              [
                Flex({ alignItems: "center" }),
                new Button({
                  iconOnly: true,
                  size: "xs",
                  className: "dragger",
                  type: "transparent-blue",
                  icon: new Icon({
                    type: "ext-move",
                    color: "blue",
                    size: 16,
                  }),
                }),
              ],
            ],
          ],
        ],
      );

      this.ranks.push({
        data: rank,
        checkbox: checkbox.input,
        rankContainer,
      });
      this.rankContainer.append(rankContainer);
    });

    // eslint-disable-next-line no-new, new-cap
    new sortablejs(this.rankContainer, {
      animation: 200,
      multiDrag: true,
      handle: ".dragger",
      fallbackTolerance: 3,
      selectedClass: "sg-box--blue-secondary-light",
    });
  }

  BindHandlers() {
    this.saveButton.element.addEventListener(
      "click",
      this.SaveSelectedRank.bind(this),
    );

    const rankLinks = this.rankContainer.querySelectorAll("a");

    if (rankLinks && rankLinks.length > 0)
      rankLinks.forEach(rankLink =>
        rankLink.addEventListener("click", event => {
          if (event.ctrlKey) return;

          event.preventDefault();
          (rankLink.parentNode as HTMLElement).click();
        }),
      );
  }

  async SaveSelectedRank() {
    let selectedRanks = this.ranks.filter(rank => rank.checkbox.checked);

    const getElementIndex = element =>
      Array.from(element.parentNode.children).indexOf(element);

    selectedRanks = selectedRanks.sort((a, b) =>
      getElementIndex(a.rankContainer) > getElementIndex(b.rankContainer)
        ? 1
        : -1,
    );

    this.ShowSpinner();

    if (!confirm(System.data.locale.common.notificationMessages.areYouSure))
      return;

    this.ShowProgressContainer();
    this.progress.setMax(2);
    this.progress.update(0);
    this.progress.ChangeType("loading");
    this.progress.UpdateLabel(
      System.data.locale.userProfile.rankManager.removingAllSpecialRanks,
    );

    await System.Delay(50);

    const removeAllRanksXHR = await new Action().RemoveAllRanks(
      window.profileData.id,
      {
        tokens: {
          key: String(
            $(`input[name="data[_Token][key]"]`, this.deleteAllRanksLi).val(),
          ),
          fields: String(
            $(
              `input[name="data[_Token][fields]"]`,
              this.deleteAllRanksLi,
            ).val(),
          ),
          lock: String(
            $(`input[name="data[_Token][lock]"]`, this.deleteAllRanksLi).val(),
          ),
        },
      },
    );
    const redirectedUserID = System.ExtractId(removeAllRanksXHR.url);

    RemoveJunkNotifications();

    if (redirectedUserID !== profileData.id) {
      notification({
        html:
          System.data.locale.common.notificationMessages
            .somethingWentWrongPleaseRefresh,
        type: "error",
      });

      return;
    }

    let currentProgress = 0;

    this.progress.update(++currentProgress);
    this.progress.UpdateLabel(
      System.data.locale.userProfile.rankManager.allRanksRemoved,
    );
    await System.Delay(500);

    this.progress.update(++currentProgress);

    if (selectedRanks.length === 0) {
      this.SavingCompleted();

      return;
    }

    this.progress.setMax(selectedRanks.length + 3);
    this.progress.UpdateLabel(
      System.data.locale.userProfile.rankManager.updatingRanks,
    );
    await System.Delay(500);

    // eslint-disable-next-line no-restricted-syntax
    for (const selectedRank of selectedRanks) {
      // eslint-disable-next-line no-await-in-loop
      await new Action().AddRank(window.profileData.id, selectedRank.data.id);
      // await System.Delay(500);

      this.progress.update(++currentProgress);
      this.progress.UpdateLabel(
        System.data.locale.userProfile.rankManager.xHasAssigned.replace(
          "%{rank_name}",
          ` ${selectedRank.data.name} `,
        ),
      );
    }

    await System.Delay(500);

    RemoveJunkNotifications();
    this.progress.update(++currentProgress);
    this.SavingCompleted();
  }

  ShowProgressContainer() {
    this.container.append(this.progressContainer);
  }

  SavingCompleted() {
    this.HideSpinner();
    this.progress.ChangeType("success");
    this.progress.UpdateLabel(System.data.locale.common.allDone);
  }

  ShowSpinner() {
    this.saveButton.Disable();
    this.saveButton.element.append(this.spinner);
  }

  HideSpinner() {
    this.saveButton.Enable();
    HideElement(this.spinner);
  }

  UpdateInputTitle() {
    const formTitle = $(`input[type="submit"]`, this.deleteAllRanksForm);

    formTitle.val(System.data.locale.userProfile.rankManager.removeAllRanks);
  }
}

export default RankManager;
