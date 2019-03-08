import { RemoveAnswer, ApproveAnswer, UnapproveAnswer } from "../../controllers/ActionsOfBrainly";
import UserContent from "./_/UserContent";

class Answers extends UserContent {
	constructor() {
		super("Answers");
	}
	InitAnswers() {
		if (System.checkUserP([15, 6])) {
			this.RenderButtonContainer();

			if (System.checkUserP(15)) {
				this.RenderModerateButton();
				this.RenderDeleteSection("response");
				this.BindModerateEvents();
			}

			if (System.checkUserP(6)) {
				if (System.checkBrainlyP(146)) {
					this.RenderApproveButton();
					this.BindApprovementEvents();
				}
				if (System.checkBrainlyP(147)) {
					this.RenderUnapproveButton();
					this.BindUnapprovementEvents();
				}
			}
		}
	}
	RenderButtonContainer() {
		this.$buttonContainer = $(`
		<div class="sg-content-box__content">
			<div class="sg-actions-list"></div>
		</div>`);

		this.$buttonList = $(".sg-actions-list", this.$buttonContainer);

		this.$buttonContainer.appendTo(this.$moderateHeader);
	}
	RenderButtonHole() {
		return $(`<div class="sg-actions-list__hole"></div>`).appendTo(this.$buttonList);;
	}
	RenderModerateButton() {
		this.$moderateButtonContainer = this.RenderButtonHole();
		this.$moderateButton = $(`<button class="sg-button-secondary sg-button-secondary--peach">${System.data.locale.common.moderating.moderate}</button>`);

		this.$moderateButton.appendTo(this.$moderateButtonContainer);
	}
	RenderApproveButton() {
		this.$approveButtonContainer = this.RenderButtonHole();
		this.$approveButton = $(`<button class="sg-button-secondary">${System.data.locale.common.moderating.approve}</button>`);

		this.$approveButton.appendTo(this.$approveButtonContainer);
	}
	RenderUnapproveButton() {
		this.$unApproveButtonContainer = this.RenderButtonHole();
		this.$unApproveButton = $(`<button class="sg-button-secondary sg-button-secondary--dark">${System.data.locale.common.moderating.unapprove}</button>`);

		this.$unApproveButton.appendTo(this.$unApproveButtonContainer);
	}
	BindModerateEvents() {
		this.$moderateButton.click(this.ToggleDeleteSection.bind(this));
		this.$deleteButton.click(this.DeleteSelectedAnswers.bind(this));
	}
	async DeleteSelectedAnswers() {
		let rows = this.DeletableRows();

		if (rows.length == 0) {
			this.ShowSelectContentWarning();
		} else if (!this.deleteSection.selectedReason) {
			this.deleteSection.ShowReasonWarning();
		} else {
			this.HideSelectContentWarning();
			await System.Delay(50);

			if (confirm(System.data.locale.common.moderating.doYouWantToDelete)) {
				this.postData = {
					reason_id: this.deleteSection.selectedReason.id,
					reason: this.deleteSection.reasonText,
					give_warning: this.deleteSection.giveWarning,
					take_points: this.deleteSection.takePoints
				};

				rows.forEach(this.Row_DeleteAnswer.bind(this));
			}
		}
	}
	async Row_DeleteAnswer(row) {
		if (row.IsNotDeleted()) {
			let postData = {
				...this.postData,
				model_id: row.element.questionID
			}

			row.checkbox.ShowSpinner();

			let resRemove = await RemoveAnswer(postData);

			row.CheckDeleteResponse(resRemove);
		}
	}
	BindApprovementEvents() {
		this.$approveButton.click(this.ApproveSelectedAnswers.bind(this));
	}
	BindUnapprovementEvents() {
		this.$unApproveButton.click(this.UnapproveSelectedAnswers.bind(this));
	}
	async ApproveSelectedAnswers() {
		let rows = this.ApprovableRows();

		if (rows.length == 0) {
			this.ShowSelectContentWarning();
		} else {
			this.HideSelectContentWarning();
			await System.Delay(50);

			if (confirm(System.data.locale.userContent.notificationMessages.confirmApproving)) {
				rows.forEach(this.Row_ApproveAnswer.bind(this));
			}
		}
	}
	async Row_ApproveAnswer(row) {
		if (row.IsApproved()) {
			row.Approved(true);
		} else {
			let resApprove = await ApproveAnswer(row.answerID);

			row.CheckApproveResponse(resApprove);
		}
	}
	async UnapproveSelectedAnswers() {
		let rows = this.UnapprovableRows();

		if (rows.length == 0) {
			this.ShowSelectContentWarning();
		} else {
			this.HideSelectContentWarning();
			await System.Delay(50);

			if (confirm(System.data.locale.userContent.notificationMessages.confirmUnapproving)) {
				rows.forEach(this.Row_UnapproveAnswer.bind(this));
			}
		}
	}
	async Row_UnapproveAnswer(row) {
		if (row.IsApproved()) {
			let resUnapprove = await UnapproveAnswer(row.answerID);

			row.CheckUnapproveResponse(resUnapprove);
		} else {
			row.Unapproved();
		}
	}
}

new Answers();
