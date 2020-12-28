import {
  DeleteReasonPropsType,
  DeleteReasonSubCategoryType,
} from "@root/controllers/System";
import { Text } from "@style-guide";
import type { ButtonPropsType } from "@style-guide/Button";
import type QuickActionButtonsClassType from "../QuickActionButtons";
import ActionButton from "./ActionButton";

export default class DeleteButton extends ActionButton {
  deleteReason: DeleteReasonSubCategoryType;

  constructor(
    main: QuickActionButtonsClassType,
    deleteReasonProps: DeleteReasonPropsType,
    index: number,
    buttonProps: ButtonPropsType,
  ) {
    const reason = System.DeleteReason(deleteReasonProps);
    const title = `<b>${reason.title}</b>:\n\n${reason.text}`;

    super(
      main,
      "right",
      {
        ...buttonProps,
        iconOnly: true,
        title,
        icon: Text({
          text: index + 1,
          color: "white",
          weight: "bold",
        }),
      },
      title,
    );

    this.deleteReason = reason;

    this.button.element.addEventListener("click", this.Clicked.bind(this));
  }

  async Clicked() {
    await this.Selected();

    this.main.Moderating();

    const confirmMessage = System.data.locale.common.moderating.doYouWantToDeleteWithReason
      .replace("%{reason_title}", this.deleteReason.title)
      .replace("%{reason_message}", this.deleteReason.text);

    if (!confirm(confirmMessage)) {
      this.main.NotModerating();

      return;
    }

    const giveWarning = System.canBeWarned(this.deleteReason.id);

    this.main.DeleteContent({
      model_id: this.main.content.databaseId,
      reason_id: this.deleteReason.category_id,
      reason: this.deleteReason.text,
      reason_title: this.deleteReason.title,
      give_warning: giveWarning,
      take_points: giveWarning,
      return_points: giveWarning,
    });
  }
}
