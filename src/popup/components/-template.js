
class LinkShortener {
	constructor() {
		return this.Render();
	}
	Render() {
		this.$layout = $(`
		<div id="linkShorter" class="column">
			<div class="field is-grouped">
				<div class="control">
					<button class="button is-link" title="${System.data.locale.popup.createShortLinkButton.title}">${System.data.locale.popup.createShortLinkButton.text}</button>
				</div>
				<div class="control is-expanded has-icons-left has-icons-right is-hidden js-input">
					<input class="input is-success" type="text" readonly>
					<span class="icon is-small is-left">
						<i class="fas fa-globe"></i>
					</span>
					<p class="help is-success">${System.data.locale.popup.notificationMessages.shortLinkSuccessMessage}</p>
				</div>
			</div>
		</div>`);

		this.BindEvents();

		return this.$layout;
	}
	BindEvents() {
	}
}

export default LinkShortener
