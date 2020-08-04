/* eslint-disable camelcase */
import * as gql from "gql-query-builder";
import Request from "..";

/**
 * @typedef {import("gql-query-builder/build/IQueryBuilderOptions").default} IQueryBuilderOptions
 * @typedef {IQueryBuilderOptions | IQueryBuilderOptions[]} GQL_OperationData
 */
export default class Brainly extends Request {
  constructor() {
    super();

    this.SetMarketURL();
    this.NoCache();
  }

  SetMarketURL() {
    const marketOrigin =
      (System && System.data.meta.location.origin) || document.location.origin;
    this.url = new URL(`${marketOrigin}`);
    // if (/Brainly|Action/i.test(this.constructor.name))
  }

  OpenConnection() {
    this.QueryString({ client: "moderator-extension" });
    this.SetAccountToken();
    super.OpenConnection();
  }

  Legacy() {
    this.P("/api/28");
    this.JSON();
    this.X_Req_With();
    // this.SetAccountToken();

    return this;
  }

  SetAccountToken() {
    this.headers["X-B-Token-Long"] = System.data.Brainly.tokenLong;
  }

  NoCache() {
    this.headers["Cache-Control"] = "no-cache, no-store";

    return this;
  }

  GenerateCoupon() {
    return btoa(
      `[object Object]${System.data.Brainly.userData.user.id}-` +
        `${new Date().getTime()}-${Math.floor(1 + Math.random() * 99999999)}`,
    );
  }

  GQL() {
    this.P(`/graphql/${System.data.Brainly.defaultConfig.MARKET}`);
    this.JSON();
    this.SetAccountToken();

    return this;
  }

  /**
   * @param {GQL_OperationData} data
   */
  Query(data) {
    this.data = gql.query(data);

    return this;
  }

  /**
   * @param {GQL_OperationData} data
   */
  Mutation(data) {
    this.data = gql.mutation(data);

    return this;
  }

  /**
   * @typedef {{key: string, fields: string, lock: string}} PHPTokens
   * @param {string} sourceURL
   * @param {undefined|string|PHPTokens} [tokens] - Tokens or form selector
   */
  async SetFormTokens(sourceURL, tokens) {
    if (!(tokens instanceof Object)) {
      const tempHeaders = JSON.parse(JSON.stringify(this.headers));
      tokens = await this.X_Req_With().GetPHPTokens(sourceURL, tokens);
      this.headers = tempHeaders;
    }

    return Promise.resolve({
      "data[_Token][key]": tokens.key,
      "data[_Token][fields]": tokens.fields,
      "data[_Token][lock]": tokens.lock,
    });
  }

  /**
   * @param {string} sourceURL
   * @param {string} [formSelector]
   * @returns {Promise<PHPTokens>}
   */
  GetPHPTokens(sourceURL, formSelector) {
    return new Promise(async (resolve, reject) => {
      try {
        this.P(sourceURL);

        let HTML = await this.GET();

        this.SetMarketURL();
        /**
         * @type {PHPTokens}
         */
        const tokens = {
          key: undefined,
          lock: undefined,
          fields: undefined,
        };
        const tokensRegex = {
          key: /\[key]" value="(.*?)" i/i,
          lock: /\[lock]" value="(.*?)" i/i,
          fields: /\[fields]" value="(.*?)" id="TokenF/i,
        };

        /**
         * To avoid having the "imgError:undefined" error message on console
         */
        HTML = HTML.replace(
          /onerror="imgError\(this, (?:'|\&\#039\;){1,}\);"/gim,
          "",
        );

        if (formSelector) {
          HTML = $(formSelector, HTML).html();
        }

        if (!HTML)
          return reject({
            msg: `The "${formSelector}" cannot be found on profile page`,
            error: 404,
          });

        for (const [tokenName, tokenRegex] of Object.entries(tokensRegex)) {
          const tokenMatch = HTML.match(tokenRegex);

          tokens[tokenName] = tokenMatch ? tokenMatch[1] : "";
        }

        resolve(tokens);
      } catch (error) {
        reject(error);
      }
    });
  }

  hello() {
    return this.P("hello");
  }

  world() {
    return this.P("world");
  }

  api_tasks() {
    return this.P("api_tasks");
  }

  main_view() {
    return this.P("main_view");
  }

  moderation_new() {
    return this.P("moderation_new");
  }

  delete_task_content() {
    return this.P("delete_task_content");
  }

  delete_response_content() {
    return this.P("delete_response_content");
  }

  delete_comment_content() {
    return this.P("delete_comment_content");
  }

  accept() {
    return this.P("accept");
  }

  wrong_report() {
    return this.P("wrong_report");
  }

  get_content() {
    return this.P("get_content");
  }

  get_comments_content() {
    return this.P("get_comments_content");
  }

  get_wrong_content() {
    return this.P("get_wrong_content");
  }

  get_abuse_reasons() {
    return this.P("get_abuse_reasons");
  }

  get_abuse_filters() {
    return this.P("get_abuse_filters");
  }

  api_content_quality() {
    return this.P("api_content_quality");
  }

  confirm() {
    return this.P("confirm");
  }

  unconfirm() {
    return this.P("unconfirm");
  }

  api_task_lines() {
    return this.P("api_task_lines");
  }

  big() {
    return this.P("big");
  }

  moderate_tickets() {
    return this.P("moderate_tickets");
  }

  expire() {
    return this.P("expire");
  }

  api_user_profiles() {
    return this.P("api_user_profiles");
  }

  get_by_id() {
    return this.P("get_by_id");
  }

  api_users() {
    return this.P("api_users");
  }

  get() {
    return this.P("get");
  }

  me() {
    return this.P("me");
  }

  moderators() {
    return this.P("moderators");
  }

  cancel_warning() {
    return this.P("cancel_warning");
  }

  supervisors() {
    return this.P("supervisors");
  }

  buddies_new() {
    return this.P("buddies_new");
  }

  ajax_panel_get_buddies() {
    return this.P("ajax_panel_get_buddies");
  }

  unbuddy() {
    return this.P("unbuddy");
  }

  users() {
    return this.P("users");
  }

  search() {
    return this.P("search");
  }

  api_messages() {
    return this.P("api_messages");
  }

  check() {
    return this.P("check");
  }

  send() {
    return this.P("send");
  }

  ranks() {
    return this.P("ranks");
  }

  delete_user_special_ranks() {
    return this.P("delete_user_special_ranks");
  }

  add_special_rank_to_user() {
    return this.P("add_special_rank_to_user");
  }

  admin() {
    return this.P("admin");
  }

  change_points() {
    return this.P("change_points");
  }

  uploader() {
    return this.P("uploader");
  }

  add() {
    return this.P("add");
  }

  delete() {
    return this.P("delete");
  }

  api_comments() {
    return this.P("api_comments");
  }

  index() {
    return this.P("index");
  }

  question() {
    return this.P("question");
  }

  api_responses() {
    return this.P("api_responses");
  }

  get_by_user() {
    return this.P("get_by_user");
  }

  api_moderation() {
    return this.P("api_moderation");
  }

  abuse_report() {
    return this.P("abuse_report");
  }

  api_tickets() {
    return this.P("api_tickets");
  }

  remove() {
    return this.P("remove");
  }
}
