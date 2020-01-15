import {
  ActionList,
  ActionListHole,
  ContentBox
} from "@style-guide";
import UserBio from "../../components/UserBio";
import UserHat from "../../components/UserHat";
import UserNoteBox from "../../components/UserNoteBox";
import Action from "../../controllers/Req/Brainly/Action";
import ServerReq from "@ServerReq";
import WaitForElement from "../../helpers/WaitForElement";
import AccountDeleteReporter from "./_/AccountDeleteReporter";
import FriendsManager from "./_/FriendsManager";
import MorePanel from "./_/MorePanel";
import RankManager from "./_/RankManager";

System.pageLoaded("User Profile inject OK!");

export default class UserProfile {
  constructor() {
    this.Init();
  }
  async Init() {
    try {
      let mainRight = await WaitForElement("#main-right");
      this.mainRight = mainRight[0];
      this.profileData = this.GetProfileData();
      this.promise = {
        profile: new Action().GetUserProfile(this.profileData.id),
        extension: new ServerReq().GetUser(this.profileData),
        moderators: new ServerReq().GetAllModerators(),
      }

      this.FixInfoBottom();

      this.morePanel = new MorePanel(this);

      new AccountDeleteReporter();
      this.RenderFriendsManager();
      this.RenderProfileInfoSection();
      this.LoadComponentsAfterExtensionResolve();
      this.LoadComponentsAfterBrainlyResolve();
      this.LoadComponentsAfterModeratorsResolved();
      this.LoadComponentsAfterAllResolved();
    } catch (error) {
      console.error(error);
    }
  }
  GetProfileData() {
    /**
     * @type {{id: number, nick: string}}
     */
    // @ts-ignore
    let data = window.profileData;

    if (!data || !data.id || !data.nick)
      throw "Can't find the profile data of user";

    return data;
  }
  FixInfoBottom() {
    let info_bottom = document.querySelector(".info_bottom");

    if (!info_bottom)
      throw "info_bottom element cannot be found";

    this.infoBottomList = ActionList({
      direction: "space-between",
    });

    Array.from(info_bottom.children).forEach(children => {
      let hole = ActionListHole({
        children,
      });

      this.infoBottomList.append(hole);
    });

    info_bottom.after(this.infoBottomList);
    info_bottom.remove();
  }
  RenderFriendsManager() {
    if (window.myData.id == this.profileData.id)
      FriendsManager();
  }
  RenderProfileInfoSection() {
    this.infoSection = ContentBox({
      full: true,
    });

    let personal_info = document.querySelector(
      "#main-left > div.personal_info > div.clear"
    );

    if (personal_info)
      personal_info.after(this.infoSection);
  }
  async LoadComponentsAfterExtensionResolve() {
    let resUser = await this.promise.extension;

    if (!resUser.success)
      throw "User can't passed to extension server";

    this.extensionUser = resUser.data;
    console.log("this.extensionUser:", this.extensionUser);

    if (this.extensionUser) {
      this.RenderNoteSection();
      this.RenderPreviousNicks();
      this.morePanel.ShowPermissionStatus();
      this.morePanel.RenderSectionsAfterExtensionResolved();
    }
  }
  RenderNoteSection() {
    this.noteSection = UserNoteBox(this.extensionUser);
    this.$noteContainer = $(`
		<div class="userNoteContainer">
			<h3 class="bold dark_grey" title="${System.data.locale.common.personalNote.title}">${System.data.locale.common.personalNote.text}</h3>
		</div>`);

    this.$noteContainer.append(this.noteSection);
    this.$noteContainer.prependTo(this.mainRight);
  }
  RenderPreviousNicks() {
    let previousNicks = (this.extensionUser.previousNicks &&
      this.extensionUser.previousNicks.join(", ")) || " -";
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

    $previousNickBox.prependTo(this.infoSection);
  }
  async LoadComponentsAfterBrainlyResolve() {
    let res = await this.promise.profile;

    if (!res || !res.success || !res.data)
      return console.error("Data is not correct: ", res);

    this.brainlyUser = res.data;

    this.RenderUserBio();
    new RankManager(res.data);
  }
  RenderUserBio() {
    let userBio = new UserBio(this.brainlyUser.description, window.myData
      .id == this.profileData.id);
    let $bioContainer = $(`
		<div class="sg-content-box__actions">
			<div class="sg-horizontal-separator"></div>
		</div>`);

    userBio.$.prependTo($bioContainer);
    $bioContainer.appendTo(this.infoSection);
  }
  async LoadComponentsAfterModeratorsResolved() {
    await this.promise.moderators;
    console.log(System.allModerators);
    this.morePanel.RenderSectionsAfterModeratorsResolved();
  }
  async LoadComponentsAfterAllResolved() {
    await Promise.all([this.promise.extension, this.promise.profile]);

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
    /* let tag = new UserTag(this.profileData.id, this.extensionUser);

    tag.$.insertAfter("#main-left span.ranking"); */
  }
  /**
   * @param {HTMLElement} element
   */
  HideElement(element) {
    if (element && element.parentElement)
      element.parentElement.removeChild(element);
  }
}

new UserProfile();
