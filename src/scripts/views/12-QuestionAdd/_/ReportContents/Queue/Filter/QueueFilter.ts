import HideElement from "@root/helpers/HideElement";
import { Flex, Icon, Label } from "@style-guide";
import type { IconTypeType } from "@style-guide/Icon";
import type { LabelColorType } from "@style-guide/Label";
import type QueueClassType from "../Queue";

type QueueFilterPropsType = {
  labelColor: LabelColorType;
  labelIconType: IconTypeType;
  labelName: string;
};

export default class QueueFilter {
  main: QueueClassType;
  props: QueueFilterPropsType;

  labelContainer: import("@style-guide/Flex").FlexElementType;
  label: Label;
  labelText: Text;

  query?: {
    [x: string]: any;
  };

  constructor(main: QueueClassType, props: QueueFilterPropsType) {
    this.main = main;
    this.props = props;
  }

  protected QuerySettled() {
    this.ShowLabel();
    this.main.main.fetcher?.FilterContents();
    this.main.main.queue.ShowContents();
  }

  RenderLabel() {
    this.labelContainer = Flex({
      margin: "xxs",
      children: this.label = new Label({
        color: this.props.labelColor,
        onClose: this.HideLabel.bind(this),
        icon: new Icon({
          type: this.props.labelIconType,
        }),
        children: [
          `${this.props.labelName}:&nbsp; `,
          (this.labelText = document.createTextNode("")),
        ],
      }),
    });
  }

  ShowLabel() {
    if (!this.labelContainer) {
      this.RenderLabel();
    }

    this.main.main.filterLabelContainer.append(this.labelContainer);
  }

  HideLabel(event?: MouseEvent) {
    if (event) {
      this.main.options.option.contentFilters.filter.attachmentLength //
        .Deselected();
    }

    this.query = {};

    HideElement(this.labelContainer);
    this.main.main.fetcher?.FilterContents();
    this.main.main.queue.ShowContents();
  }
}
