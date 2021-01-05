import type { SubjectDataType } from "@BrainlyReq/GetMarketConfig";
import CreateElement from "@components/CreateElement";
import type SubjectsClassType from "./Subjects";

export default class Subject {
  main: SubjectsClassType;
  data: SubjectDataType;

  option: HTMLOptionElement;

  constructor(main: SubjectsClassType, data: SubjectDataType) {
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
