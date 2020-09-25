/* eslint-disable class-methods-use-this, camelcase */
import Action from "@BrainlyAction";
import CreateElement from "@components/CreateElement";
import notification from "@components/notification2";
import InsertBefore from "@root/helpers/InsertBefore";
import WaitForElement from "@root/helpers/WaitForElement";
import ServerReq from "@ServerReq";
import { Flex, Text } from "@style-guide";
import PrepareDeleteReasons from "../../../controllers/PrepareDeleteReasons";
import _System from "../../../controllers/System";
import storage from "../../../helpers/extStorage";
import InjectToDOM from "../../../helpers/InjectToDOM";
import messagesLayoutExtender from "../../../helpers/messagesLayoutExtender";
import WaitForObject from "../../../helpers/WaitForObject";
import fetchFriends from "./_/fetchFriends";
import RenderMenuButtonFixer from "./_/MenuButtonFixer";
import RemoveJunkNotifications from "./_/RemoveJunkNotifications";
import SetBrainlyData from "./_/SetBrainlyData";
import SetMetaData from "./_/SetMetaData";
import SetUserData from "./_/SetUserData";

window.performanceStartTiming = performance.now();

window.selectors = {
  toplayerContainer: "body > div.js-page-wrapper",
};

window.addEventListener("beforeunload", event => {
  if (System && window.isPageProcessing) {
    let message = System.data.locale.common.notificationMessages.ongoingProcess;

    if (typeof window.isPageProcessing === "string") {
      message = window.isPageProcessing;
    }

    event.preventDefault();
    event.returnValue = message;
  }
});

async function RemoveOldLayoutCSSFile() {
  const oldLinkElement = await WaitForElement<"link">(`[href^="/min/b=css"]`, {
    // noError: true,
  });
  InsertBefore(
    CreateElement({
      tag: "link",
      type: "text/css",
      rel: "stylesheet",
      href: `${System.data.meta.extension.URL}/styles/zadane_dynamic.css`,
    }),
    oldLinkElement,
  );

  const newLinkElement = CreateElement({
    tag: "link",
    type: "text/css",
    rel: "stylesheet",
    href: oldLinkElement.href.replace(
      /(?:zadane_dynamic|bootstrap)\.css,?/g,
      "",
    ),
  });
  InsertBefore(newLinkElement, oldLinkElement);

  newLinkElement.addEventListener("load", () => {
    oldLinkElement.remove();
  });
}

async function ReplaceBootstrapStyleLink() {
  const newLinkElement = CreateElement({
    tag: "link",
    type: "text/css",
    rel: "stylesheet",
    href: `${System.data.meta.extension.URL}/styles/bootstrap.css`,
  });

  document.head.prepend(newLinkElement);

  const oldLinkElement = await WaitForElement<"link">(
    `[href^="/css/bootstrap.css"]`,
    {
      noError: true,
    },
  );

  newLinkElement.addEventListener("load", () => {
    oldLinkElement.remove();
  });
}

class Core {
  userData: {
    themeColor?: string;
    extendMessagesLayout?: boolean;
  };

  constructor() {
    window.System = new _System();

    this.Pipeline();
  }

  async Pipeline() {
    try {
      RemoveJunkNotifications();

      await SetMetaData();

      this.userData = await SetUserData();
      this.UserDataLoaded();

      await SetBrainlyData();

      await this.SetMarketConfig();

      RemoveJunkNotifications();

      await this.PrepareLanguageData();

      await System.ShareSystemDataToBackground();

      await new ServerReq().SetAuthData();
      await this.CheckForNewUpdate();

      this.InitNotifier();

      await WaitForObject("jQuery");
      System.Log("$ Lib OK!");

      this.RenderEventCelebrating();
      this.LoadComponentsForAllPages();
      this.InjectFilesToPage();
      this.InjectFilesToPageAfter_FriendsListLoaded();
      this.InjectFilesToPageAfter_DeleteReasonsLoaded();
      this.PingBrainly();
    } catch (error) {
      console.error(error);
    }
  }

  UserDataLoaded() {
    window.postMessage(
      {
        action: "changeColors",
        data: this.userData.themeColor || "#4fb3f6",
      },
      "*",
    );
    messagesLayoutExtender(
      this.userData.extendMessagesLayout ||
        typeof this.userData.extendMessagesLayout === "undefined",
    );
  }

  async SetMarketConfig() {
    const fileName = `/configs/${location.hostname}.json`;
    System.data.config.marketConfig = await InjectToDOM(fileName);

    return Promise.resolve();
  }

  async PrepareLanguageData() {
    let language = await storage("get", "language");

    if (!language) {
      language = System.data.Brainly.defaultConfig.user.ME.user.isoLocale;

      if (!language) {
        throw Error(`Language cannot be saved in storage.
        This is probably a defaultConfig error`);
      }

      storage("set", { language });
    }

    System.data.locale = await System.PrepareLanguageFile(language);
    System.Log("Locale inject OK!");

    return Promise.resolve();
  }

  async CheckForNewUpdate() {
    if (!System.data.Brainly.userData.extension.newUpdate) return;

    System.updateExtension();
    notification({
      type: "info",
      permanent: true,
      html: System.data.locale.core.notificationMessages.updateNeeded.replace(
        "\n",
        "<br>",
      ),
      children: Flex({
        marginTop: "xs",
        justifyContent: "center",
        children: Text({
          size: "small",
          weight: "bold",
          target: "_blank",
          href: "https://git.io/JJnG3",
          html: `| ${System.data.locale.core.notificationMessages.clickHereToSeeTheChangelog} |`,
        }),
      }),
    });

    throw Error(System.data.locale.core.notificationMessages.updateNeeded);
  }

  async InitNotifier() {
    const notifier = await storage("get", "notifier");

    System.toBackground("notifierInit", notifier);
  }

  async RenderEventCelebrating() {
    const currentDate = new Date();
    const startingDate = new Date();
    const endingDate = new Date();

    if (currentDate.getMonth() !== 0) {
      startingDate.setDate(25);
      startingDate.setMonth(11);
      endingDate.setFullYear(endingDate.getFullYear() + 1);
    }

    endingDate.setDate(5);
    endingDate.setMonth(0);

    if (currentDate < startingDate || currentDate > endingDate) return;

    await InjectToDOM("/scripts/lib/snowstorm.min.js");
    await WaitForObject("snowStorm", { noError: true });

    // eslint-disable-next-line dot-notation
    const st = window["snowStorm"];
    st.snowColor = "#4fb3f6";
    st.flakesMaxActive = 32;
    st.excludeMobile = false;
  }

  LoadComponentsForAllPages() {
    if (!System.checkRoute(1, "question") && !System.checkRoute(2, "add")) {
      InjectToDOM("/scripts/views/0-Core/ModerationPanel.js");
    }
    RenderMenuButtonFixer();

    if (window.sitePassedParams && typeof window.sitePassedParams === "string")
      window.sitePassedParams = JSON.parse(window.sitePassedParams);

    const RemoveSVG_Titles = async (stop?: boolean) => {
      const titles = await WaitForElement("svg > symbol > title", {
        noError: true,
        multiple: true,
      });

      titles.forEach(title => title.remove());

      if (!stop) RemoveSVG_Titles(true);
    };
    RemoveSVG_Titles();
  }

  InjectFilesToPage() {
    if (System.checkRoute(2, "view_user_warns")) {
      InjectToDOM([
        "/scripts/views/7-UserWarnings/index.js",
        "/styles/pages/UserWarnings.css",
      ]);
    }

    if (System.checkRoute(2, "supervisors")) {
      InjectToDOM([
        "/scripts/views/8-Supervisors/index.js",
        "/styles/pages/Supervisors.css",
      ]);
    }

    if (System.checkRoute(2, "uploader")) {
      InjectToDOM([
        "/scripts/views/9-Uploader/index.js",
        "/styles/pages/Uploader.css",
      ]);
    }

    if (System.checkRoute(2, "view_moderator")) {
      InjectToDOM([
        "/scripts/views/11-ModeratorActionsHistory/index.js",
        "/styles/pages/ModeratorActionsHistory.css",
      ]);
    }
    /* if (System.checkRoute(2, "holidays_show")) {
      InjectToDOM([
        "/scripts/views/Holidays/index.js",
        //"/styles/pages/ModeratorActionsHistory.css"
      ]);
    } */
  }

  async InjectFilesToPageAfter_FriendsListLoaded() {
    await fetchFriends();
    System.Log("Fetching friends OK!");

    if (System.checkRoute(1, "messages")) {
      InjectToDOM([
        "/scripts/lib/jquery-ui.min.js",
        "/scripts/views/2-Messages/index.js",
        "/styles/pages/Messages.css",
      ]);
    }

    if (
      System.checkRoute(1, "user_profile") ||
      (System.checkRoute(1, "users") && System.checkRoute(2, "view"))
    ) {
      RemoveOldLayoutCSSFile();
      InjectToDOM([
        "/scripts/views/5-UserProfile/index.js",
        "/styles/pages/UserProfile.css",
      ]);
    }
  }

  async InjectFilesToPageAfter_DeleteReasonsLoaded() {
    await PrepareDeleteReasons();
    System.Log("Delete reasons OK!");

    if (
      System.checkRoute(1, "") ||
      System.checkRoute(1, "task_subject_dynamic")
    ) {
      InjectToDOM(["/scripts/views/1-Home/index.js", "/styles/pages/Home.css"]);
    }

    if (System.checkRoute(1, "task_view") && System.checkRoute(2, /\b\d+\b/)) {
      InjectToDOM(["/scripts/views/3-Task/index.js", "/styles/pages/Task.css"]);
    }

    if (System.checkRoute(2, "user_content")) {
      RemoveOldLayoutCSSFile();
      ReplaceBootstrapStyleLink();
      InjectToDOM([
        "/scripts/views/4-UserContent/index.js",
        "/styles/pages/UserContent.css",
      ]);
    }

    if (System.checkRoute(2, "archive_mod")) {
      InjectToDOM([
        "/scripts/views/6-ArchiveMod/index.js",
        "/styles/pages/ArchiveMod.css",
      ]);
    }

    if (System.checkRoute(1, "app") && System.checkRoute(2, "ask")) {
      InjectToDOM([
        "/scripts/views/10-QuestionSearch/index.js",
        "/styles/pages/QuestionSearch.css",
      ]);
    }

    if (System.checkRoute(1, "question") && System.checkRoute(2, "add")) {
      InjectToDOM([
        "/scripts/views/12-QuestionAdd/index.js",
        "/styles/pages/QuestionAdd.css",
      ]);
    }

    if (System.checkRoute(2, "responses_short")) {
      RemoveOldLayoutCSSFile();
      InjectToDOM([
        "/scripts/views/13-ShortAnswers/index.js",
        "/styles/pages/ShortAnswers.css",
      ]);
    }
  }

  PingBrainly() {
    setInterval(async () => {
      try {
        await new Action().Me();
      } catch (_) {
        //
      }
    }, 600000);
  }
}

// eslint-disable-next-line no-new
new Core();
