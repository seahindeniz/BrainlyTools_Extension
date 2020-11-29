import { LabelColorType } from "@style-guide/Label";
import type { ContentClassTypes } from "../../../Fetcher/Fetcher";
import type { UserTypeType } from "../../FiltersPanel/User/User";
import type QueueClassType from "../../Queue";
import QueueFilter from "../QueueFilter";

type TargetType = "nick" | "id" | "specialRank";

export default class User extends QueueFilter {
  query:
    | {
        target: "nick";
        value?: number | string;
        valueLowerCase?: string;
      }
    | {
        target: "id";
        value?: number;
      }
    | {
        target: "specialRank";
        value?: number;
      };

  type: UserTypeType;

  constructor(
    main: QueueClassType,
    type: UserTypeType,
    labelColor: LabelColorType,
  ) {
    super(main, {
      labelColor,
      labelIconType: "profile_view",
      labelName:
        System.data.locale.reportedContents.filtersPanel.filters[type].name,
    });
    this.type = type;
  }

  SetQuery(target?: TargetType, value?: number | string) {
    if (!target || !value) {
      this.HideLabel();

      return;
    }

    // @ts-expect-error
    this.query = {
      target,
      value,
    };

    if (this.query.target === "nick") {
      this.query.valueLowerCase = String(this.query.value).toLowerCase();
    } else {
      if (this.query.target === "id") {
        this.query.value = System.ExtractId(`${value}`);
      } else if (target === "specialRank") {
        this.query.value = Number(this.query.value);
      }

      if (Number.isNaN(this.query.value)) {
        this.HideLabel();

        return;
      }
    }

    console.log(typeof this.query.value, this.query.value);
    super.QuerySettled();
  }

  HideLabel(event?: MouseEvent) {
    if (event) {
      this.main.filtersPanel.filter[this.type].Reset();
    }

    super.HideLabel();
  }

  ShowLabel() {
    super.ShowLabel();

    let visibleValue = this.query.value;

    if (this.query.target === "specialRank") {
      const selectedRank =
        System.data.Brainly.defaultConfig.config.data.ranksWithId[
          this.query.value
        ];

      if (visibleValue === 0) {
        visibleValue =
          System.data.locale.reportedContents.filtersPanel.filters.userFilter
            .anyRank;
      } else if (selectedRank) {
        visibleValue = selectedRank.name;
      }
    }

    this.labelText.nodeValue = `${System.data.locale.reportedContents.filtersPanel.filters.userFilter[
      this.query.target
    ].toLowerCase()}:\xa0 ${String(visibleValue)}`;
  }

  CompareContent(content: ContentClassTypes) {
    if (
      !this.query?.target ||
      this.query?.value === undefined ||
      this.query?.value === null ||
      this.query?.value === "" ||
      Number.isNaN(this.query.value)
    )
      return true;

    if (this.query.target === "id")
      return content.users[this.type].data.id === this.query.value;

    if (this.query.target === "nick")
      return content.users[this.type].nick === this.query.valueLowerCase;

    if (this.query.target === "specialRank") {
      if (this.query.value === 0) {
        console.log(content.users[this.type].specialRank);

        return content.users[this.type].specialRank;
      }

      return content.users[this.type].data.ranks_ids?.includes(
        this.query.value,
      );
    }

    return false;
  }
}
