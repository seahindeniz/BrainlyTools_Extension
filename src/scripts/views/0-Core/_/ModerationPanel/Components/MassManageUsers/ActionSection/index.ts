import { ActionListHole, Button } from "@style-guide";
import { ButtonPropsType } from "@style-guide/Button";
import type MassManageUsersClassType from "..";
import type UserClassType from "../User";

export type RenderDetailsType = {
  content: { text: string; style: string };
  actionButton: ButtonPropsType;
};

export default class ActionSection {
  main: MassManageUsersClassType;
  renderDetails: RenderDetailsType;

  users: {
    [x: number]: UserClassType;
  };

  userIdList: number[];

  $: JQuery<HTMLElement>;
  $contentContainer: JQuery<HTMLElement>;
  $actionsContainer: JQuery<HTMLElement>;
  tabButton: Button;
  actionButtonContainer: HTMLDivElement;
  $userListContainer: JQuery<HTMLElement>;
  $userList: JQuery<HTMLElement>;

  constructor(
    main: MassManageUsersClassType,
    renderDetails: RenderDetailsType,
  ) {
    this.main = main;
    this.renderDetails = renderDetails;

    this.users = {};
    this.userIdList = [];

    this.Render();
    this.RenderTabButton();
    this.RenderUserList();
    this.BindButtonHandler();
  }

  Render() {
    this.$ = $(`
    <div class="sg-content-box">
      <div class="sg-content-box__title sg-content-box__title--spaced-top sg-content-box__title--spaced-bottom sg-content-box__title--spaced-small">
        <h2 class="sg-text sg-text--bold ${this.renderDetails.content.style}">${this.renderDetails.content.text}</h2>
      </div>
      <div class="sg-content-box__content"></div>
      <div class="sg-content-box__actions"></div>
    </div>`);

    this.$contentContainer = $("> .sg-content-box__content", this.$);
    this.$actionsContainer = $("> .sg-content-box__actions", this.$);
  }

  RenderTabButton() {
    this.tabButton = new Button({
      size: "s",
      ...this.renderDetails.actionButton,
    });
    this.actionButtonContainer = ActionListHole({
      spaceBellow: true,
      children: this.tabButton.element,
    });
  }

  RenderUserList() {
    this.$userListContainer = $(`
    <div class="sg-actions-list__hole sg-actions-list__hole--grow">
      <div class="sg-content-box__actions sg-textarea sg-textarea--tall sg-textarea--resizable-vertical sg-actions-list--space-evenly sg-textarea--max1000 sg-textarea--min-width-25em"></div>
    </div>`);

    this.$userList = $(".sg-content-box__actions", this.$userListContainer);
  }

  BindButtonHandler() {
    this.tabButton.element.addEventListener(
      "click",
      this.ShowSection.bind(this),
    );
  }

  ShowSection() {
    if (this.main.activeAction) {
      this.main.activeAction.HideSection();

      if (this.main.activeAction === this) {
        this.main.activeAction = undefined;

        this.main.HideActionsSectionSeparator();

        return;
      }
    }

    this.main.activeAction = this;

    this.tabButton.Active();
    this.main.ShowActionsSectionSeparator();
    this.$.appendTo(this.main.actionsSection);
  }

  HideSection() {
    this.main.HideElement(this.$);
    this.tabButton.Inactive();
  }

  /* SetUserIdList() {
    this.userIdList = this.main.MakeListedUsersBusy();
  } */
  PickUser() {
    const id = this.userIdList.shift();

    if (!id) return undefined;

    return this.main.users[id];
  }

  SetUsers(onlySelected = false) {
    const listedUserIdList = this.main.MakeListedUsersBusy(onlySelected);

    if (!listedUserIdList) {
      this.userIdList = null;

      return;
    }

    this.userIdList = [...new Set(listedUserIdList)] as number[];
  }
}
