import Request from "../";
import { jsonToGraphQLQuery } from "json-to-graphql-query";

export default class Brainly extends Request {
  constructor() {
    super();
  }
  Legacy() {
    let marketOrigin = (window.System && System.data.meta.location.origin) || document.location.origin;
    this.path += `${marketOrigin}/api/28`;
    this.headers = {
      ...this.headers,
      'X-B-Token-Long': System.data.Brainly.tokenLong
    }

    this.JSON();
    this.X_Req_With();

    return this;
  }
  GenerateCoupon() {
    return btoa(`[object Object]${System.data.Brainly.userData.user.id}-${new Date().getTime()}-${Math.floor(1 + Math.random() * 99999999)}`);
  }
  GQL() {
    this.path += `/graphql/${System.data.Brainly.defaultConfig.MARKET}`;
    this.headers = {
      ...this.headers,
      'X-B-Token-Long': System.data.Brainly.tokenLong
    }

    this.JSON();
    return this;
  }
  Mutation(operationName, data) {
    let mutation = {
      mutation: {
        [operationName]: data
      }
    };

    let dataGQL = jsonToGraphQLQuery(mutation, { pretty: true });

    this.data = {
      operationName: "",
      query: dataGQL,
      variables: {}
    };

    return this;
  }
  /**
   * @param {string} sourceURL
   * @param {undefined|string|{key: string, fields: string, lock: string}} tokens - Tokens or form selector
   */
  async SetFormTokens(sourceURL, tokens) {
    if (!tokens || typeof tokens == "string") {
      let tempHeaders = JSON.parse(JSON.stringify(this.headers));
      tokens = await this.X_Req_With().GetPHPTokens(sourceURL, tokens);
      this.headers = tempHeaders;
    }

    return Promise.resolve({
      "data[_Token][key]": tokens.key,
      "data[_Token][fields]": tokens.fields,
      "data[_Token][lock]": tokens.lock
    });
  }

  api_tasks() {
    return this.Path("api_tasks");
  }
  main_view() {
    return this.Path("main_view");
  }

  moderation_new() {
    return this.Path("moderation_new");
  }
  delete_task_content() {
    return this.Path("delete_task_content");
  }
  delete_response_content() {
    return this.Path("delete_response_content");
  }
  delete_comment_content() {
    return this.Path("delete_comment_content");
  }
  accept() {
    return this.Path("accept");
  }
  wrong_report() {
    return this.Path("wrong_report");
  }
  get_content() {
    return this.Path("get_content");
  }
  get_comments_content() {
    return this.Path("get_comments_content");
  }
  get_wrong_content() {
    return this.Path("get_wrong_content");
  }

  api_content_quality() {
    return this.Path("api_content_quality");
  }
  confirm() {
    return this.Path("confirm");
  }
  unconfirm() {
    return this.Path("unconfirm");
  }

  api_task_lines() {
    return this.Path("api_task_lines");
  }
  big() {
    return this.Path("big");
  }

  moderate_tickets() {
    return this.Path("moderate_tickets");
  }
  expire() {
    return this.Path("expire");
  }

  api_user_profiles() {
    return this.Path("api_user_profiles");
  }
  get_by_id() {
    return this.Path("get_by_id");
  }

  api_users() {
    return this.Path("api_users");
  }
  get() {
    return this.Path("get");
  }

  moderators() {
    return this.Path("moderators");
  }
  cancel_warning() {
    return this.Path("cancel_warning");
  }
  supervisors() {
    return this.Path("supervisors");
  }

  buddies_new() {
    return this.Path("buddies_new");
  }
  ajax_panel_get_buddies() {
    return this.Path("ajax_panel_get_buddies");
  }
  unbuddy() {
    return this.Path("unbuddy");
  }

  users() {
    return this.Path("users");
  }
  search() {
    return this.Path("search");
  }

  api_messages() {
    return this.Path("api_messages");
  }
  check() {
    return this.Path("check");
  }
  send() {
    return this.Path("send");
  }

  ranks() {
    return this.Path("ranks");
  }
  delete_user_special_ranks() {
    return this.Path("delete_user_special_ranks");
  }
  add_special_rank_to_user() {
    return this.Path("add_special_rank_to_user");
  }

  admin() {
    return this.Path("admin");
  }
  change_points() {
    return this.Path("change_points");
  }
  uploader() {
    return this.Path("uploader");
  }
  add() {
    return this.Path("add");
  }

  api_comments() {
    return this.Path("api_comments");
  }
  index() {
    return this.Path("index");
  }
}
