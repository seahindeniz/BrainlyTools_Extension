import type { QuestionDataInTicketType } from "@BrainlyAction";
import { Counter, Text } from "@style-guide";
import type ModerationPanelClassType from "../ModerationPanel";
import ContentSection from "./ContentSection";

export default class Question extends ContentSection {
  questionData: QuestionDataInTicketType;

  constructor(main: ModerationPanelClassType) {
    super(main, "Question");

    this.questionData = this.main.data.task;
    this.data = this.questionData;

    this.SetOwner();
    this.Render();
    this.RenderUserDetails();
    this.RenderContentDetails();
  }

  RenderUserDetails() {
    const subjectData = System.data.Brainly.defaultConfig.config.data.subjects.find(
      subject => subject.id === this.questionData.subject_id,
    );
    const gradeData = System.data.Brainly.defaultConfig.config.data.grades.find(
      grade => grade.id === this.questionData.grade_id,
    );

    // const subjectLink = System.createBrainlyLink();

    this.userDetailsContainer.RenderChildren(
      Text({
        tag: "span",
        size: "xsmall",
        color: "gray-secondary",
        text: subjectData.name,
      }),
      Text({
        tag: "span",
        size: "xsmall",
        color: "gray-secondary",
        text: gradeData.name,
      }),
    );
  }

  RenderContentDetails() {
    this.contentDetailsContainer.append(
      Counter({
        icon: "points",
        children: [
          `+${this.questionData.points.ptsForResp} `,
          Text({
            tag: "span",
            size: "small",
            weight: "bold",
            color: "gray-secondary",
            text: System.data.locale.common.shortPoints.toLowerCase(),
          }),
        ],
      }),
    );
  }
}
