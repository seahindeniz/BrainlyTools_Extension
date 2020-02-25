import {
  ActionList,
  ActionListHole,
  ContentBox,
  ContentBoxActions,
  ContentBoxContent,
  Label,
  Spinner,
  SpinnerContainer,
  Text,
  Textarea
} from "@style-guide";
import debounce from "debounce";
import Build from "../../../../../../../helpers/Build";
import Inputs from ".";

export default class ListOfIds extends Inputs {
  constructor(main) {
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
      tag: "div",
      fullWidth: true,
      resizable: true,
      contentEditable: true,
      placeholder: System.data.locale.core.MassModerateContents.targets
        .listOfIds.contentLinksOrIDs,
      style: "position: absolute; background: transparent;"
    });
    this.textareaBack = Textarea({
      tag: "div",
      fullWidth: true,
      color: "white",
      style: "color: transparent;"
    });
    this.textareaSpinnerContainer = Build(SpinnerContainer({
      fullWidth: true,
    }), [
      this.textareaBack,
      this.textarea
    ]);
  }
  Render() {
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

    this.container = Build(ContentBox(), [
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
                        tag: "div",
                        size: "xsmall",
                        html: System.createBrainlyLink(
                          "question", { id: 1234567 })
                      }),
                      Text({
                        tag: "div",
                        size: "xsmall",
                        html: System.createBrainlyLink(
                          "question", { id: 2345678 })
                      }),
                      Text({
                        tag: "div",
                        size: "xsmall",
                        html: "1234567"
                      }),
                      Text({
                        tag: "div",
                        size: "xsmall",
                        html: "53453"
                      }),
                      Text({
                        tag: "div",
                        size: "xsmall",
                        html: "tr545645"
                      }),
                      Text({
                        tag: "div",
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
                      children: Text({
                        weight: "bold",
                        size: "xsmall",
                        html: System.data.locale.core
                          .MassContentDeleter.containerExplanation,
                      }),
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
    ]);
  }
  RenderSpinner() {
    this.spinner = Spinner({
      overlay: true
    });
  }
  RenderTextareaWarning() {
    this.$textareaWarning = $(
      `<div class="sg-bubble sg-bubble--top sg-bubble--row-start sg-bubble--peach sg-text--white enterIdWarn">${System.data.locale.core.notificationMessages.enterIdWarn}</div>`
    );
  }
  BindHandlers() {
    this.textarea.addEventListener("paste", this.PasteHandler.bind(this));
    this.textarea.addEventListener("scroll", this.UpdateTextareaBackScroll
      .bind(this));
    this.textarea.addEventListener("input", debounce(this
      .UpdateTextareaBackContent.bind(this), 5));

    // @ts-ignore
    new window.ResizeObserver(this.UpdateTextAreaBackResize.bind(this))
      .observe(this.textarea);
  }
  /**
   * @param {ClipboardEvent} event
   */
  PasteHandler(event) {
    event.preventDefault();
    this.ShowTextareaSpinner();

    /**
     * @type {string}
     */
    // @ts-ignore
    let text = (event.originalEvent || event).clipboardData.getData(
      "text/plain");

    if (text)
      text = text.replace(/\s{1,}/g, "<br>");

    document.execCommand("insertHTML", false, text)

    this.UpdateTextareaBackContent();
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
    this.numberOfIds.innerText = "0";
    let temp = this.value[this.main.active.contentType.is] = this.textarea
      .innerHTML;

    if (idList.length > 0) {
      let rgx = new RegExp(`(?<![0-9])(?:${idList.join("|")})(?![0-9])`, "g");
      temp = temp
        .replace(rgx,
          replacedId => {
            let id = Number(replacedId);

            if (moderatableIdList.includes(id))
              return replacedId;

            let status = "blue-light";

            if (
              this.main.active.contentType.deletedContents.length > 0 &&
              this.main.active.contentType.deletedContents.includes(id)
            ) {
              status = "peach";

              numberOfIgnored++;
            } else
              moderatableIdList.push(id);

            return `<span class="sg-text--background-${status}">${id}</span>`
          });
    }

    this.idList = moderatableIdList; // for triggering the setter in index.js
    this.textareaBack.innerHTML = temp;
    this.numberOfIds.innerText = String(idList.length);
    this.numberOfIgnored.innerText = String(numberOfIgnored);
    this.numberOfContents.innerText = String(moderatableIdList.length);

    this.HideTextareaWarning();
    this.HideTextareaSpinner();
    this.UpdateTextareaBackScroll();
  }
  ParseIDs() {
    /**
     * @type {number[]}
     */
    let idList = [];
    let values = this.textarea.innerText;

    if (values)
      idList = System.ExtractIds(values);

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
    this.textarea.innerHTML = this.value[this.main.active.contentType.is] ||
      "";

    this.UpdateTextareaBackContent();
  }
  ClearInput() {
    this.textarea.innerHTML = "";

    this.UpdateTextareaBackContent();
  }
}
