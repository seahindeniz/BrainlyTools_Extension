function UserFlag(elementType, gender = 0) {
	let $userFlag = "";

	if (elementType == "img") {
		let flags = [...System.constants.config.userFlags[gender], ...System.constants.config.userFlags[0]];
		let rn = System.randomNumber(0, flags.length - 1);
		let flag = System.constants.config.userFlags.list[flags[rn]];

		$userFlag = $(`<img src="${System.data.meta.extension.URL + flag.file}" class="userFlag" style="${flag.css}">`);
	} else if (elementType == "tag") {
		$userFlag = $(`
		<div class="sg-actions-list__hole userFlag">
			<div class="sg-badge sg-badge--lavender">
				<div class="sg-text sg-text--xsmall sg-text--white sg-text--emphasised">${System.data.locale.common.extensionUser}</div>
			</div>
		</div>`);
	}

	return $userFlag
}

export default UserFlag
