import Storage from "../../helpers/extStorage";
import Notification from "../components/Notification";

let DeleteButtonOptions = (quickDeleteButtonsReasons, callback) => {
	let fields = "";
	let reasonTypeKeys = Object.keys(System.data.Brainly.deleteReasons.__withTitles).reverse();

	reasonTypeKeys.forEach(reasonTypeKey => {
		System.checkUserP(reasonTypeKey == "task" ? 1 : reasonTypeKey == "response" ? 2 : reasonTypeKey == "comment" ? 3 : null, () => {
			let dropDownFields = "";
			var listOptions = i => {
				let options = "";
				Object.keys(System.data.Brainly.deleteReasons.__withTitles[reasonTypeKey]).forEach(reasonKey => {
					if (reasonKey != "__categories") {
						let contentType = System.data.Brainly.deleteReasons.__withTitles[reasonTypeKey];
						let reason = contentType[reasonKey];
						let category = contentType.__categories[reason.category_id];
						let buttonDefaultSelectedItem = (quickDeleteButtonsReasons && quickDeleteButtonsReasons[reasonTypeKey][i]) || System.data.locale.config.quickDeleteButtonsDefaultReasons[reasonTypeKey][i]
						options += `<option data-cat-id="${category.id}" data-key="${reasonKey}" title="${reason.text}"${buttonDefaultSelectedItem == reasonKey ? " selected" : ""}>${category.text == reasonKey ? reasonKey : category.text + " - " + reasonKey}</option>`
					}
				});
				return options;
			}
			for (let i = 0; i < (System.data.config.quickDeleteButtonsReasons[reasonTypeKey].length); i++) {
				dropDownFields += `
				<div class="control title is-6 has-text-centered">
					<div class="select">
						<select>
							<option disabled>Select a reason</option>
							${listOptions(i)}
						</select>
					</div>
				</div>`;
			}
			fields += `
			<div class="board-item">
				<div class="board-item-content" data-type="${reasonTypeKey}">
					<span>${System.data.locale.texts.extension_options.quick_delete_buttons[reasonTypeKey]}</span>
					${dropDownFields}
				</div>
			</div>`
		});
	});
	let $fields = $(fields);

	let $quickDeleteButtonsSelect = $(".board-item-content[data-type] select", $fields);

	//$(".board-item-content[data-type] select", $fields)
	$quickDeleteButtonsSelect.each((i, select) => {
		let selectedItem = $("option:selected", select).val();
		$("option:gt(0)", select).sort((a, b) => $(b).text() < $(a).text() ? 1 : -1).appendTo(select);
		$(select).val(selectedItem);
	});

	$quickDeleteButtonsSelect.on("change", function() {
		Notification("Button selections saved");
		let data = {};
		$quickDeleteButtonsSelect.each((i, elm) => {
			let reasonType = $(elm).parents(".board-item-content").data("type");
			!data[reasonType] && (data[reasonType] = []);
			data[reasonType].push($('option:selected', elm).data("key"));
		});
		Storage.set({ quickDeleteButtonsReasons: data });
	});

	let $layout = $(`
	<article class="message is-danger">
		<div class="message-header">
			<p>${System.data.locale.texts.extension_options.quick_delete_buttons.title}</p>
		</div>
		<div class="message-body"></div>
	</article>`);

	$(".message-body", $layout).append($fields);

	callback($layout);
}
export default DeleteButtonOptions
