import IsVisible from "@root/helpers/IsVisible";
import WaitForElement from "@root/helpers/WaitForElement";
import ServerReq from "@root/controllers/Req/Server";
import { ActionList, ActionListHole, ContentBox } from "@style-guide";
import UserBio from "@components/UserBio";
import UserHat from "@components/UserHat";
import UserNoteBox from "@components/UserNoteBox";
import Action from "../../../controllers/Req/Brainly/Action";
import AccountDeleteReporter from "./_/AccountDeleteReporter";
import FriendsManager from "./_/FriendsManager";
import MorePanel from "./_/MorePanel";
import RankManager from "./_/RankManager";

System.pageLoaded("User Profile inject OK!");

function MakeProfileMorePanelAlwaysVisible() {
  const panel = document.querySelector("#profile-mod-panel");
  const showMoreButton = panel.previousElementSibling;

  if (!panel) return;

  if (!IsVisible(panel, true) && showMoreButton instanceof HTMLSpanElement)
    showMoreButton.click();
}

function HideDeleteOptions() {
  let query =
    `#DelUserReason, span[id^="DelUserReasonsShort"]:first-child, ` +
    `input[id^="DelUser"]:not([id$="_"])`;

  if (!System.checkBrainlyP([141, 142]) && !System.checkUserP(36))
    query += `, form[action^="/admin/users/delete_"]:not([action$="avatar"])`;

  const elements = document.querySelectorAll(query);

  if (elements.length === 0) return;

  elements.forEach(element => {
    if (element.parentElement)
      element.parentElement.classList.add("always-hidden");
  });
}

export default class UserProfile {
  mainRight: HTMLElement;
  promise: {
    profile: Promise<any>;
    extension: Promise<
      {
        data: import("@root/controllers/Req/Server").UserDetailsType;
      } & import("@root/controllers/Req/Server").CommonResponsePropsType
    >;
    moderators: Promise<any>;
  };

  profileData: any;
  infoBottomList: HTMLDivElement;
  infoSection: HTMLDivElement;
  morePanel: MorePanel;
  extensionUser: any;
  noteSection: HTMLDivElement;
  $noteContainer: JQuery<HTMLElement>;
  brainlyUser: any;

  constructor() {
    this.Init();
  }

  async Init() {
    try {
      this.mainRight = await WaitForElement("#main-right");

      this.GetProfileData();

      this.promise = {
        profile: new Action().GetUserProfile(this.profileData.id),
        extension: new ServerReq().GetUser(this.profileData),
        moderators: new ServerReq().GetAllModerators(),
      };

      this.FixInfoBottom();
      this.LoadComponents();
    } catch (error) {
      console.error(error);
    }
  }

  GetProfileData() {
    /**
     * @type {{id: number, nick: string}}
     */
    const data = window.profileData;

    if (!data || !data.id || !data.nick)
      throw Error("Can't find the profile data of user");

    this.profileData = data;
  }

  FixInfoBottom() {
    const contentOld = document.getElementById("content-old");
    contentOld.id += "2";
    const infoBottom = document.querySelector(".info_bottom");

    if (!infoBottom) throw Error("info_bottom element cannot be found");

    this.infoBottomList = ActionList({
      direction: "space-between",
    });

    Array.from(infoBottom.children).forEach(children => {
      const hole = ActionListHole({
        children,
      });

      this.infoBottomList.append(hole);
    });

    infoBottom.after(this.infoBottomList);
    infoBottom.remove();
  }

  RenderFriendsManager() {
    if (Number(window.myData.id) === Number(this.profileData.id))
      FriendsManager();
  }

  RenderProfileInfoSection() {
    this.infoSection = ContentBox({
      full: true,
    });

    const personalInfo = document.body.querySelector(
      "#main-left > div.personal_info > div.clear",
    );

    if (personalInfo) personalInfo.after(this.infoSection);
  }

  LoadComponents() {
    this.morePanel = new MorePanel(this);

    MakeProfileMorePanelAlwaysVisible();
    HideDeleteOptions();
    // eslint-disable-next-line no-new
    new AccountDeleteReporter();

    this.RenderFriendsManager();
    this.RenderProfileInfoSection();
    this.LoadComponentsAfterExtensionResolve();
    this.LoadComponentsAfterBrainlyResolve();
    this.LoadComponentsAfterModeratorsResolved();
    this.LoadComponentsAfterAllResolved();
  }

  async LoadComponentsAfterExtensionResolve() {
    const resUser = await this.promise.extension;

    if (!resUser.success) throw Error("User can't passed to extension server");

    this.extensionUser = resUser.data;

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
    const previousNicks =
      (this.extensionUser.previousNicks &&
        this.extensionUser.previousNicks.join(", ")) ||
      " -";
    const $previousNickBox = $(`
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
    const res = await this.promise.profile;

    if (!res || !res.success || !res.data) {
      console.error("Data is not correct: ", res);

      return;
    }

    this.brainlyUser = res.data;

    this.RenderUserBio();
    // eslint-disable-next-line no-new
    new RankManager(res.data);
  }

  RenderUserBio() {
    const userBio = new UserBio(
      this.brainlyUser.description,
      Number(window.myData.id) === Number(this.profileData.id),
    );
    const $bioContainer = $(`
		<div class="sg-content-box__actions">
			<div class="sg-horizontal-separator"></div>
		</div>`);

    userBio.$.prependTo($bioContainer);
    $bioContainer.appendTo(this.infoSection);
  }

  async LoadComponentsAfterModeratorsResolved() {
    await this.promise.moderators;

    this.morePanel.RenderSectionsAfterModeratorsResolved();
  }

  async LoadComponentsAfterAllResolved() {
    await Promise.all([this.promise.extension, this.promise.profile]);

    if (this.extensionUser && this.brainlyUser) {
      this.morePanel.RenderSectionsAfterAllResolved();

      if (this.extensionUser.probatus) {
        this.RenderUserHat();
      }
    }
  }

  RenderUserHat() {
    const $img = UserHat(this.brainlyUser.gender);

    $img.prependTo("#main-left > div.personal_info");
  }

  /**
   * @param {HTMLElement} element
   */
  // eslint-disable-next-line class-methods-use-this
  HideElement(element) {
    if (!IsVisible(element)) return;

    element.parentElement.removeChild(element);
  }
}

// eslint-disable-next-line no-new
new UserProfile();
