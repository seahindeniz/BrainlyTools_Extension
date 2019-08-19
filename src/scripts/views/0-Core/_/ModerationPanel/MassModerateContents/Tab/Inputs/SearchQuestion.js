import debounce from "debounce";
import Inputs from ".";
import { ActionList, ActionListHole, ContentBox, ContentBoxActions, Search, SpinnerContainer, Text } from "../../../../../../../components/style-guide";
import Action from "../../../../../../../controllers/Req/Brainly/Action";
import Build from "../../../../../../../helpers/Build";

let System = require("../../../../../../../helpers/System");

export default class SearchQuestion extends Inputs {
  constructor(main) {
    if (typeof System == "function")
      // @ts-ignore
      System = System();

    super(main, {
      restrictions: {
        contentType: ["QUESTION"]
      },
      tabButton: {
        text: System.data.locale.core.MassModerateContents.targets.searchQuestion.text
      }
    });

    this.is = "searchQuestion";

    this.RenderInput();
    this.Render();
    this.BindHandler();
  }
  RenderInput() {
    this.searchContainer = Search({
      fullWidth: true,
      placeholder: System.data.locale.core.MassModerateContents.targets.searchQuestion.whatIsYourQuestion
    });
    this.$input = $("input", this.searchContainer);
  }
  Render() {
    let nIds = Text({
      size: "xsmall",
      html: System.data.locale.common.nIds.replace("%{n}", ` <span class="sg-text--bold">0</span> `)
    });
    let nContents = Text({
      size: "xsmall",
      color: "mustard-dark",
      html: System.data.locale.core.MassModerateContents.nContents.replace("%{n}", ` <span class="sg-text--bold">0</span> `)
    });
    let nIgnored = Text({
      size: "xsmall",
      color: "peach-dark",
      html: System.data.locale.core.MassModerateContents.nIgnored.replace("%{n}", ` <span class="sg-text--bold">0</span> `)
    });
    this.container = Build(ContentBox(), [
      [
        SpinnerContainer({
          className: "sg-box--full"
        }),
        [
          [ContentBoxActions(),
            this.searchContainer
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
      ]
    ]);
    this.$ = $(this.container);

    this.$numberOfIds = $("span", nIds);
    this.$numberOfContents = $("span", nContents);
    this.$numberOfIgnored = $("span", nIgnored);
  }
  BindHandler() {
    this.$input.on("input", debounce(this.InputChanged.bind(this), 2000))
  }
  InputChanged() {
    let value = this.$input.val();
    this.value[this.main.active.contentType.is] = value;

    if (value !== "")
      this.Search();
  }
  async Search() {
    let resSearch = await new Action().SearchQuestion(String(this.$input.val()));
  }
  Visible() {
    this.$input.val(this.value[this.main.active.contentType.is] || "");
    this.InputChanged();
  }
  ClearInput() {
    this.$input.val("");

    this.InputChanged();
  }
}
