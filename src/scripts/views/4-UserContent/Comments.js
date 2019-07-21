import moment from "moment-timezone";
import UserContent from "./_/UserContent";
import Action from "../../controllers/Req/Brainly/Action";

class Comments extends UserContent {
  constructor() {
    super("Comments");

  }
  InitComments() {
    if (System.checkUserP(16)) {
      this.RenderCheckboxes();
      this.RenderDeleteSection("comment");
      this.ShowDeleteSection();
      this.GetQuestions();
      this.BindHandlers();
    }
  }
  GetQuestions() {
    $.each(this.questions, this.GetQuestion.bind(this));
  }
  async GetQuestion(questionID, question) {
    question.res = await question.resPromise;
    let rows = this.rows.filter(row => row.element.questionID == questionID);

    if (!question.res || !question.res.success)
      return rows.forEach(row => row.Deleted(true));

    let allComments = await this.FindUsersComments(question.res.data);

    this.AttachCommentsToRows(allComments, rows);
  }
  async FindUsersComments(data) {
    let allComments = [];
    let usersComments = [];

    let questionComments = await this.FindCommentsFromContent(data.task, 1);
    allComments = [...allComments, ...questionComments];

    if (data.responses && data.responses.length > 0) {
      let answersComments = await this.FindCommentsFromContents([...data.responses], 2);
      allComments = [...allComments, ...answersComments];
    }

    if (allComments.length > 0) {
      allComments.forEach(comment => {
        if (comment.user_id == ~~window.sitePassedParams[0]) {
          comment.content = comment.content.replace(/(<([^>]+)>)/gmi, "");

          usersComments.push(comment);
        }
      });
    }

    return Promise.resolve(usersComments);
  }
  /**
   * @param {[]} contents
   */
  FindCommentsFromContents(contents, type) {
    return new Promise(resolve => {
      let allComments = [];

      let _loop = async () => {
        let content = contents.shift();
        let comments = await this.FindCommentsFromContent(content, type);
        allComments = [...allComments, ...comments];

        if (contents.length == 0) {
          resolve(allComments);
        } else {
          _loop();
        }
      };
      _loop();
    });
  }
  async FindCommentsFromContent(content, type) {
    let allComments = [];

    if (content.comments.count > 0) {
      // This should be exists in here because this line can push comment details even if related question has been deleted.
      allComments = content.comments.items;

      if (content.comments.count > 5 && content.settings && !content.settings.is_deleted) {
        let resComments = await new Action().GetComments(content.id, type, content.comments.count);

        if (resComments && resComments.success)
          allComments = resComments.data.comments.items;
      }
    }

    return Promise.resolve(allComments);
  }
  /**
   * @param {[]} allComments
   * @param {[]} rows
   */
  AttachCommentsToRows(allComments, rows) {
    allComments.forEach(comment => this.AttachCommentToRows(comment, rows));
  }
  /**
   * @param {{}} comment
   * @param {[]} rows
   */
  AttachCommentToRows(comment, rows) {
    rows.forEach(row => this.AttachCommentToRow(comment, row));
  }
  /**
   * @param {{}} comment
   * @param {import("./_/UserContentRow").default} row
   */
  AttachCommentToRow(comment, row) {
    let $dateCell = $("td:last", row.element);
    let date = $dateCell.text().trim();
    let $contentCell = $("td:eq(2)", row.element);
    let cellText = $contentCell.text().trim().slice(0, -3);

    if (date) {
      let date2 = moment(comment.created);
      date2 = date2.tz(System.data.Brainly.defaultConfig.locale.TIMEZONE);

      //console.log(date, date2.format("YYYY-MM-DD HH:mm:ss"), comment.created, date == date2.format("YYYY-MM-DD HH:mm:ss"));
      if (date == date2.format("YYYY-MM-DD HH:mm:ss")) {
        /* if (date) {
        	date = moment(date + System.data.Brainly.defaultConfig.locale.OFFSET).tz(System.data.Brainly.defaultConfig.locale.TIMEZONE);

        	if (date.format() == comment.created) { */
        let fetchedText = comment.content.replace(/ {2,}/g, " ");

        if (fetchedText.startsWith(cellText)) {
          row.isBusy = false;
          row.comment = comment;
          row.checkbox.HideSpinner();
          row.UnDelete();
          //row.element.dataset.commentId = comment.id;
        }
      }
    }
  }
  BindHandlers() {
    this.$deleteButton.click(this.DeleteSelectedComments.bind(this));
  }
  async DeleteSelectedComments() {
    let rows = this.DeletableRows();

    if (rows.length == 0) {
      this.ShowSelectContentWarning();
    } else if (this.deleteSection.selectedReason) {
      this.HideSelectContentWarning();
      await System.Delay(50);

      if (confirm(System.data.locale.common.moderating.doYouWantToDelete)) {
        this.postData = {
          reason_id: this.deleteSection.selectedReason.id,
          reason: this.deleteSection.reasonText,
          give_warning: this.deleteSection.giveWarning
        };

        rows.forEach(this.Row_DeleteComment.bind(this));
      }
    }
  }
  async Row_DeleteComment(row) {
    if (row.deleted) {
      row.Deleted();
    } else {
      let postData = {
        ...this.postData,
        model_id: row.comment.id
      }

      row.checkbox.ShowSpinner();

      let resRemove = await new Action().RemoveComment(postData);
      /* await System.Delay();
      let resRemove = { success: false, message: "Önceden silinmiş" }; */

      row.CheckDeleteResponse(resRemove);
    }
  }
}

new Comments();
