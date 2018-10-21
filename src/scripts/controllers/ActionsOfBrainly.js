import Request from "./Request";

const ActionsOfBrainly = {
	/**
	 * Get actions details of a question
	 * @param {number|string} taskId - Id number of a question
	 * @param {function} callback
	 */
	GetTaskContent(taskId, callback) {
		Request.Brainly("GET", '/api_tasks/main_view/' + taskId, callback);
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
		data.reason += " " + System.data.config.reasonSign;

		Request.Brainly("POST", '/moderation_new/delete_task_content', data, callback);
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
		data.reason += " " + System.data.config.reasonSign;

		Request.Brainly("POST", '/moderation_new/delete_response_content', data, callback);
	},
	/**
	 * Delete comment by id
	 * @param {object} data - Post data
	 * @param {function} callback
	 */
	RemoveComment(data, callback) {
		data = {
			"model_type_id": 45,
			"give_warning": false,
			...data
		}

		data.reason += " " + System.data.config.reasonSign;

		Request.Brainly("POST", '/moderation_new/delete_comment_content', data, callback);
	},
	/**
	 * Approve answer by id
	 * @param {object} data - Post data
	 * @param {function} callback
	 */
	ApproveAnswer(model_id, callback) {
		let coupon = btoa(`[object Object]${myData.id}-${new Date().getTime()}-${Math.floor(1 + Math.random() * 99999999)}`);
		let data = {
			model_type: 2,
			model_id,
			_coupon_: coupon
		}

		Request.Brainly("POST", '/api_content_quality/confirm', data, callback);
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
					ActionsOfBrainly.TaskActions(taskId, resActions => {
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

		Request.Brainly("POST", '/moderation_new/get_content', data, _callback);
	},

	/**
	 * Get actions details of a question
	 * @param {number|string} taskId - Id number of a question
	 * @param {function} callback
	 */
	TaskActions(taskId, callback) {
		Request.Brainly("GET", '/api_task_lines/big/' + taskId, callback);
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
		Request.Brainly("POST", '/moderate_tickets/expire', data, callback);
	},

	/**
	 * Get user profile data by user id
	 * @param {number} id - User id
	 * @param {function} callback 
	 */
	getUserByID(id, callback) {
		if (id instanceof Array) {
			Request.Brainly("GET", `/api_users/get_by_id?id[]=${id.join("&id[]=")}`, callback);

			return true;
		}
		Request.Brainly("GET", `/api_user_profiles/get_by_id/${~~id}`, callback);
	},

	/**
	 * Cancel user warning by warning id
	 * @param {number|string|Object} data - Warning id or id's in array. Example: { userID: 1183068, warningIDs: [5016271, 5016272] }
	 * @param {function} callback 
	 */
	CancelWarning(data, callback, onError) {
		let userID = null;

		if (window.sitePassedParams) {
			userID = JSON.parse(sitePassedParams)[0];
		}

		if (typeof data === "string" || typeof data == "number") {
			data = {
				userID,
				warningIDs: [data]
			};
		} else if (Object.prototype.toString.call(data) === "[object Array]") {
			data = {
				userID,
				warningIDs: data
			}
		}

		data.warningIDs.forEach(id => {
			Request.BrainlySaltGet(`/moderators/cancel_warning/${data.userID}/${id}`, callback, onError);
		});
	},
	getAllFriends(callback) {
		$.getJSON(`//${location.hostname}/buddies_new/ajax_panel_get_buddies`, callback);
	},
	RemoveFriend(idList, handler) {
		let counter = 0;

		if (typeof idList == "boolean" && idList == true) {
			idList = System.friends.map((friend) => {
				return friend.id;
			});
		}
		if (typeof idList == "string" || typeof idList == "number") {
			idList = [idList];
		}
		if (typeof handler == "function") {
			handler = {
				success: handler,
				each: () => {}
			}
		}

		if (idList && typeof idList == "object" && idList.length > 0) {
			idList.forEach(id => {
				Request.BrainlySaltGet(`/buddies_new/unbuddy/${id}`, (res, textStatus, jqXHR) => {
					counter++;

					if (handler && jqXHR && jqXHR.responseURL && jqXHR.responseURL.indexOf("users/view") >= 0) {
						handler.each && handler.each(counter, id);
					}
					if (counter == idList.length) {
						handler.success && handler.success();
					}
				});
			});
		}
	},
	findUser(nick, callback, onError) {
		Request.BrainlySaltGet(`/users/search/${nick}`, callback, onError);
	},
	getAllModerators(callback) {
		Request.get(`/moderators/supervisors/${System.data.Brainly.userData.user.id}`, res => {
			let idList = res.match(/\=\d{1,}/gim);

			if (idList && idList.length > 0) {
				Request.Brainly("GET", `/api_users/get_by_id?id[]${idList.join("&id[]")}`, res => {
					if (res && res.success) {
						System.allModerators = {
							list: res.data,
							withNicks: {},
							withID: {},
							withRanks: {}
						};
						if (res.data && res.data.length > 0) {
							res.data.forEach(user => {
								System.allModerators.withNicks[user.nick] = user;
								System.allModerators.withID[user.nick] = user;

								if (user.ranks_ids && user.ranks_ids.length > 0) {
									user.ranks_ids.forEach(rank => {
										let currentRank = System.allModerators.withRanks[rank];

										if (!currentRank) {
											currentRank = System.allModerators.withRanks[rank] = []
										}

										currentRank.push(user);
									});
								}
							});
						}

						callback && callback();
					}
				});
			}
		});
	},
	getMessageID(user_id, callback) {
		Request.Brainly("POST", `/api_messages/check`, { user_id }, callback);
	},
	sendMessage(conversation_id, content, callback) {
		let data = {
			content,
			conversation_id
		};

		Request.Brainly("POST", `/api_messages/send`, data, callback);
	}
}
export default ActionsOfBrainly;
