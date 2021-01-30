/* eslint-disable no-underscore-dangle */
import CreateElement from "@components/CreateElement";
import type { DeleteReasonSubCategoryType } from "@root/controllers/System";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import { Flex, Icon, Select, Text } from "@style-guide";
import SetProps from "@style-guide/helpers/SetProps";
import type QuickActionButtonsClassType from "../QuickActionButtons";
import ActionButton from "./ActionButton";

export default class MoreButton extends ActionButton {
  private reasonSelect: Select;
  private optionEntries: {
    reason: DeleteReasonSubCategoryType;
    element: HTMLOptionElement;
  }[];

  tippyContent: import("@style-guide/Flex").FlexElementType;

  constructor(main: QuickActionButtonsClassType) {
    super(
      main,
      "left",
      {
        type: "solid-gray",
        whiteBg: true,
        iconOnly: true,
        reversedOrder: true,
        title: System.data.locale.common.seeMoreDeletionReasons,
        icon: new Icon({
          size: 32,
          type: "more",
          color: "adaptive",
        }),
      },
      Text({
        tag: "div",
        size: "small",
        weight: "bold",
        children: System.data.locale.common.seeMoreDeletionReasons,
      }),
    );

    SetProps(this.button.element, {
      onClick: this.ShowDropdown.bind(this),
      onMouseEnter: this.ShowDropdown.bind(this),
      onTouchStart: this.ShowDropdown.bind(this),
    });
  }

  HideDropdown() {
    if (this.main.moderating) return;

    if (this.main.props.vertical) {
      this.container.append(this.button.element);
      HideElement(this.reasonSelect?.element);
    }

    this.buttonTippy.hide();
  }

  ShowDropdown() {
    if (this.main.moderating || !this.button.IsIconOnly()) return;

    if (!this.reasonSelect) {
      this.RenderDropdown();
    }

    if (this.main.props.vertical) {
      HideElement(this.button.element);
      this.container.append(this.reasonSelect.element);
    } else if (!this.tippyContent) {
      this.MoveSelectInFragment();
    }
  }

  RenderDropdown() {
    this.optionEntries = [];

    const optionChildren = [];
    const reasonCategories = Object.values(
      System.data.Brainly.deleteReasons[
        this.main.contentType === "Question"
          ? "question"
          : this.main.contentType === "Answer"
          ? "answer"
          : "comment"
      ],
    );

    reasonCategories.forEach(reasonCategory => {
      let group;

      if (reasonCategory.subcategories && reasonCategories.length > 1) {
        group = CreateElement({
          tag: "optgroup",
          label: reasonCategory.text,
        });

        optionChildren.push(group);
      }

      reasonCategory.subcategories?.forEach(reason => {
        if (!("id" in reason)) return;

        const optionElement = CreateElement({
          tag: "option",
          children: reason.title,
        });

        this.optionEntries.push({
          reason,
          element: optionElement,
        });

        if (group) {
          group.append(optionElement);
        } else {
          optionChildren.push(optionElement);
        }
      });
    });

    this.reasonSelect = new Select({
      onClick: this.ResetSelection.bind(this),
      onMouseLeave: this.main.props.vertical && this.HideDropdown.bind(this),
      onChange: this.ReasonSelected.bind(this),
      style: {
        minWidth: "max-content",
      },
      options: [
        {
          selected: true,
          text: System.data.locale.common.chooseAnOption,
        },
        ...optionChildren,
      ],
    });
  }

  ResetSelection() {
    const { selectedOptions } = this.reasonSelect.select;

    if (!selectedOptions.length) return;

    const selectedOption = selectedOptions[0];
    const selectedEntry = this.optionEntries.find(
      entry => entry.element === selectedOption,
    );

    if (!selectedEntry || this.main.moderating) return;

    this.reasonSelect.select.options[0].selected = true;
  }

  MoveSelectInFragment() {
    this.tippyContent = Build(Flex({ direction: "column" }), [
      [Flex({ marginBottom: "s" }), this.tooltipContent],
      this.reasonSelect.element,
    ]);

    this.buttonTippy.setContent(this.tippyContent);
    this.buttonTippy.setProps({
      interactive: true,
      maxWidth: 600,
      trigger: "mouseenter focus click",
    });
  }

  async ReasonSelected() {
    const { selectedOptions } = this.reasonSelect.select;

    if (!selectedOptions.length) return;

    const selectedOption = selectedOptions[0];
    const { reason } =
      this.optionEntries.find(entry => entry.element === selectedOption) || {};

    if (!reason) return;

    await this.Selected();
    this.main.Moderating();

    const confirmMessage = System.data.locale.common.moderating.doYouWantToDeleteWithReason
      .replace("%{reason_title}", reason.title)
      .replace("%{reason_message}", reason.text);

    if (!confirm(confirmMessage)) {
      this.main.NotModerating();
      (this.reasonSelect.options[0] as HTMLOptionElement).selected = true;

      return;
    }

    const giveWarning = System.canBeWarned(reason.id);

    this.main.DeleteContent({
      model_id: this.main.content.databaseId,
      reason_id: reason.category_id,
      reason: reason.text,
      reason_title: reason.title,
      give_warning: giveWarning,
      take_points: true,
      return_points: false,
    });
  }
}
