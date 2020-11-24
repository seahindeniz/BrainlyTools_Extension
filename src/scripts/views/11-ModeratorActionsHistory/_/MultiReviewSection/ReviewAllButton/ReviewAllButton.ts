import notification from "@components/notification2";
import ActionHistoryNewReview from "@ServerReq/ActionsHistory/NewReview";
import { Button, Flex, Icon, Text } from "@style-guide";
import type { ButtonColorType } from "@style-guide/Button";
import type { IconTypeType } from "@style-guide/Icon";
import tippy from "tippy.js";
import type MultiReviewSectionClassType from "../MultiReviewSection";

export default class ReviewAllButton {
  main: MultiReviewSectionClassType;
  private buttonColor: ButtonColorType;
  private buttonIconType: IconTypeType;
  private buttonTitle: string;
  private buttonText: string;

  container: import("@style-guide/Flex").FlexElementType;

  constructor(
    main: MultiReviewSectionClassType,
    buttonColor: ButtonColorType,
    buttonIconType: IconTypeType,
    buttonText: string,
    buttonTitle: string,
  ) {
    this.main = main;
    this.buttonColor = buttonColor;
    this.buttonIconType = buttonIconType;
    this.buttonTitle = buttonTitle;
    this.buttonText = buttonText;

    this.Render();
  }

  Render() {
    this.container = Flex({
      children: new Button({
        ...this.buttonColor,
        children: this.buttonText,
        icon: new Icon({
          type: this.buttonIconType,
        }),
        onClick: this.ReviewAllActions.bind(this),
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
  }

  async ReviewAllActions(valid: boolean) {
    try {
      console.log(this);

      if (typeof valid !== "boolean") {
        throw Error("Invalid parameter");
      }

      // console.log(data);
      this.ShowSpinner();
      await System.Delay(1000);

      const hashList = [
        ...new Set(
          this.main.main.actionEntries
            .filter(actionEntry => !actionEntry.dataEntry)
            .map(actionEntry => actionEntry.hash),
        ),
      ];

      const resReview = await ActionHistoryNewReview(
        this.main.main.moderator.id,
        valid,
        hashList,
      );

      if (resReview.success === false) {
        throw new Error("Review failed");
      }

      this.main.lastReviewedDataEntries = this.main.AssignReviewData(
        valid,
        resReview.data,
      );

      console.log(resReview);
      this.Reviewed();
    } catch (error) {
      console.error(error);
      this.ReviewFailed();
    }

    // this.main.HideSpinner();
  }

  ShowSpinner() {
    this.container.append(this.main.spinner);
  }

  Reviewed() {
    this.main.ToggleReviewButtons();
    this.main.ToggleRevertAllButton();
  }

  ReviewFailed() {
    console.error(this);

    notification({
      type: "error",
      text:
        System.data.locale.common.notificationMessages.operationErrorRefresh,
    });
  }
}
