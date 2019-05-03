import Brainly from "../";

export default class Action extends Brainly {
  constructor() {
    super();
  }
  /**
   * Get details of a question
   * @param {number|string} id - Question id
   */
  QuestionContent(id) {
    if (~~id == 0)
      return Promise.reject("Unvalid id");

    return this.Legacy().api_tasks().main_view().P(id).GET();
  }
  /**
   * @param {{model_id: number, reason: string, reason_id: number, give_warning: boolean, take_points: boolean, return_points:boolean}} data
   */
  RemoveQuestion(data) {
    data = {
      model_type_id: 1,
      give_warning: false,
      take_points: true,
      return_points: true,
      schema: "",
      _coupon_: this.GenerateCoupon(),
      ...data
    }
    data.reason += ` ${System.constants.config.reasonSign}`;

    return this.Legacy().moderation_new().delete_task_content().POST(data);
  }
  /**
   * @param {{model_id: number, reason: string, reason_id: number, give_warning: boolean, take_points: boolean}} data
   */
  RemoveAnswer(data) {
    data = {
      model_type_id: 2,
      give_warning: false,
      take_points: true,
      schema: "moderation.response.delete.req",
      _coupon_: this.GenerateCoupon(),
      ...data
    }
    data.reason += ` ${System.constants.config.reasonSign}`;

    return this.Legacy().moderation_new().delete_response_content().POST(data);
  }
  /**
   * Delete comment by id
   * @param {object} data - Post data
   */
  RemoveComment(data) {
    data = {
      model_type_id: 45,
      give_warning: false,
      schema: "",
      _coupon_: this.GenerateCoupon(),
      ...data
    }
    data.reason += ` ${System.constants.config.reasonSign}`;

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
      model_type_id,
      schema: "moderation.content.ok"
    };

    return this.Legacy().moderation_new().accept().POST(data);
  }
  /**
   * Approve answer by id
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
   * Unapprove answer by id
   * @param {number} model_id - answer id
   */
  UnapproveAnswer(model_id) {
    let data = {
      model_type: 2,
      model_id,
      _coupon_: this.GenerateCoupon()
    }

    return this.Legacy().api_content_quality().confirm().POST(data);
  }
  /**
   * Report answer for correction
   * @param {object} data - Post data
   */
  ReportForCorrection(data) {
    data = {
      model_type_id: 2,
      schema: "",
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
          model_type_id: 1,
          schema: "moderation.content.result.res"
        }

        let resTicket = await this.Legacy().moderation_new().get_content().POST(data);

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
      model_type_id: 1,
      schema: ""
    }

    return this.Legacy().moderate_tickets().expire().POST(data);
  }
  /**
   * Get user profile data by id
   * @param {number} id - User id
   */
  GetUserProfile(id) {
    return this.Legacy().api_user_profiles().get_by_id().P(id).GET();
  }
  /**
   * Get user data by id.
   * Difference between GetUserProfile and GetUser is GetUserProfile serves the Bio text and returns success:false for deleted accounts.
   * But GetUser returns with success:true for deleted accounts- but returns without bio text. Therefore, there should be two different methods to get user details.
   * @param {number} id - User id
   */
  GetUser(id) {
    return this.Legacy().api_users().get().P(~~id).GET();
  }
  /**
   * Get users data by ids
   * @param {number[]} ids - User id numbers
   */
  GetUsers(ids) {
    return this.Legacy().api_users().get_by_id().GET({ "id[]": ids.join("&id[]=") });
  }
  /**
   * Cancel user warning by warning id
   * @param {number} userId
   * @param {number} warningId
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

    ids.forEach(warningId => (this.path = "", promises.push(this.CancelWarning(userId, warningId))));

    return Promise.all(promises);
  }
  AllFriends() {
    return this.JSON().X_Req_With().buddies_new().ajax_panel_get_buddies().GET();
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
      let resSupervisors = await this.moderators().supervisors().P(System.data.Brainly.userData.user.id).GET();

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
   * @param {number} conversation_id
   * @param {string} content
   */
  SendMessage(conversation_id, content) {
    let data = {
      content,
      conversation_id
    };
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
   * @param {string} sourceURL
   * @param {string} formSelector
   */
  GetPHPTokens(sourceURL, formSelector) {
    return new Promise(async (resolve, reject) => {
      try {
        this.path = sourceURL;
        let HTML = await this.GET();
        this.path = "";
        let tokens = {
          key: /\[key]" value="(.*?)" i/i,
          lock: /\[lock]" value="(.*?)" i/i,
          fields: /\[fields]" value="(.*?)" id="TokenF/i
        }

        /**
         * To avoid having the "imgError:undefined" error message on console
         */
        HTML = HTML.replace(/onerror="imgError\(this, (?:'|\&\#039\;){1,}\);"/gmi, "");

        if (formSelector) {
          HTML = $(formSelector, HTML).html();
        }

        $.each(tokens, (i, token) => {
          let tokenMatch = HTML.match(token);

          tokens[i] = tokenMatch ? tokenMatch[1] : "";
        });

        resolve(tokens);
      } catch (error) {
        reject(error);
      }
    });
  }
  /**
   * @param {number} user_id
   * @param {string|{key: string, fields: string, lock: string}} tokens
   */
  async RemoveAllRanks(user_id, tokens = `[action="/ranks/delete_user_special_ranks"]`) {
    let data = await this.SetFormTokens(System.createProfileLink(user_id), tokens);
    data["data[uid]"] = user_id;

    return this.ranks().delete_user_special_ranks().Form().Salt().POST(data);
  }
  /**
   * @param {number} user_id
   * @param {number} rank_id
   */
  async AddRank(user_id, rank_id) {
    let data = await this.SetFormTokens(`/ranks/choose_special_rank_for_user/${user_id}`);
    data["data[Rank][type]"] = rank_id;

    return this.ranks().add_special_rank_to_user().P(user_id).Form().Salt().POST(data);
  }
  /**
   * @param {number} user_id
   * @param {number} point
   */
  async AddPoint(user_id, point) {
    let data = await this.SetFormTokens(System.createProfileLink(user_id), "#ChangePointsAddForm");
    data["data[ChangePoints][diff]"] = point;

    return this.admin().users().change_points().P(user_id).Form().POST(data);
  }
  /**
   * @param {number} model_id
   * @param {number} type
   * @param {number} amount
   */
  GetComments(model_id, type, amount) {
    return this.Legacy().api_comments().index().P(model_id).P(type).P(amount).GET();
  }
  GetReportedContents(last_id) {
    let data = {
      subject_id: 0,
      category_id: 0,
      schema: "moderation.index"
    }

    if (last_id)
      data.last_id = last_id;

    return this.Legacy().moderation_new().index().POST(data);
  }
  GetReportedComments(last_id) {
    let data = {
      subject_id: 0,
      category_id: 998,
      schema: "moderation.index"
    }

    if (last_id)
      data.last_id = last_id;

    return this.Legacy().moderation_new().get_comments_content().POST(data);
  }
  GetCorrectedContents(last_id) {
    let data = {
      subject_id: 0,
      category_id: 999,
      schema: "moderation.index"
    }

    if (last_id)
      data.last_id = last_id;

    return this.Legacy().moderation_new().get_wrong_content().POST(data);
  }
  async UploadFile(file, onUploadProgress) {
    let data = await this.SetFormTokens("/admin/uploader/index");
    data["data[Uploader][file]"] = file;

    return this.Axios({ onUploadProgress }).admin().uploader().add().File().POST(data);
  }
  GetQuestionAddPage() {
    return this.X_Req_With().question().add().GET();
  }
}
