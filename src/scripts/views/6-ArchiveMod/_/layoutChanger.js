import WaitForElement from "../../../helpers/WaitForElement";
import storage from "../../../helpers/extStorage";

async function layoutChanger() {
	let layoutChangerParent = await WaitForElement("#moderation-all > div.top > div.sub-header.row > div.pull-right");

	let $btnChangeLayout = $(`
	<button class="btn">
		<i class="icon icon-th nomargin"></i>
	</button>
	<button class="btn">
		<i class="icon icon-align-justify nomargin"></i>
	</button>`).prependTo(layoutChangerParent);

	$btnChangeLayout.click(function() {
		let $moderationItemParent = $(selectors.moderationItemParent);
		let isListView = $('i', this).is('.icon-align-justify');

		if (isListView) {
			$moderationItemParent.addClass('listView');
		} else {
			$moderationItemParent.removeClass('listView');
		}

		storage("set", { archive_mod_layout: isListView });
	});

	let currentCountsH1s = await WaitForElement("#moderation-all > div.top > div.header > h1");

	$(currentCountsH1s).on("click", "span", function() {
		let filterVal = this.classList.contains("total") ? "0" : "998";

		$("#moderation-all > div.top > div.sub-header.row > div.span5 > select.filters").val(filterVal).change();
	});

	storage("get", "archive_mod_layout", isTrue => {
		if (isTrue) {
			let $moderationItemParent = $(selectors.moderationItemParent);

			$moderationItemParent.addClass('listView');
		}
	});
}

export default layoutChanger
