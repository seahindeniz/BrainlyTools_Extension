/* eslint-disable no-underscore-dangle */
import { Flex, Text, Box, Icon, Button } from "@style-guide";
import Build from "@/scripts/helpers/Build";
import moment from "moment-timezone";

const BOX_STATUS = {
  default: {
    text: "",
    color: "gray-secondary-lightest",
  },
  deleted: {
    text: System.data.locale.common.deleted,
    color: "peach-secondary-light",
  },
  confirmed: {
    text: System.data.locale.common.confirmed,
    color: "mint-secondary-light",
  },
  failed: {
    text: System.data.locale.core.massModerateReportedContents.failedToModerate,
    color: "mustard-primary",
  },
};

export default class Report {
  /**
   *
   * @param {import(".").default} main
   * @param {import("@BrainlyAction").ReportedContentDataType} data
   */
  constructor(main, data) {
    this.main = main;
    this.data = data;
    this.confirmed = false;
    this.deleted = false;
    this.failed = false;
    this.user = {
      reporter: this.main.users.byId[data.report.user.id],
      reported: this.main.users.byId[data.user.id],
    };
    const reportDate = moment(this.data.report.created);
    const reportDateTz = moment(this.data.report.created).tz(
      System.data.Brainly.defaultConfig.config.data.config.timezone,
    );
    this.reportDate = {
      moment: reportDate,
      tzFormatted: reportDateTz.format("L LT Z"),
      localFormatted: reportDate.format("L LT"),
    };

    /**
     * @type {"Question" | "Answer"}
     */
    this.is = undefined;

    if (this.data.model_type_id === 1) this.is = "Question";
    else if (this.data.model_type_id === 2) this.is = "Answer";
  }

  get container() {
    if (this.deleted) {
      if (this._container) {
        this._container.remove();

        this._container = null;
      }
    } else if (!this._container) this.Render();

    return this._container;
  }

  Render() {
    const subjectData = System.data.Brainly.defaultConfig.config.data.subjects.find(
      data => data.id === this.data.subject_id,
    );
    let boxStatus = BOX_STATUS.default;

    if (this.deleted) boxStatus = BOX_STATUS.deleted;
    else if (this.confirmed) boxStatus = BOX_STATUS.confirmed;
    else if (this.failed) boxStatus = BOX_STATUS.failed;

    this._container = Build(
      Flex({
        fullWidth: true,
        marginBottom: "s",
        direction: "column",
        className: "r-c-b-c",
        dataset: {
          status: boxStatus.text,
        },
      }),
      (this.colorBox = new Box({
        border: false,
        color: boxStatus.color,
        padding: "s",
        full: true,
        children: Build(
          Flex({
            direction: "column",
            fullWidth: true,
          }),
          [
            [
              Flex({
                noShrink: true,
                fullWidth: true,
                alignItems: "center",
                justifyContent: "space-between",
              }),
              [
                [
                  Flex({ marginRight: "s" }),
                  [
                    [
                      Flex({
                        marginRight: "s",
                        tag: "a",
                        target: "_blank",
                        href: System.createBrainlyLink("question", {
                          id: this.data.task_id,
                        }),
                      }),
                      [
                        [
                          Flex({ alignItems: "center" }),
                          new Button({
                            type:
                              this.data.model_type_id === 1
                                ? "solid-blue"
                                : "solid-mint",
                            size: "s",
                            iconOnly: true,
                            icon: Text({
                              breakWords: true,
                              color: "white",
                              fixPosition: true,
                              text: this.is[0],
                            }),
                          }),
                        ],
                        [
                          Flex({
                            marginLeft: "xs",
                            alignItems: "center",
                            direction: "column",
                          }),
                          [
                            Text({
                              href: "",
                              size: "small",
                              weight: "bold",
                              text: subjectData.name,
                            }),
                            Text({
                              href: "",
                              size: "small",
                              weight: "bold",
                              text: this.data.task_id,
                            }),
                          ],
                        ],
                      ],
                    ],
                    [
                      Flex({ alignItems: "center" }),
                      Text({
                        breakWords: true,
                        tag: "a",
                        size: "small",
                        weight: "bold",
                        target: "_blank",
                        text: this.user.reported.nick,
                        href: System.createProfileLink(this.user.reported),
                      }),
                    ],
                  ],
                ],
                [
                  Flex(),
                  [
                    [
                      Flex({
                        marginRight: "s",
                        direction: "column",
                      }),
                      [
                        [
                          Flex({
                            justifyContent: "flex-end",
                            alignItems: "center",
                          }),
                          Text({
                            size: "small",
                            color: "gray",
                            weight: "bold",
                            breakWords: true,
                            text: this.reportDate.localFormatted,
                            title: this.reportDate.tzFormatted,
                          }),
                        ],
                        [
                          Flex({
                            marginTop: "xxs",
                            justifyContent: "flex-end",
                          }),
                          Text({
                            size: "small",
                            color: "gray",
                            weight: "bold",
                            breakWords: true,
                            text: this.data.report.abuse.name,
                          }),
                        ],
                      ],
                    ],
                    [
                      Flex({
                        marginRight: "s",
                        alignItems: "center",
                      }),
                      Text({
                        tag: "a",
                        size: "small",
                        weight: "bold",
                        target: "_blank",
                        breakWords: true,
                        text: this.user.reporter.nick,
                        href: System.createProfileLink(this.user.reporter),
                      }),
                    ],
                    [
                      Flex({
                        alignItems: "center",
                      }),
                      new Icon({
                        type: "report_flag",
                        color: "peach",
                      }),
                    ],
                  ],
                ],
              ],
            ],
            /* Box({
            border: "no",
            color: "transparent",
            padding: "small",
            children: Text({
              breakWords: true,
              html: this.data.content_short
            })
          }) */
            [
              Flex({
                fullWidth: true,
                marginTop: "s",
              }),
              [
                [
                  Flex({
                    marginTop: "xxs",
                    marginRight: "m",
                    marginBottom: "xs",
                    marginLeft: "m",
                  }),
                  Text({
                    breakWords: true,
                    html: this.data.content_short,
                  }),
                ],
              ],
            ],
          ],
        ),
      })),
    );
  }

  HideContainer() {
    if (!this._container) return;

    this.main.HideElement(this._container);
  }

  /**
   * @param {keyof BOX_STATUS} statusName
   */
  ChangeStatus(statusName) {
    if (statusName in BOX_STATUS && statusName in this) this[statusName] = true;

    if (!this.colorBox) return;

    // @ts-ignore
    this.colorBox.ChangeColor(BOX_STATUS[statusName].color);

    this.colorBox.element.dataset.status = BOX_STATUS[statusName].text;
  }
}
