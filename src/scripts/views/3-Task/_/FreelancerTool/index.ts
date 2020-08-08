import ServerReq from "@root/scripts/controllers/Req/Server";
import KeywordList from "./KeywordList";
import PageVisitButton from "./PageVisitButton";

export default class FreelancerTool {
  constructor() {
    this.data = undefined;
    this.keywordList = new KeywordList(this);

    this.FetchFreelancerData();
  }
  async FetchFreelancerData() {
    let questionId = System.ExtractId(location.pathname);
    this.dataPromise = new ServerReq()
      .GetKeywordsForFreelancer(questionId);
    let resKeywords = await this.dataPromise;

    if (resKeywords.success)
      this.data = resKeywords.data;

    this.InitAfterData();
  }
  InitAfterData() {
    PageVisitButton(this);
  }
}
