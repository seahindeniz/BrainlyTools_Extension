import ServerReq, {
  KeywordsForFreelancerDataType,
} from "@root/scripts/controllers/Req/Server";
import KeywordList from "./KeywordList";
import PageVisitButton from "./PageVisitButton";

export default class FreelancerTool {
  data: KeywordsForFreelancerDataType;
  keywordList: KeywordList;
  dataPromise: Promise<{
    success?: boolean;
    data?: KeywordsForFreelancerDataType;
  }>;

  constructor() {
    this.keywordList = new KeywordList(this);

    this.FetchFreelancerData();
  }

  async FetchFreelancerData() {
    const questionId = System.ExtractId(location.pathname);
    this.dataPromise = new ServerReq().GetKeywordsForFreelancer(questionId);
    const resKeywords = await this.dataPromise;

    if (resKeywords.success) this.data = resKeywords.data;

    this.InitAfterData();
  }

  InitAfterData() {
    PageVisitButton(this);
  }
}
