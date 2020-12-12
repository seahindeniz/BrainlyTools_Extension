/* eslint-disable no-underscore-dangle */
import AccountDeleteReports from "@root/popup/components/AccountDeleteReports";
import DeleteReasonsPreferences from "@root/popup/components/DeleteReasonsPreferences";
import LinkShortener from "@root/popup/components/LinkShortener";
import type { StorageDataType } from "@root/popup/components/OtherOptions";
import OtherOptions from "@root/popup/components/OtherOptions";
import QuickDeleteButtonsOptions from "@root/popup/components/QuickDeleteButtonsOptions";
import ShortenedLinks from "@root/popup/components/ShortenedLinks";
import ThemeColorChanger from "@root/popup/components/ThemeColorChanger";
import Users from "@root/popup/components/Users";
import ext from "webextension-polyfill";
import Action from "@BrainlyAction";
import storage from "../../helpers/extStorage";
import TimedLoop from "../../helpers/TimedLoop";
import PopupDiscordSection from "../components/PopupDiscordSection";

type ObjectAnyType = {
  [x: string]: any;
};

function RenderTitle(title: string) {
  const $title = $(`<h4 class="title is-4 has-text-centered">${title}</h4>`);

  return $title;
}

function RenderAccountDeleteReports() {
  if (!System.checkUserP(12)) return undefined;

  const accountDeleteReports = new AccountDeleteReports();

  return accountDeleteReports.$layout;
}

function RenderDeleteReasonsPreferences() {
  if (!System.checkUserP(11)) return undefined;

  const deleteReasonsPreferences = new DeleteReasonsPreferences();

  return deleteReasonsPreferences.$layout;
}

/* function RenderAnnouncements() {
  if (System.checkUserP(4)) return;

  const announcements = new Announcements();

  return announcements.$layout;
} */

function RenderUsers() {
  if (!System.checkUserP([5, 22, 23, 24, 25])) return undefined;

  const users = new Users();

  return users.$layout;
}

class Popup {
  $body: JQuery<HTMLElement>;
  $hero: JQuery<HTMLElement>;
  $heroBody: JQuery<HTMLElement>;
  $container: JQuery<HTMLElement>;
  $footer: JQuery<HTMLElement>;
  storageData: StorageDataType;
  fetchedUsers: ObjectAnyType;
  parameters: ObjectAnyType;

  $layout: JQuery<HTMLElement>;
  $layoutBox: JQuery<HTMLElement>;

  sections: [any[], JQuery<HTMLElement>[], any[]];

  constructor() {
    this.$body = $("body");
    this.$hero = $("> section.hero", this.$body);
    this.$heroBody = $("> div.hero-body", this.$hero);
    this.$container = $("> div.container", this.$heroBody);
    this.$footer = $("footer.footer", this.$body);
    this.storageData = {};
    this.fetchedUsers = {};
    this.parameters = {};

    this.RefreshTimeElements();
    this.BindHandlers();

    setInterval(this.RefreshTimeElements.bind(this), 1000);
  }

  RefreshTimeElements() {
    $("[data-time]", this.$body).each((i, element) => {
      const $element = $(element);
      const time = $($element).data("time");
      const dateLLL = window.moment(time).format("LLL");
      const timeAgoLong = window.moment(time).fromNow();
      const timeAgoShort = window.moment(time).fromNow(true);

      $element.attr("title", `${timeAgoLong}\n${dateLLL}`);
      $element.text(timeAgoShort);
    });
  }

  BindHandlers() {
    $(".box > .title", this.$container).on("click", function () {
      $(this).parent().toggleClass("is-active");
    });

    this.$container.on("click", ".message-header > p", function () {
      $(this).parents("article").toggleClass("is-active");
    });
  }

  async PrepareDataBeforeRendering(marketName) {
    const marketData = await ext.runtime.sendMessage({
      action: "getMarketData",
      marketName,
    });

    if (!marketData) {
      this.RenderStatusMessage({
        type: "danger",
        title: System.data.locale.popup.notificationMessages.errorN.replace(
          "%{error_code}",
          ` 417 `,
        ),
        message:
          System.data.locale.popup.notificationMessages.iCantFetchMarketData,
      });

      return;
    }

    System.data = marketData;

    const storageData = await storage("get", [
      "user",
      "themeColor",
      "quickDeleteButtonsReasons",
      "extendMessagesBody",
      "extendMessagesLayout",
      "notifier",
      "language",
    ]);

    if (
      !storageData?.user?.user?.id
      /* &&
        storageData.user.user.id == storageData.user.user.id */
    ) {
      this.RenderStatusMessage({
        type: "danger",
        title: System.data.locale.popup.notificationMessages.errorN.replace(
          "%{error_code}",
          ` 417 `,
        ),
        message: System.data.locale.popup.notificationMessages.incorrectData.replace(
          /%{market_domain_name}/i,
          System.data.meta.marketName,
        ),
      });
    } else if (!System.data.Brainly.deleteReasons.__withIds) {
      this.RenderStatusMessage({
        type: "danger",
        title: System.data.locale.popup.notificationMessages.errorN.replace(
          "%{error_code}",
          ` 416 `,
        ),
        message:
          System.data.locale.popup.notificationMessages.preparingUnsuccessful,
      });
    } else {
      this.storageData = storageData;

      this.GetParametersFromBackground();
      this.RenderMainUI();
    }
  }

  RenderStatusMessage({ type = "light", title = "", message = "" }) {
    this.$hero.attr("class", `hero is-medium is-bold is-${type}`);
    this.$container.html(
      `<h1 class="title">${title}</h1><h2 class="subtitle">${message}</h2>`,
    );
  }

  async GetParametersFromBackground() {
    const parameters = await System.toBackground("INeedParameters");

    if (parameters) {
      this.parameters = {
        ...this.parameters,
        ...parameters,
      };
    }
  }

  RenderMainUI() {
    const avatar = System.prepareAvatar(System.data.Brainly.userData.user);
    const $layout = $(`
		<div class="column">
			<div class="box">
				<figure class="avatar has-text-centered">
					<img src="${avatar}" title="${System.data.Brainly.userData.user.nick} - ${System.data.Brainly.userData.user.id}@${System.data.meta.marketName}">
				</figure>
			</div>
    </div>`);

    this.$layoutBox = $(">div.box", $layout);

    this.$container.html("").append($layout);
    this.$hero.attr("class", `hero is-success is-halfheight`);

    this.PrepareSectionsAndContents();
    this.RenderSections();
    this.ShowFooter();
    this.ResizePanel();
    TimedLoop(this.ResizePanel.bind(this), { expireTime: 5 });
  }

  RenderFooterInformation() {
    this.$footer.html(
      `<p class="title is-7 has-text-centered"><a href="https://chrome.google.com/webstore/detail/${System.data.meta.extension.id}" class="has-text-grey" target="_blank">${System.data.meta.manifest.short_name} v${System.data.meta.manifest.version}</a></p>`,
    );
  }

  PrepareSectionsAndContents() {
    this.sections = [
      [
        new LinkShortener().$layout,
        new ShortenedLinks().$layout,
        !System.checkUserP(98, true) &&
          System.data.Brainly.userData.extension.discordServer &&
          new PopupDiscordSection().container,
      ],
      [
        RenderTitle(System.data.locale.popup.extensionOptions.title),
        new ThemeColorChanger(this.storageData.themeColor).$layout,
        this.RenderQuickDeleteButtonsOptions(),
        new OtherOptions(this.storageData).$layout,
      ],
      [
        RenderAccountDeleteReports(),
        RenderDeleteReasonsPreferences(),
        // this.RenderAnnouncements(),
        RenderUsers(),
      ],
    ];

    if (this.sections[2].filter(Boolean).length > 0) {
      this.sections[2].unshift(
        RenderTitle(System.data.locale.popup.extensionManagement.title),
      );
    }

    if ($("html").attr("is") === "options") {
      this.sections[0].splice(0, 1);
    }
  }

  RenderSections() {
    this.sections.forEach(contents => {
      const $section = this.RenderSection();

      if (contents.filter(Boolean).length > 0) {
        contents.forEach($content => {
          $section.append($content);
        });
      }
    });
  }

  RenderSection() {
    const $section = $(`<section></section>`);

    this.$layoutBox.append($section);

    return $section;
  }

  RenderQuickDeleteButtonsOptions() {
    if (!System.checkUserP([1, 2, 45])) return undefined;

    const quickDeleteButtonsOptions = new QuickDeleteButtonsOptions(
      this.storageData.quickDeleteButtonsReasons,
    );

    return quickDeleteButtonsOptions.$layout;
  }

  async GetStoredUser(brainlyID: number) {
    const user = this.fetchedUsers[brainlyID];

    if (user?.brainlyData) return user;

    const resUser = await new Action().GetUser(brainlyID);

    if (!resUser || !resUser.success) {
      const message = `${brainlyID} > ${resUser.message || "error"}`;

      throw Error(message);
    }

    return this.ReserveAUser(brainlyID, { brainlyData: resUser.data });
  }

  ReserveAUser(brainlyID, _data) {
    let data = _data;

    if (!this.fetchedUsers[brainlyID]) {
      data = data || {};
    } else {
      data = { ...this.fetchedUsers[brainlyID], ...data };
    }

    this.fetchedUsers[brainlyID] = data;

    return this.fetchedUsers[brainlyID];
  }

  ShowFooter() {
    this.$footer.removeClass("is-hidden");
    this.RenderFooterInformation();
  }

  async ResizePanel() {
    if ($("html").attr("is") === "options")
      this.$heroBody.css("width", window.outerWidth * 0.6);

    if ($("html").attr("is") === "popup") {
      // let info = await ext.windows.getCurrent();
      const activeTab = await ext.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (activeTab && activeTab.length > 0) {
        const info = activeTab[0];
        let height = info.height - 10;

        if (height > 600) height = 600;

        document.body.style.height = `${height}px`;
      }
    }
  }

  refreshUsersInformation() {
    Object.keys(this.fetchedUsers).forEach(async brainlyID => {
      const user = await this.GetStoredUser(Number(brainlyID));
      const avatar = System.prepareAvatar(user.brainlyData);

      if (avatar) {
        $(`a[data-user-id="${user.brainlyData.id}"]`, this.$layoutBox).each(
          (i, element) => {
            if (element instanceof HTMLAnchorElement) {
              const $img = $("img.avatar", element);

              $img.attr("src", avatar);

              element.href = System.createProfileLink(user.brainlyData);

              if (!element.title) {
                element.title = user.brainlyData.nick;
              }
            }
          },
        );
      }
    });
  }
}

export default Popup;
