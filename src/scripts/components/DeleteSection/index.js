import DeleteReasonCategoryList from "../DeleteReasonCategoryList";

export default (Reason, type)=>{
	let categories = DeleteReasonCategoryList(Reason);
	let $deleteSection = $(`
	<div>
		<div class="sg-actions-list sg-content-box__actions--spaced-top sg-content-box__actions--spaced-bottom categories">${categories}</div>
		<div class="sg-horizontal-separator js-hidden"></div>
		<div class="sg-actions-list sg-content-box__actions--spaced-top sg-content-box__actions--spaced-bottom reasons"></div>
		
		<textarea class="sg-textarea sg-textarea--invalid sg-textarea--full-width"></textarea>

		<div class="sg-content-box__actions">
			<div class="sg-label sg-label--secondary" >
				<div class="sg-label__icon" title="${System.data.locale.texts.moderate.take_points[type].description}">
					<div class="sg-checkbox">
						<input type="checkbox" class="sg-checkbox__element" id="take_points">
						<label class="sg-checkbox__ghost" for="take_points">
						<svg class="sg-icon sg-icon--adaptive sg-icon--x10">
							<use xlink:href="#icon-check"></use>
						</svg>
						</label>
					</div>
				</div>
				<label class="sg-label__text" for="take_points">${System.data.locale.texts.moderate.take_points[type].title}</label>
			</div>
			${type == "task"? `
				<div class="sg-vertical-separator sg-vertical-separator--small"></div>
				<div class="sg-label sg-label--secondary" >
					<div class="sg-label__icon" title="${System.data.locale.texts.moderate.return_points.description}">
						<div class="sg-checkbox">
							<input type="checkbox" class="sg-checkbox__element" id="return_points">
							<label class="sg-checkbox__ghost" for="return_points">
							<svg class="sg-icon sg-icon--adaptive sg-icon--x10">
								<use xlink:href="#icon-check"></use>
							</svg>
							</label>
						</div>
					</div>
					<label class="sg-label__text" for="return_points">${System.data.locale.texts.moderate.return_points.title}</label>
				</div>`
				:""
			}
			<div class="sg-vertical-separator sg-vertical-separator--small"></div>
			<div class="sg-label sg-label--secondary" >
				<div class="sg-label__icon" title="${System.data.locale.texts.moderate.give_warning.description}">
					<div class="sg-checkbox">
						<input type="checkbox" class="sg-checkbox__element" id="give_warning">
						<label class="sg-checkbox__ghost" for="give_warning">
						<svg class="sg-icon sg-icon--adaptive sg-icon--x10">
							<use xlink:href="#icon-check"></use>
						</svg>
						</label>
					</div>
				</div>
				<label class="sg-label__text" for="give_warning">${System.data.locale.texts.moderate.give_warning.title}</label>
			</div>
		</div>
	</div>`);

	let $categoryRadio = $('.categories input', $deleteSection);
	let $reasonSeperator = $('div.sg-horizontal-separator', $deleteSection);
	let $reasons = $('div.reasons', $deleteSection);
	let $textarea = $('textarea', $deleteSection);
	window.selectedCategory = null;

	$categoryRadio.change(function() {
		$(".selectReasonWarn", $deleteSection).remove();
		$reasonSeperator.removeClass("js-hidden");
		$textarea.val("");

		let selectedCategoryId = this.id.replace(/^\D+/g, "");
		Console.log("selectedCategoryId:", selectedCategoryId);
		window.selectedCategory = Reason.find((cat) => {
			return cat.id == selectedCategoryId;
		});
		Console.log("window.selectedCategory:", window.selectedCategory);

		let reasons = DeleteReasonCategoryList(window.selectedCategory.subcategories);
		$reasons.html(reasons);
	});
	$reasons.on("change", "input", function() {
		let selectedReasonId = this.id.replace(/^\D+/g, "");
		let reason = window.selectedCategory.subcategories.find((cat) => {
			return cat.id == selectedReasonId;
		});
		$textarea.val(reason.text);
	});
	return $deleteSection;
}