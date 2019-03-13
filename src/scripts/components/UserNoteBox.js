import { UpdateNote } from "../controllers/ActionsOfServer";

export default (user) => {
	let $userNoteBox = $(`
	<div class="sg-actions-list__hole userNoteBox">
		<div class="sg-header-secondary">
			<textarea class="sg-textarea inputNote sg-textarea--full-width" placeholder="${System.data.locale.common.personalNote.writeSomething}.." title="${System.data.locale.common.personalNote.title}" maxlength="1000">${user.note || ""}</textarea>
		</div>
	</div>`);

	let $input = $("textarea", $userNoteBox);

	$input.change(async function() {
		let data = {
			_id: user._id,
			note: this.value
		}
		let resUpdate = await UpdateNote(data);

		if (resUpdate && resUpdate.success) {
			$input.addClass("changed").delay(3000).queue(() => $input.removeClass("changed"));
		}
	});

	return $userNoteBox
}
