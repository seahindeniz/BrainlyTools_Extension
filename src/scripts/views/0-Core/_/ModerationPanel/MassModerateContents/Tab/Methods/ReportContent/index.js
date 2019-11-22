import { ContentBox, ContentBoxContent, Spinner, Text } from "@style-guide";
import Methods from "..";
import Action from "../../../../../../../../controllers/Req/Brainly/Action";
import Build from "../../../../../../../../helpers/Build";
import Reason from "./Reason";

export default class ReportContent extends Methods {
  /**
   * @param {import("../../../index").default} main
   */
  constructor(main) {
    super(main, {
      startButton: {
        html: System.data.locale.common.send
      },
      tabButton: System.data.locale.core.MassModerateContents.methods
        .reportForAbuse.tabButton
    });

    this.is = "reportContent";
    /**
     * @type {Object<string, Reason[]>}
     */
    this._reasons = {};
    /**
     * @type {Reason}
     */
    this.selectedReason;
    this.abuse = {
      category_id: null,
      data: null,
      subcategory_id: null
    }
    this.lastSelectedContentType;

    this.Render();
  }
  set reasons(reasons) {
    this._reasons[this.main.active.contentType.is] = reasons;
  }
  get reasons() {
    return this._reasons[this.main.active.contentType.is]
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
                ContentBoxContent({
                  spacedBottom: true
                }),
                Text({
                  color: "blue-dark",
                  weight: "bold",
                  text: System.data.locale.core.MassModerateContents
                    .methods.reportForAbuse.chooseAReason
                })
              ],
              [
                this.reasonContainer = ContentBoxContent({
                  spacedBottom: true
                }),
                this.spinner = Spinner()
              ]
            ]
          ]
        ]
      ]
    ]);
  }
  ContentTypeSelected() {
    if (!this.reasons)
      this.FetchReasons();

    if (!this.started)
      this.ShowReasons();
  }
  async FetchReasons() {
    this.reasons = [];
    let resReasons = await new Action().GetAbuseReasons(this.main.active
      .contentType.is);
    this.main.HideElement(this.spinner);

    if (resReasons && resReasons.success) {
      this.RenderReasons(resReasons.data);

      if (this.main.IsInputHasIds())
        this.ShowReasons();
    }
  }
  /**
   *
   * @param {import("./Reason").Reason[]} reasons
   */
  RenderReasons(reasons) {
    reasons.forEach(reason => reason.visible && new Reason(this, reason));
  }
  ShowReasons() {
    if (this.lastSelectedContentType)
      this.HidePreviousReasons();

    this.lastSelectedContentType = this.main.active.contentType.is;

    this.reasons.forEach(reason => reason.Show())
  }
  HidePreviousReasons() {
    this._reasons[this.lastSelectedContentType].forEach(reason => reason
      .Hide())
  }
  TabOpened() {
    if (this.started)
      this.ShowActionButtonSpinnerContainer();
    else if (
      this.main.IsInputHasIds() &&
      this.IsReasonSelected()
    )
      this.ShowStartButton();
  }
  IsReasonSelected() {
    return !!this.selectedReason;
  }
  /**
   * @param {number} contentId
   */
  async Moderate(contentId) {
    let modelType = this.main.active.contentType.is;
    let reasonText = this.selectedReason.text;
    let reasonId = this.selectedReason.details.id;
    let subReasonId = this.selectedReason.selectedSubReason ? this
      .selectedReason.selectedSubReason.details.id : null;

    let resReport = await new Action().ReportContent(modelType, contentId,
      reasonText, reasonId, subReasonId);
    //let resReport = await new Action().HelloWorld();

    if (!resReport || !resReport.success)
      return this.resultsSection.Failed(contentId);

    this.resultsSection.Moderated(contentId);
  }
}
