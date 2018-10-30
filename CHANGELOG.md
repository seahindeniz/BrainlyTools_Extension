# Changelog
All notable changes to this project will be documented in this file.

## [6.2.1] - 2018.10.30
### Changed/Fixed
- Searching users in while creating or editing a message group had a bug that couse messing the search results

## [6.2.0] - 2018.10.30
### Added
- This change log file :). We will see the new update logs here when there is a new update.

- Group messages, user that who has the privilege for this feature, can send a message to multiple users at once.
- Mass-Question deleter, also restricted privilege. User can use for this to delete multiple questions by their ids in a list at once.
- Mass-Message sender, can send your message to the users by counting backwards from the given id number. It's currently in beta stage and needs some performance improvements. (https://ibb.co/mb7tOA)
- Under the "supervisors" page, you will some changes on the couple of elements (https://ibb.co/htzafq). Like filtering the users by selecting a rank or ranks in the ranks list. And also you can send a message to all moderators or listed moderators on this page. https://brainly.co.id/moderators/supervisors/1 (You need to change the link for your market's domain name)

- Some of the language files are not translated by me so from now on these contributors nicks will be visible along with language names in the language options (https://ibb.co/mKO5Vq)

### Changed/Fixed
- Finding a user by id on the moderation panel is now able to search using with nick and id (https://ibb.co/f3i7BV)
- Under the "User content view > responses" page, extension changes the layout for quick review. But shows you an attachment icon for who has added a attachment in to their response. This feature makes some confusion about who added this attachment, so in this update you can see only the related user answer attachment icon only. There is no need to show an icon for other user's attachments.
- Normal users can't able to click this(http://i.imgur.com/fRwLKqr.png) text before, now its clickable. (Normal user's that don't have any special privilige in the extension can also use the extension with access permission with out being a moderator. This will not be any security risks for Brainly and users questions/answers/comments at all, because they don't have moderator privilege to make actions.)
- Under the "User content view" page, if listed contents are already deleted or approved by another user while extension user starts to delete or approve the content, extension will inform you about this and pass this process without being stucked.
- Under the "Archive Mod" page, the question delete buttons color is now orange #FBC02D (https://ibb.co/eMLCAq)
- The quick delete buttons labels are now visible on the mobile view when the user tries to touch it
- There is an issue with the extend message page layout checkbox in the extension options that thecheckbox didn't show the current status.
- The unfriend all and unfriend buttons are has been hidden from the other users profile https://ibb.co/fiNyrV