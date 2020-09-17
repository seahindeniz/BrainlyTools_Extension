import SearchResultsModerationClassType from "./_/SearchResultsModeration/SearchResultsModeration";

System.pageLoaded("Question search page OK!");

export default class QuestionSearch {
  searchResultsModeration: SearchResultsModerationClassType;

  constructor() {
    this.searchResultsModeration = new SearchResultsModerationClassType();
  }
}

// eslint-disable-next-line no-new
new QuestionSearch();
