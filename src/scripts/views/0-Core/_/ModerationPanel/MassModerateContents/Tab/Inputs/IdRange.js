import {
  ActionList,
  ActionListHole,
  ContentBox,
  ContentBoxActions,
  ContentBoxContent,
  SpinnerContainer,
  Text,
  Textarea,
  Input
} from "@style-guide";
import debounce from "debounce";
import rangeParser from "parse-numeric-range";
import Inputs from ".";
import Build from "../../../../../../../helpers/Build";

let System = require("../../../../../../../helpers/System");

export default class IdRange extends Inputs {
  constructor(main) {
    if (typeof System == "function")
      // @ts-ignore
      System = System();

    super(main, {
      tabButton: {
        text: System.data.locale.core.MassModerateContents.targets.idRange
          .text
      }
    });

    this.is = "idRange";
    this.range = [];

    this.RenderInput();
    this.RenderOutput();
    this.Render();
    this.BindHandler();
  }
  RenderInput() {
    this.input = Input({
      fullWidth: true,
      placeholder: "1,2,3,4-10,11...30",
      title: System.data.locale.core.MassModerateContents.targets.idRange
        .youNeedToEnterTwoDifferentIdNumbers
    });
    this.$input = $(this.input);
  }
  RenderOutput() {
    this.output = Textarea({
      tag: "div",
      fullWidth: true,
      resizable: "vertical",
      placeholder: `${System.data.locale.core.MassModerateContents.targets.idRange.output}..`
    })
  }
  Render() {
    let sampleRange = "1,2,3-10,11..20,20...30";
    let nIds = Text({
      size: "xsmall",
      html: System.data.locale.common.nIds.replace("%{n}",
        ` <span class="sg-text--bold">0</span> `)
    });
    this.numberOfIds = nIds.querySelector("span");
    let nContents = Text({
      size: "xsmall",
      color: "blue-dark",
      html: System.data.locale.core.MassModerateContents.nContents
        .replace("%{n}", ` <span class="sg-text--bold">0</span> `)
    });
    this.numberOfContents = nContents.querySelector("span");
    let nIgnored = Text({
      size: "xsmall",
      color: "peach-dark",
      html: System.data.locale.core.MassModerateContents.nIgnored.replace(
        "%{n}", ` <span class="sg-text--bold">0</span> `)
    });
    this.numberOfIgnored = nIgnored.querySelector("span");

    this.container = Build(ActionList({
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
                SpinnerContainer({
                  fullWidth: true,
                }),
                [
                  [
                    ContentBoxActions(),
                    this.input
                  ]
                ]
              ],
              [
                ContentBoxActions(),
                [
                  [
                    ActionList({
                      noWrap: true,
                      direction: "space-between"
                    }),
                    [
                      [
                        ActionListHole(),
                        [
                          [
                            SpinnerContainer(),
                            nIds
                          ]
                        ]
                      ],
                      [
                        ActionListHole(),
                        nContents
                      ],
                      [
                        ActionListHole(),
                        nIgnored
                      ]
                    ]
                  ]
                ]
              ],
              [
                ContentBoxContent({
                  spacedTop: true
                }),
                this.output
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
                      html: System.data.locale.core.MassModerateContents
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
                        html: rangeParser.parse(sampleRange).join(", ")
                      })
                    ]
                  ]
                ]
              ]
            ]
          ]
        ]
      ]
    ]);
  }
  BindHandler() {
    this.input.addEventListener("input", debounce(this.Validate.bind(this),
      100));
  }
  Validate() {
    this.range = [];

    if (!this.input.value) {
      this.CalculateIdList();

      return this.input.Natural();
    }

    this.range = this.ParseRangeValue();
    this.value[this.main.active.contentType.is] = this.input.value;

    if (!this.range || this.range.length == 0)
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
    rangeArr = Array.from(rangeSet);
    this.rangeLengthBeforeFilter = rangeArr.length;
    rangeArr = rangeArr.filter(x => (
      x > 0 &&
      !this.main.active.contentType
      .deletedContents.includes(x)
    ));

    return rangeArr;
  }
  CalculateIdList() {
    let idList = this.range;
    let numberOfIgnored = this.rangeLengthBeforeFilter - idList.length;
    this.output.innerHTML = "";

    if (idList.length > 0) {
      let tempArr = idList.slice(0, 1000);
      let tempList = tempArr.join("\n");
      this.output.innerHTML = tempList.replace(/(\d{1,})/g,
        `<div><span class="sg-text--background-blue-light">$1</span></div>`);

      if (tempArr.length < idList.length)
        this.output.innerHTML += `...`;

      this.output.scrollTop = this.output.scrollHeight;
    }

    this.idList = idList;
    this.numberOfIds.innerText = String(this.rangeLengthBeforeFilter || 0);
    this.numberOfIgnored.innerText = String(numberOfIgnored);
    this.numberOfContents.innerText = String(idList.length);
  }
  Visible() {
    this.input.value = this.value[this.main.active.contentType.is] || "";

    this.Validate();
  }
  ClearInput() {
    this.input.value = "";

    this.Validate();
  }
}
