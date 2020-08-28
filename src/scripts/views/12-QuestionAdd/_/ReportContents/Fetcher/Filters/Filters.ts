import Build from "@root/scripts/helpers/Build";
import { Flex } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type FetcherType from "../Fetcher";
import Categories from "./Categories/Categories";
import ReportTypes from "./ReportTypes/ReportTypes";
import Subjects from "./Subjects/Subjects";

export default class Filters {
  main: FetcherType;

  container: FlexElementType;
  reportTypeFilterContainer: FlexElementType;
  filtersContainer: FlexElementType;

  reportTypeFilter: ReportTypes;
  subjectFilter: Subjects;
  categoryFilter: Categories;

  constructor(main: FetcherType) {
    this.main = main;

    this.Render();

    this.reportTypeFilter = new ReportTypes(this);
    this.subjectFilter = new Subjects(this);
    this.categoryFilter = new Categories(this);
  }

  Render() {
    this.container = Build(
      Flex({
        direction: "column",
      }),
      [
        (this.reportTypeFilterContainer = Flex({
          wrap: true,
          marginBottom: "xxs",
          justifyContent: "space-around",
          className: "reportTypeFilterContainer", // TODO remove this className
        })),
        (this.filtersContainer = Flex({
          wrap: true,
          justifyContent: "center",
          className: "filtersContainer", // TODO remove this className
        })),
      ],
    );

    this.main.container.prepend(this.container);
  }
}
