import Action from "../../../../../../../controllers/Req/Brainly/Action";

export default class InfoBar {
  /**
   * @param {import("../../User").default} user
   * @param {import(".").default} main
   */
  constructor(user, main) {
    this.user = user;
    this.main = main;
    this.numberOfFetchedAnswers = 0;
    this.numberOfApprovedAnswers = 0;
    this.fetchingAnswersDone = false;
    /**
     * @type {number}
     */
    this.lastAnswersPage;

    this.Promise();
    this.RenderInfoBar();
    this.FetchAnswers(1);
  }
  Promise() {
    this.promise = new Promise((resolve, reject) => (this.resolve = resolve, this.reject = reject));
  }
  RenderInfoBar() {
    this.$infoBar = $(`
    <div class="sg-actions-list sg-actions-list--space-between">
      <div class="sg-actions-list__hole">
        <div class="sg-label sg-label--small sg-label--secondary">
          <div class="sg-label__icon">
            <div class="sg-icon sg-icon--gray-secondary sg-icon--x18">
              <svg class="sg-icon__svg">
                <use xlink:href="#icon-answer"></use>
              </svg>
            </div>
          </div>
          <div class="sg-text sg-text--small sg-text--gray-secondary sg-text--bold">
            <span>0</span>/<span>0</span>
          </div>
        </div>
      </div>
      <div class="sg-actions-list__hole">
        <div class="sg-label sg-label--small sg-label--secondary">
          <div class="sg-label__icon">
            <div class="sg-icon  sg-icon--mint sg-icon--x18">
              <svg class="sg-icon__svg">
                <use xlink:href="#icon-check"></use>
              </svg>
            </div>
          </div>
          <div class="sg-text sg-text--small sg-text--gray-secondary sg-text--bold">0</div>
        </div>
      </div>
    </div>`);

    this.$numberOfFetchedAnswers = $("> .sg-actions-list__hole:nth-child(1) .sg-text > span:nth-child(1)", this.$infoBar);
    this.$numberOfTotalAnswers = $("> .sg-actions-list__hole:nth-child(1) .sg-text > span:nth-child(2)", this.$infoBar);
    this.$numberOfApprovedAnswers = $("> .sg-actions-list__hole:nth-child(2) .sg-text", this.$infoBar);

    this.$infoBar.appendTo(this.user.$infoBarContainer);
  }
  async FetchAnswers(page, isLastPage) {
    let resAnswers = await new Action().GetAnswersOfUser(this.user.details.id, page);

    if (resAnswers && resAnswers.success) {
      if (resAnswers.data.length > 0) {
        let nextPage = this.ExtractPageNumber(resAnswers.pagination.next);
        this.numberOfFetchedAnswers += resAnswers.data.length;

        if (resAnswers.data.length < 100)
          console.log("page data isn't right", page);

        resAnswers.data.forEach(answer => {
          if (!answer.is_confirmed)
            this.main.answersWaitingForApproval.push({
              id: answer.id,
              infoBar: this
            });
          else
            this.numberOfApprovedAnswers++;
        });

        if (!this.lastAnswersPage) {
          this.lastAnswersPage = this.ExtractPageNumber(resAnswers.pagination.last);

          if (this.lastAnswersPage !== page)
            this.FetchAnswers(this.lastAnswersPage, true);

        }

        this.PrintNumberOfFetchedAnswers();
        this.PrintNumberOfApprovedAnswers();

        if (!isLastPage && nextPage && nextPage != this.lastAnswersPage)
          this.FetchAnswers(nextPage);

        let numberOfTotalAnswers;

        if (this.lastAnswersPage === page)
          numberOfTotalAnswers = resAnswers.data.length

        if (isLastPage) {
          numberOfTotalAnswers = ((page - 1) * 100) + resAnswers.data.length;
        }

        if (numberOfTotalAnswers)
          this.$numberOfTotalAnswers.text(numberOfTotalAnswers);


      this.main.StartApproving();
      } else {
        this.fetchingAnswersDone = true;

        this.TryToFinish();
      }
    }
  }
  ExtractPageNumber(link) {
    if (link)
      return ~~(link.replace(/(?:.*page=|&limit.*)/gi, ""));
  }
  PrintNumberOfFetchedAnswers() {
    this.$numberOfFetchedAnswers.text(this.numberOfFetchedAnswers);
  }
  PrintNumberOfApprovedAnswers() {
    this.$numberOfApprovedAnswers.text(this.numberOfApprovedAnswers);
  }
  TryToFinish() {
    if (this.fetchingAnswersDone)
      this.resolve();
  }
}
