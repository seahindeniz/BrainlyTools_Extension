import Inputs from ".";
import debounce from "debounce";
import Build from "../../../../../../../helpers/Build";
import { Text, ContentBox, ContentBoxActions, ActionList, ActionListHole, SpinnerContainer, Textarea, Spinner, ContentBoxContent, Label } from "../../../../../../../components/style-guide";

let System = require("../../../../../../../helpers/System");

export default class ListOfIds extends Inputs {
  constructor(main) {
    if (typeof System == "function")
      // @ts-ignore
      System = System();

    super(main, {
      tabButton: {
        text: System.data.locale.common.listOfIds
      }
    });

    this.is = "listOfIds";

    this.RenderTextAreaContainer();
    this.Render();
    this.RenderSpinner();
    this.RenderTextareaWarning();
    this.BindHandlers();
  }
  RenderTextAreaContainer() {
    this.textarea = Textarea({
      type: "div",
      fullWidth: true,
      resizable: true,
      contentEditable: true,
      placeholder: System.data.locale.core.MassModerateContents.targets.listOfIds.contentLinksOrIDs,
      style: "position: absolute; background: transparent;"
    });
    this.textareaBack = Textarea({
      type: "div",
      fullWidth: true,
      style: "color: transparent;"
    });
    this.textareaSpinnerContainer = Build(SpinnerContainer({
      className: "sg-box--full"
    }), [
      [
        ContentBoxActions(),
        [
          this.textareaBack,
          this.textarea
        ]
      ]
    ]);
  }
  Render() {
    let nIds = Text({
      size: "xsmall",
      html: System.data.locale.common.nIds.replace("%{n}", ` <span class="sg-text--bold">0</span> `)
    });
    let nContents = Text({
      size: "xsmall",
      color: "blue-dark",
      html: System.data.locale.core.MassModerateContents.nContents.replace("%{n}", ` <span class="sg-text--bold">0</span> `)
    });
    let nIgnored = Text({
      size: "xsmall",
      color: "peach-dark",
      html: System.data.locale.core.MassModerateContents.nIgnored.replace("%{n}", ` <span class="sg-text--bold">0</span> `)
    });
    this.$ = $(Build(ContentBox(), [
      this.textareaSpinnerContainer,
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
                nIds
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
        [
          [
            Text({
              size: "small",
              breakWords: true,
              type: "blockquote"
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
                      html: System.data.locale.core.MassModerateContents.targets.idRange.exampleUsage
                    })
                  ],
                  [
                    ContentBoxContent({
                      spacedTop: true
                    }),
                    [
                      Text({
                        type: "div",
                        size: "xsmall",
                        html: System.createBrainlyLink("task", { id: 1234567 })
                      }),
                      Text({
                        type: "div",
                        size: "xsmall",
                        html: System.createBrainlyLink("task", { id: 2345678 })
                      }),
                      Text({
                        type: "div",
                        size: "xsmall",
                        html: "1234567"
                      }),
                      Text({
                        type: "div",
                        size: "xsmall",
                        html: "53453"
                      }),
                      Text({
                        type: "div",
                        size: "xsmall",
                        html: "tr545645"
                      }),
                      Text({
                        type: "div",
                        size: "xsmall",
                        html: "us423423"
                      })
                    ]
                  ],
                  [
                    ContentBoxContent({
                      spacedTop: true
                    }),
                    Label({
                      html: System.data.locale.core.MassContentDeleter.containerExplanation,
                      icon: {
                        color: "blue",
                        "type": "ext-info"
                      }
                    })
                  ]
                ]
              ]
            ]
          ]
        ]
      ]
    ]));
    this.$numbersContainer = $(".sg-content-box__actions:nth-child(2)", this.$);
    this.$numberOfIds = $("span", nIds);
    this.$numberOfContents = $("span", nContents);
    this.$numberOfIgnored = $("span", nIgnored);
  }
  RenderSpinner() {
    this.spinner = Spinner({
      overlay: true
    });
  }
  RenderTextareaWarning() {
    this.$textareaWarning = $(`<div class="sg-bubble sg-bubble--top sg-bubble--row-start sg-bubble--peach sg-text--white enterIdWarn">${System.data.locale.core.notificationMessages.enterIdWarn}</div>`);
  }
  BindHandlers() {
    $(this.textarea).on({
      paste: this.PasteHandler.bind(this),
      scroll: this.UpdateTextareaBackScroll.bind(this),
      input: debounce(this.UpdateTextareaBackContent.bind(this), 5)
    });

    // @ts-ignore
    new window.ResizeObserver(this.UpdateTextAreaBackResize.bind(this)).observe(this.textarea);
  }
  async PasteHandler(event) {
    event.preventDefault();
    this.ShowTextareaSpinner();

    let text = (event.originalEvent || event).clipboardData.getData("text/plain");

    await System.Delay(50);
    document.execCommand("insertText", false, text);
  }
  ShowTextareaSpinner() {
    this.textareaSpinnerContainer.appendChild(this.spinner);
  }
  HideTextareaSpinner() {
    this.main.HideElement(this.spinner);
  }
  UpdateTextareaBackScroll() {
    this.textareaBack.scrollTop = this.textarea.scrollTop;
  }
  UpdateTextareaBackContent() {
    let idList = this.ParseIDs();
    let moderatableIdList = [];
    let numberOfIgnored = 0;

    this.$numberOfIds.text(0);

    let temp = this.value[this.main.active.contentType.is] = this.textarea.innerHTML;

    idList.forEach(id => {
      let status = "blue-light";

      if (this.main.active.contentType.deletedContents.includes(id)) {
        status = "peach";

        numberOfIgnored++;
      } else
        moderatableIdList.push(id);

      temp = temp.replace(new RegExp(`((?:\\b|[a-z]{1,})+${id}\\b)`), `<span class="sg-text--background-${status}">$1</span>`);
    });

    this.idList = moderatableIdList; // for triggering the setter in index.js
    this.$numberOfIds.text(idList.length);
    this.$numberOfContents.text(moderatableIdList.length);
    this.$numberOfIgnored.text(numberOfIgnored);
    this.textareaBack.innerHTML = temp;
    this.HideTextareaWarning();
    this.HideTextareaSpinner();
    this.UpdateTextareaBackScroll();
  }
  /**
   * @returns {number[]}
   */
  ParseIDs() {
    let idList = [];
    let values = this.textarea.innerText;

    if (values) {
      idList = System.ExtractIds(values);

      if (idList && idList.length > 0) {
        idList = Array.from(new Set(idList));
      }
    }

    return idList;
  }
  async HideTextareaWarning() {
    await this.$textareaWarning.slideUp('fast').promise();
    this.main.HideElement(this.$textareaWarning)
    this.$textareaWarning.show();
  }
  UpdateTextAreaBackResize() {
    this.textareaBack.style.width = this.textarea.style.width;
    this.textareaBack.style.height = this.textarea.style.height;
  }
  Visible() {
    this.textarea.innerHTML = this.value[this.main.active.contentType.is] || "";

    this.UpdateTextareaBackContent();
  }
  ClearInput() {
    this.textarea.innerHTML = "";

    this.UpdateTextareaBackContent();
  }
}
