import { RemoveQuestion, RemoveAnswer } from "../../controllers/Actions";
import Buttons from "../../components/Buttons";
import WaitForFn from "../../helpers/WaitForFn";
import WaitForElm from "../../helpers/WaitForElm";

let selectors = window.selectors,
	$moderateActions = window.$moderateActions;

//WaitForElm('#content-old > div > div > table > tbody > tr:nth-child(1) > td', () => {
let $contentRows = $(selectors.contentRows);
let $tableContentBody = $(selectors.tableContentBody);

let rulesOptions1 = "";
$.each(System.data.Brainly.deleteReasons.task, function() {
	if (this.category_id)
		rulesOptions1 += `<option value="${this.id}" data-category-id="${this.category_id}" title="${this.text}">${this.title}</option>`;
});

let $moderateContent = $(`
<div style="margin: 0 0 0 6px;display: inline-block;">
	<label title="${System.data.locale.texts.moderate.take_points.description}" class="pull-left">
		<input type="checkbox" id="take_points" checked>${System.data.locale.texts.moderate.take_points.title}
	</label>
	<label title="${System.data.locale.texts.moderate.return_points.description}" class="pull-left">
		<input type="checkbox" id="return_points" checked>${System.data.locale.texts.moderate.return_points.title}
	</label>
	<label title="${System.data.locale.texts.moderate.give_warning.description}" class="pull-left">
		<input type="checkbox" id="give_warning">${System.data.locale.texts.moderate.give_warning.title}
	</label>
	<select class="pull-left" style="height: 26px;">
		<option selected disabled>${System.data.locale.texts.globals.choose_option}</option>
		${rulesOptions1}
	</select>
</div>`).appendTo($("div.moderate", $moderateActions));

$(".moderate select option:gt(0)", $moderateActions).sort((a, b) => $(b).text() < $(a).text() ? 1 : -1).appendTo($(".moderate select", $moderateActions));

let rules_actions = $(`<button class="moderation-start btn btn-mini btn-danger pull-left kaldir" title="${System.data.locale.texts.user_content.remove_answer}"><b class="icon">✖</b></button>`).appendTo($("div.moderate", $moderateActions));
_console.log($moderateActions);
