import Action from "@BrainlyAction";
import WaitForElement from "@root/helpers/WaitForElement";
import Button from "@components/Button";
import notification from "@components/notification2";

System.pageLoaded("User's warnings page OK!");

async function UserWarnings() {
  const rows = await WaitForElement("#content-old > table > tbody > tr", {
    multiple: true,
  });
  const firstRow = rows[0];

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

  $("input#select-0").on("click", function () {
    $('input[type="checkbox"]', rows).prop("checked", $(this).prop("checked"));
  });

  const $button = Button({
    type: "solid-blue",
    size: "small",
    text: System.data.locale.userWarnings.cancelWarnings,
  });
  const $buttonContainer = $(
    `<div class="fright sg-content-box__content--spaced-top-small"></div>`,
  );

  $button.appendTo($buttonContainer);

  $buttonContainer.insertAfter("#content-old > table.threadList");

  $button.on("click", () => {
    const $checkedBoxes = $(
      'input[type="checkbox"]:not(#select-0):checked',
      rows,
    );

    if ($checkedBoxes.length === 0) {
      notification({
        html:
          System.data.locale.common.notificationMessages
            .youNeedToSelectAtLeastOne,
        type: "info",
      });

      return;
    }

    const idList = [];
    const userID = window.sitePassedParams[0];

    $checkedBoxes.each((i, el) => {
      const parentRow = $(el).parents("tr");
      const $undoLink = $('a[href^="/moderators/cancel_warning"]', parentRow);

      console.log($undoLink);

      if ($undoLink.length > 0) {
        const href = $undoLink.attr("href");

        console.log(href);

        if (href) {
          const warningID = href.split("/").pop();

          idList.push(warningID);
        }
      }
    });

    new Action().CancelWarnings(userID, idList);

    System.log(4, { user: { id: userID }, data: idList });

    notification({
      html:
        System.data.locale.userWarnings.notificationMessages
          .ifYouHavePrivileges,
      type: "info",
    });
  });
}

if (Number(window.sitePassedParams[0]) !== myData.id) {
  UserWarnings();
}
