import Request from "./Request";

/**
 * Delete question by id
 * @param {number|string} id - Id number of a question
 * @param {object|function} data - Post data
 * @param {function} callback
 */
const RemoveQuestion = (id, data, callback) => {
	if (typeof data === "function") {
		callback = data;
		data = {};
	}
	let _data = {
		"model_id": id,
		"model_type_id": 1,
		"reason_id": 25,
		"reason": "Default",
		"give_warning": false,
		"take_points": true,
		"return_points": true,
		...data
	}
	Request.BrainlyPost('https://brainly.co.id/api/28/moderation_new/delete_task_content', _data, function (res) {
		console.log(res);
	});
}


export {RemoveQuestion};