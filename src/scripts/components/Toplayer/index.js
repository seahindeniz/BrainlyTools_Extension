let create_toplayer = (heading, content, actions, addAfter = "") => {
	let $toplayerContainer = $(`
	<div class="js-moderate-modal">
		<div class="sg-overlay">
			<div class="sg-toplayer sg-toplayer--modal sg-toplayer--medium">
			<div class="sg-toplayer__close"><svg class="sg-icon sg-icon--gray-secondary sg-icon--x14"><use xlink:href="#icon-x"></use></svg></div>
			<div class="sg-toplayer__wrapper">
				<div class="sg-content-box">
					<div class="sg-content-box__content sg-content-box__content--spaced-bottom-large">${heading}</div>
					<div class="sg-content-box__content sg-content-box__content--spaced-bottom-large">${content}</div>
					<div class="sg-content-box__actions">${actions}</div>
					${addAfter}
				</div>
			</div>
			</div>
		</div>
	</div>`);
	/*$(".sg-toplayer__close", $toplayerContainer).click(function () {
		$(this).parents(".js-moderate-modal").remove();
	});*/
	return $toplayerContainer;
}
export default create_toplayer;
