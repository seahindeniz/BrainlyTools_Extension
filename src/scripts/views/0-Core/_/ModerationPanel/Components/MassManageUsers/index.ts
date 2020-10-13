import Action, { UserType } from "@BrainlyAction";
import {
  ActionList,
  ActionListHole,
  Badge,
  Button,
  ContentBox,
  ContentBoxActions,
  ContentBoxContent,
  SeparatorHorizontal,
  Spinner,
  SpinnerContainer,
  Text,
  Textarea,
} from "@style-guide";
import { TextElement } from "@style-guide/Text";
import debounce from "debounce";
import Modal from "@components/Modal2";
import Build from "@root/helpers/Build";
import Components from "..";
import type ActionSectionClassType from "./ActionSection";
import ApproveAnswers from "./ActionSection/ApproveAnswers";
// import ChangeRanks from "./ActionSection/ChangeRanks";
import DeleteUsers from "./ActionSection/DeleteUsers";
import User from "./User";

type ActionsType = ApproveAnswers | DeleteUsers;
/* | ChangeRanks */

export default class MassManageUsers extends Components {
  idList: number[];
  users: {
    [x: string]: User | boolean;
  };

  fetchedUsers: UserType[];
  activeAction: ActionsType | ActionSectionClassType;
  actions: ActionsType[];
  removedIds: number[];
  lastIdInputValue: string;

  modal: Modal;
  sectionContainer: HTMLDivElement;
  inputActionList: HTMLDivElement;
  idInput: HTMLTextAreaElement;
  numberOfIdsSpinnerContainer: HTMLDivElement;
  numberOfIdsText: TextElement<"div">;
  numberOfUsersText: TextElement<"div">;
  numberOfNotFoundText: TextElement<"div">;
  numberOfIds: HTMLSpanElement;
  numberOfUsers: HTMLSpanElement;
  numberOfNotFound: HTMLSpanElement;
  numberOfIdsSpinner: HTMLDivElement;
  removeAllButton: Button;
  removeAllButtonContainer: HTMLDivElement;
  userList: HTMLDivElement;
  removeButtonList: HTMLDivElement;
  userListContainer: HTMLDivElement;
  numberOfSelectedUsers: HTMLDivElement;
  removeSelectedButton: Button;
  removeSelectedButtonContainer: HTMLDivElement;
  actionsList: HTMLDivElement;
  actionsSection: HTMLDivElement;
  actionsSectionSeparator: HTMLDivElement;

  constructor(main) {
    super(main);

    this.idList = [];
    this.users = {};
    this.fetchedUsers = [];
    this.removedIds = [];
    this.lastIdInputValue = "";
    this.liLinkContent = System.data.locale.core.massManageUsers.text;

    this.RenderListItem();
    this.RenderNumberOfIdsSpinner();
    this.RenderModal();
    this.RenderRemoveAllButton();
    this.RenderUserList();
    this.RenderRemoveSelectedButton();
    this.BindHandlers();
  }

  RenderModal() {
    const nIds = System.data.locale.common.nIds.replace(
      "%{n}",
      ` <span class="sg-text--bold">0</span> `,
    );
    const nUsers = System.data.locale.common.nUsers.replace(
      "%{n}",
      ` <span class="sg-text--bold">0</span> `,
    );
    const nNotFound = System.data.locale.common.nNotFound.replace(
      "%{n}",
      ` <span class="sg-text--bold">0</span> `,
    );

    this.modal = new Modal({
      overlay: true,
      size: "fit-content",
      title: System.data.locale.core.massManageUsers.text,
      content: {
        children: Build((this.sectionContainer = ContentBox()), [
          [
            ContentBoxContent(),
            [
              [
                (this.inputActionList = ActionList({
                  noWrap: true,
                  toTop: true,
                })),
                [
                  [
                    ActionListHole({
                      className: "sg-actions-list__hole--22-em",
                    }),
                    [
                      [
                        ContentBox(),
                        [
                          [
                            ContentBoxContent(),
                            (this.idInput = Textarea({
                              tag: "textarea",
                              fullWidth: true,
                              size: "tall",
                              resizable: "vertical",
                              placeholder:
                                System.data.locale.common.profileLinksOrIds,
                            })),
                          ],
                          [
                            ContentBoxActions(),
                            [
                              [
                                ActionList({
                                  noWrap: true,
                                  direction: "space-between",
                                }),
                                [
                                  [
                                    ActionListHole(),
                                    [
                                      [
                                        (this.numberOfIdsSpinnerContainer = SpinnerContainer()),
                                        (this.numberOfIdsText = Text({
                                          tag: "div",
                                          size: "xsmall",
                                          html: nIds,
                                        })),
                                      ],
                                    ],
                                  ],
                                  [
                                    ActionListHole(),
                                    (this.numberOfUsersText = Text({
                                      tag: "div",
                                      size: "xsmall",
                                      color: "blue-dark",
                                      html: nUsers,
                                    })),
                                  ],
                                  [
                                    ActionListHole(),
                                    (this.numberOfNotFoundText = Text({
                                      tag: "div",
                                      size: "xsmall",
                                      color: "peach-dark",
                                      html: nNotFound,
                                    })),
                                  ],
                                ],
                              ],
                            ],
                          ],
                        ],
                      ],
                    ],
                  ],
                ],
              ],
            ],
          ],
        ]),
      },
    });

    this.numberOfIds = this.numberOfIdsText.querySelector("span");
    this.numberOfUsers = this.numberOfUsersText.querySelector("span");
    this.numberOfNotFound = this.numberOfNotFoundText.querySelector("span");
  }

  RenderNumberOfIdsSpinner() {
    this.numberOfIdsSpinner = Spinner({
      size: "small",
      overlay: true,
    });
  }

  RenderRemoveAllButton() {
    this.removeAllButton = new Button({
      type: "solid",
      size: "s",
      text: System.data.locale.common.removeAll,
      title: System.data.locale.core.massManageUsers.removeAllUsersFromTheList,
    });

    this.removeAllButtonContainer = ActionListHole({
      children: this.removeAllButton.element,
    });
  }

  RenderUserList() {
    this.userList = ActionList({ direction: "space-evenly" });
    this.removeButtonList = ActionList({ direction: "space-around" });
    this.userListContainer = Build(
      ActionListHole({
        asContainer: true,
        grow: true,
      }),
      [
        [
          ContentBox({
            full: true,
          }),
          [
            [
              Textarea({
                tag: "div",
                size: "tall",
                color: "white",
                fullWidth: true,
                resizable: "vertical",
              }),
              [[ContentBoxActions({ style: "height: 100%;" }), this.userList]],
            ],
            [
              ContentBoxActions(),
              [[this.removeButtonList, this.removeAllButtonContainer]],
            ],
          ],
        ],
      ],
    );
  }

  RenderRemoveSelectedButton() {
    const badge = Badge({
      textProps: {
        text: 0,
        size: "xsmall",
        weight: "bold",
      },
    });
    this.numberOfSelectedUsers = badge.querySelector("*");

    this.removeSelectedButton = new Button({
      type: "outline",
      size: "s",
      html: `${System.data.locale.core.massManageUsers.removeSelected}&nbsp;`,
      title:
        System.data.locale.core.massManageUsers.removeSelectedUsersFromTheList,
      children: badge,
    });
    this.removeSelectedButtonContainer = ActionListHole({
      children: this.removeSelectedButton.element,
    });
  }

  BindHandlers() {
    this.li.addEventListener("click", this.Open.bind(this));
    this.idInput.addEventListener(
      "input",
      debounce(() => this.UpdateInput(), 1000),
    );
    this.removeAllButton.element.addEventListener(
      "click",
      this.RemoveAllUsers.bind(this),
    );
    this.removeSelectedButton.element.addEventListener(
      "click",
      this.RemoveSelectedUsers.bind(this),
    );
  }

  Open() {
    this.modal.Open();
    /* this.idInput.value = ([901322, 996887, 1016288].join("\n")) //"1\n2\n3\n4");
    $(this.idInput).trigger("input");
    /**
     * 14818 40016
     * 129666 2152
     * 1016288 244
     * 996887 155
     */
  }

  UpdateInput() {
    // this.FixNumberLines();
    const value = this.idInput.value.trim();

    if (value === this.lastIdInputValue) return;

    this.lastIdInputValue = value;

    this.ParseIds();
    this.UpdateNumberOfIds();
    this.FetchUserDetails();
  }

  FixNumberLines() {
    const { value } = this.idInput;

    if (!value) return;

    const cursorPosition = ~~(this.idInput.selectionStart + 1);
    const newValue = value.replace(/(\d{1,})+(?:([a-z])| {1,})/gm, "$1\n$2");

    if (value === newValue) return;

    this.idInput.value = newValue;
    this.idInput.selectionStart = cursorPosition;
    this.idInput.selectionEnd = cursorPosition;
  }

  ParseIds() {
    const idList = System.ExtractIds(this.idInput.value);
    this.idList = [...new Set(idList)];
  }

  UpdateNumberOfIds() {
    this.numberOfIds.innerText = String(this.idList.length);
  }

  async FetchUserDetails() {
    if (this.idList.length > 0) {
      let idList = this.FilterFetchedUserIds();

      if (idList.length > 0) {
        const removedIds = this.CheckIfIdListContainsAnyRemovedIds(idList);

        if (removedIds.length > 0) {
          if (
            confirm(
              System.data.locale.core.massManageUsers.notificationMessages
                .tryingToAddPreviouslyRemovedIds,
            )
          )
            this.RemoveIdsFromRemovedIdsList(removedIds);
          else idList = this.FilterRemovedIds(idList);
        }

        try {
          this.ShowNumberOfUsersSpinner();

          const resUsers = await new Action().GetUsers(idList);

          if (resUsers && resUsers.success) {
            this.fetchedUsers = resUsers.data;

            this.RenderUsers();
            this.UpdateNumbers();
            this.ToggleSections();
          }
        } catch (error) {
          this.RemoveIdsFromIdList(idList);
        }

        this.HideNumberOfUsersSpinner();
      }
    }
  }

  FilterFetchedUserIds() {
    if (this.Users().length === 0) return this.idList;

    return this.idList.filter(id => {
      const user = this.users[id];

      if (!user) this.users[id] = true;

      return !user;
    });
  }

  /**
   * @param {number[]} idList
   */
  CheckIfIdListContainsAnyRemovedIds(idList) {
    return idList.filter(id => this.removedIds.includes(id));
  }

  /**
   * @param {number[]} idList
   */
  RemoveIdsFromRemovedIdsList(idList) {
    this.removedIds = this.removedIds.filter(id => !idList.includes(id));
  }

  /**
   * @param {number[]} idList
   */
  FilterRemovedIds(idList) {
    return idList.filter(id => !this.removedIds.includes(id));
  }

  ShowNumberOfUsersSpinner() {
    this.numberOfIdsSpinnerContainer.append(this.numberOfIdsSpinner);
  }

  HideNumberOfUsersSpinner() {
    this.HideElement(this.numberOfIdsSpinner);
  }

  /**
   * @param {number[]} idList
   */
  RemoveIdsFromIdList(idList) {
    idList.forEach(id => delete this.users[id]);
  }

  RenderUsers() {
    this.fetchedUsers.forEach(this.RenderUser.bind(this));
  }

  /**
   * @param {UserProfile} details
   */
  RenderUser(details) {
    const user = new User(details, this);
    this.users[details.id] = user;

    /* let promise = new Action().GetUserProfile(details.id);
    promise.then(resProfil => {
      let count = resProfil.data.answers_by_subject.reduce((sum, entry) => sum + entry.answers_count, 0);
      console.log("Toplam cevap", count);
    }) */
    this.userList.append(user.container);
  }

  UpdateNumbers() {
    this.UpdateNumberOfNotFound();
    this.UpdateNumberOfUsers();
  }

  UpdateNumberOfUsers() {
    this.numberOfUsers.innerText = String(this.Users().length);
  }

  UpdateNumberOfNotFound() {
    const count = this.RemoveNotFoundUsersFromStore();

    this.numberOfNotFound.innerText = String(count);
  }

  RemoveNotFoundUsersFromStore() {
    let count = 0;
    const idList = this.Users();

    idList.forEach(id => {
      if (this.users[id] === true) {
        count++;
        delete this.users[id];
      }
    });

    return count;
  }

  ToggleSections() {
    if (this.Users().length > 0) this.ShowSections();
    else this.HideSections();
  }

  ShowSections() {
    this.ShowUserList();
    this.ShowActionsSection();
  }

  HideSections() {
    this.HideUserList();
    this.HideActionsSection();
  }

  ShowUserList() {
    this.inputActionList.append(this.userListContainer);
  }

  HideUserList() {
    this.HideElement(this.userListContainer);
  }

  ToggleUserList() {
    const idList = this.Users();

    if (idList.length === 0) this.HideUserList();
  }

  async ShowActionsSection() {
    if (!this.actionsSection) this.RenderActionsSection();

    await System.Delay(50);

    this.sectionContainer.append(this.actionsSection);
  }

  HideActionsSection() {
    this.HideElement(this.actionsSection);
  }

  RenderActionsSection() {
    this.actionsList = ActionList({ direction: "space-around" });
    this.actionsSection = ContentBoxContent({
      spacedTop: "xlarge",
      children: this.actionsList,
    });

    this.RenderActionsSectionSeparator();
    this.RenderActions();
  }

  RenderActionsSectionSeparator() {
    this.actionsSectionSeparator = SeparatorHorizontal({
      type: "short-spaced",
    });
  }

  ShowActionsSectionSeparator() {
    this.actionsSection.append(this.actionsSectionSeparator);
  }

  HideActionsSectionSeparator() {
    this.HideElement(this.actionsSectionSeparator);
  }

  RenderActions() {
    this.actions = [];

    if (System.checkUserP([27, 30]))
      this.actions.push(new ApproveAnswers(this));

    if (System.checkUserP([27, 31])) this.actions.push(new DeleteUsers(this));

    /* if (System.checkUserP([27, 33]))
      this.actions.push(new ChangeRanks(this)); */

    if (this.actions.length > 0)
      this.actions.forEach(this.RenderAction.bind(this));
  }

  /**
   * @param {import("./ActionSection/index").default} Section
   */
  RenderAction(Section) {
    if (Section && Section.actionButtonContainer)
      this.actionsList.append(Section.actionButtonContainer);
  }

  ShowRemoveSelectedButton() {
    this.removeButtonList.prepend(this.removeSelectedButtonContainer);
  }

  HideRemoveSelectedButton() {
    this.HideElement(this.removeSelectedButtonContainer);
  }

  UserCheckboxChanged() {
    return this;
    /* const idsOfSelectedUsers = this.ToggleRemoveSelectedButton();

    this.actions.forEach(action => {
      if ("UserCheckboxChanged" in action)
        action.UserCheckboxChanged(user, idsOfSelectedUsers);
    }); */
  }

  ToggleRemoveSelectedButton() {
    const filteredIds = this.SelectedUsers();

    if (filteredIds.length === 0) this.HideRemoveSelectedButton();
    else {
      this.ShowRemoveSelectedButton();
      this.numberOfSelectedUsers.innerHTML = String(filteredIds.length);
    }

    return filteredIds;
  }

  SelectedUsers() {
    const idList = this.Users();

    return idList.filter(id => {
      const user = this.users[id];

      if (!(user instanceof User)) return false;

      return user.checkbox.checked;
    });
  }

  Users() {
    return Object.keys(this.users);
  }

  RemoveAllUsers() {
    if (
      confirm(
        System.data.locale.core.massManageUsers.notificationMessages
          .doYouReallyWantToRemoveAllUsers,
      )
    ) {
      const idList = this.Users();

      this.RemoveUsersById(idList);
    }
  }

  RemoveSelectedUsers() {
    if (
      confirm(
        System.data.locale.core.massManageUsers.notificationMessages
          .doYouWantToRemoveSelectedUsers,
      )
    ) {
      const idList = this.SelectedUsers();

      this.RemoveUsersById(idList);
    }
  }

  /**
   * @param {string[]} idList
   */
  RemoveUsersById(idList) {
    idList.forEach(async id => {
      this.removedIds.push(~~id);
      // this.HideElement();
      const user = this.users[id];

      if (user instanceof User) {
        this.HideElement(user.container);
        await System.Delay(50);
        user.container.remove();
      }

      delete this.users[id];
    });

    this.UpdateNumbers();
    this.ToggleRemoveSelectedButton();
    this.ToggleSections();
  }

  MakeListedUsersBusy(onlySelected = false) {
    let idList;

    if (!onlySelected) idList = this.Users();
    else idList = this.SelectedUsers();

    if (idList.length === 0) {
      this.modal.Notification({
        text:
          System.data.locale.core.massManageUsers.notificationMessages
            .thereIsNoUserLeft,
        type: "info",
      });

      return null;
    }

    return idList.map(id => {
      const user = this.users[id];

      if (user instanceof User) user.BeBusy();

      return Number(id);
    });
  }

  UnBusyListedUsers() {
    const keys = this.Users();
    /**
     * @type {number[]}
     */
    let idList = [];

    if (keys.length > 0)
      idList = keys.map(id => {
        const user = this.users[id];

        if (user instanceof User) user.UnBusy();

        return Number(id);
      });

    return idList;
  }
}
