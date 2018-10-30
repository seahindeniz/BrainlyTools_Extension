"use strict";

import Modal from "../../../components/ModalToplayer";
import DeleteSection from "../../../components/DeleteSection";

export default () => {
	let modal = new Modal(
		`<div class="sg-actions-list sg-actions-list--space-between">
			<div class="sg-actions-list__hole">
				<div class="sg-label sg-label--small sg-label--secondary">
					<div class="sg-text sg-text--peach">${System.data.locale.core.TaskDeleter.text}</div>
				</div>
			</div>
		</div>`,
		`<div class="sg-content-box">
			<div class="sg-content-box__actions">
			<div class="sg-textarea sg-textarea--full-width back" style="color: transparent;"></div>
			<div class="sg-textarea js-id-input" contenteditable="true" style="position: absolute; background: transparent; width: 92%;" placeholder="${System.data.locale.core.TaskDeleter.questionsLinksOrIDs}"></div>
			</div>
			<div class="sg-content-box__actions">
				<div class="sg-actions-list sg-actions-list--no-wrap">
					<div class="sg-actions-list__hole">
						<p class="sg-text">${System.data.locale.core.TaskDeleter.questionsWillBeDeleted.replace("%{n}", `<span>0</span>`)}</p>
					</div>
					<div class="sg-actions-list__hole sg-actions-list__hole--to-right js-hidden">
						<p class="sg-text">${System.data.locale.core.TaskDeleter.nHasBeenDeleted.replace("%{n}", `<b>0</b>`)}</p>
					</div>
				</div>
			</div>
			<div class="sg-content-box__content">
				<blockquote class="sg-text sg-text--small">${System.data.locale.core.TaskDeleter.containerExplanation}<br>${System.createBrainlyLink("task", { id: 1234567 })}<br>${System.createBrainlyLink("task", { id: 2345678 })}<br>1234567<br>2345678</blockquote>
			</div>
			<div class="sg-content-box__actions deleteSection"></div>
		</div>`,
		`<div class="sg-spinner-container">
			<button class="sg-button-primary sg-button-primary--peach js-submit">${System.data.locale.common.moderating.confirm}</button>
		</div>`
	);

	DeleteSection(System.data.Brainly.deleteReasons.task, "task").appendTo($(".deleteSection", modal.$));

	let $toplayerContainer = $("body > div.page-wrapper.js-page-wrapper > section > div.js-toplayers-container");

	if($toplayerContainer.length == 0){
		$toplayerContainer = $(`<div class="js-toplayers-container"></div>`).appendTo("body");
	}

	modal.$.appendTo($toplayerContainer);

	$(".sg-toplayer__close", modal.$).click(() => modal.$.remove());

	return modal;
}
