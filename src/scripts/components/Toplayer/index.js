let create_toplayer = (size = "medium", heading = "", content = "", actions = "", addAfter = "") => {
	let $toplayerContainer = $(`
	<div class="sg-toplayer${size=="medium"?" sg-toplayer--modal":""} sg-toplayer--${size}">
		<div class="sg-toplayer__close"><svg class="sg-icon sg-icon--gray-secondary sg-icon--x14"><use xlink:href="#icon-x"></use></svg></div>
		<div class="sg-toplayer__wrapper">
			<div class="sg-content-box">
				<div class="sg-content-box__title${size=="medium"?" sg-content-box__content--spaced-bottom-large":""}">${heading}</div>
				<div class="sg-content-box__content${size=="medium"?" sg-content-box__content--spaced-bottom-large":""}">${content}</div>
				<div class="sg-content-box__actions">${actions}</div>
				${addAfter}
			</div>
		</div>
	</div>`);
	/*$(".sg-toplayer__close", $toplayerContainer).click(function () {
		$(this).parents(".js-moderate-modal").remove();
	});*/
	return $toplayerContainer;
}
export default create_toplayer;
