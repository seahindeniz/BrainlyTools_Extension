import { LabelColorType } from "@style-guide/Label";
import type { ContentClassTypes } from "../../../Fetcher/Fetcher";
import type { UserTypeType } from "../../FiltersPanel/User/User";
import type QueueClassType from "../../Queue";
import QueueFilter from "../QueueFilter";

type TargetType = "nick" | "id" | "specialRank";

const labelIconType = "profile_view";

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
        value?: number[];
        exclude?: boolean;
      };

  type: UserTypeType;

  constructor(
    main: QueueClassType,
    type: UserTypeType,
    labelColor: LabelColorType,
  ) {
    super(main, {
      labelColor,
      labelIconType,
      labelName:
        System.data.locale.reportedContents.filtersPanel.filters[type].name,
    });
    this.type = type;
  }

  SetQuery(
    target?: TargetType,
    value?: string | number | number[],
    exclude?: boolean,
  ) {
    if (!target || !value) {
      this.HideLabel();

      return;
    }

    // @ts-expect-error
    this.query = {
      target,
      value,
      exclude,
    };

    if (this.query.target === "nick") {
      this.query.valueLowerCase = String(this.query.value).toLowerCase();
    } else if (this.query.target === "specialRank") {
      if (this.query.value.length === 0) {
        this.HideLabel();

        return;
      }
    } else {
      if (this.query.target === "id") {
        this.query.value = System.ExtractId(`${value}`);
      }

      if (Number.isNaN(this.query.value)) {
        this.HideLabel();

        return;
      }
    }

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
      if (this.query.value.includes(0)) {
        visibleValue =
          System.data.locale.reportedContents.filtersPanel.filters.userFilter
            .anyRank;
      } else {
        const selectedRankNames = this.query.value
          .map(
            rankId =>
              System.data.Brainly.defaultConfig.config.data.ranksWithId[rankId],
          )
          .map(rank => rank.name);

        visibleValue = selectedRankNames.join(", ");
      }
    }

    if ("exclude" in this.query && this.query.exclude) {
      this.labelIcon.ChangeType("friend_remove");
    } else {
      this.labelIcon.ChangeType(labelIconType);
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
      Number.isNaN(this.query.value) ||
      (this.query.target === "specialRank" && this.query.value.length === 0)
    )
      return true;

    if (this.query.target === "id")
      return content.users[this.type].data.id === this.query.value;

    if (this.query.target === "nick")
      return content.users[this.type].nick === this.query.valueLowerCase;

    if (this.query.target === "specialRank") {
      const rankIds = this.query.value;

      if (rankIds.includes(0)) {
        if (this.query.exclude) {
          return !content.users[this.type].specialRank;
        }

        return content.users[this.type].specialRank;
      }

      const isHaveSpecialRank = content.users[
        this.type
      ].data.ranks_ids?.some(rankId => rankIds.includes(rankId));

      if (this.query.exclude) {
        return !isHaveSpecialRank;
      }

      return isHaveSpecialRank;
    }

    return false;
  }
}
