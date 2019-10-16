import Brainly from "../";
import Chunkify from "../../../../helpers/Chunkify";

let System = require("../../../../helpers/System");

const USERS_PROFILE_REQ_CHUNK_SIZE = 990;

/**
 * @typedef {{id: number, nick: string}} CommonUserProps
 *
 * @typedef {CommonUserProps & {avatar:{medium: string, small: string}|null, avatar_id: number, category: number, client_type: number, current_best_answers_count: number, gender:number, is_deleted: boolean, points: number, primary_rank_id: number, ranks_ids: number[], registration_date: string}} User
 *
 * @typedef {CommonUserProps & {answers_by_subject: {subject_id: number, answers_count: number}[], avatars: null|{64: string, 100: string}, best_answers_from_30_days: number, description: string, followed_count: string, follower_count: string, gender: number, is_followed_by: boolean, is_following: boolean, points: number, ranks_ids: number[], total_questions: number, total_thanks: number}} UserProfile
 *
 * @typedef {{id: number, author_id: number, question_id: number, content: string, points: number, thanks_count: number, rating: number, rates_count: number, is_confirmed: boolean, is_excellent: boolean, is_best: boolean, can_comment: boolean, attachment_ids: [], created: string}[]} AnswersOfUser
 *
 * @typedef {{success?: boolean, message?: string}} CommonProps
 *
 * @typedef {{data?: User, message?: string} & CommonProps} UserResponse
 * @typedef {{data?: User[], message?: string} & CommonProps} UsersResponse
 * @typedef {{data?: UserProfile} & CommonProps} UserProfileResponse
 * @typedef {{pagination?: {first: string, prev: string, self: string, next: string, last: string}, data?: AnswersOfUser} & CommonProps} AnswersOfUserResponse
 */
const FAILED_RESPONSE = {
  success: false,
  get message() {
    return System.data.locale.common.notificationMessages
      .somethingWentWrongPleaseRefresh
  }
};
export default class Action extends Brainly {
  constructor() {
    super();

    if (typeof System == "function")
      // @ts-ignore
      System = System();
  }
  HelloWorld(data) {
    return this.Legacy().hello().world()[data ? "POST" : "GET"]();
  }
  /**
   * @param {number|string} questionId
   */
  QuestionContent(questionId) {
    if (~~questionId == 0)
      return Promise.reject("Invalid id");

    return this.Legacy().api_tasks().main_view().P(String(questionId)).GET();
  }
  /**
   * @param {{model_id: number, reason: string, reason_title?: string, reason_id: number, model_type_id?: number, give_warning?: boolean, take_points?: boolean, return_points?:boolean, _coupon_?: string}} data
   */
  async RemoveQuestion(data) {
    data = {
      model_type_id: 1,
      give_warning: false,
      take_points: true,
      return_points: true,
      _coupon_: this.GenerateCoupon(),
      ...data
    }
    data.reason += ` ${System.constants.config.reasonSign}`;

    if (data.reason_title && System.data.config.marketConfig.default
      .abuseReportReasons) {
      let resReport = await new Action().ReportQuestion(data.model_id, data
        .reason_title);

      if (!resReport || (!resReport.success && resReport.code != 10))
        return Promise.resolve(resReport || FAILED_RESPONSE);
    }

    return this.Legacy().moderation_new().delete_task_content().POST(data);
  }
  /**
   * @param {{model_id: number, reason: string, reason_title?: string, reason_id: number, model_type_id?: number, give_warning?: boolean, take_points?: boolean, _coupon_?: string}} data
   */
  async RemoveAnswer(data) {
    data = {
      model_type_id: 2,
      give_warning: false,
      take_points: true,
      _coupon_: this.GenerateCoupon(),
      ...data
    }
    data.reason += ` ${System.constants.config.reasonSign}`;

    if (data.reason_title && System.data.config.marketConfig.default
      .abuseReportReasons) {
      let resReport = await new Action().ReportAnswer(data.model_id, data
        .reason_title);

      if (!resReport || (!resReport.success && resReport.code != 10))
        return Promise.resolve(resReport || FAILED_RESPONSE);
    }

    return this.Legacy().moderation_new().delete_response_content().POST(
      data);
  }
  /**
   * @param {{model_id: number, reason?: string, reason_title?: string, reason_id?: number,  model_type_id?: number, give_warning?: boolean, _coupon_?: string}} data - Post data
   */
  async RemoveComment(data) {
    data = {
      model_type_id: 45,
      give_warning: false,
      _coupon_: this.GenerateCoupon(),
      ...data
    }
    data.reason += ` ${System.constants.config.reasonSign}`;

    if (data.reason_title && System.data.config.marketConfig.default
      .abuseReportReasons) {
      let resReport = await new Action().ReportComment(data.model_id, data
        .reason_title);

      if (!resReport || (!resReport.success && resReport.code != 10))
        return Promise.resolve(resReport || FAILED_RESPONSE);
    }

    return this.Legacy().moderation_new().delete_comment_content().POST(data);
  }
  /**
   * Confirm question by id
   * @param {number} model_id
   */
  ConfirmQuestion(model_id) {
    return this.ConfirmContent(model_id, 1);
  }
  /**
   * Confirm answer by id
   * @param {number} model_id
   */
  ConfirmAnswer(model_id) {
    return this.ConfirmContent(model_id, 2);
  }
  /**
   * Confirm comment by id
   * @param {number} model_id
   */
  ConfirmComment(model_id) {
    return this.ConfirmContent(model_id, 45);
  }
  /**
   * @param {number} model_id
   * @param {1|2|45} model_type_id - 1 = Question, 2 = Answer, 45 = Comment
   */
  ConfirmContent(model_id, model_type_id) {
    let data = {
      model_id,
      model_type_id
    };

    return this.Legacy().moderation_new().accept().POST(data);
  }
  /**
   * @param {number} model_id - Answer id
   */
  ApproveAnswer(model_id) {
    let data = {
      model_type: 2,
      model_id,
      _coupon_: this.GenerateCoupon()
    }

    return this.Legacy().api_content_quality().confirm().POST(data);
  }
  /**
   * @param {number} model_id - answer id
   */
  UnapproveAnswer(model_id) {
    let data = {
      model_type: 2,
      model_id,
      _coupon_: this.GenerateCoupon()
    }

    return this.Legacy().api_content_quality().unconfirm().POST(data);
  }
  /**
   * Report answer for correction
   * @param {object} data - Post data
   */
  ReportForCorrection(data) {
    data = {
      model_type_id: 2,
      ...data
    }
    data.reason += ` ${System.constants.config.reasonSign}`;

    return this.Legacy().moderation_new().wrong_report().POST(data);
  }
  OpenModerationTicket(model_id, withActionsHistory = false) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = {
          model_id,
          model_type_id: 1
        }

        let resTicket = await this.Legacy().moderation_new()
          .get_content().POST(data);

        if (!resTicket || !resTicket.success || !withActionsHistory)
          return resolve(resTicket);

        let resHistory = await this.ActionsHistory(model_id);

        resTicket.actions = resHistory;

        resolve(resTicket);
      } catch (error) {
        reject(error)
      }
    });
  }
  /**
   * @param {number} id
   */
  ActionsHistory(id) {
    return this.Legacy().api_task_lines().big().P(id).GET();
  }
  /**
   * Close moderation ticket of a question
   * @param {number|string} model_id - Id number of a question
   */
  CloseModerationTicket(model_id) {
    let data = {
      model_id,
      model_type_id: 1
    }

    return this.Legacy().moderate_tickets().expire().POST(data);
  }
  /**
   * Get user profile data by id
   * @param {number} id - User id
   * @returns {Promise<UserProfileResponse>}
   */
  GetUserProfile(id) {
    return this.Legacy().api_user_profiles().get_by_id().P(id).GET();
  }
  /**
   * Get user data by id.
   * Difference between GetUserProfile and GetUser is GetUserProfile serves the Bio text and returns success:false for deleted accounts.
   * But GetUser returns with success:true for deleted accounts- but returns without bio text. Therefore, there should be two different methods to get user details.
   * @param {number} id - User id
   * @returns {Promise<UserResponse>}
   */
  GetUser(id) {
    return this.Legacy().api_users().get().P(~~id).GET();
  }
  /**
   * Get users data by ids
   * @param {number[]} ids - User id numbers
   * @returns {Promise<UsersResponse>}
   */
  GetUsers(ids) {
    if (!(ids instanceof Array))
      return Promise.reject("Not an array");

    if (ids.length > USERS_PROFILE_REQ_CHUNK_SIZE)
      return this.GetUsersInChunk(ids);

    return this.Legacy().api_users().get_by_id().GET({
      a: ids
        .length,
      "id[]": ids.join("&id[]=")
    });
  }
  GetUsersInChunk(ids) {
    return new Promise((resolve, reject) => {
      let count = 0;
      let chunkedIds = Chunkify(ids, USERS_PROFILE_REQ_CHUNK_SIZE);
      /**
       * @type {UsersResponse}
       */
      let results = {
        success: true,
        data: []
      };

      chunkedIds.forEach(async (idList) => {
        try {
          let resUsers = await new Action().GetUsers(idList);

          if (resUsers && resUsers.success)
            results.data = [
              ...results.data,
              ...resUsers.data
            ];

          if (++count == chunkedIds.length)
            resolve(results);
        } catch (error) {
          console.log("err", error);
          reject(error);
          throw error;
        }
      });
    });
  }
  /**
   * Cancel user warning by warning id
   * @param {number} userId
   * @param {number | number[]} warningId
   */
  CancelWarning(userId, warningId) {
    if (warningId instanceof Array)
      return this.CancelWarnings(userId, warningId);

    return this.moderators().cancel_warning().P(userId).P(warningId).GET();
  }
  /**
   * Cancel user warnings by ids
   * @param {number} userId
   * @param {number[]} ids - Warning ids
   */
  CancelWarnings(userId, ids = []) {
    let promises = [];

    ids.forEach(warningId => (this.path = "", promises.push(this
      .CancelWarning(userId, warningId))));

    return Promise.all(promises);
  }
  AllFriends() {
    return this.JSON().X_Req_With().buddies_new().ajax_panel_get_buddies()
      .GET();
  }
  RemoveFriend(id) {
    return this.buddies_new().unbuddy().P(id).GET();
  }
  /**
   * @param {number[]} ids
   * @param {function} each
   */
  RemoveFriends(ids, each) {
    let count = 0;
    let promises = [];
    let profileLink = System.createProfileLink();

    ids.forEach(async (id) => {
      this.path = "";
      let promise = this.RemoveFriend(id);

      promises.push(promise);

      if (each) {
        let resRemove = await promise;

        if (
          resRemove &&
          resRemove.url &&
          (
            resRemove.url.indexOf("/users/view") >= 0 ||
            resRemove.url.indexOf(profileLink) >= 0
          )
        ) {
          each(++count, id);
        }
      }
    });

    return Promise.all(promises);
  }
  RemoveAllFriends(each) {
    let idList = System.friends.map(friend => friend.id);

    return this.RemoveFriends(idList, each);
  }
  /**
   * @param {string} nick
   */
  FindUser(nick) {
    if (!nick)
      return Promise.reject("Empty nick");

    return this.X_Req_With().users().search().P(nick).GET();
  }
  GetAllModerators(handlers) {
    return new Promise(async (resolve, reject) => {
      let resSupervisors = await this.moderators().supervisors().P(
        System.data.Brainly.userData.user.id).GET();

      if (!resSupervisors)
        return reject("Can't fetch users from supervisors page");

      handlers = {
        done: resolve,
        ...handlers
      };

      System.StoreUsers(resSupervisors, handlers);
    })
  }
  /**
   * @param {number} user_id
   */
  GetConversationID(user_id) {
    return this.Legacy().api_messages().check().POST({ user_id });
  }
  /**
   * @param {{conversation_id?: number, user_id?: number}} param0
   * @param {string} content
   */
  async SendMessage({ conversation_id, user_id }, content) {
    let data = {
      content,
      conversation_id
    };

    if (user_id) {
      let resConversation = await this.GetConversationID(user_id);

      if (!resConversation || !resConversation.success)
        return Promise.reject(resConversation);

      data.conversation_id = resConversation.data.conversation_id;
      this.path = "";
    }
    //onError yerine function aç ve gelen isteğe göre conversation id oluştur. İstek conversation id hatası değilse on error devam ettir
    return this.Legacy().api_messages().send().POST(data);
  }
  ChangeBio(text) {
    let data = {
      args: {
        input: {
          description: text
        }
      },
      find: {
        user: ["id"]
      },
      operationName: "updateUserDescription"
    };

    return this.GQL().Mutation(data).POST();
  }
  /**
   * @param {number} user_id
   * @param {string|{key: string, fields: string, lock: string}} tokens
   */
  async RemoveAllRanks(user_id, tokens =
    `[action="/ranks/delete_user_special_ranks"]`) {
    let data = await this.SetFormTokens(System.createProfileLink(user_id),
      tokens);
    data["data[uid]"] = user_id;

    return this.ranks().delete_user_special_ranks().Form().Salt().POST(data);
  }
  /**
   * @param {number} user_id
   * @param {number} rank_id
   */
  async AddRank(user_id, rank_id) {
    let data = await this.SetFormTokens(
      `/ranks/choose_special_rank_for_user/${user_id}`);
    data["data[Rank][type]"] = rank_id;

    return this.ranks().add_special_rank_to_user().P(user_id).Form().Salt()
      .POST(data);
  }
  /**
   * @param {number} user_id
   * @param {number} point
   */
  async AddPoint(user_id, point) {
    let data = await this.SetFormTokens(System.createProfileLink(user_id),
      "#ChangePointsAddForm");
    data["data[ChangePoints][diff]"] = point;

    return this.admin().users().change_points().P(user_id).Form().POST(data);
  }
  /**
   * @param {number} user_id
   * @param {string} reason
   */
  async DeleteAccount(user_id, reason = "") {
    let data = await this.SetFormTokens(System.createProfileLink(user_id),
      "#DelUserAddForm");
    data["data[DelUser][delTasks]"] = 1;
    data["data[DelUser][delComments]"] = 1;
    data["data[DelUser][delResponses]"] = 1;
    data["data[DelUser][reason]"] = reason;

    return this.admin().users().delete().P(user_id).Form().POST(data);
  }
  /**
   * @param {number} model_id
   * @param {number} type
   * @param {number} amount
   */
  GetComments(model_id, type, amount) {
    return this.Legacy().api_comments().index().P(model_id).P(type).P(amount)
      .GET();
  }
  GetReportedContents(last_id) {
    let data = {
      subject_id: 0,
      category_id: 0
    }

    if (last_id)
      data.last_id = last_id;

    return this.Legacy().moderation_new().index().POST(data);
  }
  GetReportedComments(last_id) {
    let data = {
      subject_id: 0,
      category_id: 998
    }

    if (last_id)
      data.last_id = last_id;

    return this.Legacy().moderation_new().get_comments_content().POST(data);
  }
  GetCorrectedContents(last_id) {
    let data = {
      subject_id: 0,
      category_id: 999
    }

    if (last_id)
      data.last_id = last_id;

    return this.Legacy().moderation_new().get_wrong_content().POST(data);
  }
  async UploadFile(file, onUploadProgress) {
    let data = await this.SetFormTokens("/admin/uploader/index");
    data["data[Uploader][file]"] = file;

    return this.Axios({ onUploadProgress }).admin().uploader().add().File()
      .POST(data);
  }
  GetQuestionAddPage() {
    return this.X_Req_With().question().add().GET();
  }
  /**
   * @param {number} userId
   * @param {number} page
   * @returns {Promise<AnswersOfUserResponse>}
   */
  GetAnswersOfUser(userId, page) {
    if (~~userId == 0)
      return Promise.reject("Invalid id");

    let data = { userId };

    if (page)
      data.page = page

    return this.Legacy().api_responses().get_by_user().GET(data);
  }
  /**
   * @param {number} model_id
   * @param {string} reason
   * @param {number} [category_id]
   * @param {number} [subcategory_id]
   */
  ReportQuestion(model_id, reason, category_id, subcategory_id) {
    return this.ReportContent(1, model_id, reason, category_id,
      subcategory_id);
  }
  /**
   * @param {number} model_id
   * @param {string} [reason]
   * @param {number} [category_id]
   * @param {number} [subcategory_id]
   */
  ReportAnswer(model_id, reason, category_id, subcategory_id) {
    return this.ReportContent(2, model_id, reason, category_id,
      subcategory_id);
  }
  /**
   * @param {number} model_id
   * @param {string} reason
   * @param {number} [category_id]
   * @param {number} [subcategory_id]
   */
  ReportComment(model_id, reason, category_id, subcategory_id) {
    return this.ReportContent(45, model_id, reason, category_id,
      subcategory_id);
  }
  /**
   * @param {1 | "QUESTION" | 2 | "ANSWER" | 45 | "COMMENT" } model_type_id
   * @param {number} model_id
   * @param {string} [reason]
   * @param {number} [category_id]
   * @param {number} [subcategory_id]
   */
  ReportContent(model_type_id, model_id, reason, category_id, subcategory_id) {
    if (typeof model_type_id == "string")
      model_type_id = model_type_id == "QUESTION" ? 1 : model_type_id ==
      "ANSWER" ? 2 : model_type_id == "COMMENT" ? 45 : undefined;

    if (
      model_type_id != 1 &&
      model_type_id != 2 &&
      model_type_id != 45
    )
      throw "Model type is not valid";

    let type = model_type_id == 1 ? "QUESTION" : model_type_id == 2 ?
      "ANSWER" : "COMMENT";

    if (typeof category_id === "undefined")
      category_id = System.data.config.marketConfig.default
      .abuseReportReasons[type][0];

    if (typeof subcategory_id === "undefined")
      subcategory_id = System.data.config.marketConfig.default
      .abuseReportReasons[type][1];

    let data = {
      abuse: {
        category_id,
        subcategory_id,
        data: (reason || "") + System.constants.config.reasonSign
      },
      model_id,
      model_type_id
    };

    return this.Legacy().api_moderation().abuse_report().POST(data);
  }
  SearchQuestion(query = "", after = "", limit = 10) {
    let data = {
      operationName: "questionSearch",
      args: {
        query,
        first: limit,
        after
      },
      find: [
        "count",
        {
          edges: [{
              node: [
                "id",
                "databaseId",
                {
                  author: [
                    "id",
                    "databaseId",
                    "isDeleted",
                    "nick",
                    {
                      avatar: [
                        "thumbnailUrl"
                      ]
                    },
                    {
                      rank: [
                        "name"
                      ]
                    }
                  ]
                },
                "content",
                {
                  answers: [
                    "hasVerified",
                    {
                      nodes: [
                        "thanksCount",
                        "ratesCount",
                        "rating"
                      ]
                    }
                  ]
                }
              ]
            },
            {
              highlight: [
                "contentFragments"
              ]
            }
          ]
        }
      ]
    };

    return this.GQL().Query(data).POST();
  }
  /**
   * @param {(1 | 2 | 45) | ("QUESTION" | "ANSWER" | "COMMENT")} model_type_id
   */
  GetAbuseReasons(model_type_id) {
    if (typeof model_type_id == "string")
      model_type_id =
      model_type_id == "QUESTION" ? 1 :
      model_type_id == "ANSWER" ? 2 :
      model_type_id == "COMMENT" ? 45 :
      undefined;

    if (!model_type_id)
      throw "Model type should be specified";

    return this.Legacy().moderation_new().get_abuse_reasons()
      .POST({ model_type_id });
  }
}
