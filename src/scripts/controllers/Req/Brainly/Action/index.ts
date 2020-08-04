/* eslint-disable camelcase */

// @flow
const gql = (s = "") => s;

import Brainly from "../";
import Chunkify from "../../../../helpers/Chunkify";
import AnswerConnection from "./GraphQL/Answer/Connection.graphql";
import AnswerConnection_With_Comments from "./GraphQL/Answer/Connection_With_Comments.graphql";
import CommentConnection from "./GraphQL/Comment/Connection.graphql";
import QuestionFragment from "./GraphQL/Question.graphql";
import UserFragment from "./GraphQL/User.graphql";
import SubjectFragment from "./GraphQL/Subject.graphql";
import AttachmentFragment from "./GraphQL/Attachment.graphql";

const USERS_PROFILE_REQ_CHUNK_SIZE = 990;

type CommonUserProps = { id: number; nick: string };

export type UserType = CommonUserProps & {
  avatar: { medium: string; small: string } | null;
  avatar_id: number;
  category: number;
  client_type: number;
  current_best_answers_count: number;
  gender: number;
  is_deleted: boolean;
  points: number;
  primary_rank_id: number;
  ranks_ids: number[];
  registration_date: string;
};

type CommonProps = { success?: boolean; message?: string };

export type UserResponse = {
  data?: UserType;
  message?: string;
} & CommonProps;

export type UsersResponse = {
  data?: UserType[];
  message?: string;
} & CommonProps;

/**
 * @typedef {{id: number, nick: string}} CommonUserProps
 *
 * @typedef {CommonUserProps & {avatar:{medium: string, small: string}|null, avatar_id: number, category: number, client_type: number, current_best_answers_count: number, gender:number, is_deleted: boolean, points: number, primary_rank_id: number, ranks_ids: number[], registration_date: string}} UserType
 *
 * @typedef {CommonUserProps & {answers_by_subject: {subject_id: number, answers_count: number}[], avatars: null|{64: string, 100: string}, best_answers_from_30_days: number, description: string, followed_count: string, follower_count: string, gender: number, is_followed_by: boolean, is_following: boolean, points: number, ranks_ids: number[], total_questions: number, total_thanks: number}} UserProfile
 *
 * @typedef {{id: number, author_id: number, question_id: number, content: string, points: number, thanks_count: number, rating: number, rates_count: number, is_confirmed: boolean, is_excellent: boolean, is_best: boolean, can_comment: boolean, attachment_ids: [], created: string}[]} AnswersOfUser
 *
 * @typedef {{success?: boolean, message?: string}} CommonProps
 *
 * @typedef {{data?: UserType, message?: string} & CommonProps} UserResponse
 * @typedef {{data?: UserType[], message?: string} & CommonProps} UsersResponse
 * @typedef {{data?: UserProfile} & CommonProps} UserProfileResponse
 * @typedef {{pagination?: {first: string, prev: string, self: string, next: string, last: string}, data?: AnswersOfUser} & CommonProps} AnswersOfUserResponse
 *
 * @typedef {{
 *  avatar: null,
 *  gender: "MALE" | "FEMALE",
 *  id: string,
 *  nick: string,
 *  points: number,
 *  rank: {
 *    id: string,
 *    name: string,
 *  }
 * }} GQL_User
 *
 * @typedef {{
 *  id: string,
 *  thumbnailUrl: string,
 *  url: string,
 * }} GQL_Attachment
 *
 * @typedef {{
 *  id: string,
 *  content: string,
 *  author: GQL_User,
 * }} GQL_Comment
 *
 * @typedef {{
 *  cursor: string,
 *  node: GQL_Comment
 * }} GQL_CommentEdge
 *
 * @typedef {{
 *    count: number,
 *    edges: GQL_CommentEdge[]
 *  }} GQL_CommentEdges
 *
 * @typedef {{
 *  answers?: {
 *    nodes: GQL_Answer[],
 *  },
 *  attachments: GQL_Attachment[],
 *  author: GQL_User,
 *  content: string,
 *  created: string,
 *  id: string,
 *  points: number,
 *  subject: GQL_Subject,
 *  pointsForAnswer: number,
 *  pointsForBestAnswer: number,
 *  comments?: GQL_CommentEdges,
 * }} GQL_Question
 *
 * @typedef {{
 *  data: {
 *    question: GQL_Question
 *  }
 * }} GQL_ResQuestion
 *
 * @typedef {{
 *  attachments: string[],
 *  author: GQL_User,
 *  content: string,
 *  created: string,
 *  id: string,
 *  isBest: boolean,
 *  isConfirmed: boolean,
 *  thanksCount: number,
 *  verification: null | {
 *    approval: {
 *      approver: GQL_User,
 *      approvedTime: string,
 *    }
 *  },
 *  comments?: GQL_CommentEdges,
 * }} GQL_Answer
 *
 * @typedef {{icon: string, id: string, name: string}} GQL_Subject
 */

export type UsersDataInReportedContentsType = {
  avatar?: { "64": string; "100": string };
  avatars?: { "64": string; "100": string };
  gender?: number;
  id?: number;
  is_deleted: boolean;
  nick?: string;
  ranks: {
    color: string;
    names: string[];
    count: number;
  };
  rank_ids?: number[];
  stats: {
    answers: number;
    comments: number;
    questions: number;
  };
};

export type UserDataInReportType = {
  id?: number;
  warnings_count?: number;
  reports_count?: number;
  successfull_reports_count?: number;
  removed_contents_count?: number;
};

export type ReportedContentDataType = {
  model_type_id: 1 | 2 | 45;
  model_id: number;
  task_id?: number;
  grade_id?: number;
  subject_id?: number;
  content_short?: string;
  created?: string;
  user?: UserDataInReportType;
  report?: {
    user?: UserDataInReportType;
    created?: string;
    abuse?: {
      category_id?: number;
      subcategory_id?: number;
      name?: string;
    };
  };
  // correction report
  corrected: boolean;
};

export type CommonDataInTicketType = {
  attachments: [];
  comments: [];
  content: string;
  created: string;
  id: number;
  user: UserDataInReportType;
  user_id: number;
};

export type AnswerDataInTicketType = CommonDataInTicketType & {
  best: boolean;
  mark: number;
  points: number;
  task_id: number;
  thanks: number;
};

export type QuestionDataInTicketType = CommonDataInTicketType & {
  grade_id: number;
  points: {
    ptsForBest: number;
    ptsForResp: number;
    ptsForTask: number;
  };
  responses: number;
  subject_id: number;
  tickets: number;
};

export type TicketDataType = {
  delete_reasons: {};
  responses: AnswerDataInTicketType[];
  task: QuestionDataInTicketType;
  ticket: {
    id: number;
    time_left: number;
    user_id: number;
  };
};

const FAILED_RESPONSE = {
  success: false,
  get message() {
    return System.data.locale.common.notificationMessages
      .somethingWentWrongPleaseRefresh;
  },
};

export default class Action extends Brainly {
  /**
   * @param {*} [data]
   * @returns {Promise<{
   *  success: boolean,
   *  message?: string,
   *  data: {
   *    msg: string,
   *  }
   * }>}
   */
  HelloWorld(data) {
    return this.Legacy().hello().world()[data ? "POST" : "GET"](data);
  }

  /**
   * @param {number | string} id
   */
  GetQuestion(id) {
    if (~~id == 0) return Promise.reject("Invalid id");

    return this.Legacy().api_tasks().main_view().P(String(id)).GET();
  }

  /**
   * @param {number | string} id
   * @param {{excludeAnswer?: boolean, excludeComment?: boolean}} param1
   * @returns {Promise<GQL_ResQuestion>}
   */
  GetQuestion2(id, { excludeAnswer, excludeComment } = {}) {
    try {
      const idData = atob(String(id));

      if (!idData.includes("question")) throw "Invalid id";
    } catch (e) {
      if (~~id == 0) return Promise.reject("Invalid id");

      id = btoa(`question:${id}`);
    }

    const data = {
      operation: "question",
      variables: {
        id: {
          value: id,
          type: "ID!",
        },
      },
      fields: [
        "id",
        "content",
        "points",
        "created",
        {
          author: ["...UserFragment"],
        },
        {
          subject: ["...SubjectFragment"],
        },
        {
          attachments: ["...AttachmentFragment"],
        },
      ],
    };

    console.log("excludeAnswer:", excludeAnswer);
    console.log("excludeComment:", excludeComment);
    if (!excludeAnswer) {
      if (excludeComment)
        // @ts-ignore
        data.fields.push({ answers: ["...AnswerConnection"] });
      // @ts-ignore
      else data.fields.push({ answers: ["...AnswerConnection_With_Comments"] });
    }

    if (!excludeComment) {
      // @ts-ignore
      data.fields.push({ "comments(last: 1000)": ["...CommentConnection"] });
    }

    this.GQL().Query(data);

    if (!excludeAnswer) {
      if (excludeComment) this.data.query += AnswerConnection;
      else this.data.query += AnswerConnection_With_Comments;
    }

    if (!excludeComment && excludeAnswer) this.data.query += CommentConnection;

    this.data.query += UserFragment;
    this.data.query += SubjectFragment;
    this.data.query += AttachmentFragment;

    return this.POST();
  }

  /**
   * @param {number | string} id
   * @param {{
   *  includeQuestion?: boolean,
   *  includeComments?: boolean,
   * }} [param1]
   * @returns {Promise<{
   *  data: {
   *    answer: GQL_Answer
   *  }
   * }>}
   */
  GetAnswer(id, { includeQuestion, includeComments } = {}) {
    try {
      const idData = atob(String(id));

      if (!idData.includes("answer")) throw "Invalid id";
    } catch (e) {
      if (~~id == 0) return Promise.reject("Invalid id");

      id = btoa(`answer:${id}`);
    }
    const data = {
      operation: "answer",
      variables: {
        id: {
          value: id,
          type: "ID!",
        },
      },
      fields: [
        "id",
        "content",
        {
          author: ["...UserFragment"],
        },
        {
          attachments: ["...AttachmentFragment"],
        },
        "points",
        "created",
        "isBest",
        "thanksCount",
      ],
    };

    if (includeQuestion)
      // @ts-ignore
      data.fields.push({ question: ["...QuestionFragment"] });
    else if (includeComments)
      // @ts-ignore
      data.fields.push({ comments: ["...CommentConnection"] });

    this.GQL().Query(data);

    if (!includeQuestion && !includeComments) this.data.query += UserFragment;
    else if (includeQuestion) this.data.query += QuestionFragment;
    else if (includeComments) this.data.query += CommentConnection;

    return this.POST();
  }

  /**
   * @param {number} task_id
   * @param {string} content
   * @param {number[]} [attachments] - List of attachment ids
   */
  async AddAnswer(task_id, content, attachments = []) {
    const resOpenTicket = await new Action().GetTicketForAnswering(task_id);

    if (!resOpenTicket || !resOpenTicket.success)
      return Promise.resolve(resOpenTicket || FAILED_RESPONSE);

    content = content.replace(/\r\n|\n/gi, "</p><p>");
    content = `<p>${content}</p>`;

    const data = {
      attachments,
      content,
      task_id,
    };
    data.content += `<p></p><p>${System.constants.config.reasonSign}</p>`;

    const promiseAdd = this.Legacy().api_responses().add().POST(data);
    let resAdd = await promiseAdd;

    const resCloseTicket = await new Action().RemoveTicketForAnswering(
      task_id,
      resOpenTicket.data.ticket_id,
    );

    if (!resCloseTicket || !resCloseTicket.success)
      return Promise.resolve(resCloseTicket || FAILED_RESPONSE);

    return promiseAdd;
  }

  /**
   * @param {number} task_id
   */
  GetTicketForAnswering(task_id) {
    return this.Legacy().api_tickets().get().POST({ task_id });
  }

  /**
   * @param {number} task_id
   * @param {number} ticket_id
   */
  RemoveTicketForAnswering(task_id, ticket_id) {
    return this.Legacy().api_tickets().remove().POST({ task_id, ticket_id });
  }

  /**
   * @param {{model_id: number, reason: string, reason_title?: string, reason_id: number, model_type_id?: number, give_warning?: boolean, take_points?: boolean, return_points?:boolean, _coupon_?: string}} data
   * @param {boolean} [dontReport]
   */
  async RemoveQuestion(data, dontReport) {
    // eslint-disable-next-line no-param-reassign
    data = {
      model_type_id: 1,
      give_warning: false,
      take_points: true,
      return_points: true,
      ...data,
    };
    data.reason += ` ${System.constants.config.reasonSign}`;

    try {
      if (
        !dontReport &&
        data.reason_title &&
        System.data.config.marketConfig.default.abuseReportReasons
      ) {
        const resReport = await new Action().ReportQuestion(
          data.model_id,
          data.reason_title,
        );

        if (!resReport || (!resReport.success && resReport.code !== 10))
          return Promise.resolve(resReport || FAILED_RESPONSE);
      }

      return this.Legacy().moderation_new().delete_task_content().POST(data);
    } catch (_) {
      console.error(2);
      return undefined;
    }
  }

  /**
   * @param {{model_id: number, reason: string, reason_title?: string, reason_id: number, model_type_id?: number, give_warning?: boolean, take_points?: boolean, _coupon_?: string}} data
   * @param {boolean} [dontReport]
   */
  async RemoveAnswer(data, dontReport) {
    data = {
      model_type_id: 2,
      give_warning: false,
      take_points: true,
      ...data,
    };
    data.reason += ` ${System.constants.config.reasonSign}`;

    if (
      !dontReport &&
      data.reason_title &&
      System.data.config.marketConfig.default.abuseReportReasons
    ) {
      const resReport = await new Action().ReportAnswer(
        data.model_id,
        data.reason_title,
      );

      if (!resReport || (!resReport.success && resReport.code != 10))
        return Promise.resolve(resReport || FAILED_RESPONSE);
    }

    return this.Legacy().moderation_new().delete_response_content().POST(data);
  }

  /**
   * @param {{model_id: number, reason?: string, reason_title?: string, reason_id?: number,  model_type_id?: number, give_warning?: boolean, _coupon_?: string}} data - Post data
   * @param {boolean} [dontReport]
   */
  async RemoveComment(data, dontReport) {
    data = {
      model_type_id: 45,
      give_warning: false,
      _coupon_: this.GenerateCoupon(),
      ...data,
    };
    data.reason += ` ${System.constants.config.reasonSign}`;

    if (
      !dontReport &&
      data.reason_title &&
      System.data.config.marketConfig.default.abuseReportReasons
    ) {
      const resReport = await new Action().ReportComment(
        data.model_id,
        data.reason_title,
      );

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
   * @param {"Question" | "Answer" | "Comment" | 1 | 2 | 45} model_type - 1 = Question, 2 = Answer, 45 = Comment
   */
  ConfirmContent(model_id, model_type) {
    let model_type_id = model_type;

    if (typeof model_type === "string" && isNaN(Number(model_type)))
      model_type_id =
        model_type === "Question" ? 1 : model_type === "Answer" ? 2 : 45;

    const data = {
      model_id,
      model_type_id,
    };

    return this.Legacy().moderation_new().accept().POST(data);
  }

  /**
   * @param {number} model_id - Answer id
   */
  ApproveAnswer(model_id) {
    const data = {
      model_type: 2,
      model_id,
      _coupon_: this.GenerateCoupon(),
    };

    return this.Legacy().api_content_quality().confirm().POST(data);
  }

  /**
   * @param {number} model_id - answer id
   */
  UnapproveAnswer(model_id) {
    const data = {
      model_type: 2,
      model_id,
      _coupon_: this.GenerateCoupon(),
    };

    return this.Legacy().api_content_quality().unconfirm().POST(data);
  }

  /**
   * Report answer for correction
   * @param {object} data - Post data
   */
  ReportForCorrection(data) {
    data = {
      model_type_id: 2,
      ...data,
    };
    data.reason += ` ${System.constants.config.reasonSign}`;

    return this.Legacy().moderation_new().wrong_report().POST(data);
  }

  async OpenModerationTicket(
    questionId: number,
    withActionsHistory = false,
  ): Promise<
    CommonProps & {
      data?: TicketDataType;
      users_data?: UsersDataInReportedContentsType[];
    }
  > {
    const data = {
      model_id: questionId,
      model_type_id: 1,
    };

    const ticketPromise = this.Legacy()
      .moderation_new()
      .get_content()
      .POST(data);

    if (!withActionsHistory) return ticketPromise;

    const resTicket = await ticketPromise;
    const resHistory = await new Action().ActionsHistory(questionId);

    resTicket.actions = resHistory;

    return resTicket;
  }

  ActionsHistory(questionId: number) {
    return this.Legacy().api_task_lines().big().P(questionId).GET();
  }

  CloseModerationTicket(questionId: number | string) {
    return this.Legacy().moderate_tickets().expire().POST({
      model_id: questionId,
      model_type_id: 1,
    });
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
    return this.Legacy()
      .api_users()
      .get()
      .P(~~id)
      .GET();
  }

  GetUsers(ids: (string | number)[]): Promise<UsersResponse> {
    if (!(ids instanceof Array)) return Promise.reject("Not an array");

    if (ids.length > USERS_PROFILE_REQ_CHUNK_SIZE)
      return this.GetUsersInChunk(ids);

    return this.Legacy()
      .api_users()
      .get_by_id()
      .P(`length=${ids.length}&id[]=${ids.join("&id[]=")}`)
      .GET();
  }

  GetUsersInChunk(ids) {
    return new Promise((resolve, reject) => {
      let count = 0;
      const chunkedIds = Chunkify(ids, USERS_PROFILE_REQ_CHUNK_SIZE);
      const results: UsersResponse = {
        success: true,
        data: [],
      };

      chunkedIds.forEach(async idList => {
        try {
          const resUsers = await new Action().GetUsers(idList);

          if (resUsers && resUsers.success)
            results.data = [...results.data, ...resUsers.data];

          if (++count == chunkedIds.length) resolve(results);
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
    const promises = [];

    ids.forEach(warningId => {
      const promise = new Action().CancelWarning(userId, warningId);

      promises.push(promise);
    });

    return Promise.all(promises);
  }

  AllFriends() {
    return this.JSON()
      .X_Req_With()
      .buddies_new()
      .ajax_panel_get_buddies()
      .GET();
  }

  RemoveFriend(id) {
    return this.buddies_new().unbuddy().P(id).GET();
  }

  /**
   * @param {number[]} ids
   * @param {function} each
   */
  // eslint-disable-next-line class-methods-use-this
  RemoveFriends(ids, each) {
    let count = 0;
    const promises = [];
    const profileLink = System.createProfileLink();

    ids.forEach(async id => {
      const promise = new Action().RemoveFriend(id);

      promises.push(promise);

      if (each) {
        const resRemove = await promise;

        if (
          resRemove &&
          resRemove.url &&
          (resRemove.url.indexOf("/users/view") >= 0 ||
            resRemove.url.indexOf(profileLink) >= 0)
        ) {
          each(++count, id);
        }
      }
    });

    return Promise.all(promises);
  }

  RemoveAllFriends(each) {
    const idList = System.friends.map(friend => friend.id);

    return this.RemoveFriends(idList, each);
  }

  /**
   * @param {string} nick
   * @returns {Promise<string>}
   */
  FindUser(nick) {
    if (!nick) return Promise.reject("Empty nick");

    return this.users().search().P(nick).GET();
  }

  GetAllModerators(handlers) {
    return new Promise(async (resolve, reject) => {
      const resSupervisors = await this.moderators()
        .supervisors()
        .P(System.data.Brainly.userData.user.id)
        .GET();

      if (!resSupervisors)
        return reject("Can't fetch users from supervisors page");

      handlers = {
        done: resolve,
        ...handlers,
      };

      System.StoreUsers(resSupervisors, handlers);
    });
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
    const data = {
      content,
      conversation_id,
    };

    if (user_id) {
      const resConversation = await new Action().GetConversationID(user_id);

      if (!resConversation || !resConversation.success)
        return Promise.reject(resConversation);

      data.conversation_id = resConversation.data.conversation_id;
    }
    //onError yerine function aç ve gelen isteğe göre conversation id oluştur. İstek conversation id hatası değilse on error devam ettir
    return this.Legacy().api_messages().send().POST(data);
  }

  /**
   * @param {string} text
   */
  ChangeBio(text) {
    const data = {
      operation: "updateUserDescription",
      variables: {
        input: {
          value: {
            description: text,
          },
          type: "UpdateUserDescriptionInput",
        },
      },
      fields: [
        {
          user: ["id"],
        },
      ],
    };

    return this.GQL().Mutation(data).POST();
  }

  /**
   * @param {number} user_id
   * @param {string|{key: string, fields: string, lock: string}} tokens
   */
  async RemoveAllRanks(
    user_id,
    tokens = `[action="/ranks/delete_user_special_ranks"]`,
  ) {
    const data = await this.SetFormTokens(
      System.createProfileLink(user_id, "a", true),
      tokens,
    );
    data["data[uid]"] = user_id;

    return this.ranks().delete_user_special_ranks().Form().Salt().POST(data);
  }

  /**
   * @param {number} user_id
   * @param {number} rank_id
   */
  async AddRank(user_id, rank_id) {
    const data = await this.SetFormTokens(
      `/ranks/choose_special_rank_for_user/${user_id}`,
    );
    data["data[Rank][type]"] = rank_id;

    return this.ranks()
      .add_special_rank_to_user()
      .P(user_id)
      .Form()
      .Salt()
      .POST(data);
  }

  /**
   * @param {number} user_id
   * @param {number} point
   */
  async AddPoint(user_id, point) {
    const data = await this.SetFormTokens(
      System.createProfileLink(user_id, "a", true),
      "#ChangePointsAddForm",
    );
    data["data[ChangePoints][diff]"] = point;

    return this.admin().users().change_points().P(user_id).Form().POST(data);
  }

  /**
   * @param {number} user_id
   * @param {string} reason
   */
  async DeleteAccount(user_id, reason = "") {
    const data = await this.SetFormTokens(
      System.createProfileLink(user_id, "a", true),
      "#DelUserAddForm",
    );
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
    return this.Legacy()
      .api_comments()
      .index()
      .P(model_id)
      .P(type)
      .P(amount)
      .GET();
  }

  GetReportedContents(
    data: {
      last_id?: number;
      subject_id: number;
      category_id: number;
    } = { subject_id: 0, category_id: 0 },
  ): Promise<{
    success?: boolean;
    data?: {
      last_id?: number;
      items?: ReportedContentDataType[];
      corrected_count?: number;
      total_count: number;
      comment_count?: number;
    };
    users_data?: UsersDataInReportedContentsType[];
  }> {
    return this.Legacy().NoCache().moderation_new().index().POST(data);
  }

  /**
   * @param {number} [last_id]
   * @returns {Promise<{
   *  success?: boolean,
   *  data?: {
   *    last_id?: number,
   *    items?: ReportedContentDataType[],
   *    corrected_count?: number,
   *    total_count: number,
   *    comment_count?: number,
   *  },
   *  users_data?: UsersDataInReportedContentsType[]
   * }>}
   */
  /* GetReportedComments(last_id) {
    const data = {
      subject_id: 0,
      category_id: 998,
    };

    if (last_id) data.last_id = last_id;

    return this.Legacy().moderation_new().get_comments_content().POST(data);
  } */

  GetReportedComments(
    data: {
      last_id?: number;
      subject_id: number;
      category_id: number;
    } = { subject_id: 0, category_id: 0 },
  ): Promise<{
    success?: boolean;
    data?: {
      last_id?: number;
      items?: ReportedContentDataType[];
      corrected_count?: number;
      total_count: number;
      comment_count?: number;
    };
    users_data?: UsersDataInReportedContentsType[];
  }> {
    return this.Legacy()
      .NoCache()
      .moderation_new()
      .get_comments_content()
      .POST(data);
  }

  GetCorrectedContents(
    data: {
      last_id?: number;
      subject_id: number;
      category_id: number;
    } = { subject_id: 0, category_id: 0 },
  ): Promise<{
    success?: boolean;
    data?: {
      last_id?: number;
      items?: ReportedContentDataType[];
      corrected_count?: number;
      total_count: number;
      comment_count?: number;
    };
    users_data?: UsersDataInReportedContentsType[];
  }> {
    return this.Legacy().moderation_new().get_wrong_content().POST(data);
  }

  async UploadFile(file, onUploadProgress) {
    const data = await this.SetFormTokens("/admin/uploader/index");
    data["data[Uploader][file]"] = file;

    return this.Axios({ onUploadProgress })
      .admin()
      .uploader()
      .add()
      .File()
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
    if (~~userId == 0) return Promise.reject("Invalid id");

    const data = { userId };

    if (page) data.page = page;

    return this.Legacy().api_responses().get_by_user().GET(data);
  }

  /**
   * @param {number} model_id
   * @param {string} reason
   * @param {number} [category_id]
   * @param {number} [subcategory_id]
   */
  ReportQuestion(model_id, reason, category_id = 2, subcategory_id = 5) {
    return this.ReportContent(1, model_id, reason, category_id, subcategory_id);
  }

  /**
   * @param {number} model_id
   * @param {string} [reason]
   * @param {number} [category_id]
   * @param {number} [subcategory_id]
   */
  ReportAnswer(model_id, reason, category_id = 7, subcategory_id = null) {
    return this.ReportContent(2, model_id, reason, category_id, subcategory_id);
  }

  /**
   * @param {number} model_id
   * @param {string} reason
   * @param {number} [category_id]
   * @param {number} [subcategory_id]
   */
  ReportComment(model_id, reason, category_id = 301, subcategory_id = null) {
    return this.ReportContent(
      45,
      model_id,
      reason,
      category_id,
      subcategory_id,
    );
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
      model_type_id =
        model_type_id == "QUESTION"
          ? 1
          : model_type_id == "ANSWER"
          ? 2
          : model_type_id == "COMMENT"
          ? 45
          : undefined;

    if (model_type_id != 1 && model_type_id != 2 && model_type_id != 45)
      throw "Model type is not valid";

    const type =
      model_type_id == 1
        ? "QUESTION"
        : model_type_id == 2
        ? "ANSWER"
        : "COMMENT";

    if (typeof category_id === "undefined")
      category_id =
        System.data.config.marketConfig.default.abuseReportReasons[type][0];

    if (typeof subcategory_id === "undefined")
      subcategory_id =
        System.data.config.marketConfig.default.abuseReportReasons[type][1];

    const data = {
      abuse: {
        category_id,
        subcategory_id,
        data: (reason || "") + System.constants.config.reasonSign,
      },
      model_id,
      model_type_id,
    };

    return this.Legacy().api_moderation().abuse_report().POST(data);
  }

  SearchQuestion(query = "", after = null, limit = 10) {
    const data = {
      operation: "questionSearch",
      variables: {
        query: {
          value: query,
          type: "String!",
        },
        first: {
          value: limit,
          type: "Int",
        },
        after: {
          value: after,
          type: "ID",
        },
      },
      fields: [
        "count",
        {
          edges: [
            {
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
                      avatar: ["thumbnailUrl"],
                    },
                    {
                      rank: ["name"],
                    },
                  ],
                },
                "content",
                {
                  answers: [
                    "hasVerified",
                    {
                      nodes: ["thanksCount", "ratesCount", "rating"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    return this.GQL().Query(data).POST();
  }

  /**
   * @param {(1 | 2 | 45) | ("QUESTION" | "ANSWER" | "COMMENT")} model_type_id
   */
  GetAbuseReasons(model_type_id) {
    if (typeof model_type_id == "string")
      model_type_id =
        model_type_id == "QUESTION"
          ? 1
          : model_type_id == "ANSWER"
          ? 2
          : model_type_id == "COMMENT"
          ? 45
          : undefined;

    if (!model_type_id) throw "Model type should be specified";

    return this.Legacy()
      .moderation_new()
      .get_abuse_reasons()
      .POST({ model_type_id });
  }

  GetAbuseFilters() {
    return this.Legacy()
      .moderation_new()
      .get_abuse_filters()
      .POST({ model_type_id: 1 });
    // different ids, returns the same filters
  }

  Me() {
    return this.Legacy().api_users().me().GET();
  }
}
