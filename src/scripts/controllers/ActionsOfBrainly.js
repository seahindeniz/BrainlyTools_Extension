"use strict";

import Request from "./Request";
import fillRange from "../helpers/fillRange";

const coupon = () => btoa(`[object Object]${System.data.Brainly.userData.user.id}-${new Date().getTime()}-${Math.floor(1 + Math.random() * 99999999)}`);

const ActionsOfBrainly = {
	/**
	 * Get actions details of a question
	 * @param {number|string} taskId - Id number of a question
	 * @param {function} callback
	 */
	GetTaskContent(taskId, callback) {
		Request.BrainlyAPI("GET", '/api_tasks/main_view/' + taskId, callback);
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

		Request.BrainlyAPI("POST", '/moderation_new/delete_task_content', data, callback);
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

		Request.BrainlyAPI("POST", '/moderation_new/delete_response_content', data, callback);
	},
	/**
	 * Delete comment by id
	 * @param {object} data - Post data
	 * @param {function} callback
	 */
	RemoveComment(data, callback) {
		data = {
			"model_type_id": 45,
			...data
		}
		if (!data.give_warning) {
			data.give_warning = false
		}

		data.reason += " " + System.data.config.reasonSign;

		Request.BrainlyAPI("POST", '/moderation_new/delete_comment_content', data, callback);
	},
	/**
	 * Delete comment by id
	 * @param {object} data - Post data
	 * @param {function} callback
	 */
	ConfirmComment(model_id, callback) {
		let data = {
			model_id,
			model_type_id: 45,
			schema: "",
			_coupon_: coupon()
		}

		Request.BrainlyAPI("POST", '/moderation_new/accept', data, callback);
	},
	/**
	 * Approve answer by id
	 * @param {number} model_id - answer id
	 * @param {function} callback
	 */
	ApproveAnswer(model_id, callback) {
		let data = {
			model_type: 2,
			model_id,
			_coupon_: coupon()
		}

		Request.BrainlyAPI("POST", '/api_content_quality/confirm', data, callback);
	},
	/**
	 * Unapprove answer by id
	 * @param {number} model_id - answer id
	 * @param {function} callback
	 */
	UnapproveAnswer(model_id, callback) {
		let data = {
			model_type: 2,
			model_id,
			_coupon_: coupon()
		}

		Request.BrainlyAPI("POST", '/api_content_quality/unconfirm', data, callback);
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

		Request.BrainlyAPI("POST", '/moderation_new/get_content', data, _callback);
	},

	/**
	 * Get actions details of a question
	 * @param {number|string} taskId - Id number of a question
	 * @param {function} callback
	 */
	TaskActions(taskId, callback) {
		Request.BrainlyAPI("GET", '/api_task_lines/big/' + taskId, callback);
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
		Request.BrainlyAPI("POST", '/moderate_tickets/expire', data, callback);
	},

	/**
	 * Get user profile data by user id
	 * @param {number} id - User id
	 * @param {function} callback 
	 */
	getUserByID(id, callback) {
		if (id instanceof Array) {
			Request.BrainlyAPI("GET", `/api_users/get_by_id?id[]=${id.join("&id[]=")}`, callback);

			return true;
		}

		Request.BrainlyAPI("GET", `/api_user_profiles/get_by_id/${~~id}`, callback);
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
		/*Request.Brainly({
			method: "GET",
			path: `/users/search/${nick}`,
			callback,
			onError
		});*/

		Request.BrainlySaltGet(`/users/search/${nick}`, callback, onError);
	},
	getAllModerators(idList, callback) {
		if (typeof idList == "function") {
			callback = idList;
			idList = null;
		}

		let prepareUsers = _idList => {
			ActionsOfBrainly.getUserByID(_idList, res => {
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

							if (typeof callback == "object" && callback.each) {
								callback.each(user);
							}

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

					callback && (callback.done || callback)();
				}
			});
		}

		if (idList) {
			prepareUsers(idList);
		} else {
			Request.get(`/moderators/supervisors/${System.data.Brainly.userData.user.id}`, res => {
				idList = res.match(/\=\d{1,}/gim);

				if (idList && idList.length > 0) {
					if (typeof idList[0] == "string") {
						idList = idList.map(id => ~~(id.replace(/\D/gim, "")));
					}

					prepareUsers(idList);
				}
			});
		}
	},
	getMessageID(user_id, callback, onError) {
		Request.BrainlyAPI("POST", `/api_messages/check`, { user_id }, callback, onError);
	},
	sendMessage(conversation_id, content, callbacks) {
		let data = {
			content,
			conversation_id
		};
		//onError yerine function aç ve gelen isteğe göre conversation id oluştur. İstek conversation id hatası değilse on error devam ettir
		Request.BrainlyAPI("POST", `/api_messages/send`, data, callbacks);
	},
	sendMessages(conversation_ids, content, callbacks, onError) {
		let isRange = (typeof conversation_ids == "string" && conversation_ids.indexOf(":") >= 0);

		if (isRange) {
			let range = conversation_ids.split(":");
			conversation_ids = fillRange(...range);
		}

		let openedRequests = 0;
		let currentUserIndex = 0;
		let membersLen = conversation_ids.length;
		let sendedMessagesCounter = 0;

		let onResponseHandler = res => {
			openedRequests--;
			sendedMessagesCounter++;

			if (res && res.success) {
				callbacks.each(sendedMessagesCounter, openedRequests);
			}

			if (sendedMessagesCounter == membersLen) {
				callbacks.done(conversation_ids);
			}
		};
		onError = err => {
			console.log(err);
		}

		let _loop_sendMessage = setInterval(() => {
			if (currentUserIndex == membersLen) {
				clearInterval(_loop_sendMessage);

				return true;
			}

			//if (openedRequests < 500) {
			openedRequests++;
			let user = conversation_ids[currentUserIndex++];
			if (!(user.conversation_id || user.conversationID)) {
				ActionsOfBrainly.getMessageID(user.id || user, res => {
					if (res && res.success) {
						if (typeof user == "number") {
							user = { user_id: user }
						}

						user.conversation_id = res.data.conversation_id;

						ActionsOfBrainly.sendMessage(user.conversation_id, content, { success: onResponseHandler, error: onError, forceStop: callbacks.forceStop });
					} else {
						openedRequests--;
						sendedMessagesCounter++;

						callbacks.each(sendedMessagesCounter);
					}
				});
			} else {
				ActionsOfBrainly.sendMessage(user.conversation_id || user.conversationID, content, { success: onResponseHandler, error: onError, forceStop: callbacks.forceStop });
			}
			//}
		});

		return _loop_sendMessage;

	},
	sendMessageById(user_id, content, callback) {
		this.getMessageID(user_id, res => {
			if (res && res.success) {
				userData.conversationID = res.data.conversation_id;
				sendMessage(res.data.conversation_id, content, callback);
			} else {
				callback(res);
			}
		});
	},
	ChangeBio(content, callback) {
		Request.Brainly({
			method: "POST",
			path: `/graphql/${System.data.Brainly.defaultConfig.MARKET}?op=changeBio`,
			callback,
			data: JSON.stringify({
				operationName: "changeBio",
				query: `mutation changeBio { updateUserDescription( token:"${System.data.Brainly.tokenLong}", input:{ description: "${content}"}){user{id}}}`,
				variables: {}
			})
		});
	}
}
export default ActionsOfBrainly;
