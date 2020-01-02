import ServerReq from "@ServerReq";

export default (user) => {
  let $userNoteBox = $(`
	<div class="sg-actions-list__hole userNoteBox">
    <textarea class="sg-textarea sg-text--small inputNote sg-textarea--full-width" placeholder="${System.data.locale.common.personalNote.clickToAddANote}" title="${System.data.locale.common.personalNote.title}" maxlength="1000">${user.note || ""}</textarea>
	</div>`);

  let $input = $("textarea", $userNoteBox);

  $input.change(async function() {
    let data = {
      _id: user._id,
      note: this.value
    }
    let resUpdate = await new ServerReq().UpdateNote(data);

    if (resUpdate && resUpdate.success) {
      $input.addClass("changed").delay(3000).queue(() => $input.removeClass("changed"));
    }
  });

  return $userNoteBox
}
