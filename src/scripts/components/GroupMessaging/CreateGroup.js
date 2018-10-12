import Notification from "../../components/Notification";
import Modal from "../../components/ModalToplayer";
import { CreateMessageGroup } from "../../controllers/ActionsOfServer";

export default () => {
	let $createGroupLink = $(`<a class="sg-headline sg-headline--small" href="#">${System.data.locale.messages.groups.createGroup}</a>`);

	$createGroupLink.click(() => {
		let $toplayerContainer = $(`<div class="js-toplayers-container"></div>`);
		let createGroupToplayer = new Modal(
			`<h2 class="sg-header-secondary">${System.data.locale.messages.groups.createGroup}</h2>`,
			`<div class="sg-actions-list group-header">
				<div class="sg-actions-list__hole">
					<label class="sg-text sg-text--xxlarge js-first-letter">G</label>
				</div>
				<div class="sg-actions-list__hole">
					<input type="text" class="sg-input sg-input--light-alt sg-input--full-width sg-input--large js-group-name" placeholder="${System.data.locale.messages.groups.groupName}">
				</div>
			</div>
			<div class="sg-card sg-card--vertical sg-card--full  sg-card--padding-small">
				<div class="sg-card__hole sg-card__hole--lavender-secondary-light">
					<h2 class="sg-headline sg-headline--large sg-headline--gray sg-headline--justify">${System.data.locale.messages.groups.groupMembers}</h2>
					<ul class="sg-list sg-list--spaced-elements js-group-members"></ul>
				</div>
                <div class="sg-card__hole">
					<h2 class="sg-headline sg-headline--large sg-headline--gray sg-headline--justify">${System.data.locale.messages.groups.findUsers}</h2>
					<ul class="sg-list sg-list--spaced-elements js-find-users"></ul>
				</div>
              </div>`,
			``,
			"",
			"limited-width");
		let $createGroupToplayer = createGroupToplayer.$;
		let $closeIcon = $(".sg-toplayer__close", $createGroupToplayer);
		let $groupName = $("input.js-group-name", $createGroupToplayer);
		let $firstLetter = $("label.js-first-letter", $createGroupToplayer);
		let $groupMembersList = $("ul.js-group-members", $createGroupToplayer);
		let $findUsersList = $("ul.js-find-users", $createGroupToplayer);

		$toplayerContainer.insertBefore("footer.js-page-footer");
		$createGroupToplayer.appendTo($toplayerContainer);

		let closeIconHandler = () => {
			let svg = $("svg", $closeIcon);

			let $spinner = $(`<div class="sg-spinner sg-spinner--xxsmall"></div>`);

			$spinner.insertBefore(svg);
			svg.hide();
			$closeIcon.off("click");

			if (confirm(System.data.locale.messages.groups.notificationMessages.doYouWantToSaveChanges)) {
				let groupData = {};

				CreateMessageGroup(groupData, res => {
					if (!res || !res.success) {
						$createGroupToplayer.notification(System.data.locale.messages.groups.notificationMessages.cantCreate, "error");
						$closeIcon.on("click", closeIconHandler);
						svg.show();
						$spinner.remove();
					} else {
						Notification(System.data.locale.messages.groups.notificationMessages.groupCreated.replace("%{groupName}", groupData.title), "success");
						$closeIcon.parents(".js-modal").remove();
					}
				});
			} else {
				$closeIcon.parents(".js-modal").remove();
			}
		};
		let groupNameInputHandler = function() {
			let firstLetter = "G";

			if (this.value && this.value.length > 0) {
				firstLetter = this.value.charAt(0).toLocaleUpperCase(System.data.Brainly.defaultConfig.user.ME.user.isoLocale);
			}

			$firstLetter.text(firstLetter);
		};

		$closeIcon.click(closeIconHandler);
		$groupName.on("input", groupNameInputHandler);
	});

	return $createGroupLink;
}
