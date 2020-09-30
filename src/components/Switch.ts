import generateRandomString from "@root/helpers/generateRandomString";
import { CommonComponentPropsType } from "@style-guide/helpers/SetProps";
import clsx from "clsx";
import CreateElement from "./CreateElement";

type SwitchPropsType = {
  checked?: boolean;
  id?: string;
  className?: string;
} & CommonComponentPropsType;

export default class Switch {
  input: HTMLInputElement;
  label: HTMLLabelElement;
  element: HTMLLabelElement;
  inputId: string;

  constructor({
    checked,
    className,
    id = generateRandomString(),
    ...props
  }: SwitchPropsType = {}) {
    const switchClass = clsx("ext-switch", className);
    this.inputId = id;

    this.input = CreateElement({
      tag: "input",
      type: "checkbox",
      checked,
      id: id || undefined,
      ...props,
    });

    this.label = CreateElement({
      tag: "label",
      htmlFor: id || undefined,
      children: [
        CreateElement({
          tag: "span",
          className: "active",
        }),
        CreateElement({
          tag: "span",
          className: "inactive",
        }),
      ],
    });

    this.element = CreateElement({
      tag: "label",
      className: switchClass,
      children: [this.input, this.label],
    });
  }

  ChangeId(id: string) {
    this.input.id = id;
    this.inputId = id;
    this.label.htmlFor = id;

    return this;
  }
}
