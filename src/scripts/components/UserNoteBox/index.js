import { updateNote } from "../../controllers/ActionsOfServer";

export default (user) => {
	let $userNoteBox = $(`
	<div class="sg-actions-list__hole userNoteBox">
		<div class="sg-header-secondary">
			<textarea class="sg-textarea inputNote" placeholder="${System.data.locale.common.personalNote.placeholder}" title="${System.data.locale.common.personalNote.title}" maxlength="1000">${user.note || ""}</textarea>
		</div>
	</div>`);

	let $input = $("textarea", $userNoteBox);

	$input.change(function() {
		let data = {
			_id: user._id,
			note: this.value
		}
		updateNote(data, res => {
			if (res && res.success) {
				$input.addClass("changed").delay(3000).queue(() => $input.removeClass("changed"));
			}
		});
		/*Sistem.fn.postme("id=" + kisi.brainly_id + "&nick=" + kisi.nick + "&kisi_note=" + this.value, function (response) {
			if (response.success) {
				$inputNote.addClass("degisti").delay(3000).queue(function (a) {
					$(this).removeClass("degisti");
				});
			}
		});*/
	});

	return $userNoteBox
}
