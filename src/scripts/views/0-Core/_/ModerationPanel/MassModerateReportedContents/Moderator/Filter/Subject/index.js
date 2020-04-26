import { Flex, Select } from "@/scripts/components/style-guide";
import Build from "@/scripts/helpers/Build";
import Filter from "..";
import Subject from "./Subject";

export default class SubjectFilter extends Filter {
  /**
   * @param {import("../..").default} main
   */
  constructor(main) {
    super(main, "Subject");

    if (!System.data.Brainly.defaultConfig.config.data.subjects) return this;

    /**
     * @type {Subject[]}
     */
    this.subjects = [];
    /**
     * @type {{[id: number]: Subject}}
     */
    this.selectedSubjects = {};

    this.Render();
    this.InitSubjects();
    this.BindListener();
  }

  InitSubjects() {
    System.data.Brainly.defaultConfig.config.data.subjects.forEach(
      /**
       * @param {import("./Subject").SubjectDataType} subjectData
       */
      subjectData => {
        const subject = new Subject(this, subjectData);

        this.subjects.push(subject);
      },
    );
  }

  Render() {
    const selectComponent = Select({
      options: [
        {
          text: System.data.locale.common.chooseAnOption,
          disable: true,
        },
      ],
    });
    this.select = selectComponent.select;
    this.chooseAnOptionOption = this.select.querySelector("option");
    this.container = Build(Flex({ direction: "column" }), [
      [Flex(), selectComponent.container],
      (this.labelContainer = Flex({
        marginTop: "xxs",
        direction: "column-reverse",
      })),
    ]);

    this.optionsContainer.append(this.container);
  }

  BindListener() {
    this.select.addEventListener("change", this.SelectChanged.bind(this));
  }

  SelectChanged() {
    if (
      this.select.selectedOptions.length === 0 ||
      this.select.selectedOptions[0] === this.chooseAnOptionOption
    )
      return;

    this.subjects.some(subject => subject.Selected());
    this.main.FilterReports();
  }

  /**
   * @param {import("../../../Report").default} report
   */
  CheckReport(report) {
    return !!this.selectedSubjects[report.data.subject_id];
  }

  IsUsed() {
    console.log("subjects in use", Object.keys(this.selectedSubjects).length);
    return Object.keys(this.selectedSubjects).length > 0;
  }
}
