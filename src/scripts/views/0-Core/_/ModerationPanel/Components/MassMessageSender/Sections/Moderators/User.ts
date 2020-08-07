const ERROR = "sg-box--peach";
const USER_NOT_FOUND = "sg-box--dark";
const SUCCESS = "sg-box--blue-secondary";

export default class User {
  data: {
    [x: string]: any;
  };

  $: JQuery<HTMLElement>;
  $avatar: JQuery<HTMLElement>;
  $box: JQuery<HTMLElement>;
  $rankList: JQuery<HTMLElement>;
  $profileLink: JQuery<HTMLElement>;
  $nick: JQuery<HTMLElement>;
  $spinnerContainer: JQuery<HTMLElement>;
  $spinner: JQuery<HTMLElement>;

  constructor(data) {
    this.data = data;

    this.Render();
    this.FillData();
    this.RenderSpinner();
  }

  Render() {
    this.$ = $(`
		<li class="sg-list__element">
			<div class="sg-spinner-container sg-box--full">
				<div class="sg-box sg-box--no-min-height sg-box--xxsmall-padding sg-box--no-border sg-box--full">
					<div class="sg-box__hole">
						<div class="sg-actions-list sg-actions-list--no-wrap">
							<div class="sg-actions-list__hole">
								<div data-test="ranking-item-avatar" class="sg-avatar sg-avatar--normal sg-avatar--spaced">
									<a href="">
										<img class="sg-avatar__image" src="">
									</a>
								</div>
							</div>
							<div class="sg-actions-list__hole sg-actions-list__hole--grow">
								<div class="sg-content-box">
									<div class="sg-content-box__content sg-content-box__content--full">
										<a href="" class="sg-text sg-text--link-unstyled sg-text--bold">
											<span class="sg-text sg-text--small sg-text--gray sg-text--bold"></span>
										</a>
									</div>
									<div class="sg-content-box__content sg-content-box__content--full">
										<ul class="sg-breadcrumb-list sg-text--xsmall"></ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</li>`);

    this.$avatar = $("img", this.$);
    this.$box = $(".sg-box", this.$);
    this.$rankList = $("ul", this.$);
    this.$profileLink = $("a", this.$);
    this.$nick = $("> .sg-text", this.$profileLink);
    this.$spinnerContainer = $(".sg-spinner-container", this.$);
  }

  FillData() {
    const avatar = System.prepareAvatar(this.data);
    const profileLink = System.createProfileLink(this.data);
    const ranks = [];

    if (this.data.ranks_ids && this.data.ranks_ids.length > 0) {
      this.data.ranks_ids.forEach(rankId => {
        const currentRank =
          System.data.Brainly.defaultConfig.config.data.ranksWithId[rankId];

        if (currentRank || rankId === 12) {
          ranks.push(
            `<li class="sg-breadcrumb-list__element" style="color:#${
              currentRank.color || "000"
            };">${currentRank.name}</li>`,
          );
        }
      });
    }

    this.$nick.text(this.data.nick);
    this.$avatar.attr("src", avatar);
    this.$rankList.html(ranks.join(""));
    this.$profileLink.attr("href", profileLink);
  }

  RenderSpinner() {
    this.$spinner = $(
      `<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--small"></div></div>`,
    );
  }

  ShowSpinner() {
    this.$spinner.appendTo(this.$spinnerContainer);
  }

  HideSpinner() {
    this.$spinner.appendTo("<div />");
  }

  Mark(status) {
    let className = SUCCESS;

    if (status === 500) {
      className = USER_NOT_FOUND;
    } else if (status) {
      className = ERROR;
    }

    this.RemoveMarks();
    this.$box.addClass(className);
  }

  RemoveMarks() {
    this.$box.removeClass(`${ERROR} ${SUCCESS} ${USER_NOT_FOUND}`);
  }
}
