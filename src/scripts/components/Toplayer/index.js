let create_toplayer = (heading, content, actions) => {
	let $toplayerContainer = $(`
	<div class="js-moderate-modal">
		<!--<div class="sg-overlay">
			<div class="brn-new-editor-wrapper">
				<div class="sg-toplayer sg-toplayer--modal sg-toplayer--large">
					<div class="sg-toplayer__close"><svg class="sg-icon sg-icon--gray-secondary sg-icon--x14"><use xlink:href="#icon-x"></use></svg></div>
					<div class="sg-toplayer__wrapper">
						<div class="sg-content-box brn-new-editor">
							<div class="sg-content-box sg-content-box--full brn-new-editor__header">
								<div style="transition: all 850ms ease 0s; opacity: 1;">
									<div class="sg-content-box__content sg-content-box__content--spaced-bottom">
										<h2 class="sg-header-secondary">${heading}</h2>
									</div>
								</div>
								<div style="transition: all 850ms ease 0s; opacity: 0;">
								<div class="sg-content-box__content sg-content-box__content--spaced-bottom-large">${content}</div>
								<div class="sg-content-box__actions">${actions}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>-->
		<div class="sg-overlay">
			<div class="sg-toplayer sg-toplayer--modal sg-toplayer--small">
			<div class="sg-toplayer__close"><svg class="sg-icon sg-icon--gray-secondary sg-icon--x14"><use xlink:href="#icon-x"></use></svg></div>
			<div class="sg-toplayer__wrapper">
				<div class="sg-content-box">
					<div class="sg-content-box__content sg-content-box__content--spaced-bottom-large">${heading}</div>
					<div class="sg-content-box__content sg-content-box__content--spaced-bottom-large">${content}</div>
					<div class="sg-content-box__actions">${actions}</div>
				</div>
			</div>
			</div>
		</div>
	</div>`);
	$(".sg-toplayer__close", $toplayerContainer).click(function () {
		$(this).parents(".js-moderate-modal").remove();
	});
	return $toplayerContainer;
}
export default create_toplayer;