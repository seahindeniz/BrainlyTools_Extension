import { GetQuestionContent } from "../../../controllers/ActionsOfBrainly";

export default class Content {
	/**
	 * @param {*} rowElement
	 */
	constructor(questionID) {
		this.questionID = questionID;
	}
	async Fetch() {
		if (this.questionID && this.questionID > 0) {
			return GetQuestionContent(this.questionID);
		}
	}
	get question() {
		return this.res.data.task;
	}
	get answers() {
		return this.res.data.responses;
	}
}
