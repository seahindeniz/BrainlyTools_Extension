import notification from "../../components/notification";
import Progress from "../../components/Progress";
import SendMessageToBrainlyIds from "../../controllers/Req/Brainly/Action/SendMessageToBrainlyIds";
import WaitForElements from "../../helpers/WaitForElements";
import Button from "../../components/Button";

let System = require("../../helpers/System");
System = System();

System.pageLoaded("Supervisors page OK!");

Supervisors();

const SendMessages = new SendMessageToBrainlyIds();

async function Supervisors() {
  let currentColumn = 0;
  let sortIt = userLi => {
    $(`.connectedSortable:eq(${currentColumn++})`).append(userLi);
    if (currentColumn == 5) {
      currentColumn = 0;
    }
  }

  let usersLi = await WaitForElements(".connectedSortable > li");
  let usersID = [];

  usersLi.forEach(userLi => {
    usersID.push(userLi.id);
    sortIt(userLi);
  });

  await System.StoreUsers(usersID, {
    each: user => {
      let avatar = System.prepareAvatar(user);
      let buddyLink = System.createBrainlyLink("profile", { nick: user.nick, id: user.id });
      let $userLi = $(`.connectedSortable li[id="${user.id}"]`);
      let ranks = [];

      if (user.ranks_ids && user.ranks_ids.length > 0) {
        user.ranks_ids.forEach(rankId => {
          let current_rank = System.data.Brainly.defaultConfig.config.data.ranksWithId[rankId];
          if (current_rank || rankId == 12) {
            ranks.push(`<span class="" style="color:#${(current_rank.color || "000")};">${current_rank.name}</span>`);
          }
        });
      }

      user.$li = $userLi;
      $userLi.html(`
			<a href="${buddyLink}">
				<div>
					<img src="${avatar}" width="65" height="65">
				</div>
				${user.nick}
			</a>
			<div class="ranks">${ranks.join('<br>')}</div>`);
    }
  });

  let optionsOfRanks = System.data.Brainly.defaultConfig.config.data.ranks.map(rank => {
    return `<option value="${rank.id}"${rank.color?` style="color:#${rank.color};"`:""}>${rank.name}</option>`;
  });
  let $actionBox = $(`
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

  let $rankSelect = $(".ranks > select", $actionBox);
  let $tableLayout = $(".tableLayout > span", $actionBox);
  let listedUsers = System.allModerators.list;

  /**
   * Rank select
   */
  let rankSelectHandler = function() {
    let selectedRankIds = [...this.selectedOptions].map(option => option.value);
    currentColumn = 0;
    listedUsers = System.allModerators.list.filter(user => {
      if (selectedRankIds.indexOf("all") >= 0 || selectedRankIds.some(v => user.ranks_ids.includes(~~v))) {
        user.$li.removeClass("js-hidden");
        sortIt(user.$li);

        return true;
      } else {
        user.$li.addClass("js-hidden");

        return false;
      }
    });
  };

  $rankSelect.change(rankSelectHandler);

  /**
   * Table layout
   */
  let tableLayoutHandler = () => {};

  $tableLayout.click(tableLayoutHandler);

  /**
   * Message sender
   */

  if (System.checkUserP(10)) {
    let $sendMessage = $(`
		<div class="sendMessage">
			<span class="sg-text sg-text--xsmall sg-text--link sg-text--bold sg-text--blue">${System.data.locale.supervisors.sendMessagesToMods}</span>
			<div class="messageBox js-hidden">
				<textarea class="sg-textarea sg-text--small sg-textarea--tall sg-textarea--full-width" placeholder="${System.data.locale.messages.groups.writeSomething}"></textarea>

				<div class="sg-spinner-container"></div>
				<div class="sg-spinner-container"></div>
			</div>
		</div>`);
    let $sendMessageContainer = $("> span", $sendMessage);
    let $messageBox = $("> div.messageBox", $sendMessage);
    let $messageInput = $("> div.messageBox > textarea", $sendMessage);
    let $toListedButtonSpinnerContainer = $(".sg-spinner-container:nth-child(2)", $sendMessage);
    let $toAllButtonSpinnerContainer = $(".sg-spinner-container:nth-child(3)", $sendMessage);
    let $toListedButton = Button({
      type: "primary-blue",
      size: "small",
      text: `⇐ ${System.data.locale.supervisors.sendMessagesToListedMods.text}`,
      title: System.data.locale.supervisors.sendMessagesToListedMods.title
    });
    let $toAllButton = Button({
      size: "small",
      ...System.data.locale.supervisors.sendMessagesToListedMods
    });

    $toAllButton.appendTo($toAllButtonSpinnerContainer);
    $toListedButton.appendTo($toListedButtonSpinnerContainer);

    let $sendButton = $("> div.messageBox > div > button", $sendMessage);

    $sendMessage.appendTo($actionBox);
    /**
     * Message box visibility
     */
    let sendMessageContainerHandler = () => {
      $messageBox.toggleClass("js-hidden");
    };

    $sendMessageContainer.click(sendMessageContainerHandler);

    /**
     * Send message
     */
    let SendMessage = async (users) => {
      if (window.isPageProcessing) {
        notification(System.data.locale.common.notificationMessages.ongoingProcessWait, "info");
      } else if ($messageInput.val() == "") {
        notification(System.data.locale.supervisors.notificationMessages.emptyMessage, "info");
        $messageInput.focus();
      } else if (users.length == 0) {
        notification(System.data.locale.supervisors.notificationMessages.noUser, "info");
        $rankSelect.focus();
      } else {
        window.isPageProcessing = true;
        let message = $messageInput.val();
        let idList = users.map(user => user.id);
        let idListLen = idList.length;
        let previousProgressBars = $("#content-old > .progress-container");
        let $spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--small sg-spinner--light"></div></div>`);
        let progress = new Progress({
          type: "is-success",
          label: System.data.locale.common.progressing,
          max: idListLen
        });

        $spinner.insertAfter(this);
        $sendButton.addClass("js-disabled");
        progress.$container.prependTo("#content-old");

        if (previousProgressBars.length > 0) {
          previousProgressBars.remove();
        }

        let doInEachSending = i => {
          progress.update(i);
          progress.UpdateLabel(`${i} - ${idListLen}`);
        };

        SendMessages.handlers.Each = doInEachSending;
        SendMessages.Start(idList, message);
        await SendMessages.Promise();

        window.isPageProcessing = false;

        $spinner.remove();
        $messageInput.val("");
        $messageInput.prop("disabled", false);
        $sendButton.removeClass("js-disabled");
        progress.UpdateLabel(`(${idListLen}) - ${System.data.locale.common.allDone}`);
      }
    };

    $toListedButton.click(() => SendMessage(listedUsers));
    $toAllButton.click(() => SendMessage(System.allModerators.list));
  }
}
