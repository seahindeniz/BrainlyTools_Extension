import Storage from "../../helpers/extStorage";
import Notification from "../components/Notification";

const isPosInt = str => /^\+?\d+$/.test(str);

let DeleteButtonOptions = (quickDeleteButtonsReasons, callback) => {
	let fields = "";
	let reasonTypeKeys = Object.keys(System.data.Brainly.deleteReasons.__withIds);
	reasonTypeKeys = reasonTypeKeys.filter(key => key.indexOf("__") < 0).reverse()

	reasonTypeKeys.forEach(reasonTypeKey => {
		System.checkUserP(reasonTypeKey == "task" ? 1 : reasonTypeKey == "response" ? 2 : reasonTypeKey == "comment" ? 3 : null, () => {
			let dropDownFields = "";
			var listOptions = i => {
				let options = "";
				Object.keys(System.data.Brainly.deleteReasons.__withIds[reasonTypeKey]).forEach(reasonId => {
					if (reasonId != "__categories") {
						let contentType = System.data.Brainly.deleteReasons.__withIds[reasonTypeKey];
						let reason = contentType[reasonId];
						let category = contentType.__categories[reason.category_id];
						let buttonDefaultSelectedItem = (quickDeleteButtonsReasons && quickDeleteButtonsReasons[reasonTypeKey][i] && isPosInt(quickDeleteButtonsReasons[reasonTypeKey][i]) && quickDeleteButtonsReasons[reasonTypeKey][i]) || System.data.config.marketConfig.quickDeleteButtonsDefaultReasons[reasonTypeKey][i];

						options += `<option data-cat-id="${category.id}" data-reason-id="${reasonId}" title="${reason.text}"${buttonDefaultSelectedItem == reasonId ? " selected" : ""}>${ category.text == reason.title ? reason.title : category.text + " › " + reason.title }</option>`
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
					<span>${System.data.locale.popup.extensionOptions.quickDeleteButtons[reasonTypeKey]}</span>
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
			data[reasonType].push($('option:selected', elm).data("reason-id"));
		});
		Storage.set({ quickDeleteButtonsReasons: data });
	});

	let $layout = $(`
	<article class="message is-danger">
		<div class="message-header" title="${System.data.locale.popup.extensionOptions.quickDeleteButtons.title}">
			<p>${System.data.locale.popup.extensionOptions.quickDeleteButtons.text}</p>
		</div>
		<div class="message-body"></div>
	</article>`);

	$(".message-body", $layout).append($fields);

	callback($layout);
}
export default DeleteButtonOptions
