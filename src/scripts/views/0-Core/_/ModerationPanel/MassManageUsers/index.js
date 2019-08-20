import template from "backtick-template";
import debounce from "debounce";
import Modal from "../../../../../components/Modal";
import Action from "../../../../../controllers/Req/Brainly/Action";
import ApproveAnswers from "./ActionSection/ApproveAnswers";
import DeleteUsers from "./ActionSection/DeleteUsers";
import ModalContent from "./templates/ModalContent.html";
import User from "./User";
import ChangePoints from "./ActionSection/ChangePoints";
import Button from "../../../../../components/Button";
import { MenuListItem } from "../../../../../components/style-guide";

/**
 * @typedef {import("../../../../../controllers/Req/Brainly/Action/index").User} UserProfile
 * @type {import("../../../../../controllers/System").default}
 */
let System;
let SetSystem = () => !System && (System = window.System);

export default class MassManageUsers {
  constructor() {
    /**
     * @type {number[]}
     */
    this.idList = [];
    /**
     * @type {Object<string, User>}
     */
    this.users = {};
    /**
     * @type {UserProfile[]}
     */
    this.fetchedUsers = [];
    /**
     * @type {ApproveAnswers|DeleteUsers|ChangePoints}
     */
    this.activeAction;
    /**
     * @type {number[]}
     */
    this.removedIds = [];
    this.lastIdInputValue = "";

    SetSystem();
    this.RenderLi();
    this.RenderModal();
    this.RenderNumberOfIdsSpinner();
    this.RenderUserList();
    this.RenderRemoveAllButton();
    this.RenderRemoveSelectedButton();
    this.BindHandlers();
  }
  RenderLi() {
    this.li = MenuListItem({
      html: System.data.locale.core.massManageUsers.text
    });

    this.li.setAttribute("style", "display: table; width: 100%;");
  }
  RenderModal() {
    let contentData = {
      nIds: String(System.data.locale.common.nIds.replace("%{n}", ` <span class="sg-text--bold">0</span> `)),
      nUsers: String(System.data.locale.common.nUsers.replace("%{n}", ` <span class="sg-text--bold">0</span> `)),
      nNotFound: String(System.data.locale.common.nNotFound.replace("%{n}", ` <span class="sg-text--bold">0</span> `))
    };
    this.modal = new Modal({
      header: `
      <div class="sg-actions-list sg-actions-list--space-between">
				<div class="sg-actions-list__hole">
					<div class="sg-label sg-label--small sg-label--secondary">
						<div class="sg-text sg-text--peach">${System.data.locale.core.massManageUsers.text}</div>
					</div>
				</div>
			</div>`,
      content: template(ModalContent, contentData),
      size: "90prc sg-toplayer--fit-content"
    });

    this.$idInput = $("textarea", this.modal.$content);
    this.$sectionContainer = $("> .sg-content-box", this.modal.$content);
    this.$inputActionList = $("> .sg-content-box__content > .sg-actions-list", this.$sectionContainer);
    this.$numberOfIdsSpinnerContainer = $(".sg-spinner-container", this.modal.$content);
    this.$numberOfIds = $(".sg-text > span", this.$numberOfIdsSpinnerContainer);
    this.$numberOfUsers = $(".sg-content-box__actions .sg-actions-list__hole:nth-child(2) > .sg-text > span", this.modal.$content);
    this.$numberOfNotFound = $(".sg-content-box__actions .sg-actions-list__hole:nth-child(3) > .sg-text > span", this.modal.$content);
  }
  RenderNumberOfIdsSpinner() {
    this.$numberOfIdsSpinner = $(`
    <div class="sg-spinner-container__overlay">
      <div class="sg-spinner sg-spinner--small"></div>
    </div>`);
  }
  RenderUserList() {
    this.$userListContainer = $(`
    <div class="sg-actions-list__hole sg-actions-list__hole--container sg-actions-list__hole--grow">
      <div class="sg-content-box">
        <div class="sg-content-box__actions sg-textarea sg-textarea--tall sg-textarea--resizable-vertical sg-actions-list--space-evenly"></div>
        <div class="sg-content-box__actions">
          <div class="sg-actions-list sg-actions-list--space-around">
            <div class="sg-actions-list__hole"></div>
          </div>
        </div>
      </div>
    </div>`);

    this.$userList = $("> .sg-content-box > .sg-content-box__actions:nth-child(1)", this.$userListContainer);
    this.$removeButtonList = $(".sg-actions-list", this.$userListContainer);
    this.$removeAllButtonContainer = $(".sg-actions-list__hole", this.$removeButtonList);
  }
  RenderRemoveAllButton() {
    this.$removeAllButton = Button({
      size: "small",
      text: System.data.locale.common.removeAll,
      title: System.data.locale.core.massManageUsers.removeAllUsersFromTheList
    });

    this.$removeAllButton.appendTo(this.$removeAllButtonContainer);
  }
  RenderRemoveSelectedButton() {
    let $badge = $(`
    <div class="sg-badge">
      <div class="sg-text sg-text--xsmall sg-text--bold">0</div>
    </div>`);
    this.$numberOfSelectedUsers = $(".sg-text", $badge);
    this.$removeSelectedButton = Button({
      type: "secondary",
      size: "small",
      text: `${System.data.locale.core.massManageUsers.removeSelected}&nbsp;`,
      title: System.data.locale.core.massManageUsers.removeSelectedUsersFromTheList
    });
    this.$removeSelectedButtonContainer = $(`<div class="sg-actions-list__hole"></div>`);

    $badge.appendTo(this.$removeSelectedButton);
    this.$removeSelectedButton.appendTo(this.$removeSelectedButtonContainer);
  }
  BindHandlers() {
    this.modal.$close.click(this.modal.Close.bind(this.modal));
    this.li.addEventListener("click", this.Open.bind(this));
    this.$idInput.on("input", debounce(() => this.UpdateInput(), 1000));
    this.$removeAllButton.click(this.RemoveAllUsers.bind(this));
    this.$removeSelectedButton.click(this.RemoveSelectedUsers.bind(this));
  }
  Open() {
    this.modal.Open();
    /*this.$idInput.val([901322, 996887, 1016288].join("\n")) //"1\n2\n3\n4");
    this.$idInput.trigger("input");
    /**
     * 14818 40016
     * 129666 2152
     * 1016288 244
     * 996887 155
     */
  }
  UpdateInput() {
    //this.FixNumberLines();
    let value = this.$idInput.val().trim();

    if (value != this.lastIdInputValue) {
      this.lastIdInputValue = value;

      this.ParseIds();
      this.UpdateNumberOfIds();
      this.FetchUserDetails();
    }
  }
  FixNumberLines() {
    let value = this.$idInput.val();

    if (!value) return;

    let cursorPosition = ~~(this.$idInput.prop("selectionStart") + 1);
    let newValue = value.replace(/(\d{1,})+(?:([a-z])| {1,})/gm, "$1\n$2");

    if (value == newValue) return;

    this.$idInput
      .val(newValue)
      .prop("selectionStart", cursorPosition)
      .prop("selectionEnd", cursorPosition)
      .focus();
  }
  ParseIds() {
    let value = this.$idInput.val();
    let idList = System.ExtractIds(value);
    this.idList = [...new Set(idList)];
  }
  UpdateNumberOfIds() {
    this.$numberOfIds.text(this.idList.length);
  }
  async FetchUserDetails() {
    if (this.idList.length > 0) {
      let idList = this.FilterFetchedUserIds();

      if (idList.length > 0) {
        let removedIds = this.CheckIfIdListContainsAnyRemovedIds(idList);

        if (removedIds.length > 0) {
          if (confirm(System.data.locale.core.massManageUsers.notificationMessages.tryingToAddPreviouslyRemovedIds))
            this.RemoveIdsFromRemovedIdsList(removedIds);
          else
            idList = this.FilterRemovedIds(idList);
        }

        try {
          this.ShowNumberOfUsersSpinner();

          let resUsers = await new Action().GetUsers(idList);

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
    if (this.Users().length == 0)
      return this.idList;

    return this.idList.filter(id => {
      let _user = this.users[id];

      if (!_user)
        this.users[id] = true;

      return !_user
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
    this.$numberOfIdsSpinner.appendTo(this.$numberOfIdsSpinnerContainer);
  }
  HideNumberOfUsersSpinner() {
    this.HideElement(this.$numberOfIdsSpinner);
  }
  /**
   * @param {JQuery<HTMLElement>} $element
   */
  HideElement($element) {
    if ($element)
      $element.detach();
    //$element.appendTo("<div />");
  }
  /**
   * @param {number[]} idList
   */
  RemoveIdsFromIdList(idList) {
    idList.forEach(id => (delete this.users[id]));
  }
  RenderUsers() {
    this.fetchedUsers.forEach(this.RenderUser.bind(this));
  }
  /**
   * @param {UserProfile} details
   */
  RenderUser(details) {
    let user = this.users[details.id] = new User(details, this);

    /* let promise = new Action().GetUserProfile(details.id);
    promise.then(resProfil => {
      let count = resProfil.data.answers_by_subject.reduce((sum, entry) => sum + entry.answers_count, 0);
      console.log("Toplam cevap", count);
    }) */
    user.$.appendTo(this.$userList);
  }
  UpdateNumbers() {
    this.UpdateNumberOfNotFound();
    this.UpdateNumberOfUsers();
  }
  UpdateNumberOfUsers() {
    this.$numberOfUsers.text(this.Users().length);
  }
  UpdateNumberOfNotFound() {
    let count = this.RemoveNotFoundUsersFromStore();

    this.$numberOfNotFound.text(count);
  }
  RemoveNotFoundUsersFromStore() {
    let count = 0;
    let idList = this.Users();

    idList.forEach(id => {
      if (this.users[id] === true) {
        count++;
        delete this.users[id];
      }
    });

    return count;
  }
  ToggleSections() {
    if (this.Users().length > 0)
      this.ShowSections();
    else
      this.HideSections();
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
    this.$userListContainer.appendTo(this.$inputActionList);
  }
  HideUserList() {
    this.HideElement(this.$userListContainer);
  }
  ToggleUserList() {
    let idList = this.Users();

    if (idList.length == 0)
      this.HideUserList();
  }
  async ShowActionsSection() {
    if (!this.$actionsSection)
      this.RenderActionsSection();

    await System.Delay(50);

    this.$actionsSection.appendTo(this.$sectionContainer);
  }
  HideActionsSection() {
    this.HideElement(this.$actionsSection);
  }
  RenderActionsSection() {
    this.$actionsSection = $(`
    <div class="sg-content-box__content sg-content-box__content--spaced-top-xlarge">
      <div class="sg-actions-list sg-actions-list--space-around"></div>
    </div>`);

    this.$actionsList = $(".sg-actions-list", this.$actionsSection);

    this.RenderActionsSectionSeparator();
    this.RenderActions();
  }
  RenderActionsSectionSeparator() {
    this.$actionsSectionSeparator = $(`<div class="sg-horizontal-separator sg-horizontal-separator--short-spaced"></div>`);
  }
  ShowActionsSectionSeparator() {
    this.$actionsSectionSeparator.appendTo(this.$actionsSection);
  }
  HideActionsSectionSeparator() {
    this.HideElement(this.$actionsSectionSeparator);
  }
  RenderActions() {
    this.actions = [];

    if (System.checkUserP([27, 30]))
      this.actions.push(new ApproveAnswers(this));

    if (System.checkUserP([27, 31]))
      this.actions.push(new DeleteUsers(this));

    if (System.checkUserP([27, 32]))
      this.actions.push(new ChangePoints(this));

    if (this.actions.length > 0)
      this.actions.forEach(this.RenderAction.bind(this));
  }
  /**
   * @param {import("./ActionSection/index").default} Section
   */
  RenderAction(Section) {
    if (Section && Section.$actionButtonContainer)
      Section.$actionButtonContainer.appendTo(this.$actionsList);
  }
  ShowRemoveSelectedButton() {
    this.$removeSelectedButtonContainer.prependTo(this.$removeButtonList);
  }
  HideRemoveSelectedButton() {
    this.HideElement(this.$removeSelectedButtonContainer);
  }
  UserCheckboxChanged(user) {
    let idsOfSelectedUsers = this.ToggleRemoveSelectedButton();

    this.actions.forEach(action => {
      if (action.UserCheckboxChanged)
        action.UserCheckboxChanged(user, idsOfSelectedUsers);
    })
  }
  ToggleRemoveSelectedButton() {
    let filteredIds = this.SelectedUsers();

    if (filteredIds.length == 0)
      this.HideRemoveSelectedButton();
    else {
      this.ShowRemoveSelectedButton();
      this.$numberOfSelectedUsers.text(filteredIds.length);
    }

    return filteredIds;
  }
  SelectedUsers() {
    let idList = this.Users();

    return idList.filter(id => this.users[id].$checkbox.is(':checked'));
  }
  Users() {
    return Object.keys(this.users);
  }
  RemoveAllUsers() {
    if (confirm(System.data.locale.core.massManageUsers.notificationMessages.doYouReallyWantToRemoveAllUsers)) {
      let idList = this.Users();

      this.RemoveUsersById(idList);
    }
  }
  RemoveSelectedUsers() {
    if (confirm(System.data.locale.core.massManageUsers.notificationMessages.doYouWantToRemoveSelectedUsers)) {
      let idList = this.SelectedUsers();

      this.RemoveUsersById(idList);
    }
  }
  /**
   * @param {string[]} idList
   */
  RemoveUsersById(idList) {
    idList.forEach(id => {
      this.removedIds.push(~~id);
      //this.HideElement();
      this.users[id].$.remove();

      delete this.users[id];
    });

    this.UpdateNumbers();
    this.ToggleRemoveSelectedButton();
    this.ToggleSections();
  }
  MakeListedUsersBusy(onlySelected = false) {
    let idList;

    if (!onlySelected)
      idList = this.Users();
    else
      idList = this.SelectedUsers();

    if (idList.length == 0) {
      this.modal.notification(System.data.locale.core.massManageUsers.notificationMessages.thereIsNoUserLeft, "info");

      return null;
    }

    return idList.map(id => {
      this.users[id].BeBusy();

      return Number(id);
    });
  }
  UnBusyListedUsers() {
    let idList = this.Users();

    if (idList.length > 0)
      idList = idList.map(id => {
        this.users[id].UnBusy();

        return Number(id);
      });
  }
}
