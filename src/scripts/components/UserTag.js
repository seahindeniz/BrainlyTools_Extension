function UserTag() {
	let $userTag = $(`
		<div class="sg-actions-list__hole userFlag">
			<div class="sg-badge sg-badge--lavender">
				<div class="sg-text sg-text--xsmall sg-text--white sg-text--emphasised">${System.data.locale.common.extensionUser}</div>
			</div>
		</div>`);

	return $userTag
}

export default UserTag
