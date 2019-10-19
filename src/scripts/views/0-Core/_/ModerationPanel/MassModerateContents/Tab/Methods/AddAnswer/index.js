import {
  ContentBox,
  ContentBoxContent,
  Textarea,
  SpinnerContainer,
  Spinner,
  ActionList,
  ActionListHole,
  Text
} from "@style-guide";
import Methods from "..";
import Build from "@/scripts/helpers/Build";
import Action from "@/scripts/controllers/Req/Brainly/Action";

let MIN_ANSWER_LENGTH = 20;

export default class AddAnswer extends Methods {
  /**
   * @param {import("../../../index").default} main
   */
  constructor(main) {
    super(main, {
      restrictions: {
        contentType: ["QUESTION"]
      },
      startButton: {
        html: System.data.locale.common.add
      },
      tabButton: System.data.locale.core.MassModerateContents.methods
        .addAnswer.tabButton
    });

    this.is = "addAnswer";
    this.answerContent = "";

    this.Render();
    this.RenderSpinner();
    this.BindHandlers2();
  }
  Render() {
    this.container = Build(ContentBox(), [
      [
        ContentBoxContent(),
        [
          [
            ContentBox(),
            [
              [
                ContentBoxContent(),
                [
                  [
                    this.spinnerContainer = SpinnerContainer({
                      className: "sg-box--full"
                    }),
                    this.textarea = Textarea({
                      tag: "textarea",
                      fullWidth: true,
                    })
                  ]
                ]
              ],
              [
                ContentBoxContent(),
                [
                  [
                    ActionList({ direction: "to-right" }),
                    [
                      [
                        ActionListHole(),
                        this.counter = Text({
                          text: 0,
                          size: "xsmall",
                          weight: "bold",
                        }),
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
  }
  RenderSpinner() {
    this.spinner = Spinner({
      overlay: true,
    });
  }
  BindHandlers2() {
    this.textarea.addEventListener("input", this.AnswerWritten.bind(this))
  }
  AnswerWritten() {
    if (this.started) {
      this.textarea.value = this.answerContent;

      return;
    }

    this.answerContent = this.textarea.value;
    let contentLen = this.answerContent.length;
    this.counter.innerText = String(contentLen);

    this.counter.ChangeColor(
      contentLen < MIN_ANSWER_LENGTH ?
      "peach-dark" :
      "mint-dark"
    );

    this._Show();
  }
  _Show() {
    if (this.started)
      this.ShowActionButtonSpinnerContainer();
    else if (
      this.main.IsInputHasIds() &&
      this.HasValidAnswerContent()
    ) {
      this.ShowActionButtonSpinnerContainer();
      this.ShowStartButton();
    } else
      this._Hide();
  }
  HasValidAnswerContent() {
    return this.textarea.value.length >= MIN_ANSWER_LENGTH
  }
  /**
   * @param {number} contentId
   */
  async Moderate(contentId) {
    let resAnswer = await new Action()
      .HelloWorld();
    //.AddAnswer(contentId, this.answerContent);

    if (!resAnswer || !resAnswer.success)
      return this.resultsSection.Failed(contentId);

    this.resultsSection.Moderated(contentId);
  }
}
