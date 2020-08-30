import CreateElement from "@components/CreateElement";
import Build from "@root/helpers/Build";
import IsVisible from "@root/helpers/IsVisible";
import {
  ActionList,
  ActionListHole,
  ContentBox,
  ContentBoxActions,
  ContentBoxContent,
  ContentBoxTitle,
  InputDeprecated,
  Spinner,
  SpinnerContainer,
  Text,
  Textarea,
} from "@style-guide";
import { InputElementType } from "@style-guide/InputDeprecated";
import debounce from "debounce";
import rangeParser from "parse-numeric-range";
import type MassMessageSenderClassType from "../..";
import User from "./User";

class AllUsers {
  main: MassMessageSenderClassType;
  // logElements: {};
  idList: number[];

  $: JQuery<HTMLElement>;
  numberOfIds: HTMLSpanElement;
  container: HTMLDivElement;
  spinnerContainer: HTMLDivElement;
  input: InputElementType;
  output: HTMLDivElement;
  $userId: JQuery<HTMLInputElement>;
  logSection: HTMLDivElement;
  successLogsContainer: HTMLTableElement;
  failLogsContainer: HTMLTableElement;
  spinner: HTMLDivElement;

  constructor(main) {
    this.main = main;
    // this.logElements = {};
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
    const sampleRange = "1,2,3-10,11..20,20...30";
    const nIds = Text({
      size: "xsmall",
      html: System.data.locale.common.nIds.replace(
        "%{n}",
        ` <span class="sg-text--bold">0</span> `,
      ),
    });
    this.numberOfIds = nIds.querySelector("span");

    this.container = Build(ContentBox(), [
      [
        ContentBoxContent(),
        [
          [
            ActionList({
              noWrap: true,
            }),
            [
              [
                ActionListHole({
                  equalWidth: true,
                }),
                [
                  [
                    ContentBox(),
                    [
                      [
                        (this.spinnerContainer = SpinnerContainer({
                          fullWidth: true,
                        })),
                        [
                          [
                            ContentBoxActions(),
                            (this.input = InputDeprecated({
                              fullWidth: true,
                              placeholder: "1,2,3,4-10,11...30",
                              title:
                                System.data.locale.core.MassModerateContents
                                  .targets.idRange
                                  .youNeedToEnterTwoDifferentIdNumbers,
                            })),
                          ],
                        ],
                      ],
                      [ContentBoxActions(), [[SpinnerContainer(), nIds]]],
                      [
                        ContentBoxContent({
                          spacedTop: true,
                        }),
                        (this.output = Textarea({
                          tag: "div",
                          fullWidth: true,
                          resizable: "vertical",
                          placeholder: `${System.data.locale.core.MassModerateContents.targets.idRange.output}..`,
                        })),
                      ],
                    ],
                  ],
                ],
              ],
              [
                ActionListHole({
                  equalWidth: true,
                }),
                [
                  [
                    Text({
                      size: "small",
                      breakWords: true,
                      tag: "blockquote",
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
                              html:
                                System.data.locale.core.MassModerateContents
                                  .targets.idRange.exampleUsage,
                            }),
                          ],
                          [
                            ContentBoxContent({
                              spacedTop: true,
                            }),
                            [
                              Text({
                                tag: "span",
                                size: "xsmall",
                                weight: "bold",
                                color: "mint-dark",
                                html: `${System.data.locale.core.MassModerateContents.targets.idRange.input}: `,
                              }),
                              Text({
                                tag: "span",
                                size: "xsmall",
                                html: sampleRange,
                              }),
                            ],
                          ],
                          [
                            ContentBoxContent({
                              spacedTop: "xsmall",
                            }),
                            [
                              Text({
                                tag: "span",
                                size: "xsmall",
                                weight: "bold",
                                color: "blue-dark",
                                html: `${System.data.locale.core.MassModerateContents.targets.idRange.output}: `,
                              }),
                              Text({
                                tag: "span",
                                size: "xsmall",
                                html: rangeParser(sampleRange).join(", "),
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
          ],
        ],
      ],
    ]);
    this.$ = $(this.container);

    this.$userId = $("input", this.$);
  }

  RenderLogs() {
    this.logSection = Build(
      ContentBoxContent({
        spacedTop: "large",
      }),
      [
        [
          ContentBox(),
          [
            [
              ContentBoxTitle({
                children: "Result:",
              }),
            ],
            [
              ContentBoxContent(),
              [
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
                          (this.successLogsContainer = CreateElement({
                            tag: "table",
                            fullWidth: true,
                          })),
                        ],
                      ],
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
                          (this.failLogsContainer = CreateElement({
                            tag: "table",
                            fullWidth: true,
                            size: "xtall",
                          })),
                        ],
                      ],
                    ],
                  ],
                ],
              ],
            ],
          ],
        ],
      ],
    );
  }

  RenderSpinner() {
    this.spinner = Spinner({
      overlay: true,
      size: "small",
    });
  }

  BindHandler() {
    this.input.addEventListener(
      "input",
      debounce(this.Validate.bind(this), 100),
    );
  }

  Validate() {
    if (!this.input.value) {
      this.CalculateIdList();
      this.input.Natural();

      return;
    }

    this.idList = this.ParseRangeValue();

    if (!this.idList || this.idList.length === 0) this.input.Invalid();
    else {
      this.input.Valid();
      this.CalculateIdList();
    }
  }

  ParseRangeValue() {
    const value = this.input.value.replace(/\s/g, "");
    let rangeArr = rangeParser(value);
    const rangeSet = new Set(rangeArr);
    rangeArr = Array.from(rangeSet).filter(x => x > 0);

    return rangeArr;
  }

  CalculateIdList() {
    this.output.innerHTML = "";
    this.numberOfIds.innerText = String(this.idList.length);

    if (this.idList.length > 0) {
      const idList = this.idList.slice(0, 1000);
      const tempList = idList.join("\n");
      this.output.innerHTML = tempList.replace(
        /(\d{1,})/g,
        `<div><span class="sg-text--background-blue-light">$1</span></div>`,
      );

      if (idList.length < this.idList.length) this.output.innerHTML += `...`;

      this.output.scrollTop = this.output.scrollHeight;
    }
  }

  ShowEmptyIdListError() {
    this.input.focus();
    this.input.classList.add("error");
    this.main.modal.notification(
      System.data.locale.core.notificationMessages.youNeedToEnterValidId,
      "error",
    );
  }

  ShowSpinner() {
    this.spinnerContainer.append(this.spinner);
  }

  HideSpinner() {
    this.main.HideElement(this.spinner);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  BeforeSending(_) {
    this.ShowLogSection();
  }

  ShowLogSection() {
    if (!IsVisible(this.logSection)) this.container.append(this.logSection);
  }

  MessageSent(data) {
    // eslint-disable-next-line no-new
    new User(this, data);
  }
}

export default AllUsers;
