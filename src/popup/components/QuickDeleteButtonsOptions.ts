/* eslint-disable no-underscore-dangle */
import { QuickDeleteButtonReasonsType } from "@root/scripts/controllers/System";
import storage from "../../scripts/helpers/extStorage";
import notification from "./notification";

function OrderDropdownItems($dropdown) {
  const selectedItem = $("option:selected", $dropdown).val();

  $("option:gt(0)", $dropdown)
    // @ts-ignore TODO check this
    .sort((a, b) => ($(b).text() < $(a).text() ? 1 : -1))
    .appendTo($dropdown);
  $($dropdown).val(selectedItem);
}

const isPosInt = str => /^\+?\d+$/.test(str);
function RenderDropdownItems(reasonTypeKey, selectedReason, $dropdown) {
  let options = "";
  const reasons = System.data.Brainly.deleteReasons.__withIds[reasonTypeKey];

  $.each(reasons, (reasonId, reason) => {
    if (String(reasonId).indexOf("__") < 0) {
      const category = reasons.__categories[reason.category_id];
      // TODO check selected reason is selected on the dropdown
      const isSelected = selectedReason === reasonId ? " selected" : "";
      const title =
        category.text === reason.title
          ? reason.title
          : `${category.text} › ${reason.title}`;

      options += `<option data-cat-id="${category.id}" data-reason-id="${String(
        reasonId,
      )}" title="${reason.text}"${isSelected}>${title}</option>`;
    }
  });

  $dropdown.append(options);
  OrderDropdownItems($dropdown);
}

class QuickDeleteButtonsOptions {
  quickDeleteButtonsReasons: QuickDeleteButtonReasonsType;

  $layout: JQuery<HTMLElement>;
  $container: JQuery<HTMLElement>;

  constructor(quickDeleteButtonsReasons: QuickDeleteButtonReasonsType) {
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
      const reasonTypeKeyCode =
        reasonTypeKey === "question"
          ? 1
          : reasonTypeKey === "answer"
          ? 2
          : reasonTypeKey === "comment"
          ? 45
          : null;

      if (System.checkUserP(reasonTypeKeyCode)) {
        this.RenderCategory(reasonTypeKey);
      }
    });
  }

  RenderCategory(reasonTypeKey) {
    const $field = $(`
		<div class="board-item">
			<div class="board-item-content" data-type="${reasonTypeKey}">
				<span>${System.data.locale.popup.extensionOptions.quickDeleteButtons[reasonTypeKey]}</span>
			</div>
		</div>`);
    const $fieldContent = $("> .board-item-content", $field);

    this.RenderDropdowns(reasonTypeKey, $fieldContent);
    $field.appendTo(this.$container);
  }

  RenderDropdowns(reasonTypeKey, $fieldContent) {
    const selectedReasons = this.GetSelectedReasons(reasonTypeKey);
    const defaultReasons =
      System.data.config.marketConfig.quickDeleteButtonsDefaultReasons[
        reasonTypeKey
      ];

    if (
      selectedReasons &&
      selectedReasons.length > 0 &&
      isPosInt(selectedReasons[0])
    ) {
      defaultReasons.forEach((defaultReason, i) => {
        const selectedReason = selectedReasons[i] || defaultReason;
        const $dropdownContainer = $(`
				<div class="control title is-6 has-text-centered">
					<div class="select">
						<select>
							<option disabled>Select a reason</option>
						</select>
					</div>
				</div>`);

        const $dropdown = $("> div.select > select", $dropdownContainer);

        RenderDropdownItems(reasonTypeKey, selectedReason, $dropdown);

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
      selectedReasons =
        System.data.config.quickDeleteButtonsReasons[reasonTypeKey];
    }

    if (!selectedReasons) {
      selectedReasons =
        System.data.config.marketConfig.quickDeleteButtonsDefaultReasons[
          reasonTypeKey
        ];
    }

    return selectedReasons || [];
  }

  DropdownChangeHandler() {
    notification("Button selections saved");

    const reasonIdStore = {};
    const $dropdowns = $("div.select > select", this.$container);

    $dropdowns.each((i, $dropdown) => {
      const reasonType = $($dropdown)
        .parents(".board-item-content")
        .data("type");
      const reasonId = $("option:selected", $dropdown).data("reason-id");

      if (!reasonIdStore[reasonType]) {
        reasonIdStore[reasonType] = [];
      }

      reasonIdStore[reasonType].push(reasonId);
    });

    storage("set", { quickDeleteButtonsReasons: reasonIdStore });
  }
}

export default QuickDeleteButtonsOptions;
