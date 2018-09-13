import Request from "./Request";

const Actions = {
	/**
	 * Get actions details of a question
	 * @param {number|string} taskId - Id number of a question
	 * @param {function} callback
	 */
	GetTaskContent(taskId, callback) {
		Request.BrainlyReq("GET", '/api_tasks/main_view/' + taskId, callback);
	},
	/**
	 * Delete question by id
	 * @param {object} data - Post data
	 * @param {function} callback
	 */
	RemoveQuestion(data, callback) {
		data = {
			"model_type_id": 1,
			"give_warning": false,
			"take_points": true,
			"return_points": true,
			...data
		}
		data.reason += " "+System.data.config.reasonSign;

		Request.BrainlyReq("POST", '/moderation_new/delete_task_content', data, callback);
	},
	/**
	 * Delete answer by id
	 * @param {object} data - Post data
	 * @param {function} callback
	 */
	RemoveAnswer(data, callback) {
		data = {
			model_type_id: 2,
			give_warning: false,
			take_points: true,
			schema: "moderation.response.delete.req",
			...data
		}
		data.reason += " "+System.data.config.reasonSign;

		Request.BrainlyReq("POST", '/moderation_new/delete_response_content', data, callback);
	},
	/**
	 * Create a ticket for a question
	 * @param {number|string} taskId - Id number of a question
	 * @param {function} callback
	 * @param {boolean} withTaskDetails - If you want to get the actions list of a question then pass "true"
	 */
	OpenModerationTicket(taskId, callback, withTaskDetails = false) {
		let data = {
			model_id: taskId,
			model_type_id: 1,
			schema: "moderation.content.result.res"
		}
		let _callback = callback;
		if (withTaskDetails) {
			_callback = resTask => {
				if (resTask.success) {
					Actions.TaskActions(taskId, resActions => {
						if (resActions.success) {
							callback({
								...resTask,
								actions: resActions
							})
						}
					});
				}
			}
		}

		Request.BrainlyReq("POST", '/moderation_new/get_content', data, _callback);
	},

	/**
	 * Get actions details of a question
	 * @param {number|string} taskId - Id number of a question
	 * @param {function} callback
	 */
	TaskActions(taskId, callback) {
		Request.BrainlyReq("GET", '/api_task_lines/big/' + taskId, callback);
	},

	/**
	 * Close a opened ticket for a question
	 * @param {number|string} taskId - Id number of a question
	 * @param {function} callback
	 */
	CloseModerationTicket(taskId, callback) {
		let data = {
			model_id: taskId,
			model_type_id: 1,
			schema: ""
		}
		Request.BrainlyReq("POST", '/moderate_tickets/expire', data, callback);
	}
}
export default Actions;
