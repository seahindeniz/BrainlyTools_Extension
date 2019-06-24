import ActionSection from ".";
import Action from "../../../../../../controllers/Req/Brainly/Action";

/**
 * @type {import("../../../../../../controllers/System").default}
 */
let System;
let SetSystem = () => !System && (System = window.System);

export default class DeleteUsers extends ActionSection {
  constructor(main) {
    SetSystem();
    /**
     * @type {import("./index").renderDetails}
     */
    let renderDetails = {
      content: {
        text: System.data.locale.core.massManageUsers.sections.actionButton.deleteUsers.title,
        style: " sg-text--peach-dark"
      },
      actionButton: {
        ...System.data.locale.core.massManageUsers.sections.actionButton.deleteUsers,
        style: "sg-button-secondary--peach-inverse"
      }
    }

    super(main, renderDetails);

    this.started = false;
    this.openedConnection = 0;

    this.RenderContent();
    this.RenderStopButton();
    this.RenderUserList();
    this.BindHandlers();
  }
  RenderContent() {
    this.$content = $(`
    <div class="sg-actions-list sg-actions-list--no-wrap sg-actions-list--to-top sg-actions-list--centered">
      <div class="sg-actions-list__hole sg-actions-list__hole--10-em">
        <div class="sg-content-box">
          <div class="sg-content-box__content sg-content-box__content--full sg-content-box__content--with-centered-text">
            <button class="sg-button-secondary">${System.data.locale.common.start}</button>
          </div>
        </div>
      </div>
    </div>`);

    this.$startButton = $("button", this.$content);
    this.$buttonContainer = $(".sg-content-box__content", this.$content);

    this.$content.appendTo(this.$contentContainer);
  }
  RenderStopButton() {
    this.$stopButton = $(`<button class="sg-button-secondary sg-button-secondary--peach">${System.data.locale.common.stop}</button>`);
  }
  RenderUserList() {
    this.$userListContainer = $(`
    <div class="sg-actions-list__hole sg-actions-list__hole--grow">
      <div class="sg-content-box__actions sg-textarea sg-textarea--tall sg-textarea--resizable-vertical sg-actions-list--space-evenly"></div>
    </div>`);

    this.$userList = $(".sg-content-box__actions", this.$userListContainer);
  }
  BindHandlers() {
    this.$startButton.click(this.StartDeleting.bind(this));
    this.$stopButton.click(this.StopDeleting.bind(this));
  }
  StartDeleting() {
    this.SetUserIdList();

    if (this.userIdList && confirm(System.data.locale.core.massManageUsers.notificationMessages.areYouSureAboutDeletingAllListedUsers)) {
      this.started = true;

      this.ShowUserList();
      this.ShowStopButton();
      this.TryToDelete();
      this._loop_TryToDelete = setInterval(this.TryToDelete.bind(this), 1000);
    }
  }
  ShowUserList() {
    this.$userListContainer.appendTo(this.$content);
  }
  ShowStopButton() {
    this.HideStartButton();
    this.$stopButton.appendTo(this.$buttonContainer);
  }
  HideStartButton() {
    this.main.HideElement(this.$startButton);
  }
  HideStopButton() {
    this.main.HideElement(this.$stopButton);
    this.ShowStartButton();
  }
  ShowStartButton() {
    this.$startButton.appendTo(this.$buttonContainer);
  }
  TryToDelete() {
    if (this.started)
      for (let i = 0; i < 7; i++)
        if (this.openedConnection < 7) {
          this.openedConnection++;
          let user = this.PickUser();

          if (!user)
            return this.StopDeleting();

          this.DeleteUser(user);
        }
  }
  StopDeleting() {
    this.started = false;

    this.HideStopButton();
    clearInterval(this._loop_TryToDelete);
    this.main.modal.notification(System.data.locale.common.allDone, "success");
  }
  /**
   * @param {import("../User").default} user
   */
  async DeleteUser(user) {
    await new Action().DeleteAccount(user.details.id);
    //await System.TestDelay();
    this.UserDeleted(user);
  }
  /**
   * @param {import("../User").default} user
   */
  UserDeleted(user) {
    this.openedConnection--;

    user.Move$To$(this.$userList);
    user.ChangeBoxColor("sg-box--peach");
  }
}
