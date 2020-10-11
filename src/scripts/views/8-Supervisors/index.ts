import SendMessageToBrainlyIds from "@root/controllers/Req/Brainly/Action/SendMessageToBrainlyIds";
import WaitForElement from "@root/helpers/WaitForElement";
import Button from "@components/Button";
import notification from "@components/notification2";
import Progress from "@components/Progress";
import { UserType } from "@BrainlyAction";

System.pageLoaded("Supervisors page OK!");

const SendMessages = new SendMessageToBrainlyIds();

const users: {
  $li: JQuery<HTMLElement>;
  data: UserType;
}[] = [];

async function Supervisors() {
  let currentColumn = 0;
  const sortIt = userLi => {
    $(`.connectedSortable:eq(${currentColumn++})`).append(userLi);
    if (currentColumn === 5) {
      currentColumn = 0;
    }
  };

  const usersLi = await WaitForElement(".connectedSortable > li", {
    multiple: true,
  });
  const usersID = [];

  usersLi.forEach(userLi => {
    usersID.push(userLi.id);
    sortIt(userLi);
  });

  await System.StoreUsers(usersID, {
    each: userData => {
      const avatar = System.prepareAvatar(userData);
      const buddyLink = System.createBrainlyLink("profile", {
        nick: userData.nick,
        id: userData.id,
      });
      const $userLi = $(`.connectedSortable li[id="${userData.id}"]`);
      const ranks = [];

      if (userData.ranks_ids && userData.ranks_ids.length > 0) {
        userData.ranks_ids.forEach(rankId => {
          const current_rank =
            System.data.Brainly.defaultConfig.config.data.ranksWithId[rankId];
          if (current_rank || rankId === 12) {
            ranks.push(
              `<span class="" style="color:#${current_rank.color || "000"};">${
                current_rank.name
              }</span>`,
            );
          }
        });
      }
      $userLi.html(`
			<a href="${buddyLink}">
				<div>
					<img src="${avatar}" width="65" height="65">
				</div>
				${userData.nick}
			</a>
      <div class="ranks">${ranks.join("<br>")}</div>`);

      users.push({
        $li: $userLi,
        data: userData,
      });
    },
  });

  const optionsOfRanks = System.data.Brainly.defaultConfig.config.data.ranks.map(
    rank => {
      return `<option value="${rank.id}"${
        rank.color ? ` style="color:#${rank.color};"` : ""
      }>${rank.name}</option>`;
    },
  );
  const $actionBox = $(`
	<div class="actionBox">
		<div class="ranks">
			<select multiple>
				<option selected value="all">${System.data.locale.supervisors.allRanks}</option>
				${optionsOfRanks}
			</select>
		</div>
		<div class="tableLayout js-hidden">
			<span class="sg-text sg-text--xsmall sg-text--link sg-text--bold sg-text--mint">${System.data.locale.supervisors.tableLayout}</span>
		</div>
	</div>`).insertAfter("#mod_sup");

  const $rankSelect = $(".ranks > select", $actionBox);
  const $tableLayout = $(".tableLayout > span", $actionBox);
  let listedUsers = users;

  /**
   * Rank select
   */
  const rankSelectHandler = function () {
    const selectedRankIds = [...this.selectedOptions].map(
      option => option.value,
    );
    currentColumn = 0;
    listedUsers = users.filter(user => {
      if (
        selectedRankIds.indexOf("all") >= 0 ||
        selectedRankIds.some(v => user.data.ranks_ids.includes(~~v))
      ) {
        user.$li.removeClass("js-hidden");
        sortIt(user.$li);

        return true;
      }
      user.$li.addClass("js-hidden");

      return false;
    });
  };

  $rankSelect.on("change", rankSelectHandler);

  $tableLayout.on("click", () => {
    //
  });

  /**
   * Message sender
   */

  if (System.checkUserP(10)) {
    const $sendMessage = $(`
		<div class="sendMessage">
			<span class="sg-text sg-text--xsmall sg-text--link sg-text--bold sg-text--blue">${System.data.locale.supervisors.sendMessagesToMods}</span>
			<div class="messageBox js-hidden">
				<textarea class="sg-textarea sg-text--small sg-textarea--tall sg-textarea--full-width" placeholder="${System.data.locale.messages.groups.writeSomething}"></textarea>

				<div class="sg-spinner-container"></div>
				<div class="sg-spinner-container"></div>
			</div>
		</div>`);
    const $sendMessageContainer = $("> span", $sendMessage);
    const $messageBox = $("> div.messageBox", $sendMessage);
    const $messageInput = $("> div.messageBox > textarea", $sendMessage);
    const $toListedButtonSpinnerContainer = $(
      ".sg-spinner-container:nth-child(2)",
      $sendMessage,
    );
    const $toAllButtonSpinnerContainer = $(
      ".sg-spinner-container:nth-child(3)",
      $sendMessage,
    );
    const $toListedButton = Button({
      type: "solid-blue",
      size: "small",
      text: `⇐ ${System.data.locale.supervisors.sendMessagesToListedMods.text}`,
      title: System.data.locale.supervisors.sendMessagesToListedMods.title,
    });
    const $toAllButton = Button({
      size: "small",
      ...System.data.locale.supervisors.sendMessagesToAllMods,
    });

    $toAllButton.appendTo($toAllButtonSpinnerContainer);
    $toListedButton.appendTo($toListedButtonSpinnerContainer);

    const $sendButton = $("> div.messageBox > div > button", $sendMessage);

    $sendMessage.appendTo($actionBox);
    /**
     * Message box visibility
     */
    const sendMessageContainerHandler = () => {
      $messageBox.toggleClass("js-hidden");
    };

    $sendMessageContainer.on("click", sendMessageContainerHandler);

    /**
     * Send message
     */
    const SendMessage = async userList => {
      if (window.isPageProcessing) {
        notification({
          html:
            System.data.locale.common.notificationMessages.ongoingProcessWait,
          type: "info",
        });
      } else if ($messageInput.val() === "") {
        notification({
          html:
            System.data.locale.supervisors.notificationMessages.emptyMessage,
          type: "info",
        });
        $messageInput.trigger("focus");
      } else if (userList.length === 0) {
        notification({
          html: System.data.locale.supervisors.notificationMessages.noUser,
          type: "info",
        });
        $rankSelect.trigger("focus");
      } else {
        window.isPageProcessing = true;
        const message = $messageInput.val();
        const idList = userList.map(user => user.id);
        const idListLen = idList.length;
        const previousProgressBars = $("#content-old > .progress-container");
        const $spinner = $(
          `<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--small sg-spinner--light"></div></div>`,
        );
        const progress = new Progress({
          type: "success",
          label: System.data.locale.common.progressing,
          max: idListLen,
        });

        $spinner.insertAfter(this);
        $sendButton.addClass("js-disabled");
        progress.$container.prependTo("#content-old");

        if (previousProgressBars.length > 0) {
          previousProgressBars.remove();
        }

        let i = 0;
        const doInEachSending = () => {
          progress.update(++i);
          progress.UpdateLabel(`${i} - ${idListLen}`);
        };

        SendMessages.handlers.Each = doInEachSending;
        SendMessages.Start(idList, String(message));
        await SendMessages.Promise();

        window.isPageProcessing = false;

        $spinner.remove();
        $messageInput.val("");
        $messageInput.prop("disabled", false);
        $sendButton.removeClass("js-disabled");
        progress.UpdateLabel(
          `(${idListLen}) - ${System.data.locale.common.allDone}`,
        );
      }
    };

    $toListedButton.on("click", () => SendMessage(listedUsers));
    $toAllButton.on("click", () => SendMessage(System.allModerators.list));
  }
}

Supervisors();
