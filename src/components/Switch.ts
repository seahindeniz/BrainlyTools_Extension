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
  element: HTMLDivElement;
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
      checked,
      className: "ext-switch__element",
      id: id || undefined,
      tag: "input",
      type: "checkbox",
      ...props,
    });

    this.label = CreateElement({
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
      className: "ext-switch__ghost",
      htmlFor: id || undefined,
      tag: "label",
    });

    this.element = CreateElement({
      tag: "div",
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
