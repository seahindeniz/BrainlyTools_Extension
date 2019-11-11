import Build from "@/scripts/helpers/Build";
import IsVisible from "@/scripts/helpers/IsVisible";
import {
  ActionList,
  ActionListHole,
  ContentBox,
  ContentBoxActions,
  ContentBoxContent,
  ContentBoxTitle,
  Input,
  Spinner,
  SpinnerContainer,
  Text,
  Textarea
} from "@style-guide";
import debounce from "debounce";
// @ts-ignore
import moment from "moment";
import rangeParser from "parse-numeric-range";
import CreateElement from "@/scripts/components/CreateElement";

const ERROR = "peach-dark";
const SUCCESS = "mint-dark";
const USER_NOT_FOUND = "lavender-dark";

class User {
  /**
   *
   * @param {AllUsers} main
   * @param {{
   *  id: number,
   *  conversation_id?: number,
   *  time: number,
   *  exception_type?: number,
   *  message?: string,
   * }} user
   */
  constructor(main, user) {
    this.main = main;
    this.user = user;

    this.SetStatusColor();
    this.Render();
    this.RenderExceptionMessage()
  }
  SetStatusColor() {
    /**
     * @type {"mint-dark" | "peach-dark" | "lavender-dark"}
     */
    this.statusColor = SUCCESS;

    if (this.user.exception_type)
      this.statusColor = ERROR;

    if (this.user.exception_type == 500)
      this.statusColor = USER_NOT_FOUND;
  }
  Render() {
    let time = moment().format('LTS');
    this.container = CreateElement({
      tag: "tr",
      children: Text({
        tag: "td",
        size: "small",
        text: this.user.id,
        color: this.statusColor,
      }),
    });

    if (this.user.exception_type)
      this.main.failLogsContainer.append(this.container);
    else
      this.main.successLogsContainer.append(this.container);
  }
  RenderExceptionMessage() {
    if (this.user.exception_type || this.user.message) {
      let message = this.user.message;

      if (this.user.exception_type == 500)
        message = System.data.locale.core.notificationMessages.userNotFound;

      if (!message)
        message = System.data.locale.core.MessageSender.unknownError;

      let messageContainer = Text({
        tag: "td",
        size: "small",
        text: message,
        color: this.statusColor,
        align: "RIGHT",
      });

      this.container.append(messageContainer);
    }
  }
}

class AllUsers {
  /**
   * @param {import("..").default} main
   */
  constructor(main) {
    this.main = main;
    this.logElements = {};
    /**
     * @type {number[]}
     */
    this.idList = [];

    this.Render();
    this.RenderLogs();
    this.RenderSpinner();
    this.BindHandler();
  }
  Render() {
    let sampleRange = "1,2,3-10,11..20,20...30";
    let nIds = Text({
      size: "xsmall",
      html: System.data.locale.common.nIds.replace("%{n}",
        ` <span class="sg-text--bold">0</span> `)
    });
    this.numberOfIds = nIds.querySelector("span");

    this.container = Build(ContentBox(), [
      [
        ContentBoxContent(), [
          [
            ActionList({
              noWrap: true
            }), [
              [
                ActionListHole({
                  equalWidth: true
                }),
                [
                  [
                    ContentBox(), [
                      [
                        this.spinnerContainer = SpinnerContainer({
                          className: "sg-box--full"
                        }),
                        [
                          [
                            ContentBoxActions(),
                            this.input = Input({
                              fullWidth: true,
                              placeholder: "1,2,3,4-10,11...30",
                              title: System.data.locale.core
                                .MassModerateContents.targets.idRange
                                .youNeedToEnterTwoDifferentIdNumbers
                            })
                          ]
                        ]
                      ],
                      [
                        ContentBoxActions(),
                        [
                          [
                            SpinnerContainer(),
                            nIds
                          ]
                        ]
                      ],
                      [
                        ContentBoxContent({
                          spacedTop: true
                        }),
                        this.output = Textarea({
                          tag: "div",
                          fullWidth: true,
                          resizable: "vertical",
                          placeholder: `${System.data.locale.core.MassModerateContents.targets.idRange.output}..`
                        })
                      ]
                    ]
                  ]
                ]
              ],
              [
                ActionListHole({
                  equalWidth: true
                }),
                [
                  [
                    Text({
                      size: "small",
                      breakWords: true,
                      tag: "blockquote"
                    }),
                    [
                      [
                        ContentBox(),
                        [
                          [
                            ContentBoxContent(),
                            Text({
                              size: "small",
                              weight: "bold",
                              align: "CENTER",
                              html: System.data.locale.core
                                .MassModerateContents
                                .targets.idRange.exampleUsage
                            })
                          ],
                          [
                            ContentBoxContent({
                              spacedTop: true
                            }),
                            [
                              Text({
                                tag: "span",
                                size: "xsmall",
                                weight: "bold",
                                color: "mint-dark",
                                html: `${System.data.locale.core.MassModerateContents.targets.idRange.input}: `
                              }),
                              Text({
                                tag: "span",
                                size: "xsmall",
                                html: sampleRange
                              })
                            ]
                          ],
                          [
                            ContentBoxContent({
                              spacedTop: "xsmall"
                            }),
                            [
                              Text({
                                tag: "span",
                                size: "xsmall",
                                weight: "bold",
                                color: "blue-dark",
                                html: `${System.data.locale.core.MassModerateContents.targets.idRange.output}: `
                              }),
                              Text({
                                tag: "span",
                                size: "xsmall",
                                html: rangeParser.parse(sampleRange)
                                  .join(
                                    ", ")
                              })
                            ]
                          ]
                        ]
                      ]
                    ]
                  ]
                ]
              ]
            ]
          ]
        ]
      ]
    ]);
    this.$ = $(this.container);

    this.$userId = $("input", this.$);
  }
  RenderLogs() {
    this.logSection = Build(ContentBoxContent({
      spacedTop: "large",
    }), [
      [
        ContentBox(), [
          [
            ContentBoxTitle({
              children: {
                size: "normal",
                html: "Result:",
              },
            })
          ],
          [
            ContentBoxContent(), [
              [
                ActionList({ noWrap: true }),
                [
                  [
                    ActionListHole({ grow: true }),
                    [
                      [
                        Textarea({
                          tag: "div",
                          fullWidth: true,
                          size: "xtall",
                        }),
                        this.successLogsContainer = CreateElement({
                          tag: "table",
                          fullWidth: true,
                        })
                      ]
                    ]
                  ],
                  [
                    ActionListHole({ grow: true }),
                    [
                      [
                        Textarea({
                          tag: "div",
                          fullWidth: true,
                          size: "xtall",
                        }),
                        this.failLogsContainer = CreateElement({
                          tag: "table",
                          fullWidth: true,
                          size: "xtall",
                        })
                      ]
                    ]
                  ]
                ],
              ]
            ]
          ]
        ]
      ]
    ]);
  }
  RenderSpinner() {
    this.spinner = Spinner({
      overlay: true,
      size: "small",
    });
  }
  BindHandler() {
    this.input.addEventListener("input", debounce(this.Validate.bind(this),
      100));
  }
  Validate() {
    if (!this.input.value) {
      this.CalculateIdList();

      return this.input.Natural();
    }

    this.idList = this.ParseRangeValue();

    if (!this.idList || this.idList.length == 0)
      this.input.Invalid();
    else {
      this.input.Valid();
      this.CalculateIdList();
    }
  }
  ParseRangeValue() {
    let value = this.input.value.replace(/\s/g, "");
    let rangeArr = rangeParser.parse(value);
    let rangeSet = new Set(rangeArr);
    rangeArr = Array.from(rangeSet)
      .filter(x => x > 0);

    return rangeArr;
  }
  CalculateIdList() {
    this.output.innerHTML = "";

    this.idList.forEach(id => {
      let color = "blue-dark";
      let text = `${id}`;

      if (this.main.deletedUsers.includes(id)) {
        color = "peach-dark";
        text = `-${id}`;
      }

      this.output.appendChild(Text({
        text,
        // @ts-ignore
        color,
        size: "small",
      }));
    });

    this.numberOfIds.innerText = String(this.idList.length);
  }
  ShowEmptyIdListError() {
    this.input.focus();
    this.input.classList.add("error");
    this.main.modal.notification(System.data.locale.core.notificationMessages
      .youNeedToEnterValidId, "error");
  }
  ShowSpinner() {
    this.spinnerContainer.append(this.spinner);
  }
  HideSpinner() {
    this.main.HideElement(this.spinner);
  }
  BeforeSending(data) {
    this.ShowLogSection();
  }
  ShowLogSection() {
    if (!IsVisible(this.logSection))
      this.container.append(this.logSection);
  }
  MessageSent(data) {
    new User(this, data);
  }
}

export default AllUsers
