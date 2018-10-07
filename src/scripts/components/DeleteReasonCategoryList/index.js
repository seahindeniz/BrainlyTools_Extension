export default (categories, type) => {
	return categories.map(category => `
	<div class="sg-actions-list__hole sg-actions-list__hole--spaced-xsmall">
		<div class="sg-label sg-label--secondary">
			<div class="sg-label__icon">
				<div class="sg-radio">
					<input type="radio" class="sg-radio__element" name="${type}" id="item${category.id}">
					<label class="sg-radio__ghost" for="item${category.id}"></label>
				</div>
			</div>
			<label class="sg-label__text" for="item${category.id}">${category.title || category.text}</label>
		</div>
	</div>`).join('');;
}
