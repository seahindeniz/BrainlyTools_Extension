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
			delete: "Delete",
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
			userDescription: "Description",
			changes_affected: "Changes affected",
			are_you_sure: "Are you sure?",
			yes: "Yes",
			no: "No",
			update: "Update",
			cancelEdit: "Cancel edit",
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
				update_account_error: "An unexpected error occurred while trying to update. Please try again in 2 sec",
				if_error_continue: "If this error persists, please contact with extension manager and explain what happened :)",
				userNotFound: "User not found",
				passUser: "An unexpected error occurred while trying to sending the user informations to the extension server. Please try again in 2 sec",
				extensionServerError: "An unexpected error occurred while connecting the extension server. Please try again in ~5 sec."
			}
		},
		extension_options: {
			title: "Extension Options",
			extensionManagement: "Ext. Management",
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
				unpublish: "Unpublish",
				published: "Published",
				unpublished: "Unpublished",
				draft: "Draft",
				on: "On",
				off: "Off",
				createdMessage:"Created successfully",
				updatedMessage:"Updated successfully",
				removedMessage: "Removed successfully",
				clearForm: "Clear the text inputs"
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
						//deleteButtonTooltip: "Delete",
						searchButtonTooltip: "Search",
						clearFilterButtonTooltip: "Clear filter",
						insertButtonTooltip: "Insert"
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
			warning__continue_deleting: "Are you sure you want to continue the deletion process?",
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
	}
}
