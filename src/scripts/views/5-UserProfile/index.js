import UserBio from "../../components/UserBio";
import UserHat from "../../components/UserHat";
import UserNoteBox from "../../components/UserNoteBox";
import UserTag from "../../components/UserTag";
import { GetUserByID } from "../../controllers/ActionsOfBrainly";
import { GetUser } from "../../controllers/ActionsOfServer";
import WaitForElement from "../../helpers/WaitForElement";
import AccountDeleteReporter from "./_/AccountDeleteReporter";
import FriendsManager from "./_/FriendsManager";
import RankManager from "./_/RankManager";

System.pageLoaded("User Profile inject OK!");

class UserProfile {
  constructor() {
    this.Init();
  }
  async Init() {
    try {
      this.mainRight = await WaitForElement("#main-right");
      this.profileData = await this.GetProfilData();

      this.extensionPromise = GetUser(this.profileData.id, this.profileData.nick);
      this.brainlyPromise = GetUserByID(this.profileData.id);

      new AccountDeleteReporter();
      this.RenderFriendsManager();
      this.RenderProfileInfoSection();
      this.LoadComponentsAfterExtensionResolve();
      this.LoadComponentsAfterBrainlyResolve();
      this.LoadComponentsAfterAllResolved();
    } catch (error) {
      console.error(error);
    }
  }
  async GetProfilData() {
    let data = window.profileData;

    if (!data || !data.id || !data.nick)
      return Promise.reject("Can't find the user profile data");

    return Promise.resolve(data);
  }
  RenderFriendsManager() {
    if (myData.id == this.profileData.id)
      FriendsManager();
  }
  RenderProfileInfoSection() {
    this.$infoSection = $(`<div class="sg-content-box sg-content-box--full"></div>`);

    this.$infoSection.insertAfter("#main-left > div.personal_info > div.clear");
  }
  async LoadComponentsAfterExtensionResolve() {
    let resUser = await this.extensionPromise;

    if (!resUser.success)
      return console.error("User can't passed to extension server");

    this.extensionUser = resUser.data;

    if (this.extensionUser) {
      this.RenderNoteSection();
      this.RenderPreviousNicks();
    }
  }
  RenderNoteSection() {
    this.$noteSection = UserNoteBox(this.extensionUser);
    this.$noteContainer = $(`
		<div class="userNoteContainer">
			<h3 class="bold dark_grey" title="${System.data.locale.common.personalNote.title}">${System.data.locale.common.personalNote.text}</h3>
		</div>`);

    this.$noteSection.appendTo(this.$noteContainer);
    this.$noteContainer.prependTo(this.mainRight);
  }
  RenderPreviousNicks() {
    let previousNicks = (this.extensionUser.previousNicks && this.extensionUser.previousNicks.join(", ")) || " -";
    let $previousNickBox = $(`
		<div class="sg-content-box__actions sg-content-box__actions--spaced-top-large">
			<div class="sg-actions-list sg-actions-list--no-wrap sg-actions-list--to-top sg-content-box__actions--spaced-bottom">
				<div class="sg-actions-list__hole" title="${System.data.locale.userProfile.previousNicks.title}">
					<p class="sg-text sg-text--small sg-text--bold">${System.data.locale.userProfile.previousNicks.text}: </p>
				</div>
				<div class="sg-actions-list__hole sg-actions-list__hole--grow">
					<p class="sg-text sg-text--xsmall">${previousNicks}</p>
				</div>
			</div>
			<div class="sg-horizontal-separator"></div>
		</div>`);

    $previousNickBox.prependTo(this.$infoSection);
  }
  async LoadComponentsAfterBrainlyResolve() {
    let res = await this.brainlyPromise;

    if (!res || !res.success || !res.data)
      return console.error("Data is not correct: ", res);

    this.brainlyUser = res.data;

    this.RenderUserBio();
    new RankManager(res.data);
  }
  RenderUserBio() {
    let userBio = new UserBio(this.brainlyUser.description, myData.id == this.profileData.id);
    let $bioContainer = $(`
		<div class="sg-content-box__actions">
			<div class="sg-horizontal-separator"></div>
		</div>`);

    userBio.$.prependTo($bioContainer);
    $bioContainer.appendTo(this.$infoSection);
  }
  async LoadComponentsAfterAllResolved() {
    await Promise.all([this.extensionPromise, this.brainlyPromise]);

    if (this.extensionUser && this.brainlyUser) {
      this.RenderExtensionUserTag();

      if (this.extensionUser.probatus) {
        this.RenderUserHat();
      }
    }
  }
  RenderUserHat() {
    let $img = UserHat(this.brainlyUser.gender);

    $img.prependTo("#main-left > div.personal_info");
  }
  RenderExtensionUserTag() {
    let tag = new UserTag(this.profileData.id, this.extensionUser);

    tag.$.insertAfter("#main-left span.ranking");
  }
}

new UserProfile();
