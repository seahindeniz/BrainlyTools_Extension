import Modal from "@/scripts/components/Modal2";
import notification from "@/scripts/components/notification2";
import Build from "@/scripts/helpers/Build";
import InsertBefore from "@/scripts/helpers/InsertBefore";
import Action from "@BrainlyAction";
import ServerReq from "@ServerReq";
import {
  Button,
  ContentBox,
  ContentBoxActions,
  ContentBoxContent,
  Flex,
  Icon,
  Spinner,
  Text,
} from "@style-guide";
import Excel from "exceljs";
import { saveAs } from "file-saver";
import moment from "moment";
import Components from "../Components";
import Moderator from "./Moderator";
import Report from "./Report";

export default class extends Components {
  constructor(main) {
    super(main);
    this.liLinkContent =
      System.data.locale.core.massModerateReportedContents.text;
    /**
     * @type {{
     *  all: Moderator[],
     *  moderating: Moderator[],
     * }}
     */
    this.moderators = {
      all: [],
      moderating: [],
    };
    this.loop = {};
    this.numberOfActiveConnections = 0;
    this.users = {
      /**
       * @typedef {import("@BrainlyAction").UsersDataInReportedContentsType} UsersDataInReportedContentsType
       *
       * @type {UsersDataInReportedContentsType[]}
       */
      all: [],
      /**
       * @type {{[x: number]: UsersDataInReportedContentsType}}
       */
      byId: {},
    };
    this.contentTypes = {
      Question: {
        model_type_id: 1,
      },
      Answer: {
        model_type_id: 2,
      },
    };
    /**
     * @type {("Question"| "Answer")[]}
     */
    this.contentTypeNames = ["Question", "Answer"];
    /**
     * @type {{
     *  icon: import("@style-guide/Icon").IconTypeType,
     *  extension: string,
     *  type: string,
     * }}
     */
    this.exportSpreadsheetFile = {
      icon: "ext-xlsx",
      extension: "xlsx",
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };

    this.ResetReports();
    this.RenderListItem();
    this.BindHandlers();
  }

  ResetReports() {
    /**
     * @type {Report[]}
     */
    this.reports = [];
  }

  BindHandlers() {
    this.li.addEventListener("click", this.Open.bind(this));
  }

  Open() {
    if (!this.modal) {
      this.RenderModal();
      this.RenderFetcherSpinner();
      this.CollectReports();
    }

    this.modal.Open();
  }

  RenderModal() {
    this.modal = new Modal({
      overlay: true,
      size: "fit-content",
      title: System.data.locale.core.massModerateReportedContents.text,
      content: {
        children: Build(ContentBox(), [
          [
            ContentBoxContent({
              spacedTop: true,
            }),
            [
              [
                (this.addModeratorButton = new Button({
                  fullWidth: true,
                  icon: new Icon({ type: "plus" }),
                  type: "solid-blue",
                  size: "s",
                  html:
                    System.data.locale.core.massModerateReportedContents
                      .addModerator,
                })),
              ],
            ],
          ],
          [
            ContentBoxActions({
              spacedBottom: true,
            }),
            [
              [
                Flex({
                  fullWidth: true,
                  justifyContent: "space-between",
                }),
                [
                  [
                    (this.counterContainer = Flex({
                      title:
                        System.data.locale.core.massModerateReportedContents
                          .fetchedReports,
                    })),
                    [
                      [
                        Flex({
                          marginRight: "xxs",
                          alignItems: "center",
                        }),
                        new Icon({
                          type: "report_flag",
                          size: 22,
                          color: "peach",
                        }),
                      ],
                      [
                        Flex({
                          alignItems: "center",
                        }),
                        /* Text({
                          weight: "bold",
                          color: "gray-secondary",
                          children: [
                            this.fetchedReportsCount =
                            document
                            .createTextNode("0"),
                            "/",
                            this.totalReportsCount = document
                            .createTextNode("0"),
                          ]
                        }) */
                        [
                          [
                            Flex({ marginRight: "s" }),
                            Text({
                              size: "small",
                              weight: "bold",
                              color: "gray-secondary",
                              text: `${System.data.locale.core.massModerateReportedContents.collectedReports}: `,
                              children: (this.fetchedReportsCount = document.createTextNode(
                                "0",
                              )),
                            }),
                          ],
                          [
                            Flex({}),
                            Text({
                              size: "small",
                              weight: "bold",
                              color: "gray-secondary",
                              text: `${System.data.locale.core.massModerateReportedContents.totalReportedContents}: `,
                              children: (this.totalReportsCount = document.createTextNode(
                                "0",
                              )),
                            }),
                          ],
                        ],
                      ],
                    ],
                  ],
                ],
              ],
            ],
          ],
        ]),
      },
      actions: {
        children: Flex({
          tag: "blockquote",
          grow: true,
          minContent: true,
          direction: "column",
          children: System.data.locale.core.massModerateReportedContents.informationText.map(
            (text, index, arr) => {
              return Flex({
                marginBottom: index + 1 < arr.length ? "s" : "",
                children: Text({
                  size: "xsmall",
                  html: text.replace(
                    "%{addModerator}",
                    `<b>${System.data.locale.core.massModerateReportedContents.addModerator.toUpperCase()}</b>`,
                  ),
                }),
              });
            },
          ),
        }),
      },
    });

    this.BindModalItemListeners();
  }

  BindModalItemListeners() {
    this.addModeratorButton.element.addEventListener(
      "click",
      this.AddModeratorSection.bind(this),
    );
  }

  AddModeratorSection() {
    if (!this.moderatorContainer) this.RenderModeratorContainer();

    const moderator = new Moderator(this, this.moderators.all.length);

    this.moderatorContainer.append(moderator.toplayer);
    this.moderators.all.push(moderator);
  }

  RenderModeratorContainer() {
    this.moderatorContainer = Flex({
      direction: "column",
      fullWidth: true,
    });

    InsertBefore(this.moderatorContainer, this.addModeratorButton.element);
  }

  RenderFetcherSpinner() {
    this.fetcherSpinnerContainer = Flex({
      marginLeft: "xs",
      alignItems: "center",
      children: Spinner({
        size: "xxsmall",
      }),
    });
  }

  async CollectReports() {
    /**
     * @type {number[]}
     */
    this.lastIds = [];

    this.ResetReports();
    await this.GetLastIds();
  }

  async GetLastIds() {
    const resLastIds = await new ServerReq().GetModerateAllPages();

    if (!resLastIds || !resLastIds.success) {
      notification({
        type: "error",
        html:
          System.data.locale.core.massModerateReportedContents
            .notificationMessages.cantFetchDetailsFromExtensionServer,
      });
      throw Error("Can't fetch last ids from extension server");
    }

    this.lastIds = resLastIds.data;

    if (!this.lastIds || !(this.lastIds instanceof Array)) {
      this.modal.Notification({
        type: "error",
        html: "Can't fetch last ids from extension server",
      });

      return;
    }

    this.StartFetching();
  }

  async StartFetching() {
    this.fetching = true;

    this.ShowFetcherSpinner();
    try {
      await this.FetchReportedContents(null);
      this.loop.TryToFetchReportedContents = setInterval(() => {
        this.TryToFetchReportedContents();
      }, 1000);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  StopFetching() {
    clearInterval(this.loop.TryToFetchReportedContents);
  }

  ShowFetcherSpinner() {
    this.counterContainer.append(this.fetcherSpinnerContainer);
  }

  HideFetcherSpinner() {
    if (this.lastIds.length > 0 || this.numberOfActiveConnections > 0) return;

    this.HideElement(this.fetcherSpinnerContainer);
  }

  TryToFetchReportedContents() {
    const lastId = this.lastIds.shift();

    if (lastId === undefined) {
      this.StopFetching();

      return undefined;
    }

    return this.FetchReportedContents(lastId);
  }

  TryToFetchReportedContents2() {
    // TODO remove this
    for (let i = 0; i < System.constants.Brainly.marketRequestLimit; i++)
      if (this.numberOfActiveConnections < 8) {
        const lastId = this.lastIds.shift();
        console.log(lastId, i);

        if (lastId === undefined) {
          this.StopFetching();

          return;
        }

        // this.FetchReportedContents(lastId);
      }
  }

  LetModeratorsFilterReports() {
    this.moderators.all.forEach(moderator => moderator.FilterReports());
  }

  /**
   * @param {number} lastId
   */
  async FetchReportedContents(lastId) {
    this.numberOfActiveConnections++;
    const resReports = await new Action().GetReportedContents({
      last_id: lastId,
    });
    this.numberOfActiveConnections--;

    if (!resReports && !resReports.success && !resReports.data) {
      // eslint-disable-next-line no-throw-literal
      throw { msg: "Brainly sent empty data", res: resReports };
    }

    this.HideFetcherSpinner();
    this.StoreUsers(resReports.users_data);
    this.StoreReports(resReports.data.items);
    this.LetModeratorsFilterReports();
    this.UpdateCounters(resReports.data.total_count);

    return true;
  }

  /**
   * @param {import("@BrainlyAction").UsersDataInReportedContentsType[]} usersData
   */
  StoreUsers(usersData) {
    if (!usersData || usersData.length === 0) return;

    usersData.forEach(data => {
      this.users.byId[data.id] = data;

      this.users.all.push(data);
    });
  }

  /**
   * @param {import("@BrainlyAction").ReportedContentDataType[]} items
   */
  StoreReports(items) {
    if (!items || items.length === 0) return;

    this.reports.push(...items.map(item => new Report(this, item)));
  }

  /**
   * @param {number} [_totalCount]
   */
  UpdateCounters(_totalCount) {
    let totalCount = _totalCount;
    let filteredReportsLength = 0;

    if (!totalCount)
      totalCount = this.reports.reduce((length, report) => {
        return length + (report.deleted ? 0 : 1);
      }, 0);

    if (this.moderators.all.length > 0)
      filteredReportsLength = this.moderators.all.reduce(
        (length, moderator) => {
          const filteredReports = moderator.filteredReports.filter(report => {
            return !report.deleted;
          });

          return length + filteredReports.length;
        },
        0,
      );

    this.fetchedReportsCount.data = `${
      this.reports.length + filteredReportsLength
    }`;
    this.totalReportsCount.data = `${totalCount}`;
  }

  /**
   * @param {Report[]} [reports]
   * @param {string} [_fileName]
   */
  async ExportReports(reports = this.reports, _fileName) {
    let fileName = _fileName;

    const workbook = new Excel.Workbook();
    const questionSheet = workbook.addWorksheet("Question");
    const answerSheet = workbook.addWorksheet("Answer");
    const questionHeaders = [
      { key: "moderated", header: "Moderated" },
      { key: "questionId", header: "Question id" },
      { key: "reportedUserId", header: "Reported user id" },
      { key: "reporterUserId", header: "Reporter user id" },
      { key: "date", header: "Reported on" },
      { key: "reason", header: "Reason" },
      { key: "content", header: "Content(short)" },
    ];
    const answerHeaders = questionHeaders.slice();

    answerHeaders.splice(2, 0, {
      key: "answerId",
      header: "Answer id",
    });

    questionSheet.columns = questionHeaders;
    answerSheet.columns = answerHeaders;

    /**
     * @typedef {{
     *  [x: string]: number,
     * }} ColumnsWidthType
     * @type {{
     *  Question: ColumnsWidthType,
     *  Answer: ColumnsWidthType,
     * }}
     */
    const sheetsColumnWidths = {
      Question: {},
      Answer: {},
    };

    if (reports.length > 0)
      reports.forEach(report => {
        const rowData = {
          moderated: report.deleted
            ? "Deleted"
            : report.confirmed
            ? "Confirmed"
            : false,
          questionId: report.data.task_id,
          reportedUserId: report.user.reported.id,
          reporterUserId: report.user.reporter.id,
          date: report.reportDate.tzFormatted,
          reason: report.data.report.abuse.name,
          content: report.data.content_short,
        };

        if (report.data.model_type_id === 2)
          rowData.answerId = report.data.model_id;

        const contentType =
          report.data.model_type_id === 1 ? "Question" : "Answer";

        Object.entries(rowData).forEach(([header, data]) => {
          let { length } = String(data);

          if (length < header.length) length = header.length + 2;

          if (
            !sheetsColumnWidths[contentType][header] ||
            sheetsColumnWidths[contentType][header] < length + 2
          )
            sheetsColumnWidths[contentType][header] = length + 2;
        });

        if (report.data.model_type_id === 1) questionSheet.addRow(rowData);
        else answerSheet.addRow(rowData);
      });

    Object.entries(sheetsColumnWidths).forEach(([contentType, columns]) => {
      const sheet = workbook.getWorksheet(contentType);

      Object.entries(columns).forEach(([columnName, width]) => {
        const details = sheet.getColumn(columnName);
        details.width = width < 5 ? 5 : width;
      });
    });

    workbook.worksheets.forEach(sheet => {
      if (sheet.rowCount < 2) {
        workbook.removeWorksheet(sheet.name);
        return;
      }

      const firstRow = sheet.getRow(1);
      firstRow.height = 30;
      firstRow.font = { bold: true, size: 12 };
      firstRow.alignment = { vertical: "middle", horizontal: "center" };
    });

    const xls64 = await workbook.xlsx.writeBuffer();

    if (!fileName) {
      const sheetNames = workbook.worksheets.map(sheet => `${sheet.name}s`);
      fileName = `${reports.length} Reported ${sheetNames
        .join(" and ")
        .toLocaleLowerCase()} - ${moment().format("L LTS")}`;
    }
    saveAs(
      new Blob([xls64]),
      `${fileName}.${this.exportSpreadsheetFile.extension}`,
    );
  }
}
