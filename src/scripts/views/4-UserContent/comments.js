"use strict";

import moment from "moment-timezone";
import DeleteSection from "../../components/DeleteSection";
import notification from "../../components/notification";
import { GetQuestionContent, RemoveComment, CloseModerationTicket, GetComments } from "../../controllers/ActionsOfBrainly";

let selectors = window.selectors;
let $moderateActions = window.$moderateActions;

let $tableContentBody = $(selectors.tableContentBody);

class Comments {
	constructor() {
		this.questionContents = {};
		this.userId = ~~window.sitePassedParams[0];
		this.questionLink = document.querySelectorAll(selectors.contentLinks);

		if (this.questionLink.length > 0)
			this.Init();
	}
	Init() {
		this.FindQuestionIDs();
		this.GetContents();
		this.RenderDeletePanel();
		this.BindEvents();
	}
	FindQuestionIDs() {
		let links = [...this.questionLink];

		links.forEach(link => {
			let URL = link.href;
			let parsedURL = URL.split("/");
			let questionId = ~~parsedURL.pop();

			if (!this.questionContents[questionId]) {
				this.questionContents[questionId] = {
					elements: [link]
				};
			} else {
				this.questionContents[questionId].elements.push(link);
			}
		});
	}
	GetContents() {
		$.each(this.questionContents, questionId => {
			this.GetContent(questionId);
		});
		/* let idList = Object.keys(this.taskContents);

		idList.forEach((id) => {}); */
	}
	async GetContent(questionId) {
		let res = await GetQuestionContent(questionId);
		this.questionContents[questionId].content = res;

		this.AttachComments(questionId);
	}
	async AttachComments(questionId) {
		try {
			let userComments = await this.GetUserComments(questionId);

			userComments.forEach(comment => {
				this.AttachComment(questionId, comment);
			});
			//this.taskContents[id].elements.forEach(this.AttachComment.bind(this));
		} catch (error) {
			console.error(error)
		}
	}
	AttachComment(questionId, comment) {
		this.questionContents[questionId].elements.forEach(element => {
			let cellText = element.innerText;
			cellText = cellText.slice(0, -3);
			let date = $(element).parent().nextAll(":last").text();

			if (date) {
				date = moment(date + System.data.Brainly.defaultConfig.locale.OFFSET).tz(System.data.Brainly.defaultConfig.locale.TIMEZONE);

				if (date.format() == comment.created) {
					let fetchedText = comment.content.replace(/ {2,}/g, " ");

					if (fetchedText.startsWith(cellText)) {
						element.comment = comment;
						$(element).parents("tr").attr("data-commentId", comment.id);
					}
				}
			}
		});
	}
	AttachComment2(element) {
		let cellText = element.innerText;
		cellText = cellText.slice(0, -3);

		let date = $(element).parent().nextAll(":last").text();
		date = moment(date + System.data.Brainly.defaultConfig.locale.OFFSET).tz(System.data.Brainly.defaultConfig.locale.TIMEZONE);
		//let timestamp = new Date(date).getTime();
		let comment = this.userComments.find(c => {
			if (date.format() == c.created) {
				let fetchedText = c.content.replace(/ {2,}/g, " ");
				console.log(fetchedText);
				console.log(cellText);
				console.warn(fetchedText.startsWith(cellText));

				return fetchedText.startsWith(cellText);
			}
			/* if (c.content.startsWith(text)) {
				console.log(c.content, text, date.format() == c.created);
				//let time = moment(c.created).tz(System.data.Brainly.defaultConfig.locale.TIMEZONE)
				//let cTimestamp = time.getTime();
				//console.log(date, date.format());
				//	console.log(time, time.format(), c.created);
				//	console.log(date.format() == time.format());

				return date.format() == c.created
			} */
		});
		/*
		let date = $(element).parent().nextAll(":last").text();
		let timestamp = new Date(date + System.data.Brainly.defaultConfig.locale.OFFSET).getTime();
		let comment = this.userComments.find(c => {
			if (c.content == "fast")
				console.log(text, c.content);
			if (c.content.startsWith(text)) {
				let time = new Date(c.created);
				let cTimestamp = time.getTime();
				console.log(timestamp, cTimestamp, timestamp == cTimestamp);

				return timestamp == cTimestamp
			}
		}); */

		if (comment) {
			element.comment = comment;
			$(element).parents("tr").attr("data-commentId", comment.id);
			//console.dir(element);
		} else {
			console.log(element, comment);

		}
	}
	async GetUserComments(questionId) {
		let content = this.questionContents[questionId].content;
		let userComments = [];
		let comments = [];

		if (content.data.task.comments.count > 0) {
			let taskComments = content.data.task.comments.items;

			if (content.data.task.comments.count > 5) {
				let resTaskComments = await GetComments(content.data.task.id, 1, content.data.task.comments.count);
				taskComments = resTaskComments.data.comments.items
			}

			comments = [...comments, ...taskComments];
		}

		if (content.data.responses.length > 0) {
			let responsesComments = await this.GetResponsesComments(content.data.responses);

			if (responsesComments.length) {
				comments = [...comments, ...responsesComments];
			}
		}

		if (comments.length > 0) {
			comments.forEach(comment => {
				if (comment.user_id == this.userId) {
					comment.content = comment.content.replace(/(<([^>]+)>)/gmi, "");

					userComments.push(comment);
				}
			});
		}

		return Promise.resolve(userComments);
	}
	GetResponsesComments(responses) {
		return new Promise((resolve, reject) => {
			try {
				let comments = [];

				let _loop_responses = async (i) => {
					let response = responses[i];

					if (response && response.comments.count > 0) {
						let responseComments = response.comments.items;

						if (response.comments.count > 5) {
							let resResponseComments = await GetComments(response.id, 2, response.comments.count);
							responseComments = resResponseComments.data.comments.items
						}

						comments = [...comments, ...responseComments];

					}

					if (responses.length - 1 == i) {
						resolve(comments);
					} else {
						_loop_responses(++i)
					}

				}
				_loop_responses(0);
			} catch (error) {
				console.error(error);
				reject(error);
			}
		})
	}
	RenderDeletePanel() {
		this.$deleteSection = DeleteSection(System.data.Brainly.deleteReasons.comment, "comment");
		this.$textarea = $('textarea', this.$deleteSection);
		this.$categories = $(".categories", this.$deleteSection);
		this.$give_warning = $('#give_warning', this.$deleteSection);

		this.$deleteSection.appendTo($("td", $moderateActions));

		let $submitContainer = $(`
		<div class="sg-spinner-container">
			<button class="sg-button-secondary sg-button-secondary--peach js-submit">${System.data.locale.common.moderating.confirm} !</button>
		</div>`).insertAfter(this.$deleteSection);
		this.$submit = $(".js-submit", $submitContainer);
	}
	BindEvents() {
		this.$submit.click(() => {
			let $checkedContentSelectCheckboxes = $('input[type="checkbox"]:checked:not([disabled])', $tableContentBody);
			let $selectAComment_warning = $(".selectAComment_warning", $moderateActions);

			if ($checkedContentSelectCheckboxes.length == 0) {
				if ($selectAComment_warning.length == 0) {
					$(`<div class="sg-bubble sg-bubble--top sg-bubble--row-start sg-bubble--peach sg-text--light selectAComment_warning">${System.data.locale.userContent.notificationMessages.selectAtLeasetOneComment}</div>`).prependTo($("td", $moderateActions));
				} else {
					$selectAComment_warning.fadeTo('fast', 0.5).fadeTo('fast', 1.0).fadeTo('fast', 0.5).fadeTo('fast', 1.0);
				}
			} else {
				$selectAComment_warning.remove();
				let $selectAReason_warning = $(".selectAReason_warning", this.$deleteSection);

				if (!window.selectedCategory) {
					if ($selectAReason_warning.length == 0) {
						$(`<div class="sg-bubble sg-bubble--bottom sg-bubble--row-start sg-bubble--peach sg-text--light selectAReason_warning">${System.data.locale.common.moderating.selectReason}</div>`).insertBefore(this.$categories)
					} else {
						$selectAReason_warning.fadeTo('fast', 0.5).fadeTo('fast', 1.0).fadeTo('fast', 0.5).fadeTo('fast', 1.0);
					}
				} else {
					$selectAReason_warning.remove();
					if (confirm(System.data.locale.common.moderating.doYouWantToDelete)) {
						let $progressBarContainer = $("#commentProgress", $moderateActions);

						if ($progressBarContainer.length == 0) {
							$progressBarContainer = $(`<div id="commentProgress" class="progress-container sg-content-box--spaced-top-large  sg-content-box--spaced-bottom-large"><progress class="progress is-info" value="0" max="${$checkedContentSelectCheckboxes.length}" data-label="${System.data.locale.common.progressing}"></progress></div>`);

							$progressBarContainer.appendTo($("td", $moderateActions));
						}

						let $progressBar = $("progress", $progressBarContainer);

						$progressBarContainer.show();

						window.isPageProcessing = true;
						let $spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner"></div></div>`).insertAfter(this.$submit);
						let counter = 0;

						let updateCounter = () => {
							$progressBar.val(++counter);

							if (counter == $checkedContentSelectCheckboxes.length) {
								$spinner.remove();
								$progressBar.attr("data-label", System.data.locale.common.allDone)
								$progressBar.attr("class", "progress is-success");
								window.isPageProcessing = false;
							}
						}

						let idList = [];
						let removeIt = async that => {
							let $parentRow = $(that).parents("tr");
							let taskId = $parentRow.data("taskid");
							let rowNumber = ~~($(">td:eq(1)", $parentRow).text());
							let model_id = $parentRow.data("commentid");
							let commentData = {
								model_id,
								reason_id: window.selectedCategory.id,
								reason: this.$textarea.val(),
								give_warning: this.$give_warning.is(':checked'),
							};

							idList.push(model_id);

							let res = await RemoveComment(commentData);

							CloseModerationTicket(taskId);
							updateCounter();

							if (!res) {
								notification(System.data.locale.common.notificationMessages.somethingWentWrong, "error");
							} else {
								if (!res.success && res.message) {
									notification("#" + rowNumber + " > " + res.message, "error");
									$parentRow.addClass("already");
								}

								$(that).attr("disabled", "disabled");
								$parentRow.addClass("removed");
							}
						};

						$checkedContentSelectCheckboxes.each(function() {
							removeIt(this);
						});

						System.log(7, this.userId, idList);
					}
				}
			}
		});
	}
}

new Comments();
/**
 * Prepare comment id's
 */
/* let requestedTasks = [];

$contentLinks.each(async function() {
	let taskId = this.href.split("/").pop();

	this.setAttribute("target", "_blank");

	if (taskId > 0 && !requestedTasks.includes(taskId)) {
		requestedTasks.push(taskId);

		let res = await GetTaskContent(taskId);

		if (res) {
			let comments = []

			if (res.data.task.comments.items && res.data.task.comments.items.length > 0) {
				comments = [...comments, ...res.data.task.comments.items]
			}

			if (res.data.responses && res.data.responses.length > 0) {
				res.data.responses.forEach(response => {
					if (response.comments.items && response.comments.items.length > 0) {
						comments = [...comments, ...response.comments.items];
					}
				});
			}

			if (comments.length > 0) {
				processComments(comments);
			}
		}
	}
}); */

/* function processComments(comments) {
	$contentLinks.each(function() {
		let commentText = this.innerText || "";
		commentText = commentText.replace(/\.\.\.$/gm, "");
		let commentCreatedDate = $(this).parent().nextAll(":last-child").text();

		if (commentText && commentText != "") {
			let foundComment = comments.find(comment => {
				return comment.content.replace(/\s{2,}/, " ").startsWith(commentText) &&
					comment.created.replace(/T|\+.* /gim, " ").startsWith(commentCreatedDate);
			});

			if (foundComment) {
				$(this).parents("tr").attr("data-commentId", foundComment.id);
			}
		}
	});
} */

/**
 * Prepare delete section
 */
/* let $deleteSection = DeleteSection(System.data.Brainly.deleteReasons.comment, "comment");
let $categories = $(".categories", $deleteSection);
let $textarea = $('textarea', $deleteSection);
let $give_warning = $('#give_warning', $deleteSection);

$deleteSection.appendTo($("td", $moderateActions));

let $submitContainer = $(`
<div class="sg-spinner-container">
	<button class="sg-button-secondary sg-button-secondary--peach js-submit">${System.data.locale.common.moderating.confirm} !</button>
</div>`).insertAfter($deleteSection);
let $submit = $(".js-submit", $submitContainer); */
