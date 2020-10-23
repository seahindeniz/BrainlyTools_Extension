import Action, { AbuseReasonDataType } from "@BrainlyAction";
import CreateElement from "@components/CreateElement";
import HideElement from "@root/helpers/HideElement";
import Reason from "./Reason";
import type ReasonsClassType from "./Reasons";

export default class ReasonGroup {
  main: ReasonsClassType;
  groupLabel: string;

  container: HTMLOptGroupElement;
  modelTypeId: 1 | 2 | 45;
  reasonData: AbuseReasonDataType[];

  constructor(
    main: ReasonsClassType,
    modelTypeId: 1 | 2 | 45,
    groupLabel: string,
  ) {
    this.main = main;
    this.modelTypeId = modelTypeId;
    this.groupLabel = groupLabel;

    this.Render();
    this.RenderReasons();
  }

  Render() {
    this.container = CreateElement({
      tag: "optgroup",
      label: this.groupLabel,
    });
  }

  async RenderReasons() {
    if (!this.reasonData) {
      await this.GetReasons();
    }

    this.reasonData.forEach(data => {
      if (!data.visible) return;

      const reason = new Reason(this.main, data);

      this.container.append(reason.option);
    });
  }

  async GetReasons() {
    const resReasons = await new Action().GetAbuseReasons(this.modelTypeId);

    if (resReasons.success === false) return;

    this.reasonData = resReasons.data;
  }

  Show() {
    this.main.reasonSelect.select.append(this.container);
  }

  Hide() {
    HideElement(this.container);
  }
}
