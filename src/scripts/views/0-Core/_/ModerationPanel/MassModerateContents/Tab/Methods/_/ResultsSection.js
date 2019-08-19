import clipboard from "clipboard";
import { ActionList, ActionListHole, ContentBox, ContentBoxActions, ContentBoxContent, Label, SeparatorHorizontal, Text, Textarea } from "../../../../../../../../components/style-guide";
import Build from "../../../../../../../../helpers/Build";

let System = require("../../../../../../../../helpers/System");

export default class ResultsSection {
  /**
   * @param {import("../index").default} main
   */
  constructor(main) {
    this.main = main;

    if (typeof System == "function")
      // @ts-ignore
      System = System();

    this.RenderLists();
    this.Render();
    this.BindHandlers();
  }
  RenderLists() {
    this.moderatedIdsBox = Textarea({
      type: "div",
      size: "xtall",
      resizable: "vertical"
    });
    this.failedIdsBox = Textarea({
      type: "div",
      size: "xtall",
      resizable: "vertical"
    });
  }
  Render() {
    this.container = Build(ContentBoxContent(), [
      [
        ContentBox(),
        [
          [
            ContentBoxActions(),
            SeparatorHorizontal()
          ],
          [
            ContentBoxContent(),
            [
              [
                ActionList({
                  toTop: true,
                }),
                [
                  [
                    ActionListHole({
                      equalWidth: true
                    }),
                    [
                      [
                        ContentBox(),
                        [
                          [
                            ContentBoxContent(),
                            Text({
                              align: "CENTER",
                              color: "blue-dark",
                              weight: "bold",
                              html: "Moderated"
                            })
                          ],
                          [
                            ContentBoxContent(),
                            this.moderatedIdsBox
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
                        ContentBox(),
                        [
                          [
                            ContentBoxContent(),
                            Text({
                              align: "CENTER",
                              color: "blue-dark",
                              weight: "bold",
                              html: "Failed"
                            })
                          ],
                          [
                            ContentBoxContent(),
                            this.failedIdsBox
                          ]
                        ]
                      ]
                    ]
                  ]
                ]
              ],
              [
                ContentBoxActions(),
                Label({
                  text: System.data.locale.core.MassModerateContents.methods.clickListToCopy,
                  icon: {
                    type: "ext-info",
                    color: "blue"
                  }
                })
              ]
            ]
          ]
        ]
      ]
    ]);
  }
  BindHandlers() {
    try {
      let clipboardOptions = {
        target: trigger => {
          return trigger.innerText.length > 0 ? trigger : null
        }
      };

      new clipboard(this.failedIdsBox, clipboardOptions)
        .on("success", this.Copied.bind(this))
        .on("error", this.NotCopied.bind(this));

      new clipboard(this.moderatedIdsBox, clipboardOptions)
        .on("success", this.Copied.bind(this))
        .on("error", this.NotCopied.bind(this));
    } catch (error) {
      console.error(error);
      this.NotCopied();
    }
  }
  Copied() {
    this.main.main.modal.Notification({
      text: System.data.locale.core.MassModerateContents.methods.copied,
      type: "success"
    });

    // event.clearSelection();
  }
  NotCopied() {
    this.main.main.modal.Notification({
      text: System.data.locale.core.MassModerateContents.methods.iCantCopy,
      type: "error"
    });
  }
  /**
   * @param {number} contentId
   */
  Failed(contentId) {
    this.failedIdsBox.appendChild(Text({
      type: "div",
      text: contentId,
      size: "small",
      color: "peach-dark"
    }));
  }
  /**
   * @param {number} contentId
   */
  Moderated(contentId) {
    this.moderatedIdsBox.appendChild(Text({
      type: "div",
      text: contentId,
      size: "small",
      color: "mint-dark"
    }));
  }
}
