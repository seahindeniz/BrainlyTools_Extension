/* eslint-disable import/first */
/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const gql = (s = "") => s;

import Brainly, { TokensPropsType } from "@BrainlyReq/Brainly";
import Chunkify from "../../../../helpers/Chunkify";
/* import AnswerConnection from "./GraphQL/Answer/Connection.graphql";
import AnswerConnection_With_Comments from "./GraphQL/Answer/Connection_With_Comments.graphql";
import CommentConnection from "./GraphQL/Comment/Connection.graphql";
import QuestionFragment from "./GraphQL/Question.graphql";
import UserFragment from "./GraphQL/User.graphql";
import SubjectFragment from "./GraphQL/Subject.graphql";
import AttachmentFragment from "./GraphQL/Attachment.graphql"; */

const USERS_PROFILE_REQ_CHUNK_SIZE = 100;

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

type CommonSuccessResponseDataType = { success: true };
type CommonFailedResponseDataType = {
  success: false;
  message?: string;
  code?: number;
  exception_type?: number;
};

export type CommonResponseDataType =
  | CommonSuccessResponseDataType
  | CommonFailedResponseDataType;

type CommonGenericResponseType<T> =
  | (CommonSuccessResponseDataType & T)
  | CommonFailedResponseDataType;

export type UserResponse = CommonGenericResponseType<{
  data?: UserType;
  message?: string;
}>;

export type UsersResponse = CommonGenericResponseType<{
  data?: UserType[];
  message?: string;
}>;

export type UserProfile = CommonUserProps & {
  answers_by_subject: {
    subject_id: number;
    answers_count: number;
  }[];
  avatars: null | { 64: string; 100: string };
  best_answers_from_30_days: number;
  description: string;
  followed_count: string;
  follower_count: string;
  gender: number;
  is_followed_by: boolean;
  is_following: boolean;
  points: number;
  ranks_ids: number[];
  total_questions: number;
  total_thanks: number;
};

type AnswersOfUser = {
  id: number;
  author_id: number;
  question_id: number;
  content: string;
  points: number;
  thanks_count: number;
  rating: number;
  rates_count: number;
  is_confirmed: boolean;
  is_excellent: boolean;
  is_best: boolean;
  can_comment: boolean;
  attachment_ids: [];
  created: string;
}[];

type UserProfileResponse = CommonGenericResponseType<{ data?: UserProfile }>;

type AnswersOfUserResponse = CommonGenericResponseType<{
  pagination?: {
    first: string;
    prev: string;
    self: string;
    next: string;
    last: string;
  };
  data?: AnswersOfUser;
}>;

type GQL_User = {
  avatar: null;
  gender: "MALE" | "FEMALE";
  id: string;
  nick: string;
  points: number;
  rank: {
    id: string;
    name: string;
  };
};

type GQL_Attachment = {
  id: string;
  thumbnailUrl: string;
  url: string;
};

type GQL_Comment = {
  id: string;
  content: string;
  author: GQL_User;
};

type GQL_CommentEdge = {
  cursor: string;
  node: GQL_Comment;
};

type GQL_CommentEdges = {
  count: number;
  edges: GQL_CommentEdge[];
};

type GQL_Question = {
  answers?: {
    nodes: GQL_Answer[];
  };
  attachments: GQL_Attachment[];
  author: GQL_User;
  content: string;
  created: string;
  id: string;
  points: number;
  subject: GQL_Subject;
  pointsForAnswer: number;
  pointsForBestAnswer: number;
  comments?: GQL_CommentEdges;
};

type GQL_ResQuestion = {
  data: {
    question: GQL_Question;
  };
};

type GQL_Answer = {
  attachments: string[];
  author: GQL_User;
  content: string;
  created: string;
  id: string;
  isBest: boolean;
  isConfirmed: boolean;
  thanksCount: number;
  verification: null | {
    approval: {
      approver: GQL_User;
      approvedTime: string;
    };
  };
  comments?: GQL_CommentEdges;
};

type GQL_Subject = { icon: string; id: string; name: string };

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
  ranks_ids?: number[];
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

type ReportDetailsDataType = {
  user?: UserDataInReportType;
  created?: string;
  abuse?: {
    category_id?: number;
    subcategory_id?: number;
    name?: string;
    data?: string;
  };
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
  report?: ReportDetailsDataType;
  // correction report
  corrected?: boolean;
};

export type CommentDataInTicketType = {
  content: string;
  created: string;
  deleted: boolean;
  id: number;
  user_id: number;
  report?: ReportDetailsDataType;
};

export type AttachmentDataInTicketType = {
  extension: string;
  full: string;
  hash: string;
  id: number;
  size: number;
  thumbnail: string;
  type: string;
};

export type CommonDataInTicketType = {
  attachments: AttachmentDataInTicketType[];
  comments: CommentDataInTicketType[];
  content: string;
  created: string;
  id: number;
  user: UserDataInReportType;
  user_id: number;
  report?: ReportDetailsDataType;
};

export type AnswerDataInTicketType = CommonDataInTicketType & {
  best: boolean;
  mark: number;
  points: number;
  task_id: number;
  thanks: number;
  wrong_report?: {
    reason: string;
    reported: string;
    user: UserDataInReportType;
  };
  edited?: string;
  original_content?: string;
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
  delete_reasons: {
    [x: string]: any;
  };
  responses: AnswerDataInTicketType[];
  task: QuestionDataInTicketType;
  ticket: {
    id: number;
    time_left: number;
    user_id: number;
  };
};

export type ModerationTicketDataType = CommonGenericResponseType<{
  data?: TicketDataType;
  users_data?: UsersDataInReportedContentsType[];
}>;

export type RemoveQuestionReqDataType = {
  model_id: number;
  reason: string;
  reason_title?: string;
  reason_id: number;
  model_type_id?: number;
  give_warning?: boolean;
  take_points?: boolean;
  return_points?: boolean;
  _coupon_?: string;
};

export type RemoveAnswerReqDataType = {
  model_id: number;
  reason: string;
  reason_title?: string;
  reason_id: number;
  model_type_id?: number;
  give_warning?: boolean;
  take_points?: boolean;
  _coupon_?: string;
};

export type RemoveCommentReqDataType = {
  model_id: number;
  reason: string;
  reason_title?: string;
  reason_id: number;
  model_type_id?: number;
  give_warning?: boolean;
  _coupon_?: string;
};

export type QuestionLogEntryClassType =
  | "accepted"
  | "added"
  | "best"
  | "deleted"
  | "edited"
  | "info"
  | "reported";

export type QuestionLogEntryType = {
  class: QuestionLogEntryClassType;
  date: string;
  descriptions?: {
    subject: string;
    text: string;
  }[];
  owner_id: number;
  text: string;
  time: string;
  type: number;
  user_id: number;
  warn: boolean;
};

export type ReportedContentsDataType = {
  last_id?: number;
  items?: ReportedContentDataType[];
  corrected_count?: number;
  total_count: number;
  comment_count?: number;
};

const FAILED_RESPONSE = {
  success: false,
  get message() {
    return System.data.locale.common.notificationMessages
      .somethingWentWrongPleaseRefresh;
  },
};

function GetUsersInChunk(
  ids: (number | string)[],
): Promise<CommonGenericResponseType<UsersResponse>> {
  return new Promise((resolve, reject) => {
    let count = 0;
    const chunkedIds = Chunkify(ids, USERS_PROFILE_REQ_CHUNK_SIZE);
    const results: UsersResponse = {
      success: true,
      data: [],
    };

    chunkedIds.forEach(async idList => {
      try {
        // eslint-disable-next-line no-use-before-define
        const resUsers = await new Action().GetUsers(idList);

        if (resUsers && resUsers.success)
          results.data = [...results.data, ...resUsers.data];

        if (++count === chunkedIds.length) resolve(results);
      } catch (error) {
        console.error("err", error);
        reject(error);
        throw error;
      }
    });
  });
}

function CancelWarnings(userId: number, ids: number[] = []) {
  const promises = [];

  ids.forEach(warningId => {
    // eslint-disable-next-line no-use-before-define
    const promise = new Action().CancelWarning(userId, warningId);

    promises.push(promise);
  });

  return Promise.all(promises);
}

export default class Action extends Brainly {
  GetUsersInChunk: typeof GetUsersInChunk;
  CancelWarnings: typeof CancelWarnings;

  constructor() {
    super();

    this.GetUsersInChunk = GetUsersInChunk;
    this.CancelWarnings = CancelWarnings;
  }

  HelloWorld(
    data: any,
  ): Promise<{
    success: boolean;
    message?: string;
    data: {
      msg: string;
    };
  }> {
    return this.Legacy().hello().world()[data ? "POST" : "GET"](data);
  }

  GetQuestion(id: number | string) {
    if (~~id === 0) return Promise.reject(Error("Invalid id"));

    return this.Legacy().api_tasks().main_view().P(String(id)).GET();
  }

  /* GetQuestion2(
    id: number | string,
    {
      excludeAnswer,
      excludeComment,
    }: { excludeAnswer?: boolean; excludeComment?: boolean } = {},
  ): Promise<GQL_ResQuestion> {
    try {
      const idData = atob(String(id));

      if (!idData.includes("question")) throw Error("Invalid id");
    } catch (e) {
      if (~~id === 0) return Promise.reject(Error("Invalid id"));

      // eslint-disable-next-line no-param-reassign
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
  } */

  /* GetAnswer(
    id: number | string,
    {
      includeQuestion,
      includeComments,
    }: {
      includeQuestion?: boolean;
      includeComments?: boolean;
    } = {},
  ): Promise<{
    data: {
      answer: GQL_Answer;
    };
  }> {
    try {
      const idData = atob(String(id));

      if (!idData.includes("answer")) throw Error("Invalid id");
    } catch (e) {
      if (~~id === 0) return Promise.reject(Error("Invalid id"));

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
  } */

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
    /* const resAdd = */ await promiseAdd;

    const resCloseTicket = await new Action().RemoveTicketForAnswering(
      task_id,
      resOpenTicket.data.ticket_id,
    );

    if (!resCloseTicket || !resCloseTicket.success)
      return Promise.resolve(resCloseTicket || FAILED_RESPONSE);

    return promiseAdd;
  }

  GetTicketForAnswering(task_id: number) {
    return this.Legacy().api_tickets().get().POST({ task_id });
  }

  /**
   * @param {number} task_id
   * @param {number} ticket_id
   */
  RemoveTicketForAnswering(task_id, ticket_id) {
    return this.Legacy().api_tickets().remove().POST({ task_id, ticket_id });
  }

  async RemoveQuestion(
    data: RemoveQuestionReqDataType,
    dontReport?: boolean,
  ): Promise<CommonResponseDataType> {
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

  async RemoveAnswer(
    data: RemoveAnswerReqDataType,
    dontReport?: boolean,
  ): Promise<CommonResponseDataType> {
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

      if (!resReport || (!resReport.success && resReport.code !== 10))
        return Promise.resolve(resReport || FAILED_RESPONSE);
    }

    return this.Legacy().moderation_new().delete_response_content().POST(data);
  }

  async RemoveComment(
    data: RemoveCommentReqDataType,
    dontReport?: boolean,
  ): Promise<CommonResponseDataType> {
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

      if (!resReport || (!resReport.success && resReport.code !== 10))
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

  ConfirmContent(
    contentId: number,
    contentType: "Question" | "Answer" | "Comment" | 1 | 2 | 45,
  ): Promise<CommonResponseDataType> {
    let model_type_id = contentType;

    if (!contentId) throw Error(`Invalid content id ${contentId}`);

    if (typeof contentType === "string" && isNaN(Number(contentType)))
      model_type_id =
        contentType === "Question" ? 1 : contentType === "Answer" ? 2 : 45;

    if (model_type_id !== 1 && model_type_id !== 2 && model_type_id !== 45)
      throw Error(`Invalid content type ${model_type_id}`);

    const data = {
      model_id: contentId,
      model_type_id,
    };

    return this.Legacy().moderation_new().accept().POST(data);
  }

  ApproveAnswer(model_id: number): Promise<CommonResponseDataType> {
    const data = {
      model_type: 2,
      model_id,
      _coupon_: this.GenerateCoupon(),
    };

    return this.Legacy().api_content_quality().confirm().POST(data);
  }

  UnapproveAnswer(model_id: number) {
    const data = {
      model_type: 2,
      model_id,
      _coupon_: this.GenerateCoupon(),
    };

    return this.Legacy().api_content_quality().unconfirm().POST(data);
  }

  ReportForCorrection(_data: {
    model_id: number;
    reason?: string;
  }): Promise<CommonResponseDataType> {
    const data = {
      model_type_id: 2,
      ..._data,
    };

    data.reason += ` ${System.constants.config.reasonSign}`;

    return this.Legacy().moderation_new().wrong_report().POST(data);
  }

  async OpenModerationTicket(
    questionId: number,
    withActionsHistory = false,
  ): Promise<ModerationTicketDataType> {
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

  ActionsHistory(
    questionId: number,
  ): Promise<
    CommonGenericResponseType<{
      data: QuestionLogEntryType[];
      users_data: UsersDataInReportedContentsType[];
    }>
  > {
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
   */
  GetUser(id: number): Promise<UserResponse> {
    return this.Legacy()
      .api_users()
      .get()
      .P(~~id)
      .GET();
  }

  GetUsers(ids: (string | number)[]): Promise<UsersResponse> {
    if (!(ids instanceof Array)) {
      return Promise.reject(Error("Not an array"));
    }

    if (ids.length === 0)
      return Promise.resolve({
        data: [],
        success: true,
      });

    if (ids.length > USERS_PROFILE_REQ_CHUNK_SIZE)
      return this.GetUsersInChunk(ids);

    const queries = ids.map(id => {
      return [`id[]`, id];
    });

    return this.Legacy().api_users().get_by_id().GET(queries);
  }

  CancelWarning(userId: number, warningId: number | number[]) {
    if (warningId instanceof Array)
      return this.CancelWarnings(userId, warningId);

    return this.moderators().cancel_warning().P(userId).P(warningId).GET();
  }

  AllFriends() {
    return this.JSON().XReqWith().buddies_new().ajax_panel_get_buddies().GET();
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
    // TODO fix this
    // const profileLink = System.createProfileLink();

    ids.forEach(async id => {
      const promise = new Action().RemoveFriend(id);

      promises.push(promise);

      if (each) {
        const resRemove = await promise;

        if (
          resRemove &&
          resRemove.url &&
          resRemove.url.indexOf("/users/view") >=
            0 /*  ||
            resRemove.url.indexOf(profileLink) >= 0 */
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
    if (!nick) return Promise.reject(Error("Empty nick"));

    return this.users().search().P(nick).GET();
  }

  async GetAllModerators(handlers?) {
    const resSupervisors = await this.moderators()
      .supervisors()
      .P(System.data.Brainly.userData.user.id)
      .GET();

    if (!resSupervisors) throw Error("Can't fetch users from supervisors page");

    const userIds = System.ParseUsers(resSupervisors);
    const resUsers = await new Action().GetUsers(userIds);

    if (!resUsers || resUsers.success === false || !resUsers.data.length)
      return undefined;

    await System.StoreUsers(resUsers.data, handlers);

    return System.allModerators;
  }

  /**
   * @param {number} user_id
   */
  GetConversationID(user_id) {
    return this.Legacy().api_messages().check().POST({ user_id });
  }

  async SendMessage(
    {
      conversation_id,
      user_id,
    }: { conversation_id?: number; user_id?: number },
    content: string,
  ) {
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
    // onError yerine function aç ve gelen isteğe göre conversation id oluştur. İstek conversation id hatası değilse on error devam ettir
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

  async RemoveAllRanks(
    user_id: number,
    tokenProps: TokensPropsType = {
      tokenSelector: `[action="/ranks/delete_user_special_ranks"]`,
    },
  ) {
    const data = await this.SetFormTokens(
      System.createProfileLink(user_id, "a", true),
      tokenProps,
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

  async AddPoint(user_id: number, point: number) {
    const data = await this.SetFormTokens(
      System.createProfileLink(user_id, "a", true),
      { tokenSelector: "#ChangePointsAddForm" },
    );
    data["data[ChangePoints][diff]"] = point;

    return this.admin().users().change_points().P(user_id).Form().POST(data);
  }

  async DeleteAccount(user_id: number, reason = "") {
    const data = await this.SetFormTokens(
      System.createProfileLink(user_id, "a", true),
      { tokenSelector: "#DelUserAddForm" },
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
    data?: ReportedContentsDataType;
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
      subject_id?: number;
      category_id?: number;
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
    return this.XReqWith().question().add().GET();
  }

  GetAnswersOfUser(
    userId: number,
    page: number,
  ): Promise<AnswersOfUserResponse> {
    if (~~userId === 0) throw Error("Invalid id");

    const data = { userId, page: undefined };

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
    if (typeof model_type_id === "string")
      model_type_id =
        model_type_id === "QUESTION"
          ? 1
          : model_type_id === "ANSWER"
          ? 2
          : model_type_id === "COMMENT"
          ? 45
          : undefined;

    if (
      ~~model_type_id !== 1 &&
      ~~model_type_id !== 2 &&
      ~~model_type_id !== 45
    )
      throw Error("Model type is not valid");

    const type =
      ~~model_type_id === 1
        ? "QUESTION"
        : ~~model_type_id === 2
        ? "ANSWER"
        : "COMMENT";

    if (typeof category_id === "undefined")
      [
        category_id,
      ] = System.data.config.marketConfig.default.abuseReportReasons[type];

    if (typeof subcategory_id === "undefined")
      [
        ,
        subcategory_id,
      ] = System.data.config.marketConfig.default.abuseReportReasons[type];

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
    if (typeof model_type_id === "string")
      model_type_id =
        model_type_id === "QUESTION"
          ? 1
          : model_type_id === "ANSWER"
          ? 2
          : model_type_id === "COMMENT"
          ? 45
          : undefined;

    if (!model_type_id) throw Error("Model type should be specified");

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
    // no need to set different type id. All returns the same filters
  }

  Me() {
    return this.Legacy().api_users().me().GET();
  }

  DeleteAttachment(data: {
    attachment_id: number;
    model_id: number;
    model_type_id: 1 | 2 | "Answer" | "Question";
    task_id: number;
  }) {
    if (data.model_type_id === "Question") data.model_type_id = 1;

    if (data.model_type_id === "Answer") data.model_type_id = 2;

    return this.Legacy().moderation_new().delete_attachment().POST(data);
  }

  ProlongModerationTicket(data: {
    model_id: number;
    model_type_id: 1 | 2 | "Answer" | "Question";
    ticket_id: number;
    time?: number;
  }): Promise<
    CommonGenericResponseType<{
      data: {
        id: number;
        time_left: number;
        user_id: number;
      };
    }>
  > {
    if (data.model_type_id === "Question") data.model_type_id = 1;

    if (data.model_type_id === "Answer") data.model_type_id = 2;

    if (!data.time) data.time = 900;

    return this.Legacy().moderate_tickets().prolong().POST(data);
  }
}
