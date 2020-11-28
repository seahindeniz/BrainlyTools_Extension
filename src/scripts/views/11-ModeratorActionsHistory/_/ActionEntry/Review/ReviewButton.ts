import notification from "@components/notification2";
import ActionHistoryNewReview from "@ServerReq/ActionsHistory/NewReview";
import { Button, Flex, Icon, Text } from "@style-guide";
import type { ButtonColorType } from "@style-guide/Button";
import type { IconTypeType } from "@style-guide/Icon";
import tippy from "tippy.js";
import type ActionEntryClassType from "../ActionEntry";

export default class ReviewButton {
  main: ActionEntryClassType;
  private buttonColor: ButtonColorType;
  private buttonIconType: IconTypeType;
  buttonTitle: string;

  container: import("@style-guide/Flex").FlexElementType;

  constructor(
    main: ActionEntryClassType,
    buttonColor: ButtonColorType,
    buttonIconType: IconTypeType,
    buttonTitle: string,
  ) {
    this.main = main;
    this.buttonColor = buttonColor;
    this.buttonIconType = buttonIconType;
    this.buttonTitle = buttonTitle;

    this.Render();
  }

  Render() {
    this.container = Flex({
      children: new Button({
        size: "xs",
        ...this.buttonColor,
        iconOnly: true,
        icon: new Icon({
          type: this.buttonIconType,
        }),
        onClick: this.ReviewAction.bind(this),
      }),
    });

    tippy(this.container, {
      placement: "top",
      theme: "light",
      content: Text({
        weight: "bold",
        size: "small",
        children: this.buttonTitle,
      }),
    });

    // this.main.reviewButtonsContainer.append(this.container);
  }

  async ReviewAction(valid: boolean) {
    try {
      this.ShowSpinner();
      await System.Delay(50);

      const resReview = await ActionHistoryNewReview(
        this.main.main.moderator.id,
        valid,
        this.main.hash,
      );

      if (resReview.success === false) {
        throw new Error("Review failed");
      }

      this.main.main.multiReviewSection.AssignReviewData(valid, resReview.data);
      this.Reviewed();
    } catch (error) {
      console.error(error);
      this.ReviewFailed();
    }

    this.main.HideSpinner();
  }

  ShowSpinner() {
    this.container.append(this.main.spinner);
  }

  Reviewed() {
    this.main.Reviewed();
    this.main.main.multiReviewSection.Reviewed();
  }

  ReviewFailed() {
    console.error(this);

    notification({
      type: "error",
      text: "Review failed",
    });
  }
}
