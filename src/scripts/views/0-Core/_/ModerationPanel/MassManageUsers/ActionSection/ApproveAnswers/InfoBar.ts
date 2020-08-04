import Action from "../../../../../../../controllers/Req/Brainly/Action";

export default class InfoBar {
  /**
   * @param {import("../../User").default} user
   * @param {import(".").default} main
   */
  constructor(user, main) {
    this.user = user;
    this.main = main;
    this.approved = false;
    this.numberOfFetchedAnswers = 0;
    this.numberOfApprovedAnswers = 0;
    this.numberOfAlreadyApprovedAnswers = 0;
    this.fetchingAnswersDone = false;

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
      <div class="sg-actions-list__hole" title="${System.data.locale.core.massManageUsers.sections.approveAnswers.numberOfApprovedAnswers}">
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
      <div class="sg-actions-list__hole" title="${System.data.locale.core.massManageUsers.sections.approveAnswers.numberOfAlreadyApprovedAnswers}">
        <div class="sg-label sg-label--small sg-label--secondary">
          <div class="sg-label__icon">
            <div class="sg-icon  sg-icon--mustard sg-icon--x18">
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
    this.$numberOfAlreadyApprovedAnswers = $("> .sg-actions-list__hole:nth-child(3) .sg-text", this.$infoBar);

    this.$infoBar.appendTo(this.user.infoBarContainer);
  }
  /**
   * @param {number} currentPage
   * @param {boolean} isLastPage
   */
  async FetchAnswers(currentPage, isLastPage = false) {
    let resAnswers = await new Action().GetAnswersOfUser(this.user.details.id, currentPage);

    if (resAnswers && resAnswers.success) {
      if (resAnswers.data.length == 0) {
        this.fetchingAnswersDone = true;
        this.reject({ message: `${this.user.details.nick} has no answer`, exception: 1 });
      } else {
        let nextPage = this.ExtractPageNumber(resAnswers.pagination.next);
        let lastPage = this.ExtractPageNumber(resAnswers.pagination.last);
        this.numberOfFetchedAnswers += resAnswers.data.length;

        let numberOfTotalAnswers;

        if (lastPage === currentPage)
          numberOfTotalAnswers = resAnswers.data.length

        if (isLastPage) {
          numberOfTotalAnswers = ((currentPage - 1) * 100) + resAnswers.data.length;
        }

        if (numberOfTotalAnswers > 0) {
          this.numberOfTotalAnswers = numberOfTotalAnswers;

          this.$numberOfTotalAnswers.text(numberOfTotalAnswers);
        }

        resAnswers.data.forEach(answer => {
          let data = {
            id: answer.id,
            infoBar: this
          };

          if (!answer.is_confirmed)
            this.main.answersWaitingForApproval.push(data);
          else {
            this.numberOfAlreadyApprovedAnswers++;

            this.main.AnswerApproved(data);
          }
        });

        this.PrintNumberOfFetchedAnswers();
        this.PrintNumberOfApprovedAnswers();
        this.PrintNumberOfAlreadyApprovedAnswers();

        if (lastPage !== currentPage) {
          if (!this.lastPage) {
            this.lastPage = lastPage;

            this.FetchAnswers(lastPage, true); // Fetch last page async
          }
          let isNotLastPage = !isLastPage;

          if (isNotLastPage && !!nextPage && nextPage != lastPage && currentPage != lastPage) {
            this.FetchAnswers(nextPage);
          } else {
            this.fetchingAnswersDone = true;

          }
        } else if (!isLastPage)
          this.fetchingAnswersDone = true;

        this.main.StartApproving();
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
  PrintNumberOfAlreadyApprovedAnswers() {
    this.$numberOfAlreadyApprovedAnswers.text(this.numberOfAlreadyApprovedAnswers);
  }
  TryToFinish() {
    if (this.fetchingAnswersDone)
      this.resolve();
  }
}
