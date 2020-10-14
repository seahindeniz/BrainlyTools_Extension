import { ContentNameType } from "@components/ModerationPanel/ModeratePanelController";
import type { Column, Worksheet } from "exceljs";
import type ExportToSpreadsheetClassType from "../ExportToSpreadsheet";
import type ContentClassType from "../../../Content/Content";

export default class Sheet {
  #main: ExportToSpreadsheetClassType;
  #contentType: string;
  #idHeaders: Partial<Column>[];

  protected sheet: Worksheet;
  #contents: ContentClassType[];
  #columnWidth: {
    [key: string]: number;
  };

  constructor(
    main: ExportToSpreadsheetClassType,
    contentType: ContentNameType,
    idHeaders: Partial<Column>[],
  ) {
    this.#main = main;
    this.#contentType = contentType;
    this.#idHeaders = idHeaders;

    this.#columnWidth = {
      reason: 40,
      content: 80,
    };
    this.#contents = main.contents[contentType];

    this.SetSheet();
    this.SetHeaderRow();
    this.SetRows();
    this.ResizeHeaderColumns();
  }

  private SetSheet() {
    this.sheet = this.#main.spreadsheet.addWorksheet(
      System.data.locale.reportedContents.options.filter.filters.contentType[
        this.#contentType
      ],
      {
        pageSetup: {},
      },
    );
  }

  private SetHeaderRow() {
    this.sheet.columns = [
      {
        key: "isModerated",
        header:
          System.data.locale.reportedContents.queue.exportReports.isModerated,
      },
      ...this.#idHeaders,
      {
        key: "reportedUserId",
        header:
          System.data.locale.reportedContents.queue.exportReports
            .reportedUserId,
      },
      {
        key: "reporterUserId",
        header:
          System.data.locale.reportedContents.queue.exportReports
            .reporterUserId,
      },
      {
        key: "date",
        header:
          System.data.locale.reportedContents.queue.exportReports.reportedOn,
      },
      {
        key: "reason",
        header: System.data.locale.reportedContents.queue.exportReports.reason,
      },
      {
        key: "content",
        header:
          System.data.locale.reportedContents.queue.exportReports.contentShort,
      },
    ];

    const firstRow = this.sheet.getRow(1);

    firstRow.height = 30;
    firstRow.font = {
      bold: true,
      size: 12,
    };
    firstRow.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    this.sheet.columns.forEach(column => {
      if (column.key === "content" || column.key === "reason") return;

      this.#columnWidth[column.key] = String(column.header).length + 2;
    });
  }

  private SetRows() {
    this.#contents.forEach(content =>
      this.SetRow(
        {
          isModerated:
            System.data.locale.common[
              content.has === "deleted"
                ? "deleted"
                : content.has === "confirmed"
                ? "confirmed"
                : "no"
            ],
          questionId: content.data.task_id,
          reportedUserId: content.users.reported.data.id,
          reporterUserId: content.users.reporter.data.id,
          date: content.dates.report.localFormatted,
          reason: content.data.report.abuse.name,
          content: content.data.content_short,
        },
        content, // For inheriting classes
      ),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected SetRow(data: ObjectAnyType, _?: ContentClassType) {
    Object.entries(data).forEach(([key, content]: [string, string]) => {
      const { length } = String(content);

      if (
        key === "content" ||
        key === "reason" ||
        this.#columnWidth[key] >= length
      )
        return;

      this.#columnWidth[key] = length + 2;
    });

    this.sheet.addRow(data);
  }

  private ResizeHeaderColumns() {
    this.sheet.columns.forEach(column => {
      const width = this.#columnWidth[column.key];

      column.width = width;
    });
  }
}
