export default {
  common: {
    extensionUser: "Extension user",
    selectAll: "Select All",
    progressing: "Progressing",
    done: "Done!",
    allDone: "All done!",
    save: "Save",
    clearInputs: "Clear text inputs",
    delete: "Delete",
    confirm: "Confirm",
    deleteN: "Delete %{number_of_contents}",
    confirmed: "Confirmed",
    deleted: "Deleted",
    edit: "Edit",
    profileID: "Profile ID",
    profileLinksOrIds: "Profile links or IDs",
    nick: "Nick",
    moderator: "Moderator",
    date: "Date",
    show: "Show",
    remove: "Remove",
    select: "Select",
    start: "Start",
    startAll: "Start all",
    stop: "Stop",
    continue: "Continue",
    no: "No",
    shortPoints: "pts",
    writeSomething: "Write something",
    userHasNoPrivilege: "User has no privileges",
    nUsers: "%{n} users",
    nIds: "%{n} IDs",
    nNotFound: "%{n} not found",
    removeAll: "Remove all",
    notificationMessages: {
      operationError: "An error occurred during operation. Please try again",
      somethingWentWrong: "Oops, something went wrong",
      somethingWentWrongPleaseRefresh: "Something happened, please refresh the page",
      cannotShareUserInfoWithServer: "An unexpected error occurred while trying to communicate with extension's server. Please try again in ~2 seconds.",
      ongoingProcess: "Some contents are still being processed. Do you still want to exit the page?",
      areYouSure: "Are you sure?",
      mayRequireWarning: "Do you want to apply a warning to this content?",
      ongoingProcessWait: "Some contents are still being processed. Please wait until this process is finished.",
      xSendYouANewMessage: "%{userName} sent you a new message",
      newNotification: "New notification",
      operationCompleted: "Operation completed",
      unsavedChanges: "You have some unsaved changes. Do you still want to close?",
      youNeedToSelectAtLeastOne: "You need to select at least one",
      cannotShareUserInfoWithServer_RefreshPage: "An unexpected error occurred while trying to communicate with extension's server. Please refresh the page.",
      operationErrorRefresh: "An error occurred. Please refresh the page and try again."
    },
    moderating: {
      moreOptions: "More Options",
      moderate: "Moderate",
      doYouWantToDelete: "Do you want to delete this content?",
      selectContentType: "Please select a content type",
      selectReason: "Please select a reason",
      editInPanel: "Edit in moderation panel",
      point: "point",
      returnPoints: {
        text: "Don't give points back",
        title: "Don't give the points back to the user"
      },
      giveWarning: {
        text: "Give a warning",
        title: "Delete selected contents with a warning"
      },
      approve: "Verify",
      approved: "Verified",
      unapprove: "Unverify",
      unapproved: "Unverified",
      doYouWantToDeleteWithReason: "Are you sure you want to delete this content?\n\n%{reason_title}:\n%{reason_message}",
      takePoints: {
        question: {
          text: "Take back respondents' points",
          title: "Remove the points received by the respondents when they answered the question"
        },
        answer: {
          text: "Take points back",
          title: "Take points back from user"
        }
      },
      contentAuthorIsModerator: "\"%{content_author}\" has moderation powers.\nPlease moderate this from the panel.",
      contentAuthorHasSpecialRanks: "\"%{content_author}\" has the \"%{special_rank}\" rank and might be someone important.\nPlease moderate this from the panel."
    },
    personalNote: {
      text: "Personal note",
      title: "Add a private note specific to this user and only visible to you",
      clickToAddANote: "Click to add a note"
    },
    users: "Users",
    listOfIds: "List of IDs",
    deleting: "Deleting",
    pointsWithExample: {
      text: "Points: (1 or -1)",
      title: "Add points with positive numbers (123) or remove points with negative numbers (-123)."
    },
    showMore: "Show more",
    userHasNPoints: "User has %{n} points",
    send: "Send",
    deleteAll: "Delete all",
    ok: "OK",
    cancel: "Cancel",
    optional: "OPTIONAL",
    add: "Add",
    chooseAnOption: "Choose an option",
    deleteAcross: "Delete across",
    profileLinkOrId: "Profile link or ID",
    beta: "Beta",
    deletedUser: "Deleted user",
    toggleSelections: "Toggle selections",
    copied: "Copied!",
    default: "Default",
    yes: "Yes",
    workingOnIt: "Working on it...",
    seeMoreDeletionReasons: "See more deletion reasons",
    deletedAccount: "Deleted account",
    warnings: "Warnings",
    banUser: {
      ban: "Ban",
      tutorial: "Tutorial",
      nMinutes: "%{n} minutes",
      nHours: "%{n} hours",
      currentBan: "Current ban",
      appliedBy: "Applied by"
    }
  },
  popup: {
    notificationMessages: {
      shortLinkSuccessMessage: "Copied to clipboard!",
      languageChanged: "Language changed",
      cannotFindUser: "Couldn't find the user with the entered ID number",
      createdMessage: "Created successfully",
      updatedMessage: "Updated successfully",
      removedMessage: "Removed successfully",
      published: "Published",
      unpublished: "Unpublished",
      layoutExtended: "Layout extended",
      switchedToNormal: "Switched back to normal",
      notifierOn: "Notifier active",
      notifierOff: "Notifier closed",
      idNumberRequired: "You need to enter an ID number",
      invalidId: "Invalid ID number",
      pleaseWait: "Please wait",
      openABrainlyPage: "You need to open a Brainly page in your browser",
      errorN: "Error %{error_code}",
      preparingUnsuccessful: "An error occurred while preparing the delete reasons and fetching from Brainly",
      noEvidenceFound: "Moderator didn't add any evidence nor comment",
      doYouWannaGiveThisPrivilege: "Do you want to give this privilege to all extension users?",
      doYouWannaRevokeThisPrivilege: "Do you want to revoke this privilege from all extension users?",
      privilegeHasGiven: "Privilege has been given to %{user_amount} users",
      privilegeHasRevoked: "Privilege has been revoked from %{user_amount} users",
      iCantFetchMarketData: "Unable to fetch market data",
      incorrectData: "I can't communicate with %{market_domain_name}.\n\nPlease visit any %{market_domain_name} page or refresh the page if it's already open."
    },
    createShortLinkButton: {
      text: "Shorten URL",
      title: "Create a short link for this web page"
    },
    shortenedLinks: {
      text: "Shortened Links",
      originalURL: "Original URL",
      created: "Created",
      shortURL: "Short URL",
      allClicks: "All Clicks",
      searchURL: "Search URL"
    },
    extensionOptions: {
      title: "Extension Options",
      themeColor: {
        title: "Theme Color",
        setYourColor: "Set your color",
        rainbow: "Rainbow",
        pickAColor: "Pick a color",
        colorFormatInfo: "You can set the theme color with hex codes (ex. #FF0000 for red)."
      },
      quickDeleteButtons: {
        text: "Quick Delete Buttons",
        title: "Change the deletion reasons of the quick delete buttons",
        comment: "Comment",
        question: "Question",
        answer: "Answer"
      },
      otherOptions: {
        title: "Other Options",
        extendMessagesLayout: {
          text: "Expand messages layout",
          title: "This option will extend the layout of the messages page. You can try it when the messages page is open."
        },
        extensionLanguage: {
          text: "Extension language",
          chooseLanguage: "Select a language"
        },
        notifier: {
          text: "Browser notifications",
          title: "Extension will toast a notification you when you have a new message or new notification on Brainly"
        }
      }
    },
    extensionManagement: {
      title: "Ext. Management",
      users: {
        title: "You can set the extension user's permission and privileges",
        changeUserPrivileges: "Change all users' privileges",
        revoke: "Revoke",
        give: "Give",
        addNewOrEditUser: "Add or edit an extension user",
        permission: "Access permission",
        privileges: "Privileges",
        firstUsageTimeAgoPreTitle: "Started to use %{time}",
        hasntUsed: "User hasn't used the extension yet",
        important: "Important",
        lessImportant: "Less important",
        harmless: "Harmless",
        explainingColors: {
          line1: "Some users have colored border in their avatars and this colors shows their access permission status of the extension.",
          line2: "<s>Red</s> border means that shown user is banned from the extension.",
          line3: "<s>Mustard</s> border means that the user has the permission to use the extension but hasn't started to use it yet",
          line4: "<s>Green</s> color means the user is an active authorized user.",
          line5: "<s>No border</s> means that user has some privileges assigned but not the permission to use the extension in their account and hasn't started to use the extension yet."
        },
        privilegeList: {
          0: {
            title: "Extension admin",
            description: "Can use the extension without any restriction. (No need to assign any other privileges, this will remove all restrictions)"
          },
          1: {
            title: "Quick delete questions",
            description: "On question pages, Moderate All, and the homepage, user can use the quick delete buttons for deleting questions"
          },
          2: {
            title: "Quick delete answers",
            description: "On question pages, Moderate All, and the homepage, user can use the quick delete buttons for deleting answers"
          },
          4: {
            title: "Announcement management",
            description: "Can create, edit, remove or publish the internal extension announcements"
          },
          5: {
            title: "Manage extension users",
            description: "Can add or edit the extension users and give them privileges or permission to use the extension"
          },
          6: {
            title: "Verify answers by selecting",
            description: "On the user contents page, the moderator can verify answers by selecting up to 25 answers on each page"
          },
          7: {
            title: "Mass-Content deleter",
            description: "In the moderation panel, user can use this function for deleting multiple questions/answers/comments from Brainly"
          },
          8: {
            title: "Group messages",
            description: "In the messages page, user can send private messages to multiple users in a group at once"
          },
          9: {
            title: "Mass-Message sender",
            description: "In the moderation panel, user can use this function for sending a private message to all users of your market"
          },
          10: {
            title: "Supervisors page, Message sender",
            description: "In the supervisors page, user can send a private message to listed moderators or all moderators of your market"
          },
          11: {
            title: "Deletion reasons preferences management",
            description: "Can set warning level of deletion reasons"
          },
          12: {
            title: "User deletion reports",
            description: "In the extension options, user can see account deletion reports"
          },
          13: {
            title: "Mass-Point changer",
            description: "In the moderation panel, user can change user's points by their IDs"
          },
          14: {
            title: "Selective question deletion",
            description: "On the user contents and question searching page, user can use the selective deletion function to delete selected questions"
          },
          15: {
            title: "Selective answer deletion",
            description: "On the user contents page, user can use the selective deletion function to delete selected answers"
          },
          16: {
            title: "Selective comment deletion",
            description: "On the user contents page, user can use the selective deletion function to delete selected comments"
          },
          17: {
            title: "Reported comments deleter",
            description: "User can use this function to delete all the reported comments from Moderate all"
          },
          18: {
            title: "Mass-Moderate reported contents",
            description: "User can use this tool to mass-moderate reported contents from the Reported contents page"
          },
          19: {
            title: "Selective ask for correction",
            description: "On the user contents page, user can use the selective ask for correction to report answers"
          },
          20: {
            title: "Noticeboard management",
            description: "Can edit noticeboard content"
          },
          21: {
            title: "View users' privileges",
            description: "User can see extension privileges of other extension users without making changes"
          },
          22: {
            title: "Can change access permission",
            description: "User can manage permissions to use the extension"
          },
          23: {
            title: "Can change important privileges",
            description: "User can assign/revoke important privileges to other extension users"
          },
          24: {
            title: "Can change less important privileges",
            description: "User can assign/revoke less important privileges to extension users"
          },
          25: {
            title: "Can change harmless privileges",
            description: "User can assign/revoke harmless privileges to other extension users"
          },
          26: {
            title: "Selective question deletion (Multiple pages)",
            description: "On the question searching page, user can use the selective deletion function to delete selected questions from multiple pages at once"
          },
          27: {
            title: "Mass-Manage users",
            description: "User can use this function to manage users in bulk such as changing points, approving answers of users, etc."
          },
          28: {
            title: "Action history reviewer",
            description: "Ability to review other moderators' actions as valid or invalid and let them know about their mistakes from the moderator actions history page"
          },
          45: {
            title: "Quick delete comments",
            description: "On question pages and Moderate All, user can use the quick delete buttons for deleting comments"
          },
          29: {
            title: "Mass-Moderate contents",
            description: "User can use this function to moderate contents in bulk"
          },
          30: {
            title: "Verify all answers",
            description: "User can use this function to approve all answers of users in bulk by providing a list of profile links/IDs"
          },
          31: {
            title: "Delete users",
            description: "User can use this function to delete users in bulk by providing a list of profile links/IDs"
          },
          32: {
            title: "Change points",
            description: "User can use this function to change points of users in bulk by providing a list of profile links/IDs"
          },
          33: {
            title: "Change ranks",
            description: "User can use this function to change ranks of users in bulk by providing a list of profile links/IDs"
          },
          36: {
            title: "Content delete options on profile page",
            description: "Allow this moderator to mass-delete all questions, answers, and/or comments from the profile page of a user"
          },
          99: {
            title: "Reported contents (Beta)"
          },
          37: {
            title: "Moderate Panel > Delete all comments",
            description: "Ability to delete comments in bulk from the moderate panel"
          },
          38: {
            title: "Confirm reported answer button",
            description: "Allow moderator to use the confirm button to confirm/accept reported answers instead of verifying"
          },
          39: {
            title: "Action history review management",
            description: "Ability to revert other reviewers' reviews on moderation history of moderators. Without this, reviewers can only revert their own reviews"
          },
          98: {
            title: "Limited channel access on Discord",
            description: "User will not see any channels other than #announcements and #rules on the Discord server"
          },
          40: {
            title: "Unverify answers by selecting",
            description: "On the user contents page, the moderator can unverify answers by selecting 25 answers max- on each page"
          },
          41: {
            title: "Mass-Confirm reported contents",
            description: "User can use this tool to only mass-confirm reported contents from the Reported contents page"
          },
          42: {
            title: "Mass-Delete reported questions",
            description: "User can use this tool to only mass-delete reported questions from the Reported contents page"
          },
          43: {
            title: "Mass-Delete reported answers",
            description: "User can use this tool to only mass-delete reported answers from the Reported contents page"
          },
          44: {
            title: "Mass-Delete reported comments",
            description: "User can use this tool to only mass-delete reported comments from the Reported contents page"
          }
        },
        veryImportant: "Very important"
      },
      announcements: {
        text: "Announcements",
        addNewAnnouncement: "Add a new announcement",
        editorTitle: "Title",
        editorContent: "Content",
        cancelEdit: "Cancel edit",
        update: "Update",
        publish: "Publish",
        unpublish: "Unpublish",
        readOn: "Read on:\n%{date}"
      },
      DeleteReasonsPreferences: {
        text: "Delete reasons preferences",
        withoutAsk: "Give warning without asking for confirmation",
        withAsk: "Show warning confirmation dialog when deleting content",
        findReason: "Find a reason",
        explaining: {
          line1: "You can find deletion reasons by typing the name of the reason",
          line2: "After selecting a deletion reason, you can click the %{exclamation-circle} button to give a warning without asking for confirmation from moderators when they are deleting content. You can also click the %{exclamation-triangle} button to show a confirmation dialog to moderators when they are deleting content before giving a warning."
        }
      },
      accountDeleteReports: {
        text: "Account deletion reports",
        download: "Download",
        playOrPause: "Play/Pause",
        byModerator: "By moderator",
        byDeletedAccount: "By deleted account"
      }
    }
  },
  core: {
    assignExtensionPermission: "Assign extension permission",
    notificationMessages: {
      cantFetchDeleteReasons: "An unexpected error occurred while trying to prepare deletion reasons",
      searching: "Searching...",
      userNotFound: "User not found",
      extensionServerError: "An unexpected error occurred while connecting to the extension server. Please try again in ~5 seconds.",
      ifErrorPersists: "If this error persists, please contact the extension manager.",
      accessPermissionDenied: "You are not authorized to use Brainly Tools.\nPlease contact the Community Manager or another administrator to receive permission.",
      updateNeeded: "A new version of the extension is available and will be installed in the background.\nPlease wait ~10 seconds and refresh this page.",
      warningBeforeDelete: "This process will be executed and the questions in the input will the deleted.\nAre you sure you wish to continue?",
      enterIdWarn: "You need to add at least 1 ID number of that you wish to delete",
      youNeedToEnterValidId: "You need to enter a valid ID number",
      tryingToSendTheSameMessage: "You're trying to send the last message again. Do you still want to send?",
      alreadyStarted: "Process has already started",
      pointsAdded: "Points added",
      doYouWantToContinue: "Do you want to continue?",
      couldntAbleToGetNoticeBoardContent: "An error occurred while retrieving the contents of the noticeboard.",
      changesMayNotBeSaved: "Changes you've made may not be saved",
      stillProcessing: "This section is still in process. Do you want to remove this block?\n(this will stop the moderating process)",
      youNeedToChooseActionType: "You need to choose an action type",
      errorOccurredWhileDeletingTheN: "An error occurred while deleting the %{content_id}",
      clickHereToSeeTheChangelog: "Click here to see the changelog"
    },
    MassContentDeleter: {
      text: "Mass-Content deleter",
      nIdsToDeleted: "%{n} ID(s) to delete",
      nHasBeenDeleted: "%{n} ID(s) have been deleted",
      containerExplanation: "Enter or paste content links or IDs in the text box. Each line should contain 1 ID number or link.",
      select: {
        reason: "Reason",
        subReason: "Sub reason",
        action: "Action"
      }
    },
    MessageSender: {
      text: "Mass-Message sender",
      lastRegisteredUserId: "Enter last registered user ID",
      information: "This function can send a message to all users by counting backwards from the given ID. Once you've started the process, please don't close this tab or your browser/computer until the process is finished.",
      target: "Target",
      allUsers: "All users",
      moderators: "Moderators",
      startOver: "Start over",
      sent: "Sent",
      usersNotFound: "Users not found",
      errors: "Errors",
      unknownError: "Unknown error",
      somethingWentWrongWhileLoadingModerators: "Something went wrong while fetching details of moderators"
    },
    announcements: {
      text: "Announcements",
      title: "Once you've read the announcement, mark it as read",
      markAsRead: "Mark as read"
    },
    pointChanger: {
      text: "Mass-Point changer",
      enterOrPasteUID: "Enter or paste user profile IDs",
      youNeedToEnterOrPaste: "You need to enter user ID or you can paste copied list of user ID(s) into input",
      pastingExample: "Example list of users ID(s)",
      pastingExample2: "Also, you can specify the points in the list before copy pasting",
      addPoints: "Add points to this user",
      addPointsToAll: "Add points to all users",
      pointsNotSpecified: "You must give points to at least 1 user in order to proceed",
      applyPointsToAllInputs: "Edit all values",
      clearList: "Clear list"
    },
    reportedCommentsDeleter: {
      text: "Reported comments deleter",
      description: "You can delete all reported comments in Moderate All with one click. Just start the process and leave this tab open.",
      stopped: "Stopped",
      numberOfPending: "Pending",
      selectAReason: "Select a reason"
    },
    noticeBoard: {
      text: "Noticeboard",
      lastChanges: "Last updated",
      readBy: "Read by"
    },
    massManageUsers: {
      notificationMessages: {
        doYouWantToRemoveSelectedUsers: "Do you want to remove selected users from the list?",
        doYouReallyWantToRemoveAllUsers: "Do you really want to remove all users from the list?",
        tryingToAddPreviouslyRemovedIds: "The IDs you've entered contain previously removed IDs.\n\nClick \"OK\" if you want to add or\nclick \"Cancel\" if you want to exclude.",
        areYouSureAboutDeletingAllListedUsers: "You are about to delete all listed users.\n\nAre you sure you wish to continue?",
        thereIsNoUserLeft: "There is no user left in the list"
      },
      text: "Mass-Manage users",
      removeSelected: "Remove selected",
      removeSelectedUsersFromTheList: "Remove selected users from the list",
      removeAllUsersFromTheList: "Remove all users from the list",
      sections: {
        approveAnswers: {
          numberOfApprovedAnswers: "Number of approved answers",
          numberOfAlreadyApprovedAnswers: "Number of already approved answers",
          actionButton: {
            text: "Verify answers",
            title: "Verify all answers of all listed users"
          }
        },
        deleteUsers: {
          actionButton: {
            text: "Delete users",
            title: "Delete all listed users"
          }
        },
        changeRanks: {
          actionButton: {
            text: "Change ranks",
            title: "Add or remove ranks from all listed users"
          }
        }
      }
    },
    MassModerateContents: {
      text: "Mass-Moderate contents",
      nContents: "%{n} contents",
      nIgnored: "%{n} ignored",
      contentType: "Content type",
      targets: {
        text: "Specify targets",
        listOfIds: {
          contentLinksOrIDs: "Content links or IDs"
        },
        idRange: {
          text: "ID range",
          youNeedToEnterTwoDifferentIdNumbers: "Enter ID numbers separated by a hyphen or 2+ periods to moderate the contents in that range",
          exampleUsage: "Example Usage",
          input: "Input",
          output: "Output"
        },
        searchQuestion: {
          text: "Search question",
          whatIsYourQuestion: "What is your question?"
        }
      },
      methods: {
        text: "Methods",
        iCantCopy: "Unable to copy to the clipboard",
        reportForAbuse: {
          chooseAReason: "Choose a reason",
          tabButton: {
            text: "Report for abuse",
            title: "Report abusive contents"
          }
        },
        addAnswer: {
          tabButton: {
            text: "Add answer",
            title: "Add an answer to target questions"
          }
        }
      }
    },
    searchUser: {
      text: "Find users",
      nickOrID: "Nick or profile ID"
    },
    discordPopup: {
      discordServer: "DISCORD SERVER!",
      heyUser: "Hey, %{nick},",
      nextMessage: "We have opened the doors to our brand-new\nDiscord server for extension users.\n\nFeel free to check it out!",
      informationLine: "About the Discord server"
    }
  },
  home: {
    todaysActions: "Today's actions"
  },
  messages: {
    notificationMessages: {
      unsendedMessage: "You didn't send your message, do you still want to leave?",
      wrongMessageLength: "Your message must be between 1 and %{max_value} characters long",
      messageContainsSwear: "Oops! It appears your message contains explicit content and can't be sent."
    }
  },
  userContent: {
    notificationMessages: {
      alreadyApproved: "This answer is already approved",
      alreadyUnapproved: "This answer is already unapproved",
      someOfSelectedAnswersAreApproved: "Some selected answers have already been approved, so they can't be approved again",
      selectAnUnapprovedAnswerForApproving: "You need to select some unapproved answers to start approving them",
      confirmApproving: "Do you want to approve this answer?",
      someOfSelectedAnswersAreUnapproved: "Some selected answers aren't approved, so they can't be unapproved",
      selectAnApprovedAnswerForUnapproving: "You need to select some approved answers to start unapproving them",
      confirmUnapproving: "Do you want to unapprove this answer?",
      doYouWantToConfirmThisContent: "Do you want to confirm this content?",
      confirmReporting: "Do you want to report the selected answers for correction?",
      selectAtLeastOneContent: "Select at least one content",
      xIsAlreadyApproved: "%{row_id} has already been approved",
      xIsAlreadyUnapproved: "%{row_id} has already been unapproved",
      confirmApprovingSelected: "Do you want to approve the selected answers?"
    },
    approvedAnswer: "Approved answer",
    bestAnswer: "Best answer",
    askForCorrection: {
      text: "Ask for correction",
      placeholder: "Write additional information for users",
      ask: "Ask"
    },
    hasAttachment: {
      question: "Question has an attachment",
      answer: "Answer has an attachment"
    },
    reported: {
      question: "Reported question",
      answer: "Reported answer",
      comment: "Reported comment"
    },
    copyQuestionLinks: "Copy question links"
  },
  userProfile: {
    notificationMessages: {
      areYouSureDeleteSelectedFriends: "Are you sure you want to remove the selected users from your friend list?",
      areYouSureRemoveAllFriends: "Are you sure you want to remove all your friends?",
      youHaveNoFriends: "No friends found. If you believe this is an error, please refresh the page and check again.",
      cannotChangeBio: "An error occurred while updating your bio. Please refresh the page and try again.",
      fileSizeExceeded: "The file \"%{file_name}\" exceeds the size limit of %{file_size}.",
      aShortcutFile: "The file you're attempting to upload is a shortcut. You may need to select the original file instead.\n\nDo you still want to upload this shortcut?",
      unableToReportAccountDeleting: "The deletion request couldn't be reported to your community manager, so the account hasn't been deleted.\nIf this error persists, please contact your extension manager.",
      confirmNoEvidenceOrComment: "You didn't add any evidence or comment.\nDo you still want to delete this profile?",
      selectAtLeastOneUser: "You need to select at least one user",
      youNeedToProvideSomeDetails: "You need to provide some details",
      confirmAccountDeletion: "Do you want to delete this profile?",
      profileHasAlreadyDeleted: "This profile has already been deleted by someone else"
    },
    previousNicks: {
      text: "Previous nicks",
      title: "Previous nicks of the user registered in the database"
    },
    userBio: {
      title: "Bio",
      description: "Bio text from the Brainly Android app"
    },
    showAllFriends: {
      text: "Show all",
      title: "List all your friends"
    },
    removeAllFriends: {
      text: "Unfriend all",
      title: "Remove all your friends"
    },
    removeSelectedFriends: {
      text: "Unfriend",
      title: "Remove the selected friends from your friend list"
    },
    accountDelete: {
      evidences: "Evidence",
      willBeReviewedByCommunityManager: "will be reviewed by your Community Manager",
      addFiles: "Add files",
      compressingTheFile: "Compressing %{file_name}",
      compressingTheFiles: "Compressing files",
      uploading: "Uploading (%{percentage_value})",
      deletingContinues: "Deleting continues...",
      reasonForDeletion: "Any reason for deletion?"
    },
    rankManager: {
      title: "Manage special ranks",
      removeAllRanks: "Remove all special ranks",
      allRanksRemoved: "All special ranks have been removed",
      updatingRanks: "Updating ranks",
      xHasAssigned: "%{rank_name} has been assigned",
      removingAllSpecialRanks: "Removing all special ranks..."
    },
    morePanel: {
      title: "More...",
      privileges: {
        title: "Active privileges"
      },
      manageExtensionUser: {
        title: "Manage extension privileges"
      },
      reportUser: {
        report: "Report this user",
        whatIsTheReason: "What is the reason?",
        reasons: {
          pointTransferer: "Point transferer",
          spammer: "Spammer",
          other: "Other"
        }
      }
    },
    userWarningsList: {
      name: "Recent warnings",
      showRest: "Show all warnings"
    },
    goToOldProfilePage: "Go to old profile page",
    comments: "Comments"
  },
  userWarnings: {
    notificationMessages: {
      ifYouHavePrivileges: "Warning(s) will be revoked if you have the ability. Please wait ~10 seconds after the process starts."
    },
    cancelWarnings: "Cancel Warnings"
  },
  supervisors: {
    notificationMessages: {
      noUser: "There are no users to send this message to",
      emptyMessage: "You cannot send an empty message"
    },
    allRanks: "All Ranks",
    tableLayout: "Table Layout",
    sendMessagesToMods: "Send message to mods",
    sendMessagesToListedMods: {
      text: "to listed mods",
      title: "Send a message to only listed moderators"
    },
    sendMessagesToAllMods: {
      text: "to all mods",
      title: "Send a message to all moderators"
    }
  },
  uploader: {
    notificationMessages: {
      alreadyExist: "%{file_name} already exists",
      fileNameCannotContainBackslash: "File names cannot contain backslashes. Please rename %{file_name}"
    },
    text: "Upload multiple files",
    selectFiles: "Select files"
  },
  moderateAll: {
    wrongContentConfirmer: {
      text: "Confirm all corrected contents"
    },
    notificationMessage: {
      questionRemovedPanelClosing: "Question has been removed. Panel will close in few seconds"
    }
  },
  moderatorActionHistory: {
    revert: "Revert",
    valid: "Valid",
    validateAll: "Validate all",
    validateAllDescription: "Validate all non-reviewed actions on this page",
    invalid: "Invalid",
    invalidateAll: "Invalidate all",
    invalidateAllDescription: "Invalidate all non-reviewed actions on this page",
    revertAll: "Revert all",
    statusTitle: {
      valid: "Marked valid by %{nick} on %{date}",
      invalid: "Marked invalid by %{nick} on %{date}"
    },
    toggleDetails: "Toggle details",
    validated: "Action has been marked as valid",
    invalidated: "Action has been marked as invalid",
    allValidated: "Actions have been marked as valid",
    allInvalidated: "Actions are marked as invalid",
    informModeratorTitle: "Inform %{nick} about this invalid action",
    informModeratorTitleForMany: "Inform %{nick} about these invalid actions",
    informModerator: "Inform moderator",
    messageTemplate: "Hello %{nick},\n\n..\n\nQuestion: %{question}\n\nAttachment: %{links}",
    anAttachmentUploading: "Please wait for attachments to be uploaded",
    anErrorOccurredWhileSendingMessage: "An error occurred while sending the message:\n%{reason}",
    warnBeforeEditing: "Do you really want to edit the last message?",
    informed: "Informed",
    reviewWithdrawn: "Review has been successfully withdrawn",
    reviewsWithdrawn: "Reviews have been successfully withdrawn",
    reviewDetails: "Review details"
  },
  question: {
    keywords: "Keywords"
  },
  reportedContents: {
    questionAnswerReports: {
      text: "Questions/Answers (%{number_of_reports})",
      title: "Click here to see reported questions and answers"
    },
    commentReports: {
      text: "Comments (%{number_of_reports})",
      title: "Click here to see reported comments"
    },
    correctionReports: {
      text: "Correction Reports (%{number_of_reports})",
      title: "Click here to view the answers that have been reported for correction and are waiting to be moderated"
    },
    subjectFilterFirstOption: "Subject — ALL",
    options: {
      buttonVisibility: {
        optionName: "Action buttons visibility",
        alwaysVisible: "Always visible",
        onHoverOrTouch: "On hover/touch"
      },
      name: "Options",
      density: {
        optionName: "Density"
      },
      lazyQueue: {
        optionName: "Lazy queue (Refresh required)",
        description: "This option enables lazy loading for the reported contents queue.\n\nWhen enabled, the queue displays reports with a delay while scrolling, so it's memory-friendly.\nHowever, the \"Find on page\" feature will not function for invisible reports. The page might display blank reports if you scroll too fast."
      },
      toggleInfiniteLoader: {
        optionName: "Scrollable loading",
        description: "Toggle auto-loading contents when scrolling"
      },
      loadLimiter: {
        optionName: "Load amount",
        description: "Changes the limit of how many reports will be shown after clicking the load more button.\n\nHigher values may cause some delay in showing reports."
      }
    },
    queue: {
      rating: "%{rating} stars based on %{ratesCount} ratings",
      bestAnswer: "This is the Brainliest Answer",
      popularQuestion: "Popular question!",
      moderatorVerifiedSomeonesAnswer: "%{verifier} has verified %{author}'s answer",
      loadMore: "Load more",
      exportReports: {
        exportAsSpreadsheet: "Export filtered reports as spreadsheet",
        nothingToExport: "There are no reports left to export",
        id: "ID",
        questionId: "Question ID",
        reportedUserId: "Reported user ID",
        reporterUserId: "Reporter user ID",
        reportedOn: "Reported on",
        reason: "Reason",
        contentShort: "Content preview",
        isModerated: "Is moderated?",
        isCorrected: "Is corrected?"
      },
      notYetCorrected: "Not corrected yet",
      pageNumberInputTitle: "Enter a page number between %{MIN_N} and %{MAX_N}"
    },
    loadAll: "Fetch all reports",
    loadAllConfirmationMessage: "I'll try to fetch all reported contents from Brainly, but the process can be interrupted by Brainly due to elevated requests.\n\nPlease confirm to start the process.",
    massModerate: {
      name: "Mass-Moderate contents",
      description: "You can only moderate contents that have been fetched",
      confirm: {
        text: "Confirm",
        noContentToConfirm: "There is no content that's available for confirmation",
        confirmModeration: "Do you really want to confirm %{n} reported contents?"
      },
      delete: {
        text: "Delete",
        choose: {
          Question: "Choose a reason for questions",
          Answer: "Choose a reason for answers",
          Comment: "Choose a reason for comments"
        },
        noContentToDelete: "There is no content that's available for deletion",
        confirmDeletion: "Do you really want to delete %{n} reported contents?",
        warnAboutConfirmedContents: "Warning!\n%{N_of_confirmed} of the %{N_of_filtered} contents you want to delete have already been confirmed.\nDo you want those contents to be deleted as well?"
      },
      status: {
        fetched: "%{count} fetched",
        filtered: "%{count} filtered",
        visible: "%{count} visible",
        moderated: "%{count} moderated",
        failed: "%{count} failed",
        alreadyModerated: "%{count} already moderated"
      },
      visible: {
        contents: "Visible contents",
        questions: "Visible questions",
        answers: "Visible answers",
        comments: "Visible comments"
      },
      filtered: {
        contents: "Filtered contents",
        questions: "Filtered questions",
        answers: "Filtered answers",
        comments: "Filtered comments"
      },
      ignoreContent: "Ignore this report while mass-moderating",
      ignoreContents: "Ignore %{number} visible reports while mass-moderating",
      fetchingReports: "Please wait until the fetch all reports operation has completed or stop the process to continue to moderate"
    },
    categoryFilterFirstOption: {
      name: "Report reason — ALL",
      reasonsFor: {
        Question: "Reasons for questions",
        Answer: "Reasons for answers",
        Comment: "Reasons for comments"
      }
    },
    name: "Reported contents",
    filtersPanel: {
      description: "Filters can only be applied to reports that have been fetched",
      filters: {
        reporter: {
          name: "Reported by"
        },
        reported: {
          name: "Reported user"
        },
        reportingDate: {
          name: "Reported between",
          startingDate: "Starting date",
          endingDate: "Ending date"
        },
        contentType: {
          name: "Content type",
          Question: "Question",
          Answer: "Answer",
          Comment: "Comment"
        },
        contentLength: {
          name: "Content preview length",
          equals: "equals",
          lowerThan: "lower than",
          label: {
            equals: "equal to %{N}",
            lowerThan: "lower than %{N}",
            greaterThan: "greater than %{N}"
          },
          greaterThan: "greater than"
        },
        attachmentLength: {
          name: "Attachment count"
        },
        subject: {
          name: "Subject"
        },
        userFilter: {
          id: "ID",
          nick: "nick",
          lookFor: "Look for",
          specialRank: "Special rank",
          anyRank: "Any rank",
          excludeSelectedRanks: "Exclude users with selected ranks"
        },
        stringFilter: {
          chooseCondition: "Choose condition",
          label: {
            contains: "contains: %{input}",
            sameWith: "is exactly: %{input}",
            startsWith: "starts with: %{input}",
            endsWith: "ends with: %{input}",
            regExp: "%{input}"
          },
          conditions: {
            contains: "contains",
            sameWith: "is exactly",
            startsWith: "starts with",
            endsWith: "ends with",
            regExp: "RegExp (JS/ES6)"
          },
          additionalData: "Additional data",
          content: "Content"
        }
      },
      title: "Filters",
      name: "Filter reports"
    },
    contentBeforeResettingCache: "You have fetched %{number_of_reports} reports and the cache will be cleared to fetch new reports after confirming this.\nPlease confirm if you want to continue"
  },
  moderationPanel: {
    text: "Question Moderation",
    answers: "Answers (%{number_of_answers})",
    panelWillClose: "Moderation panel will close in %{remain_N} seconds...",
    showAllComments: "Show all comments",
    failedToGetLogs: "Cannot fetch logs of question",
    seeMoreDeleteOptions: "See more deletion options",
    thereIsNoReportLeft: "There are no reports left",
    deleteAllComments: "Delete all comments",
    confirmDeletingNComments: "Are you sure you want to delete all %{N} comments?",
    commentsDeleted: "Comments deleted!",
    switchingToNextContent: "I'll try to switch to the next content",
    hideDeletedComments: "Hide deleted comments",
    showDeletedComments: "Show deleted comments",
    janToDec: "JAN\nDEC",
    decToJan: "DEC\nJAN",
    sortDESC: "Sort comments from newest to oldest",
    sortASC: "Sort comments from oldest to newest",
    showLess: "Show less",
    toggleReportedComments: "Toggle reported comments",
    corrected: "Corrected",
    originalAnswer: "Original answer",
    answerHasCorrected: "%{nick} has corrected the answer",
    questionHasBeenDeleted: "Question has been deleted",
    moderationCompleted: "Moderation completed",
    extendBy15Minutes: "Reset to 15 minutes",
    log: {
      text: "Log",
      deletedWithWarning: "Deleted with a warning",
      nActions: {
        one: "1 action",
        other: "%{number_of} actions"
      },
      nMore: "%{number_of_occurrences} more"
    }
  },
  shortAnswersPage: {
    selectAtLeastOneAnswer: "Select at least one answer",
    doYouWantToDeleteSelectedAnswers: "Do you really want to delete the selected answers?"
  },
  questionSearch: {
    selectAtLeastOneQuestion: "Select at least one question",
    doYouWantToDeleteSelectedQuestions: "Do you really want to delete %{N} selected questions?"
  }
}
