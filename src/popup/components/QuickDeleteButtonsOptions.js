import storage from "../../scripts/helpers/extStorage";
import notification from "../components/notification";

const isPosInt = str => /^\+?\d+$/.test(str);

class QuickDeleteButtonsOptions {
  constructor(quickDeleteButtonsReasons) {
    this.quickDeleteButtonsReasons = quickDeleteButtonsReasons;

    this.Render();
    this.RenderCategories();
  }
  Render() {
    this.$layout = $(`
		<div id="quickDeleteButtons" class="column is-narrow">
			<article class="message is-danger">
				<div class="message-header" title="${System.data.locale.popup.extensionOptions.quickDeleteButtons.title}">
					<p>${System.data.locale.popup.extensionOptions.quickDeleteButtons.text}</p>
				</div>
				<div class="message-body"></div>
			</article>
		</div>`);

    this.$container = $("> .message > .message-body", this.$layout);
  }
  RenderCategories() {
    let reasonTypes = Object.keys(System.data.Brainly.deleteReasons.__withIds);
    reasonTypes = reasonTypes.filter(type => type.indexOf("__") < 0).reverse();

    reasonTypes.forEach(reasonTypeKey => {
      let reasonTypeKeyCode =
        reasonTypeKey == "question" ? 1 :
        reasonTypeKey == "answer" ? 2 :
        reasonTypeKey == "comment" ? 45 :
        null;

      if (System.checkUserP(reasonTypeKeyCode)) {
        this.RenderCategory(reasonTypeKey);
      }
    });
  }
  RenderCategory(reasonTypeKey) {
    let $field = $(`
		<div class="board-item">
			<div class="board-item-content" data-type="${reasonTypeKey}">
				<span>${System.data.locale.popup.extensionOptions.quickDeleteButtons[reasonTypeKey]}</span>
			</div>
		</div>`);
    let $fieldContent = $("> .board-item-content", $field);

    this.RenderDropdowns(reasonTypeKey, $fieldContent);
    $field.appendTo(this.$container);
  }
  RenderDropdowns(reasonTypeKey, $fieldContent) {
    let selectedReasons = this.GetSelectedReasons(reasonTypeKey);
    let defaultReasons = System.data.config.marketConfig.quickDeleteButtonsDefaultReasons[reasonTypeKey];

    if (
      selectedReasons &&
      selectedReasons.length > 0 &&
      isPosInt(selectedReasons[0])
    ) {
      defaultReasons.forEach((defaultReason, i) => {
        let selectedReason = selectedReasons[i] || defaultReason;
        let $dropdownContainer = $(`
				<div class="control title is-6 has-text-centered">
					<div class="select">
						<select>
							<option disabled>Select a reason</option>
						</select>
					</div>
				</div>`);

        let $dropdown = $("> div.select > select", $dropdownContainer);

        this.RenderDropdownItems(reasonTypeKey, selectedReason, $dropdown);

        $fieldContent.append($dropdownContainer);
        $dropdown.on("change", this.DropdownChangeHandler.bind(this));
      });
    }
  }
  GetSelectedReasons(reasonTypeKey) {
    let selectedReasons;

    if (this.quickDeleteButtonsReasons)
      selectedReasons = this.quickDeleteButtonsReasons[reasonTypeKey];

    if (!selectedReasons) {
      selectedReasons = System.data.config.quickDeleteButtonsReasons[reasonTypeKey];
    }

    if (!selectedReasons) {
      selectedReasons = System.data.config.marketConfig.quickDeleteButtonsDefaultReasons[reasonTypeKey];
    }

    return selectedReasons || [];
  }
  RenderDropdownItems(reasonTypeKey, selectedReason, $dropdown) {
    let options = "";
    let reasons = System.data.Brainly.deleteReasons.__withIds[reasonTypeKey];

    $.each(reasons, (reasonId, reason) => {
      if (reasonId.indexOf("__") < 0) {
        let category = reasons.__categories[reason.category_id];
        let isSelected = selectedReason == reasonId ? " selected" : "";
        let title = category.text == reason.title ? reason.title : category.text + " › " + reason.title;

        options += `<option data-cat-id="${category.id}" data-reason-id="${reasonId}" title="${reason.text}"${isSelected}>${title}</option>`
      }
    });

    $dropdown.append(options);
    this.OrderDropdownItems($dropdown);
  }
  OrderDropdownItems($dropdown) {
    let selectedItem = $("option:selected", $dropdown).val();

    $("option:gt(0)", $dropdown).sort((a, b) => $(b).text() < $(a).text() ? 1 : -1).appendTo($dropdown);
    $($dropdown).val(selectedItem);
  }
  DropdownChangeHandler() {
    notification("Button selections saved");

    let reasonIdStore = {};
    let $dropdowns = $("div.select > select", this.$container);

    $dropdowns.each((i, $dropdown) => {
      let reasonType = $($dropdown).parents(".board-item-content").data("type");
      let reasonId = $('option:selected', $dropdown).data("reason-id");

      if (!reasonIdStore[reasonType]) {
        reasonIdStore[reasonType] = [];
      }

      reasonIdStore[reasonType].push(reasonId);
    });

    storage("set", { quickDeleteButtonsReasons: reasonIdStore });
  }
}

export default QuickDeleteButtonsOptions
