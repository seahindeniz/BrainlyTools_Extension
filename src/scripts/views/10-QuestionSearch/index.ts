import SearchResultsModeration from "./_/SearchResultsModeration/SearchResultsModeration";

System.pageLoaded("Question search page OK!");

export default class QuestionSearch {
  searchResultsModeration: SearchResultsModeration;

  constructor() {
    this.searchResultsModeration = new SearchResultsModeration();
  }
}

// eslint-disable-next-line no-new
new QuestionSearch();
