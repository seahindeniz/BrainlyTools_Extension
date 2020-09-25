import Action, { RemoveCommentReqDataType } from "@BrainlyAction";
import moment from "moment-timezone";
import UserContent from "./_/UserContent";
import type UserContentRowClassType from "./_/UserContentRow";

async function FindCommentsFromContent(content, type) {
  let allComments = [];

  if (content.comments.count > 0) {
    // This should be exists in here because this line can push comment details even if related question has been deleted.
    allComments = content.comments.items;

    if (
      content.comments.count > 5 &&
      content.settings &&
      !content.settings.is_deleted
    ) {
      const resComments = await new Action().GetComments(
        content.id,
        type,
        content.comments.count,
      );

      if (resComments && resComments.success)
        allComments = resComments.data.comments.items;
    }
  }

  return Promise.resolve(allComments);
}

function FindCommentsFromContents(
  contents: any[],
  type?: number,
): Promise<any[]> {
  return new Promise(resolve => {
    let allComments = [];

    const loop = async () => {
      const content = contents.shift();
      const comments = await FindCommentsFromContent(content, type);
      allComments = [...allComments, ...comments];

      if (contents.length === 0) {
        resolve(allComments);
      } else {
        loop();
      }
    };
    loop();
  });
}

async function FindUsersComments(data) {
  let allComments = [];
  const usersComments = [];

  const questionComments = await FindCommentsFromContent(data.task, 1);
  allComments = [...allComments, ...questionComments];

  if (data.responses && data.responses.length > 0) {
    const answersComments = await FindCommentsFromContents(
      [...data.responses],
      2,
    );
    allComments = [...allComments, ...answersComments];
  }

  if (allComments.length > 0) {
    allComments.forEach(comment => {
      if (comment.user_id === ~~window.sitePassedParams[0]) {
        comment.content = comment.content.replace(/(<([^>]+)>)/gim, "");

        usersComments.push(comment);
      }
    });
  }

  return Promise.resolve(usersComments);
}

function AttachCommentToRow(
  comment: { [x: string]: any },
  row: UserContentRowClassType,
) {
  const $dateCell = $("td:last", row.element);
  const date = $dateCell.text().trim();
  const $contentCell = $("td:eq(2)", row.element);
  const cellText = $contentCell.text().trim().slice(0, -3);

  if (date) {
    moment.locale(navigator.language);

    const date2 = moment(comment.created);
    const date2Str = date2
      /* .utcOffset(System.data.Brainly.defaultConfig.locale
              .OFFSET) */
      .tz(System.data.Brainly.defaultConfig.config.data.config.timezone)
      .format("YYYY-MM-DD HH:mm:ss");

    // console.log(date, date2.format("YYYY-MM-DD HH:mm:ss"), comment.created, date == date2.format("YYYY-MM-DD HH:mm:ss"));
    if (date === date2Str) {
      const fetchedText = comment.content.replace(/ {2,}/g, " ");

      if (fetchedText.startsWith(cellText)) {
        row.isBusy = false;
        row.comment = comment;
        row.HideSpinner();
        row.UnDelete();

        if (comment.is_marked_abuse) {
          // @ts-ignore
          row.element.that.RenderReportedContentIcon(comment);
        }

        // row.element.dataset.commentId = comment.id;
      }
    }
  }
}

function AttachCommentToRows(comment, rows: UserContentRowClassType[]) {
  rows.forEach(row => AttachCommentToRow(comment, row));
}

function AttachCommentsToRows(allComments, rows: UserContentRowClassType[]) {
  allComments.forEach(comment => AttachCommentToRows(comment, rows));
}

class Comments extends UserContent {
  postData: RemoveCommentReqDataType;

  constructor() {
    super("Comments");
  }

  InitComments() {
    this.RenderCheckboxes();
    this.RenderButtonContainer();
    this.RenderCopyLinksButton();

    if (System.checkUserP(16)) {
      this.RenderDeleteSection("comment");
      this.ShowDeleteSection();
      this.GetQuestions();
      this.BindHandlers();
    }
  }

  GetQuestions() {
    $.each(this.questions, this.GetQuestion.bind(this));
  }

  async GetQuestion(questionID: string, question) {
    question.res = await question.resPromise;

    const rows = this.rows.filter(
      row => row.element.questionID === Number(questionID),
    );

    if (!question.res || !question.res.success) {
      rows.forEach(row => row.Deleted(true));

      return;
    }

    const allComments = await FindUsersComments(question.res.data);

    AttachCommentsToRows(allComments, rows);
  }

  BindHandlers() {
    this.$deleteButton.on("click", this.DeleteSelectedComments.bind(this));
  }

  async DeleteSelectedComments() {
    const rows = this.DeletableRows();

    if (rows.length === 0) {
      this.ShowSelectContentWarning();
    } else if (this.deleteSection.selectedReason) {
      this.HideSelectContentWarning();
      await System.Delay(50);

      if (confirm(System.data.locale.common.moderating.doYouWantToDelete)) {
        this.postData = {
          reason: this.deleteSection.reasonText,
          reason_id: this.deleteSection.selectedReason.id,
          // @ts-expect-error
          reason_title: this.deleteSection.selectedReason.title,
          give_warning: this.deleteSection.giveWarning,
          model_id: undefined,
        };

        rows.forEach(this.DeleteCommentFromRow.bind(this));
      }
    }
  }

  async DeleteCommentFromRow(row: UserContentRowClassType) {
    if (row.deleted) {
      row.Deleted();

      return;
    }

    const postData = {
      ...this.postData,
      model_id: row.comment.id,
    };

    row.ShowSpinner();

    const resRemove = await new Action().RemoveComment(postData);

    row.CheckDeleteResponse(resRemove);
  }
}

// eslint-disable-next-line no-new
new Comments();
