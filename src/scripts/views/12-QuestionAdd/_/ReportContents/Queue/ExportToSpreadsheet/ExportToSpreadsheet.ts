import type { ContentNameType } from "@components/ModerationPanel/ModeratePanelController";
import notification from "@components/notification2";
import Excel from "exceljs";
import { DateTime } from "luxon";
import { saveAs } from "file-saver";
import type ContentClassType from "../../Content/Content";
import type ReportedContentsStatusBarClassType from "../../StatusBar";
import AnswerSheet from "./Sheet/AnswerSheet";
import CommentSheet from "./Sheet/CommentSheet";
import QuestionSheet from "./Sheet/QuestionSheet";

function showNoReportWarning() {
  notification({
    type: "info",
    text:
      System.data.locale.reportedContents.queue.exportReports.nothingToExport,
  });
}

function generateDateString() {
  const dt = DateTime.local();

  return `${dt.toLocaleString(DateTime.DATE_SHORT)} ${dt.toLocaleString(
    DateTime.TIME_SIMPLE,
  )}`;
}

export default class {
  main: ReportedContentsStatusBarClassType;

  spreadsheet: Excel.Workbook;
  contents: {
    [contentType in ContentNameType]: ContentClassType[];
  };

  #answersSheet: AnswerSheet;
  #commentsSheet: CommentSheet;
  #questionsSheet: QuestionSheet;

  fileName: string;
  #xlsBuffer: Excel.Buffer;

  constructor(main: ReportedContentsStatusBarClassType) {
    this.main = main;
  }

  async ExportReports() {
    if (this.main.main.contents.filtered.length === 0) {
      showNoReportWarning();

      return;
    }

    this.SetSpreadsheet();
    this.MapContents();
    this.InitSheets();
    await this.WriteBuffer();
    this.SetFileName();
    this.Download();
  }

  private SetSpreadsheet() {
    this.spreadsheet = new Excel.Workbook();
    this.spreadsheet.lastModifiedBy = "";
    this.spreadsheet.creator = `${
      //
      System.data.meta.manifest.short_name
    } ${System.data.meta.manifest.version}`;
  }

  private MapContents() {
    this.contents = {
      Answer: [],
      Comment: [],
      Question: [],
    };

    this.main.main.contents.all.forEach(content =>
      this.contents[content.contentType].push(content),
    );
  }

  private InitSheets() {
    if (this.contents.Question.length !== 0) {
      this.#questionsSheet = new QuestionSheet(this);
    }

    if (this.contents.Answer.length !== 0) {
      this.#answersSheet = new AnswerSheet(this);
    }

    if (this.contents.Comment.length !== 0) {
      this.#commentsSheet = new CommentSheet(this);
    }
  }

  private async WriteBuffer() {
    this.#xlsBuffer = await this.spreadsheet.xlsx.writeBuffer();
  }

  private SetFileName() {
    const sheetNames = this.spreadsheet.worksheets
      .map(sheet => `${sheet.name}`)
      .join(", ")
      .toLocaleLowerCase();

    this.fileName = `${
      this.main.main.contents.all.length
    } ${sheetNames} - ${generateDateString()}`;
  }

  private Download() {
    saveAs(new Blob([this.#xlsBuffer]), `${this.fileName}.xlsx`);
  }
}
