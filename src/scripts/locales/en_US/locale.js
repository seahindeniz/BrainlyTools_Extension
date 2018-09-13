System.data.locale = {
	lang: "en",
	config: {
		account_using_for_approve: "",
		reserve: "reserve",
		Deleted_account: "Deleted account",
		special_ranks_starts: 8,
		chatango: {
			for: "brainly.com",
			id: "cid0020000160005754810",
			handle: "brainlycom"
		},
		change_forum_link: {
			use_it: false,
			links: [{
				title: "",
				link: ""
			}]
		},
		quickDeleteButtonsDefaultReasons: { //Recommended 2 items at least 
			task: ["Default", "Incomplete"],
			response: ["Default", "Just For Points"],
			comment: ["Default", "Incomplete", "Incomplete"]
		}
	},
	texts: {
		globals: {
			nick: "Nick",
			rank: "Rank",
			moderator: "Moderator",
			username: "Username",
			ok: "Okay",
			save: "Save",
			cancel: "Cancel",
			choose_option: "Choose an option",
			select_all: "Select All",
			edit: "Edit",
			pause: "Pause",
			continue: "Continue",
			all_ranks: "All Ranks",
			warning__wait_for_process_done: "Wait until the process is finished and do not close the page!",
			enterId: "Profile Id",
			saving: "Saving",
			all: "All",
			all2: "All",
			accept: "Accept",
			later: "Later",
			show: "Show",
			point: "point",
			extension_user: "Extension user",
			manage_users: "Manage extension user's",
			previous_nicks: "Previous nicks:",
			previous_nicks_description: "User's previous nicks stored at extension",
			changes_affected: "Changes affected",
			errors: {
				operation_error: "An error occurred during operation. Please try again.",
				went_wrong: "Oops, something went wrong.",
				options_cant_be_same: "Options cannot be the same!",
				permission_error: {
					title: "Warning!",
					description: "Your are not authorized to use Brainly Tools extension.<br>Please contact with the Extension Manager for getting permission or remove the extension."
				},
				only_number: "Only numbers please.",
				greater_than_zero: "Enter a number above zero.",
				error_at_reason: "Incomplete operation.",
				update_account_error: "An expected error occurred while trying to update. Please try again in 2 sec.",
				if_error_continue: "If this error persists, please contact with extension manager and explain what happened :)",
				userNotFound: "User not found"
			}
		},
		extension_options: {
			title: "Extension Options",
			version_text: "Extension version: ",
			themeColor: {
				title: "Theme Color",
				description: "You can use it to change Brainly's theme color.",
				choose_color: "Choose a color",
				timer_color: "Breathing theme color",
				on_refresh_random: "Random color on refresh",
				fontColorExample: "Colors can be set in hex format. So for example, you need to specify the red color as #FF0000",
				rainbow: "Rainbow"
			},
			quick_delete_buttons: {
				title: "Quick Delete Buttons",
				description: "To set the fast delete button actions",
				task: "Questions",
				response: "Answers",
				comment: "Comments",
				button_1: "Slot 1",
				button_2: "Slot 2",
				button_3: "Slot 3",
				effects_on_refresh: "Buttons will change when the page is refreshed"
			},
			otherOptions: {
				title: "Other options"
			},
			extendMessagesLayout: {
				title: "Extended messages layout",
				description: "This option will extend the layout of the messages page. You can try it when the messages page is on"
			},
			answer_box_height: {
				title: "Answer box height",
				description: "Increase the size of the reply box.\nYou can see more content on this number."
			},
			manage_users: {
				title: "Manage extension user's",
				description: "Managing extension user's access and privileges"
			},
			announcements: {
				title: "Extension announcements",
				description: "Managing extension interval announcements",
				short_description_of_announcement: "Title(inside of notification balloon)",
				publish: "Publish",
				draft: "Draft",
				on: "On",
				off: "Off"
			},
			hide_unnecessary_contents: {
				title: "Hide unnecessary containers",
				description: "This will hide unnecessary containers that we are not use all the time"
			}
		},
		management: {
			brainly_id: "Brainly Id",
			privileges: "Privileges",
			extension_privileges: "Extension privileges",
			first_usage_date: "First time of using the extension",
			access: "Extension access",
			can_use_extension: "Allowed",
			can_not_use_extension: "Not allowed",
			comment: "Comment",
			js_grid: {
				grid: {
					noDataContent: "Not found",
					deleteConfirm: "Are you sure?",
					pagerFormat: "Pages: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} of {pageCount}",
					pagePrevText: "Prev",
					pageNextText: "Next",
					pageFirstText: "First",
					pageLastText: "Last",
					loadMessage: "Please, wait...",
					invalidMessage: "Invalid data entered!"
				},
				loadIndicator: {
					message: "Loading..."
				},
				fields: {
					control: {
						searchModeButtonTooltip: "Switch to searching",
						insertModeButtonTooltip: "Switch to inserting",
						editButtonTooltip: "Edit",
						deleteButtonTooltip: "Delete",
						searchButtonTooltip: "Search",
						clearFilterButtonTooltip: "Clear filter",
						insertButtonTooltip: "Insert",
						updateButtonTooltip: "Update",
						cancelEditButtonTooltip: "Cancel edit"
					}
				},
				validators: {
					required: {
						message: "Field is required"
					},
					rangeLength: {
						message: "Field value length is out of the defined range"
					},
					minLength: {
						message: "Field value is too short"
					},
					maxLength: {
						message: "Field value is too long"
					},
					pattern: {
						message: "Field value is not matching the defined pattern"
					},
					range: {
						message: "Field value is out of the defined range"
					},
					min: {
						message: "Field value is too small"
					},
					max: {
						message: "Field value is too large"
					}
				}
			},
			privileges_list: {
				20: {
					title: "Global > Extension admin",
					description: "Extension admin privilige"
				},
				23: {
					title: "Global > Extension announcements[Not prepared yet]",
					description: "Can manage extension internal announcements"
				},
				22: {
					title: "Mod Panel > <b>Cannot</b> delete multiple account",
					description: "Cannot delete multiple accounts in moderator panel even if user has account delete privilige"
				},
				24: {
					title: "Mod Func > <b>Cannot</b> delete multiple account",
					description: "Cannot delete multiple accounts in moderator functions even if user has account delete privilige"
				},
				1: {
					title: "Home Page > Express",
					description: "Can use express buttons in home page"
				},
				25: {
					title: "Question search > Express",
					description: "Can use express buttons in question search page"
				},
				2: {
					title: "M. All > Question express",
					description: "Can use the question express buttons in moderate all"
				},
				3: {
					title: "M. All > Answer express",
					description: "Can use the answer express buttons in moderate all"
				},
				4: {
					title: "M. All > Comment express (with selection)",
					description: "Can use the comment express buttons in moderate all"
				},
				5: {
					title: "M. All > Comment express (with buttons)",
					description: "Can use the comment express buttons in moderate all"
				},
				6: {
					title: "VUC > Question express",
					description: "Can use the question express buttons in View user content"
				},
				7: {
					title: "VUC > Answer express",
					description: "Can use the answer express button in View user content"
				},
				8: {
					title: "VUC > Answer approve",
					description: "Can use the answer approve button in View user content"
				},
				19: {
					title: "VUC > Unapprove answers",
					description: "Can use the answer unapprove button in View user content"
				},
				21: {
					title: "VUC > Mass. ask for correction",
					description: "Can use the massive ask for correction button in View user content"
				},
				9: {
					title: "Question > Question express",
					description: "Can use the question express buttons in question page"
				},
				10: {
					title: "Question > Own answer approve",
					description: "Can use the own answer approve button"
				},
				11: {
					title: "Question > Answer express",
					description: "Can use the answer express buttons in question page"
				},
				12: {
					title: "Messages > Group message",
					description: "Can use group message sending"
				},
				13: {
					title: "Messages > Highlight vulgarisms (Not being used on Brainly US)",
					description: ""
				},
				15: {
					title: "Profile > Delete all comments",
					description: "Can delete all comments in other user's profile page"
				},
				16: {
					title: "Profile > Selectable comment delete",
					description: "Can delete selected comments in other user's profile page"
				},
				17: {
					title: "Profile > Mass. approve user's answers",
					description: "Can use the massive approve user's all answers function in profile page"
				},
				18: {
					title: "Profile > Star and thank user's answers",
					description: "Can use the thank and add star user's all answers function in profile page"
				}
			}
		},
		announcements: {
			title: "Announcements",
			announcement: "Announcement",
			description: "Marked as read after you read the accouncement.",
			mark_as_read: {
				long: "Mark as read",
				short: "Read"
			}
		},
		moderate: {
			description: "Edit in moderation panel",
			take_points: {
				task: {
					title: " Take back respondents' points",
					description: "Remove the points received by the respondents, when they answered the question"
				},
				response: {
					title: "Take points back",
					description: "Take points back from user"
				}
			},
			return_points: {
				title: " Return asker's points",
				description: "Refund asker's points"
			},
			give_warning: {
				title: " Give a warning",
				description: "Delete selected contents with a warning"
			},
			moreOptions: "More Options",
			confirm: "Confirm",
			choose_reason: "Please select a reason",
			question_removed: "Question has been removed",
			do_you_want_to_delete: "Do you want to delete this content?",
			authorized_content: "Authorized content. Are you sure you want to delete it?",
			authorized_comment: "Authorized comment. Are you sure you want to delete it?",
			done_moderating: "Moderation Completed",
			answer_deleted: "Answer has been deleted",
			answers_deleted: "Answers have been deleted"
		},
		moderate_all: {
			pages: "Pages",
			comments: {
				remove: "Remove Comment",
				confirm: "Confirm Comment"
			}
		},
		answer_approve: {
			approve: "Approve",
			message__wait_for_approve: "Approving your own answer may take a little longer than usual. Please wait...",
			approved: "Approved",
			message__approved: "The answer has been approved. Verification is done through the account itself."
		},
		notes: {
			placeholder: "Add a note...",
			description: "You can add related notes to a user here",
			personal_note: "Add a personal note..."
		},
		todays_actions: "Today's actions",
		messages: "Messages",
		groups: {
			title: "Groups",
			choose_group: "Choose a group",
			add_group: "Add group",
			edit_group: "Edit group",
			group_added: "Group added",
			dbl_click_for_edit_title: "Double-click to change the title",
			save_changes: "Save changes",
			changes_saved: "Changes saved",
			delete_group: "Delete group",
			do_you_want_to_delete_group: "Do you want to delete this group?",
			group_deleted: "Group has been deleted",
			search_except_friends: "To add group members, type their username and click on the ${search_icon} icon. Find their username below and slide their username card into the right panel.",
			enter_username: "Enter username or ID number",
			dont_forget_save: "To remove a group member, slide their card into the left panel. Remember to save any changes that you make to the list or group name.",
			group_members: "Group members",
			enter_group_title: "Enter group title...",
			loading: "Loading...",
			group_list: "Group list",
			type_here: "Write your message here",
			character_count: "Character count: ",
			char_limit_exceeded: "Your message has exceeded the 512 character limit.",
			send: "Submit",
			supervisors: {
				table_view: "Table view",
				send_bulk_messages: "Send bulk message",
				send_message_to_listed_accounts: "Send message to listed accounts",
				multiple_selection_with_ctrl: "You can choose multiple rank using with CTRL key",
				press_show_for_listing: "Click \"Show\" for listing",
				selected: "Selected",
				export_as_csv: "Export as CSV"
			}
		},
		profile: {
			give_stars_to_all_answers: "Star all your answers",
			give_stars_and_add_thanks_to_all_answers: "Star and thank user's answers",
			approve_all_answers: "Approve user's answers",
			explaining_on_start: "Refresh the page to repeat the process.",
			explaining_on_pause: "You can continue where you left off. Saved intervals are set at every 25 completions.<br>For example, if you paused at 132, you will continue off at 125.",
			paused: "Paused",
			its_done: "Completed",
			processed: "Processed",
			approving: "Approved",
			see_more_comment: "Show more comments",
			delete_comments: "Delete profile comments",
			how_many_comments_should_delete: "How many comments do you want to delete?",
			how_many_comment_fetch: "How many comments to do you want to show?",
			explaining_how_many: "For example, if you would like to take action with or view the past fifty comments, type 50.",
			do_you_want_to_delete_comments: "Are you sure you want to delete the comments?",
			warning__no_turning_back: "There is no turning back.",
			n_comments_deleted: "${n} comments have been deleted",
			are_you_sure: "Are you sure?",
			yes: "Yes",
			no: "No",
			delete_selected_comments: "Delete selected comments",
			select_at_least_one_comment: "You must select at least one comment",
			show_all_friends: {
				title: "Show all",
				description: "List your all friends",
				warning__no_friends_to_show: "You have no friends to show"
			},
			remove_all_friends: "Remove all your friends",
			deleting_friends: {
				remove_all_friends: "Remove all friends",
				on_pause_message: "You can continue where you left off.",
				on_start_message: "Refresh the page to reset the progress.",
				delete_selected_friends: "Unfriend selected friends",
				delete_selected_friends_title: "You can unfriend selected friends.",
				select_at_least_one_friend: "You must select at least one friend",
				warning__are_you_sure_delete_selected_friends: "Are you sure you want to unfriend selected friends?",
				warning__are_you_sure_delete_all_friends: "Are you sure you want to remove all of your friends?",
				n_deleted: "${n} people removed from your friendship list"
			},
			delete_account: {
				delete_reason: "Reason of deletion",
				evidences: "Evidences",
				cm_explain: "will send to the Community Manager",
				more_details: "More details..",
				add_files: "Add files",
				are_you_sure: "Are you sure you want to delete this account?",
				file_size_limit_exceeded: "File size limit exceeded (250MB)",
				uploading: "Uploading",
				processing: "Processing",
				mail_sent: "Mail has been sent",
				upload_failed: "File(s) could not be uploaded",
				mail_failed: "Mail could not be sent",
				continue_deletion: "Do you still want to delete this account?(you'll have to report this progress by yourself)",
				lnk_file_warn: "The thing you are trying to add is not an actual file. Its a file shortcut.\nDo you still want to add it?"
			},
			rank_appended: "Rank appended to user",
			edit_users_profile: {
				title: "Edit user's profile",
				email: "E-Mail",
				nickname: "Nickname"
			},
			confirm_for_add_moderator: "Do you wanna add this account as a moderator?",
			moderator_privileges_added: "Account added as a moderator\nChanges will affect in 3 minutes"
		},
		user_content: {
			select: "Select",
			remove_answer: "Remove selected content",
			select_a_question_first: "Select some question(s) first",
			select_an_answer_first: "Select some answer(s) first",
			warning__reason_not_selected: "Reason for deletion has not been specified",
			warning__more_than_5_question_selected: "Over 5 questions are selected.",
			warning__more_than_5_answer_selected: "Over 5 answers are selected.",
			warning__continue_deleting: " Are you sure you would like to continue the deletion process?",
			approve_selected_answers: "Approve selected answers",
			unapprove_selected_answers: "Unapprove selected answers",
			remove_selected_answers: "Remove selected answers",
			correction_for_selected_answers: "Ask for correction on selected answers",
			warning__before_approving_review_the_answer_first: "Before action is taken, please review the content first.",
			show_content: "Show user content",
			range_of_listing: "Range number of content listing"
		},
		user_warnings: {
			operations: "Operations",
			undo: "Undo",
			message__if_you_have_privileges: "Warning has been revoked if you have authority."
		},
		delete_accounts: {
			delete_multiple_accounts: "Delete multiple accounts",
			add_accounts_line_by_line: [
				"You need to put accounts line by line.",
				"Example;",
				"https://brainly.com/profile/aaa-1234567",
				"https://brainly.com/profile/bbb-2345678",
				"1234567",
				"2345678"
			],
			matched_accounts_number: "Will be delete:",
			deleted_accounts_number: "Deleted accounts:",
			accounts_cannot_be_deleted_number: "Cannot delete:",
			already_deleted_accounts_number: "Already deleted:",
			delete_reason: "Reason",
			delete: "Delete !",
			are_you_sure: "Are you sure you want to delete?",
			button__delete_accounts: "Delete accounts!",
			error_during_deletion: "An error occurred while deleting the {nick} account"
		},
		moderating_functions: {
			compare_moderators_ip_address: {
				title: "Compare all moderators IP address",
				information: [
					"Lets clear something :)",
					"Moderators can be share their passwords to another moderator or maybe they're connected to the same internet location or maybe they are <b>siblings</b>"
				],
				moderators: "Moderators",
				matched_moderators: "Matched moderators",
				confirm__multiple_accounts_will_be_processed: "Too many accounts will be processed and it will take a while.\nDo you want to continue?"
			}
		},
		archive: {
			export: {
				title: "Export questions links as CSV",
				range_of_page_numbers: "Range of page numbers",
				scan: "Scan",
				processed_page_count: "Proccessed pages",
				elapsed_time: "Elapsed time",
				ranges_cannot_be_empty: "Ranges cannot be empty",
				wrong_ranges: "Ranges are not valid",
				csv_file_compatible_with_google_spreadsheet: "CSV file compatible with Google Spreadsheet"
			}
		},
		notifications: {
			x_send_you_a_new_message: "{x} send you a new message",
			new_notify: "New notification"
		}
	},
	rules: {
		question: {
			warnings: [],
			contents: {
				Default: {
					title: "Default",
					reason: "Uh oh. Your question has been removed. Please review the Terms of Use and thanks for sticking to our posting guidelines!",
					code: 22
				},
				Incomplete: {
					title: "Incomplete",
					reason: "Aw snap! We really want to help you out, but it looks like your question is incomplete. Please repost and include all helpful information, so other user's can get back to you with the best answer. Thanks!",
					code: 1
				},
				Not_a_School_Problem: {
					title: "Not a School Problem",
					reason: "#Yikes. Looks like your question is not school-related. Please repost with only school-specific problems. Thanks!",
					code: 1
				},
				Unclear_Question: {
					title: "Unclear Question",
					reason: "We're really sorry, but we just can't figure out what you are asking. Please repost and try to be as specific and detailed as possible, so we can get back to you with the best answer. Thanks!",
					code: 1
				},
				Too_Trivial: {
					title: "Too Trivial",
					reason: "We're all about challenging our user's to push their intellectual boundaries. Your question, while much appreciated, seems just a bit too trivial for the site. Please try to post more difficult questions in the future. Thanks!",
					code: 1
				},
				Test_Preparation: {
					title: "Test Preparation",
					reason: "Sorry, we wish we could help you out with all of life's biggest challenges, but Brainly is all about helping you learn to work through specific academic-related problems, so that you can tackle them on your own out there. Therefore, questions about how to prep for that big exam are not permitted. Thanks for your cooperation!",
					code: 1
				},
				Silly_Pointless_Question: {
					title: "Silly/Pointless Question",
					reason: "We love a sense of humor, but please save the comedy act for another forum. Your schoolwork-related questions really help to improve the content and overall quality of Brainly. So follow the rules, ask solid questions and, of course, have fun!",
					code: 1
				},
				Essay_or_Project: {
					title: "Essay or Project",
					reason: "Your question about your assignment was removed because it was too complex - you'll need to complete this project on your own, rather than asking other Brainly user's to write your response for you. But, feel free to repost any specific questions you have about the assignment that can help you get started!",
					code: 1
				},
				Too_General: {
					title: "Too General",
					reason: "Say whaaa? Unfortunately, your question is not clear or too general for your fellow Brainiacs to answer. The site is designed to give specific answers to specific academic questions. Please add some details to your question so we can get back to you! Thanks!",
					code: 1
				},
				Not_English: {
					title: "Not English",
					reason: "Hi! Hola! Salut! Hallo! Looks like you've posted a question not in English. Please stick to proper English or check out our other language versions of Brainly. Thanks! Gracias! Merci! Danke!",
					code: 8
				},
				Multiple_Posting: {
					title: "Multiple Posting",
					reason: "Either we're seeing double or this question has already been asked. Since it's posted twice, we had to remove it. Sorry about that, but please post a new question!",
					code: 22
				},
				Link_in_Question: {
					title: "Link in Question",
					reason: "Let's keep this between us. Please don't include external links that could lead us to the furthest reaches of the internet. It can get unruly, but moreover, this violates our Terms of Use. Thanks for adhering to Brainly's posting guidelines!",
					code: 22
				},
				Missing_Info_or_Attachment: {
					title: "Missing Info or Attachment",
					reason: "Oops! Looks like your question is missing some information needed to properly answer it. Help us help you. Please repost  your question with all necessary info and attachments. Thanks!",
					code: 22
				},
				Too_Complex: {
					title: "Too Complex",
					reason: "Whoa there! Turns out there is such as a thing as too much of a good thing. Your questions are great, but there are just too many all rolled into one. Please post your questions individually to get the best answers. Thanks!",
					code: 22
				},
				Personal_Information: {
					title: "Personal Information",
					reason: "Your question was removed because it’s not safe to share or ask for personal information online. Keep information like your real name, school name, social media usernames, and selfies to yourself!",
					code: 22
				},
				Brainly_Related_Question: {
					title: "Brainly-Related Question",
					reason: "Looks like you've asked a question about how to use Brainly! As Brainly is only intended for help with school-related questions, instead, be sure to check out our help site to see if your question has been answered here: faq.brainly.com. If you still need help, send us a message here: https://brainly.com/contact/index and we'll reply very soon!",
					code: 22
				}
			}
		},
		answer: {
			warnings: [],
			contents: {
				Copied_From_Another_Source: {
					title: "Copied From Another Source",
					reason: "Your answer has been removed because plagiarism is serious business. Remember that it is forbidden to post any content from another website, person or source. Besides, we know you can do it on your own. Thanks!",
					code: 16
				},
				Link_in_Answer: {
					title: "Link in Answer",
					reason: "Is that yours? Please don't include any links in your answers, even to cite sources. We ask that your answers be original and in your own words. Thanks!",
					code: 16
				},
				Copied_from_Another_User: {
					title: "Copied from Another User",
					reason: "Be cool. Be original. It looks like your answer may have been copied from another user. Copying answers is a direct violation of our Terms of Use. Keep your account in good standing and post answers in your own words. Thanks!",
					code: 16
				},
				Not_English: {
					title: "Not English",
					reason: "Hello there! It seems like you posted an answer which is not in a language that is recognized by most Brainly user's. Please remember to always use proper English, or use a Brainly version in your language. Thanks!",
					code: 20
				},
				Not_Clear_or_Answer_Did_Not_Answer_Specific_Question: {
					title: "Not Clear or Answer Did Not Answer Specific Question",
					reason: "(Head scratch). We're sorry, but it looks like your answer is unclear, has nothing to do with the question, or did not specifically answer the question being asked. We know you were excited to answer, so please try again. Thanks!",
					code: 21
				},
				Uninformative: {
					title: "Uninformative",
					reason: "Not so fast...Your answer does not provide any work or examples as to why it is right. Always show your work and include any information that may be helpful to your peers. This is the only way they'll be able to learn how to tackle the problem on their own in the future. Thanks!",
					code: 21
				},
				Mistakes_in_Answer: {
					title: "Mistakes in Answer",
					reason: "Aw shucks! Looks like there are some mistakes in your answer. Please recheck your work and answer and try again. Second time's a charm! Thanks!",
					code: 21
				},
				No_Calculations: {
					title: "No Calculations",
					reason: "Brainly is all about giving students the tools they need to tackle future problems on their own, so it's important to show your work and explain how you reached your answer. Thanks for helping others and keep up the great work!",
					code: 21
				},
				Incomplete_Answer: {
					title: "Incomplete Answer",
					reason: "Hey there, your answer has been deleted because it was incomplete or missing some crucial information. After all, it just isn't quite a burger without the bun, right? Please repost and include all necessary info and details. Thanks!",
					code: 21
				},
				Spam_Answer: {
					title: "Spam Answer",
					reason: "Please don't post unhelpful answers - keep Brainly's answer quality high! If you contribute quality answers to Brainly, you'll earn more points and help others learn. Check out what makes a great answer here: http://finest.brainly.com/answeringguidelines/",
					code: 21
				},
				I_Dont_Know: {
					title: "I Don't Know",
					reason: "Whoa there, Brainiac! Telling someone that you’re not sure how to answer their question isn’t very helpful to them, and Brainly’s Answer section is intended for genuine attempts at answering the question. Next time, just move on to another question you can answer. Also, be sure to “follow” this question if you’re interested in learning the answer from other posters.",
					code: 21
				},
				Just_For_Points: {
					title: "Just For Points",
					reason: "Not so fast… answering just to get the points isn’t cool. Your goal is to provide a helpful and specific answer to earn those points, and to help the asker learn how to do this problem on their own! Plus, you’ll lose the points again when your unhelpful answer is removed by a moderator. Learn more about providing helpful answers here: http://finest.brainly.com/answeringguidelines/",
					code: 21
				},
				Default: {
					title: "Default",
					reason: "We love the rebel in you, but please don't violate our Terms and Conditions. Your answer has been removed, but please review our posting guidelines and repost your answer. Thanks!",
					code: 23
				},
				Question_About_Question: {
					title: "Question About Question",
					reason: "Not to be total neat freaks, but please use the comments section to ask about questions. The \"Answer\" feature is designed for posting answers you're sure about and can respond to specifically. Thanks!",
					code: 23
				},
				Comment_or_Advice: {
					title: "Comment or Advice (Not an Answer)",
					reason: "Answers? Comments? They fall under two different categories here on Brainly. If you'd like to comment on a question or give advice, please use the \"Comments\" section, rather than post it as an answer. You can also use the private messaging feature or post on a user's public board as well. Thanks!",
					code: 23
				},
				Please_Be_Nice_to_Other_users: {
					title: "Please Be Nice to Other user's",
					reason: "Not cool. We have a zero tolerance policy for cyber bullying or being mean to other user's on Brainly. We are a welcoming and friendly place where awesome students come to learn from other awesome students, so be nice! If you continue to break the golden rule, we will delete your account and you will be banned from using Brainly.",
					code: 23
				},
				Google_It_or_Search_for_Answer: {
					title: "Google It or Search for Answer",
					reason: "Hey Brainiac! Members are looking to you for complete and accurate answers, so sending them to Google or another search engine just isn't very helpful. Help out your fellow students and post complete and direct answers in your own words. Thanks!",
					code: 23
				},
				Personal_Information: {
					title: "Personal Information",
					reason: "Your answer was removed because it’s not safe to share or ask for personal information online. Keep information like your real name, school name, social media usernames, and selfies to yourself!",
					code: 23
				}
			}
		},
		comment: {
			warnings: [],
			contents: {
				Default: {
					title: "Default",
					reason: "Your comment violates our Terms of Use, so we had to take it down. Please review the terms and thanks for being a team player!",
					code: 5
				},
				Please_Be_Nice_to_Other_users: {
					title: "Please Be Nice to Other user's",
					reason: "If you wouldn't want your mom to see it, don't post it! We have a zero tolerance policy for cyberbullying or general meanness on Brainly. Just don't do it. If you continue to break this golden rule, your Brainly account may be banned. Thanks for being cool and keeping Brainly awesome!",
					code: 5
				},
				Not_English: {
					title: "Not English",
					reason: "Hi! Hola! Salut! Hallo! Looks like you've posted a comment not in English. Please stick to proper English or check out our other language versions of Brainly. Thanks! Gracias! Merci! Danke!",
					code: 5
				},
				Link_in_Comment: {
					title: "Link in Comment",
					reason: "Whoops! Your comment was removed because it contained a link. Please keep in mind that links to other sites/sources are not allowed. Thanks!",
					code: 5
				},
				Question_Posted_as_a_Comment: {
					title: "Question Posted as a Comment",
					reason: "Uh oh, looks like you've posted your question as a comment. Please remember to use the \"Ask a Question\" feature for asking questions. Comments are only for asking for clarification or more information. Thanks!",
					code: 5
				},
				Personal_Information: {
					title: "Personal Information",
					reason: "Your comment was removed because it’s not safe to share or ask for personal information online. Keep information like your real name, school name, social media usernames, and selfies to yourself!",
					code: 5
				},
				Answer_in_Comment: {
					title: "Answer in Comment",
					reason: "Uh oh, looks like you've posted your answer as a comment. Comments are for asking about the question. Please use the \"Answer\" option to post your solutions, so other user's can learn and you can earn points. Thanks!",
					code: 15
				}
			}
		},
		account: [{
			title: "Reason 1",
			reason: "Put a delete reason in here"
		}, {
			title: "Reason 2",
			reason: "Put a delete reason in here too.."
		}]
	}
}
