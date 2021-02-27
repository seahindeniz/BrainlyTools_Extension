import type { RemoveAnswerReqDataType } from "@BrainlyAction";
import { GQL } from "@BrainlyReq";
import CreateElement from "@components/CreateElement";
import DeleteSection from "@components/DeleteSection2/DeleteSection";
import { ContentTypeType } from "@components/ModerationPanel/ContentSection/ContentSection";
import notification from "@components/notification2";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import { Button, Checkbox, Flex, Label } from "@style-guide";
import gql from "graphql-tag";
import {
  AnswerAttachmentFragment,
  AnswerAttachmentsType,
} from "./answerAttachment.fragment";
import Answer from "./_/Answer";
import ShortAnswerModeratePanelController from "./_/ModeratePanelController";

type AnswerMapType = {
  [questionId: string]: AnswerAttachmentsType;
};

function GenerateAliasedQuery(idList: number[]) {
  return idList.map(id => {
    const globalId = window.btoa(`answer:${id}`);

    return `
        answer${id}: answer(id: "${globalId}") {
          ...AnswerAttachmentFragment
        }
    `;
  });
}

export default class ShortAnswers {
  answers: {
    all: Answer[];
    byId: {
      [x in ContentTypeType]: {
        [id: number]: Answer;
      };
    };
  };

  moderatePanelController: ShortAnswerModeratePanelController;
  answersTable: HTMLTableElement;
  headerRow: HTMLTableRowElement;
  answerRows: NodeListOf<HTMLTableRowElement>;
  deleteSection: DeleteSection;
  selectAllCheckbox: Checkbox;
  toggleSelectionsButton: Button;
  selectedAnswers: Answer[];
  loopTryToDeleteAnswers: number;
  deleteReqData: RemoveAnswerReqDataType;
  selectedAnswersLength: number;
  stopButton: Button;

  constructor() {
    this.answers = {
      all: [],
      byId: {
        Answer: {},
        Question: {},
      },
    };
    this.moderatePanelController = new ShortAnswerModeratePanelController(this);

    this.FindTable();
    this.FindAnswerRows();
    this.InitAnswers();
    this.GetAttachmentDetails();
    this.RenderCheckboxColumn();
    this.RenderSelectAllCheckbox();
    this.RenderDeleteSection();
  }

  private FindTable() {
    this.answersTable = document.querySelector("table.prices");

    if (!this.answersTable) {
      throw Error("Can't find the table of answers");
    }

    this.answersTable.removeAttribute("style");
  }

  private FindAnswerRows() {
    this.answerRows = this.answersTable.querySelectorAll(":scope > tbody > tr");
  }

  private InitAnswers() {
    if (!this.answerRows?.length) return;

    this.answerRows.forEach(answerRow => {
      const answer = new Answer(this, answerRow);

      this.answers.all.push(answer);
      this.answers.byId.Answer[answer.answerId] = answer;
      this.answers.byId.Question[answer.questionId] = answer;
    });
  }

  private async GetAttachmentDetails() {
    const idList = this.answers.all.map(answer => answer.answerId);
    const aliasedQueries = GenerateAliasedQuery(idList);
    const query = gql`
      {
        ${aliasedQueries.join("\n")}
      }
      ${AnswerAttachmentFragment}
    `;

    const res = await GQL<AnswerMapType>(query);

    if (!res?.data) {
      throw Error("Can't fetch answer details");
    }

    Object.entries(res.data).forEach(([key, answerData]) => {
      if (!answerData?.attachments?.length) return;

      const answer = this.answers.byId.Answer[System.ExtractId(key)];

      if (!answer) return;

      answer.attachments = answerData.attachments;

      answer.RenderAttachmentIcon();
    });
  }

  private RenderCheckboxColumn() {
    if (!this.answerRows?.length || !System.checkUserP(15)) return;

    const headerRow = this.answersTable.querySelector("thead > tr");

    if (!headerRow) {
      throw Error("Can't find the table header row");
    }

    headerRow.prepend(
      CreateElement({
        tag: "th",
      }),
    );
  }

  private RenderSelectAllCheckbox() {
    if (!this.answerRows?.length || !System.checkUserP(15)) return;

    this.selectAllCheckbox = new Checkbox({
      id: null,
    });

    const selectAllCheckboxContainer = Build(
      Flex({
        alignItems: "flex-start",
        marginTop: "s",
        marginBottom: "s",
        direction: "column",
      }),
      [
        [
          Flex(),
          new Label({
            tag: "label",
            type: "transparent",
            children: System.data.locale.common.selectAll,
            icon: this.selectAllCheckbox.element,
            onChange: this.SelectAllCheckboxes.bind(this),
          }),
        ],
        [
          Flex({}),
          (this.toggleSelectionsButton = new Button({
            type: "outline",
            toggle: "blue",
            size: "xs",
            children: System.data.locale.common.toggleSelections,
            onClick: this.ToggleCheckboxes.bind(this),
          })),
        ],
      ],
    );

    this.answersTable.parentElement.append(selectAllCheckboxContainer);
  }

  private SelectAllCheckboxes() {
    this.answers.all.forEach(answer => {
      if (answer.deleted) return;

      answer.checkbox.input.checked = this.selectAllCheckbox.input.checked;
    });
  }

  private ToggleCheckboxes() {
    this.answers.all.forEach(answer => {
      if (answer.deleted) return;

      answer.checkbox.input.checked = !answer.checkbox.input.checked;
    });
  }

  private RenderDeleteSection() {
    if (!this.answerRows?.length || !System.checkUserP(15)) return;

    this.deleteSection = new DeleteSection({
      defaults: {
        contentType: "Answer",
      },
      listeners: {
        onDeleteButtonClick: this.DeleteSelectedAnswers.bind(this),
      },
    });

    this.answersTable.parentElement.append(this.deleteSection.container);
  }

  private DeleteSelectedAnswers() {
    this.selectedAnswers = this.answers.all.filter(
      answer => answer.checkbox.input.checked && !answer.deleted,
    );
    this.selectedAnswersLength = this.selectedAnswers.length;

    if (this.selectedAnswersLength === 0) {
      notification({
        type: "info",
        text: System.data.locale.shortAnswersPage.selectAtLeastOneAnswer,
      });

      return;
    }

    if (
      !confirm(
        System.data.locale.shortAnswersPage.doYouWantToDeleteSelectedAnswers,
      )
    )
      return;

    this.StartDeletingAnswers();
  }

  StartDeletingAnswers() {
    this.deleteReqData = this.deleteSection.PrepareData();

    this.ShowStopButton();
    this.TryToDeleteAnswers();
    this.loopTryToDeleteAnswers = window.setInterval(
      this.TryToDeleteAnswers.bind(this),
      1000,
    );
  }

  ShowStopButton() {
    if (!this.stopButton) {
      this.RenderStopButton();
    }

    HideElement(this.deleteSection.deleteButton.element);
    this.deleteSection.buttonContainer.append(this.stopButton.element);
  }

  RenderStopButton() {
    this.stopButton = new Button({
      children: System.data.locale.common.stop,
      onClick: this.FinishDeletion.bind(this),
      type: "solid-blue",
    });
  }

  TryToDeleteAnswers() {
    const selectedAnswers = this.selectedAnswers.splice(0, 7);

    if (!selectedAnswers) {
      this.StopDeletion();

      return;
    }

    selectedAnswers.forEach(async answer => {
      await answer.quickActionButtons.DeleteContent({
        ...this.deleteReqData,
        model_id: answer.answerId,
      });

      this.selectedAnswersLength--;

      if (this.selectedAnswersLength === 0) {
        this.FinishDeletion();
      }
    });
  }

  StopDeletion() {
    clearInterval(this.loopTryToDeleteAnswers);
  }

  FinishDeletion() {
    this.StopDeletion();
    this.HideStopButton();
  }

  HideStopButton() {
    HideElement(this.stopButton.element);
    this.deleteSection.buttonContainer.append(
      this.deleteSection.deleteButton.element,
    );
  }
}

// eslint-disable-next-line no-new
new ShortAnswers();
