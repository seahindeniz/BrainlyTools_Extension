import Button from "../../../components/Button";
import ServerReq from "../../../controllers/Req/Server";
import WaitForElement from "../../../helpers/WaitForElement";

class Pagination {
  constructor() {
    this.Render();
    this.RenderFirstButton();
    this.GetModerateAllPages();
    this.BindHandler();
  }
  Render() {
    this.$ = $(`
    <div class="sg-content-box js-pagination">
      <div class="sg-content-box__actions sg-content-box__actions--full sg-actions-list--space-between"></div>
    </div>`);

    this.$numberButtonContainer = $("> .sg-content-box__actions", this.$);
  }
  RenderFirstButton() {
    this.$firstButton = Button({
      type: "primary-mint",
      size: "small",
      text: 1
    });

    this.$firstButton.Disable();
    this.$firstButton.appendTo(this.$numberButtonContainer);
  }
  async GetModerateAllPages() {
    this.resPagination = await new ServerReq().GetModerateAllPages();
    this.loadMoreButton = await WaitForElement("#moderation-all > div.content > div.loader.calm");
    this.$filtersList = $("#moderation-all > div.top > div.sub-header.row > div.span5 > select.filters");

    this.RenderPageNumbers();
    this.Show();
    this.$filtersList.change(this.Toggle.bind(this));
    $(this.loadMoreButton).addClass("sg-box--full");
  }
  RenderPageNumbers() {
    let data = this.resPagination.data;

    if (data && data.length > 0)
      data.forEach(this.RenderPageNumber.bind(this));
  }
  RenderPageNumber(last_id, i) {
    let $numberButton = Button({
      type: "primary-inverted",
      size: "small",
      text: i + 2
    });

    $numberButton.prop("last_id", last_id);
    $numberButton.appendTo(this.$numberButtonContainer);
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
    this.$.detach();
  }
  BindHandler() {
    this.$numberButtonContainer.on("click", "button", this.ChangePage.bind(this));
  }
  ChangePage(event) {
    /**
     * @type {import("../../../components/Button").ButtonElement}
     */
    let $button = event.currentTarget;

    if (!$button.IsDisabled()) {
      let last_id = $button.last_id;

      if (last_id)
        $Z.moderation.all.data.lastId = ~~last_id;
      else {
        delete $Z.moderation.all.data.lastId;
        delete $Z.moderation.all.data.settings.last_id;
      }

      this.MarkPreviousButton();
      $Z.moderation.all.getContent();
      $button
        .Disable()
        .ChangeType("primary-mint")
        .focus();
      $('#moderation-all > div.content > .moderation-item').remove();
    }
  }
  MarkPreviousButton() {
    /**
     * @type {import("../../../components/Button").JQueryButtonElement}
     */
    let $clickedButtons = $("button[disabled]", this.$numberButtonContainer);

    $clickedButtons.each((i, button) => button.Enable().ChangeType("secondary"));
  }
}

export default Pagination
