import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import { Flex, Select, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type FiltersClassType from "../FiltersPanel";
import Subject from "./Subject";

export default class Subjects {
  main: FiltersClassType;

  container: FlexElementType;
  contentWrapper: FlexElementType;
  subjectSelect: Select;
  subjects: Subject[];

  constructor(main: FiltersClassType) {
    this.main = main;

    this.subjects = [];

    this.Render();
    this.InitSubjects();
  }

  Render() {
    this.container = Flex();

    this.main.container.append(this.container);

    this.contentWrapper = Build(
      Flex({
        grow: true,
        marginTop: "m",
        wrap: true,
      }),
      [
        [
          Flex({
            marginRight: "xs",
            alignItems: "center",
          }),
          Text({
            noWrap: true,
            size: "small",
            weight: "bold",
            text: `${System.data.locale.reportedContents.filtersPanel.filters.subject.name}: `,
          }),
        ],
        [
          Flex({
            grow: true,
          }),
          (this.subjectSelect = new Select({
            fullWidth: true,
            multiple: true,
            onChange: this.InputChanged.bind(this),
            options: [
              {
                selected: true,
                text: System.data.locale.common.chooseAnOption,
              },
            ],
          })),
        ],
      ],
    );

    this.Show();
  }

  InitSubjects() {
    System.data.Brainly.defaultConfig.config.data.subjects.forEach(
      subjectData => {
        const subject = new Subject(this, subjectData);

        this.subjects.push(subject);
      },
    );
  }

  InputChanged() {
    const selectedOptions = Array.from(
      this.subjectSelect.select.selectedOptions,
    );
    const selectedSubjectIds = this.subjects
      .filter(_subject => selectedOptions.includes(_subject.option))
      .map(subject => subject.data.id);

    this.main.main.filter.byName.subject.SetQuery(selectedSubjectIds);
  }

  Show() {
    this.container.append(this.contentWrapper);
  }

  Hide() {
    this.Deselected();
    HideElement(this.contentWrapper);
  }

  Deselected() {
    this.subjectSelect.select.value = "";
  }
}
