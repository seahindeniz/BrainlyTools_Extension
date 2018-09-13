export default task => {
	let categories = "";
	task.forEach((category, i) => {
		categories += `
		<div class="sg-actions-list__hole sg-actions-list__hole--spaced-xsmall">
			<div class="sg-label sg-label--secondary">
				<div class="sg-label__icon">
					<div class="sg-radio sg-radio--undefined">
						<input type="radio" class="sg-radio__element" name="categories" id="category${category.id}">
						<label class="sg-radio__ghost" for="category${category.id}"></label>
					</div>
				</div>
				<label class="sg-label__text" for="category${category.id}">${category.text}</label>
			</div>
		</div>`
	});
	return categories;
}
