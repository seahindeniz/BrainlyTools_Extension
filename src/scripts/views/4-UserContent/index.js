"use strict";

import Inject2body from "../../helpers/Inject2body";

_console.log("User Content inject OK!");
System.printLoadedTime();
System.changeBadgeColor("loaded");
//_console.clear();

if (System.checkRoute(4, "") || System.checkRoute(4, "tasks") || System.checkRoute(4, "responses")) {
	window.selectors = {
		tableHeaderRow: "#content-old > div > div > table > thead > tr",
		tableContentBody: "#content-old > div > div > table > tbody:first",
		contentRows: "#content-old > div > div > table > tbody > tr",
		contentLinks: "#content-old > div > div > table > tbody > tr > td > a"
	}

	let $tableHeaderRow = $(selectors.tableHeaderRow);
	let $tableContentBody = $(selectors.tableContentBody);
	let $contentRows = $(selectors.contentRows);
	let $contentLinks = $(selectors.contentLinks);

	$tableHeaderRow.prepend(`<th style="width: 5%;"><b>${System.data.locale.texts.user_content.select}</b></th>`);

	let $contentSelectCheckboxes = $('<td><input type="checkbox"></td>').prependTo($contentRows);

	window.$moderateActions = $(`
	<tbody>
		<tr class="moderateActions">
			<td colspan="5">
				<label><input type="checkbox" id="selectAll"> ${System.data.locale.texts.globals.select_all}</label>
				<div class="moderate"></div>
			</td>
		</tr>
	</tbody>`).insertAfter($tableContentBody);

	$contentLinks.click(function(e){
		e.preventDefault();
_console.log(e);
		
	});

	$("input#selectAll", window.$moderateActions).click(function() {
		$("input", $contentSelectCheckboxes).prop("checked", this.checked);
	});

	if (System.checkRoute(4, "") || System.checkRoute(4, "tasks"))
		Inject2body("/scripts/views/4-UserContent/tasks.js");
}
