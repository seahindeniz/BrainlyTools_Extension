import type { SubjectDataType } from "@BrainlyReq/GetMarketConfig";
import CreateElement from "@components/CreateElement";
import type SubjectsType from "./Subjects";

export default class Subject {
  main: SubjectsType;
  data: SubjectDataType;

  option: HTMLOptionElement;

  constructor(main: SubjectsType, data: SubjectDataType) {
    this.main = main;
    this.data = data;

    this.Render();
  }

  Render() {
    this.option = CreateElement({
      tag: "option",
      children: this.data.name,
    });

    this.main.subjectSelect.select.append(this.option);
  }
}
