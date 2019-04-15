"use strict";

import WaitForElement from "../../helpers/WaitForElement";
import { CancelWarning } from "../../controllers/ActionsOfBrainly";
import Buttons from "../../components/Buttons";
import notification from "../../components/notification";

System.pageLoaded("User's warnings page OK!");

if (window.sitePassedParams[0] != myData.id) {
  UserWarnings();
}

async function UserWarnings() {
  let row = await WaitForElement("#content-old > table > tbody > tr");

  $(row).each((i, el) => {
    $(el).append(`
		<th style="width:10%">
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
    $('input[type="checkbox"]', row).prop("checked", $(this).prop("checked"));
  });

  let $button = Buttons('RemoveQuestionNoIcon', {
    text: System.data.locale.userWarnings.cancelWarnings,
    title: "",
    type: "alt"
  });
  let $buttonContainer = $(`<div class="fright sg-content-box__content--spaced-top-small">${$button}</div>`);

  $buttonContainer.insertAfter("#content-old > table.threadList");

  $("button", $buttonContainer).click(() => {
    let $checkedBoxes = $('input[type="checkbox"]:not(#select-0):checked', row);
    let idList = [];

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

    CancelWarning(idList);

    System.log(4, { user: { id: JSON.parse(sitePassedParams)[0] }, data: idList });

    notification(System.data.locale.userWarnings.notificationMessages.ifYouHavePrivileges, "info");
  });
}
