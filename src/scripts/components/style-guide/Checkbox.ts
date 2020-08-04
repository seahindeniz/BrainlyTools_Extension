import classnames from "classnames";
import generateRandomString from "../../helpers/generateRandomString";
import CreateElement from "../CreateElement";
import Icon from "./Icon";

type CheckboxPropsType = {
  checked?: boolean;
  id?: string;
  className?: string;
};

type CheckboxElementType = HTMLDivElement & {
  inputId: string;
  ChangeId: (id: string) => CheckboxElementType;
};

const SG = "sg-checkbox";
const SGL = `${SG}__`;

function ChangeId(this: CheckboxElementType, id: string) {
  const input = this.querySelector("input");
  const label = this.querySelector("label");
  input.id = id;
  this.inputId = id;
  label.htmlFor = id;

  return this;
}

/**
 * @param {Properties} param0
 */
export default ({
  checked,
  id = generateRandomString(),
  className,
  ...props
}: CheckboxPropsType = {}): CheckboxElementType => {
  const checkboxClass = classnames(SG, className);

  const inputElement = CreateElement({
    tag: "input",
    type: "checkbox",
    checked,
    className: `${SGL}element`,
    id,
    ...props,
  });

  const icon = new Icon({
    type: "check",
    color: "adaptive",
    size: 16,
  });

  const labelElement = CreateElement({
    tag: "label",
    className: `${SGL}ghost`,
    htmlFor: id,
    children: icon.element,
  });

  // @ts-expect-error
  const container: CheckboxElementType = CreateElement({
    tag: "div",
    className: checkboxClass,
    children: [inputElement, labelElement],
    inputId: id,
    ChangeId,
  });

  return container;
};
