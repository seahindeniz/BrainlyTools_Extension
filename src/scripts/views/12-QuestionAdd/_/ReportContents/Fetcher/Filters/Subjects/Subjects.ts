import { Flex, Select } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type FiltersType from "../Filters";
import Subject from "./Subject";

export default class Subjects {
  main: FiltersType;
  subjects: Subject[];

  container: FlexElementType;
  subjectSelect: Select;

  selectedSubject: Subject;

  constructor(main: FiltersType) {
    this.main = main;
    this.subjects = [];

    this.Render();
    this.InitSubjects();
    this.BindListener();
  }

  Render() {
    this.container = Flex({
      grow: true,
      margin: "xxs",
      // marginRight: "s",
      children: this.subjectSelect = new Select({
        fullWidth: true,
      }),
    });

    this.main.filtersContainer.append(this.container);
  }

  InitSubjects() {
    const allSubjects = new Subject(this, {
      id: 0,
      name: System.data.locale.reportedContents.subjectFilterFirstOption,
    });
    this.selectedSubject = allSubjects;

    this.subjects.push(allSubjects);

    System.data.Brainly.defaultConfig.config.data.subjects.forEach(data => {
      if (data.enabled) this.subjects.push(new Subject(this, data));
    });
  }

  BindListener() {
    this.subjectSelect.select.addEventListener(
      "change",
      this.SubjectChanged.bind(this),
    );
  }

  SubjectChanged() {
    this.AssignSelectedSubject();

    if (!this.selectedSubject) return;

    this.main.main.FetchReports({ resetStore: true });
  }

  AssignSelectedSubject() {
    const selectedOption = this.subjectSelect.select.selectedOptions[0];
    this.selectedSubject = this.subjects.find(
      subject => subject.option === selectedOption,
    );
  }
}
