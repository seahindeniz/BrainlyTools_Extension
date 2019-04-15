class Results {
  constructor() {
    this.Render();
    this.ResetValues();
  }
  Render() {
    this.$ = $(`
		<div class="sg-content-box__actions sg-content-box__actions--spaced-top-xlarge sg-content-box__actions--spaced-bottom-large">
			<div class="sg-content-box sg-content-box--full">
				<div class="sg-content-box__actions">
					<ul class="sg-list sg-list--spaced-elements">
						<li class="sg-list__element">
							<div class="sg-text sg-text--blue">${System.data.locale.core.MessageSender.sent}: <span>0</span></div>
						</li>
						<li class="sg-list__element">
							<div class="sg-text sg-text--peach-dark">${System.data.locale.core.MessageSender.errors}: <span>0</span></div>
						</li>
						<li class="sg-list__element">
							<div class="sg-text sg-text--gray">${System.data.locale.core.MessageSender.usersNotFound}: <span>0</span></div>
						</li>
					</ul>
				</div>
				<div class="sg-content-box__content"></div>
			</div>
		</div>`);

    this.$sent = $("li:eq(0) span", this.$);
    this.$errors = $("li:eq(1) span", this.$);
    this.$usersNotFound = $("li:eq(2) span", this.$);
  }
  ResetValues() {
    this.sent = 0;
    this.errors = 0;
    this.usersNotFound = 0;

    this.$sent.text(0);
    this.$errors.text(0);
    this.$usersNotFound.text(0);
  }
  IncreaseSent() {
    this.$sent.text(++this.sent);
  }
  IncreaseErrors() {
    this.$errors.text(++this.errors);
  }
  IncreaseUsersNotFound() {
    this.$usersNotFound.text(++this.usersNotFound);
  }
}

export default Results
