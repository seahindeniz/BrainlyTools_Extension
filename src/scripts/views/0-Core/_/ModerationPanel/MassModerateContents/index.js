import Modal from "../../../../../components/Modal2";
import { ActionList, ActionListHole, ContentBox, ContentBoxContent, SeparatorVertical, Text, MenuListItem } from "../../../../../components/style-guide";
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
    this.li = MenuListItem({
      html: System.data.locale.core.MassModerateContents.text
    });

    this.li.setAttribute("style", "display: table; width: 100%;");
    this.li.addEventListener("click", this.Open.bind(this));
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
  }
  RenderModal() {
    this.contentTypesList = ActionList({
      direction: "space-around"
    });
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
                    ActionListHole({
                      noShrink: true,
                    }),
                    Text({
                      color: "blue-dark",
                      weight: "bold",
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
    this.inputsContainer = ActionListHole({
      grow: true
    });
    this.actionListOfInputsSection = ContentBox();

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
            ActionListHole({
              noShrink: true,
              noSpacing: true,
            }),
            [
              [
                this.actionListOfInputsSection,
                [
                  [
                    ContentBoxContent({
                      full: true,
                      spacedBottom: true,
                      align: "center",
                    }),
                    Text({
                      color: "blue-dark",
                      weight: "bold",
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
          this.inputsContainer
        ]
      ]
    ]);
  }
  RenderInputs() {
    this.inputs = [
      new ListOfIds(this),
      new IdRange(this),
      //new SearchQuestion(this)
    ];
  }
  RenderMethodsSection() {
    this.methodsContainer = ActionListHole({
      grow: true
    });
    this.actionListOfMethodsSection = ContentBox();

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
            ActionListHole({
              noShrink: true,
              noSpacing: true,
            }),
            [
              [
                this.actionListOfMethodsSection,
                [
                  [
                    ContentBoxContent({
                      full: true,
                      spacedBottom: true,
                      align: "center",
                    }),
                    Text({
                      color: "blue-dark",
                      weight: "bold",
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
          this.methodsContainer
        ]
      ]
    ]);
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
    this.HideElement(this.inputsSection);

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
    this.HideElement(this.methodsSection);

    if (this.active.method)
      this.active.method.HideActive();
  }
  TriggerInputs() {
    if (this.active.contentType) {
      this.sectionContainer.appendChild(this.inputsSection);
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
      !IsVisible(this.methodsSection) &&
      (
        this.MethodsStarted().length > 0 ||
        this.IsInputHasIds()
      )
    ) {
      this.sectionContainer.appendChild(this.methodsSection);
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
