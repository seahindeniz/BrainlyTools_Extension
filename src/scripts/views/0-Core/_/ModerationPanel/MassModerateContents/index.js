import Modal from "../../../../../components/Modal2";
import { ActionList, ActionListHole, ContentBox, ContentBoxContent, SeparatorVertical, Text, Label, Radio } from "../../../../../components/style-guide";
import Build from "../../../../../helpers/Build";
import IsVisible from "../../../../../helpers/IsVisible";
import Answer from "./Tab/ContentType/Answer";
import Comment from "./Tab/ContentType/Comment";
import Question from "./Tab/ContentType/Question";
import IdRange from "./Tab/Inputs/IdRange";
import ListOfIds from "./Tab/Inputs/ListOfIds";
import SearchQuestion from "./Tab/Inputs/SearchQuestion";
import ReportContent from "./Tab/Methods/ReportContent";

/**
 * @typedef {Question | Answer | Comment} ContentTypes
 * @typedef {ListOfIds | IdRange | SearchQuestion} Inputs
 * @typedef {ReportContent} Methods
 * @typedef {ContentTypes | Inputs | Methods} Tabs
 */
let System = require("../../../../../helpers/System");

class MassModerateContents {
  constructor() {
    if (typeof System == "function")
      // @ts-ignore
      System = System();

    let that = this;
    this.active = {
      /**
       * @type {ContentTypes}
       */
      _contentType: undefined,
      /**
       * @type {Inputs}
       */
      _input: undefined,
      /**
       * @type {Methods}
       */
      _method: undefined,
      set contentType(contentType) {
        this._contentType = contentType;
      },
      get contentType() {
        return this._contentType;
      },
      set input(input) {
        this._input = input;

        that.ToggleMethods();
      },
      get input() {
        return this._input;
      },
      set method(method) {
        this._method = method;
      },
      get method() {
        return this._method;
      }
    }

    this.RenderLi();
  }
  RenderLi() {
    this.$li = $(`
		<li class="sg-menu-list__element" style="display: table; width: 100%;">
			<span class="sg-menu-list__link sg-text--link">${System.data.locale.core.MassModerateContents.text}</span>
    </li>`);

    this.$li.on("click", "span", this.Open.bind(this));
  }
  Open() {
    if (!this.modal) {
      try {
        this.RenderSectionContainer();
        this.RenderModal();
        this.RenderContentTypes();
        this.RenderInputsSection();
        this.RenderInputs();
        this.RenderMethodsSection();
        this.RenderMethods();
      } catch (error) {
        console.error(error);
      }
    }

    this.modal.Open();
  }
  RenderSectionContainer() {
    this.sectionContainer = ContentBox({ full: true });
    this.$sectionContainer = $(this.sectionContainer);
  }
  RenderModal() {
    this.contentTypesList = ActionList({
      direction: "space-around"
    });
    this.$contentTypesList = $(this.contentTypesList);
    this.modal = new Modal({
      overlay: true,
      size: "large",
      limitedWidth: true,
      title: {
        children: System.data.locale.core.MassModerateContents.text
      },
      content: {
        children: Build(this.sectionContainer, [
          [
            ContentBoxContent({
              full: true,
              spacedBottom: "large"
            }),
            [
              [
                ActionList(),
                [
                  [
                    ActionListHole(),
                    Text({
                      color: "blue-dark",
                      weight: "bold",
                      noWrap: true,
                      html: System.data.locale.core.MassModerateContents.contentType
                    })
                  ],
                  [
                    ActionListHole({
                      grow: true
                    }),
                    this.contentTypesList
                  ]
                ]
              ]
            ]
          ]
        ])
      },
      actions: {
        align: "center",
        spacedTop: "xlarge"
      }
    });
  }
  RenderContentTypes() {
    this.contentTypes = {
      question: new Question(this),
      answer: new Answer(this),
      comment: new Comment(this)
    };
  }
  RenderInputsSection() {
    this.inputsSection = Build(ContentBoxContent({
      full: true,
      spacedTop: "xxlarge",
      spacedBottom: true
    }), [
      [
        ActionList({
          noWrap: true,
          toTop: true
        }),
        [
          [
            ActionListHole(),
            [
              [
                ContentBox(),
                [
                  [
                    ContentBoxContent({
                      full: true,
                      spacedBottom: true
                    }),
                    Text({
                      color: "blue-dark",
                      weight: "bold",
                      noWrap: true,
                      html: System.data.locale.core.MassModerateContents.targets.text
                    })
                  ]
                ]
              ]
            ]
          ],
          [
            ActionListHole({
              stretch: true
            }),
            SeparatorVertical({
              size: "full"
            })
          ],
          ActionListHole({
            grow: true
          })
        ]
      ]
    ]);
    this.$inputsSection = $(this.inputsSection);

    this.$actionListOfInputsSection = $(".sg-content-box", this.$inputsSection);
    this.$inputsContainer = $(".sg-actions-list__hole:nth-child(3)", this.$inputsSection);
  }
  RenderInputs() {
    this.inputs = [
      new ListOfIds(this),
      new IdRange(this),
      //new SearchQuestion(this)
    ];
  }
  RenderMethodsSection() {
    this.methodsSection = Build(ContentBoxContent({
      full: true,
      spacedTop: "xxlarge"
    }), [
      [
        ActionList({
          noWrap: true,
          toTop: true
        }),
        [
          [
            ActionListHole(),
            [
              [
                ContentBox(),
                [
                  [
                    ContentBoxContent({
                      full: true,
                      spacedBottom: true
                    }),
                    Text({
                      color: "blue-dark",
                      weight: "bold",
                      noWrap: true,
                      html: System.data.locale.core.MassModerateContents.methods.text
                    })
                  ]
                ]
              ]
            ]
          ],
          [
            ActionListHole({
              stretch: true
            }),
            SeparatorVertical({
              size: "full"
            })
          ],
          ActionListHole({
            grow: true
          })
        ]
      ]
    ]);
    this.$methodsSection = $(this.methodsSection);

    this.$actionListOfMethodsSection = $(".sg-content-box", this.$methodsSection);
    this.$methodsContainer = $(".sg-actions-list__hole:nth-child(3)", this.$methodsSection);
  }
  RenderMethods() {
    this.methods = [
      new ReportContent(this)
    ]
  }
  /**
   * @param {HTMLElement | JQuery<HTMLElement>} $element
   */
  HideElement($element) {
    if ($element) {
      if ($element instanceof HTMLElement)
        document.createElement("div").appendChild($element);
      else if ($element instanceof jQuery)
        $element.appendTo("<div />");

    }
  }
  HideInputs() {
    this.HideElement(this.$inputsSection);

    if (this.active.input)
      this.active.input.HideActive();

    this.inputs.forEach(this.HideInput.bind(this));
  }
  /**
   * @param {(ListOfIds|IdRange|SearchQuestion)} input
   */
  HideInput(input) {
    input.Hide();
    input.HideActionButton();
  }
  HideMethods() {
    this.HideElement(this.$methodsSection);

    if (this.active.method)
      this.active.method.HideActive();
  }
  TriggerInputs() {
    if (this.active.contentType) {
      this.$inputsSection.appendTo(this.$sectionContainer);
      this.inputs.forEach(this.TriggerInput.bind(this));
    }
  }
  /**
   * @param {(ListOfIds|IdRange|SearchQuestion)} input
   */
  TriggerInput(input) {
    input.ContentTypeSelected();

    if (
      !input.restrictions ||
      input.restrictions.contentType.includes(this.active.contentType.is)
    ) {
      input.ShowActionButton();
      input.Visible();
    }
  }
  ToggleMethods() {
    //console.log(this.active.input, this.active.input && this.active.input.idList);
    if (
      this.MethodsStarted().length == 0 &&
      (
        !this.active.input ||
        this.active.input.idList.length == 0
      )
    )
      return this.HideMethods();

    this.TriggerMethods();
  }
  TriggerMethods() {
    if (
      !this.$methodsSection.is(":visible") &&
      (
        this.MethodsStarted().length > 0 ||
        this.IsInputHasIds()
      )
    ) {
      this.$methodsSection.appendTo(this.$sectionContainer);
    }

    this.methods.forEach(this.TriggerMethod.bind(this));
  }
  MethodsStarted() {
    return this.methods.filter(method => method.started);
  }
  IsInputHasIds() {
    return this.active.input && this.active.input.idList.length > 0;
  }
  /**
   * @param {ReportContent} method
   */
  TriggerMethod(method) {
    if (this.active.contentType)
      method.ContentTypeSelected();

    if (this.active.input)
      method.InputSelected();

    if (
      !IsVisible(method.tabButton) &&
      (
        method.started ||
        this.IsInputHasIds() &&
        (
          !method.restrictions ||
          method.restrictions.contentType.includes(this.active.input.is)
        )
      )
    )
      method.ShowActionButton();
  }
}

export default MassModerateContents
