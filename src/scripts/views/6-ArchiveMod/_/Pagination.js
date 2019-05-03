import WaitForElement from "../../../helpers/WaitForElement";
import ServerReq from "../../../controllers/Req/Server";

class Pagination {
  constructor() {
    this.Render();
    this.GetModerateAllPages();
    this.BindHandler();
  }
  Render() {
    this.$ = $(`
    <div class="sg-content-box js-pagination">
      <div class="sg-content-box__actions sg-content-box__actions--full">
        <button class="sg-button-secondary sg-button-secondary--small sg-button-secondary--disabled">1</button>
      </div>
    </div>`);

    this.$numberList = $("> .sg-content-box__actions", this.$);
  }
  async GetModerateAllPages() {
    this.resPagination = await new ServerReq().GetModerateAllPages();
    this.loadMoreButton = await WaitForElement("#moderation-all > div.content > div.loader.calm");
    this.$filtersList = $("#moderation-all > div.top > div.sub-header.row > div.span5 > select.filters");

    this.RenderPageNumbers();
    this.Show();
    this.$filtersList.change(this.Toggle.bind(this));
  }
  RenderPageNumbers() {
    let data = this.resPagination.data;

    if (data && data.length > 0)
      data.forEach(this.RenderPageNumber.bind(this));
  }
  RenderPageNumber(last_id, i) {
    let $number = $(`
    <button class="sg-button-secondary sg-button-secondary--small sg-button-secondary--dark-inverse">${i + 2}</button>`);

    $number.prop("last_id", last_id);
    $number.appendTo(this.$numberList);
  }
  Show() {
    this.$.insertAfter(this.loadMoreButton);
  }
  Toggle(event) {
    if (event.target.value != 0)
      return this.Hide();

    this.Show();
  }
  Hide() {
    this.$.appendTo("<div />");
  }
  BindHandler() {
    this.$numberList.on("click", "button", this.ChangePage.bind(this));
  }
  ChangePage(event) {
    /**
     * @type {HTMLElement}
     */
    let button = event.target;

    if (button.classList.contains("sg-button-secondary--dark-inverse") || button.classList.contains("sg-button-secondary--dark")) {
      let last_id = button.last_id;

      if (last_id)
        $Z.moderation.all.data.lastId = ~~last_id;
      else {
        delete $Z.moderation.all.data.lastId;
        delete $Z.moderation.all.data.settings.last_id;
      }

      this.MarkPreviousButton();
      this.ResetButtons();
      $Z.moderation.all.getContent();
      button.classList.add("sg-button-secondary--disabled");
      button.classList.remove("sg-button-secondary--dark-inverse", "sg-button-secondary--dark");
      $('#moderation-all > div.content > .moderation-item').remove();
    }
  }
  MarkPreviousButton() {
    let $buttons = $("button:not(.sg-button-secondary--dark-inverse)", this.$numberList);

    $buttons.addClass("sg-button-secondary--dark");
  }
  ResetButtons() {
    let $clickedButtons = $("button:not(.sg-button-secondary--dark-inverse)", this.$numberList);
    let $buttons = $("button:not(.sg-button-secondary--dark-inverse):not(.sg-button-secondary--dark)", this.$numberList);

    $buttons.addClass("sg-button-secondary--dark-inverse");
    $buttons.removeClass("sg-button-secondary--disabled");
    $clickedButtons.removeClass("sg-button-secondary--disabled");
  }
}

export default Pagination
