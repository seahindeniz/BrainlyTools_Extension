import { AbuseReasonDataType } from "@BrainlyAction";
import CreateElement from "@components/CreateElement";
import type ReasonsClassType from "./Reasons";

export default class Reason {
  main: ReasonsClassType;
  data: AbuseReasonDataType;

  option: HTMLOptionElement;

  constructor(main: ReasonsClassType, data: AbuseReasonDataType) {
    this.main = main;
    this.data = data;

    this.Render();
    this.main.reasons.push(this);
  }

  Render() {
    this.option = CreateElement({
      tag: "option",
      children: this.data.text,
    });
  }
}
