import Button from "../../components/Button";
import notification from "../../components/notification";
import Action from "../../controllers/Req/Brainly/Action";
import WaitForElements from "../../helpers/WaitForElements";

let System = require("../../helpers/System");

if (typeof System == "function")
  System = System();

System.pageLoaded("User's warnings page OK!");

if (window.sitePassedParams[0] != myData.id) {
  UserWarnings();
}

async function UserWarnings() {
  let rows = await WaitForElements("#content-old > table > tbody > tr");
  let firstRow = rows[0];

  $("th:nth-child(1)", firstRow).css("width", "7%");
  $("th:nth-child(2)", firstRow).css("width", "23%");
  $("th:nth-child(3)", firstRow).removeAttr("style");

  $(rows).each((i, row) => {
    $(row).append(`
		<th style="width: 3%">
			<div class="sg-checkbox">
				<input type="checkbox" class="sg-checkbox__element" id="select-${i}">
				<label class="sg-checkbox__ghost" for="select-${i}">
					<div class="sg-icon sg-icon--adaptive sg-icon--x10">
						<svg class="sg-icon__svg">
							<use xlink:href="#icon-check"></use>
						</svg>
					</div>
				</label>
			</div>
		</th>`);
  });

  $('input#select-0').click(function() {
    $('input[type="checkbox"]', rows).prop("checked", $(this).prop("checked"));
  });

  let $button = Button({
    type: "solid-blue",
    size: "small",
    text: System.data.locale.userWarnings.cancelWarnings
  });
  let $buttonContainer = $(`<div class="fright sg-content-box__content--spaced-top-small"></div>`);

  $button.appendTo($buttonContainer)

  $buttonContainer.insertAfter("#content-old > table.threadList");

  $button.click(() => {
    let $checkedBoxes = $('input[type="checkbox"]:not(#select-0):checked', rows);

    if ($checkedBoxes.length == 0)
      return notification(System.data.locale.common.notificationMessages.youNeedToSelectAtLeastOne, "info");

    let idList = [];
    let userID = window.sitePassedParams[0];

    $checkedBoxes.each((i, el) => {
      let parentRow = $(el).parents("tr");
      let $undoLink = $('a[href^="/moderators/cancel_warning"]', parentRow);

      console.log($undoLink);
      if ($undoLink.length > 0) {
        let href = $undoLink.attr("href");

        console.log(href);
        if (href) {
          let warningID = href.split("/").pop();

          idList.push(warningID);
        }
      }
    });

    new Action().CancelWarnings(userID, idList);

    System.log(4, { user: { id: userID }, data: idList });

    notification(System.data.locale.userWarnings.notificationMessages.ifYouHavePrivileges, "info");
  });
}
