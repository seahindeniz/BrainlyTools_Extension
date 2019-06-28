"use strict";

import Buttons from "../../components/Buttons";
import notification from "../../components/notification";
import Action from "../../controllers/Req/Brainly/Action";
import WaitForElement from "../../helpers/WaitForElement";
import WaitForObject from "../../helpers/WaitForObject";
import layoutChanger from "./_/layoutChanger";
import Pagination from "./_/Pagination";

window.selectors = {
  moderationItemParent: "#moderation-all > div.content",
  moderationItemFooter: "div.content > div.footer",
  moderationItemType: "> div.header > span.qa",
  panelCloseIcon: "#toplayer > div.contener-center.mod > div.moderation > div.title > div.options > div.close",
  taskUrl: "> div.header a.task-url"
}

System.pageLoaded("Arcive Mod page OK!");
ArciveMod();

async function ArciveMod() {
  layoutChanger();
  new Pagination();

  if (System.checkUserP([1, 2, 45])) {
    /**
     *  Adding remove buttons inside of question boxes
     **/
    let prepareButtons = {
      task: "",
      response: "",
      comment: ""
    };
    let confirmButton = Buttons('RemoveQuestionNoIcon', {
      text: "✓",
      class: "confirm",
      title: System.data.locale.common.confirm,
    }, `<div class="sg-spinner-container">{button}</div>`);

    $.each(System.data.config.quickDeleteButtonsReasons, (reasonType, reasonIds) => {
      if (prepareButtons[reasonType] === "") {
        let data = [];
        let reasons = System.data.Brainly.deleteReasons.__withIds[reasonType];
        let buttonStyle = "peach";

        if (reasonType == "task")
          buttonStyle = "mustard";

        reasonIds.forEach((reasonId, i) => {
          let reason = reasons[reasonId];

          if (reason) {
            data.push({
              text: i + 1,
              title: reason.title + ":\n" + reason.text,
              type: buttonStyle
            });
          }
        });

        prepareButtons[reasonType] = Buttons('RemoveQuestionNoIcon', data, `<div class="sg-spinner-container">{button}</div>`) + confirmButton;
      }
    });

    let createQuickDeleteButtons = nodes => {
      if (nodes) {
        for (let i = 0, node;
          (node = nodes[i]); i++) {
          //let itemType = $(selectors.moderationItemType, node).text();
          node.classList.add("ext-buttons-added");
          //node.setAttribute("data-type", itemType == "Q" ? "task" : itemType == "A" ? "response" : "comment");
          let obj = Zadanium.getObject(node.getAttribute("objecthash"));
          let $footer = $(selectors.moderationItemFooter, node);
          let profileLink = System.createProfileLink(obj.data.user);

          $("span.alert-error", node).html(`<a href="${profileLink}" target="_blank">${obj.data.user.nick}</a>`)

          if (System.checkUserP(obj.data.model_type_id)) {
            $("> div", $footer).remove();
            let itemType = obj.data.model_type_id == 1 ? "task" : obj.data.model_type_id == 2 ? "response" : "comment";
            let $extActionButtons = $(`<div class="ext-action-buttons sg-content-box__content--with-centered-text">${prepareButtons[itemType]}</div>`);

            //$footer.html("");
            prepareButtons[itemType] && $footer.append($extActionButtons);
          }
        }
      }
    }
    let quickDeleteButtonsHandler = async function() {
      let btn_index = $(this).parent().index();
      let $moderation_item = $(this).parents(".moderation-item");

      let obj = Zadanium.getObject($moderation_item.attr("objecthash"));

      let $itemContent = $("> div.content ", $moderation_item);

      if (obj && obj.data && obj.data.model_id && obj.data.model_id >= 0) {
        let contentType = obj.data.model_type_id == 1 ? "task" : obj.data.model_type_id == 2 ? "response" : "comment";

        if ($(this).is(".confirm")) {
          if (confirm(System.data.locale.userContent.notificationMessages.doYouWantToConfirmThisContent)) {
            let res;
            let $spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--small sg-spinner--light"></div></div>`).appendTo(this);
            let $extActions = $(this).parents(".ext-action-buttons");

            $extActions.addClass("is-deleting");

            if (contentType == "task") {
              res = await new Action().ConfirmQuestion(obj.data.model_id);

              System.log(19, { user: obj.data.user, data: [obj.data.model_id] });
            } else if (contentType == "response") {
              res = await new Action().ConfirmAnswer(obj.data.model_id);

              System.log(20, { user: obj.data.user, data: [obj.data.model_id] });
            } else if (contentType == "comment") {
              res = await new Action().ConfirmComment(obj.data.model_id);

              System.log(21, { user: obj.data.user, data: [obj.data.model_id] });
            }

            $spinner.remove();
            $extActions.removeClass("is-deleting");

            if (!res) {
              notification(System.data.locale.common.notificationMessages.operationError, "error");
            } else {
              if (!res.success) {
                notification(res.message || System.data.locale.common.notificationMessages.somethingWentWrong, "error");
              } else {
                $moderation_item.addClass("confirmed");
                $(this).remove();
              }
            }
          }
        } else if (confirm(System.data.locale.common.moderating.doYouWantToDelete)) {
          let reasonID = System.data.config.quickDeleteButtonsReasons[contentType][btn_index];
          let reason = System.data.Brainly.deleteReasons.__withIds[contentType][reasonID];
          let data = {
            model_id: obj.data.model_id,
            reason_id: reason.category_id,
            reason: reason.text,
            give_warning: System.canBeWarned(reason.id)
          };
          let $spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--small sg-spinner--light"></div></div>`).appendTo(this);
          let $extActions = $(this).parents(".ext-action-buttons");

          $extActions.addClass("is-deleting");

          let onRes = res => {
            new Action().CloseModerationTicket(obj.data.task_id);

            $spinner.remove();
            $extActions.removeClass("is-deleting");

            if (res) {
              if (res.success) {
                $moderation_item.addClass("removed");
                $(this).parent().remove();
              } else if (res.message) {
                notification(res.message, "error");
              }
            } else {
              notification(System.data.locale.common.notificationMessages.somethingWentWrong, "error");
            }
          };

          if (contentType == "task") {
            let res = await new Action().RemoveQuestion(data);

            System.log(5, { user: obj.data.user, data: [data.model_id] });
            onRes(res);
          } else if (contentType == "response") {
            let res = await new Action().RemoveAnswer(data);

            System.log(6, { user: obj.data.user, data: [data.model_id] });
            onRes(res);
          } else if (contentType == "comment") {
            let res = await new Action().RemoveComment(data);

            System.log(7, { user: obj.data.user, data: [data.model_id] });
            onRes(res);
          }
        }
      }
    };
    $("body").on("click", ".ext-action-buttons button", quickDeleteButtonsHandler);

    /**
     * Manipulate moderation panel
     */
    let prepareQuickDeleteButtons = {
      task: true,
      response: true
    };

    $.each(System.data.config.quickDeleteButtonsReasons, (reasonType, reasonIds) => {
      if (prepareQuickDeleteButtons[reasonType]) {
        let data = [];

        reasonIds.forEach((reasonId, i) => {
          let reason = System.data.Brainly.deleteReasons.__withIds[reasonType][reasonId];

          if (reason)
            data.push({
              text: reason.title,
              title: reason.text,
              type: "peach sg-button-secondary--small"
            });
        });

        prepareQuickDeleteButtons[reasonType] = Buttons('RemoveQuestionNoIcon', data);
      }
    });

    let manipulateModPanel = $toplayer => {
      $("> div:not(.moderation-taskline)", $toplayer).each(function(i, $moderation) {
        let contentType = $moderation.getAttribute("class").replace(/\w{1,}\-|[0-9.]| {1,}\w{1,}|\-| {1,}/g, "");
        let contentType_id = contentType == "task" ? 1 : contentType == "response" ? 2 : 45;

        if (System.checkUserP(contentType_id)) {
          let contentID = $moderation.getAttribute("class").replace(/[^0-9.]/g, "");
          let $actions = $("> div.header > div.actions", $moderation);
          let $quickDeleteButtons = $(`<div class="actions pull-right quickDeleteButtons">${prepareQuickDeleteButtons[contentType]}</div>`);

          $quickDeleteButtons.insertAfter($actions);

          $("button", $quickDeleteButtons).click(async function() {
            let btn_index = $(this).index();

            if (contentID >= 0) {
              if (confirm(System.data.locale.common.moderating.doYouWantToDelete)) {
                let reason = System.data.Brainly.deleteReasons.__withIds[contentType][System.data.config.quickDeleteButtonsReasons[contentType][btn_index]];
                let data = {
                  model_id: contentID,
                  reason_id: reason.category_id,
                  reason: reason.text,
                  give_warning: System.canBeWarned(reason.id)
                };
                let spinner = $(`<div class="sg-spinner sg-spinner--xxsmall sg-spinner--light"></div>`).appendTo(this);
                let obj = Zadanium.getObject($($toplayer).attr("objecthash"));
                let toplayer = Zadanium.toplayer.createdObjects[Zadanium.toplayer.createdObjects.length - 1].data.toplayer;
                let notify = message => {
                  if (toplayer) {
                    toplayer.setMessage(message, "failure");
                  } else {
                    notification(message, "error");
                  }
                }

                let onRes = (res) => {
                  new Action().CloseModerationTicket(obj.data.task_id);

                  if (res) {
                    if (res.success) {
                      if (contentType == "task") {
                        $(selectors.panelCloseIcon).click();
                      } else if (contentType == "response") {
                        $moderation.classList.add("removed");
                        $("button.resign", $moderation).click();
                        $("> div.header > div.actions", $moderation).remove();
                      }
                    } else if (res.message) {
                      notify(res.message)
                    }
                  } else {
                    notify(System.data.locale.common.notificationMessages.somethingWentWrong)
                  }
                  spinner.remove();
                };

                if (contentType == "task") {
                  let user = Zadanium.users.getUserObject(obj.data.task.user.id);

                  let res = await new Action().RemoveQuestion(data);

                  onRes(res);
                  System.log(5, { user: user.data, data: [contentID] });
                } else if (contentType == "response") {
                  let response = obj.data.responses.find(res => {
                    return res.id == contentID;
                  });
                  let user = Zadanium.users.getUserObject(response.user_id);

                  let res = await new Action().RemoveAnswer(data);

                  onRes(res);
                  System.log(6, { user: user.data, data: [contentID] });
                }
              }

            }
          });
        }
      });
    }

    let _$_observe = await WaitForObject("$().observe");

    if (_$_observe) {
      (async () => {
        let moderationItemParent = await WaitForElement(selectors.moderationItemParent);

        moderationItemParent[0].classList.add("sg-actions-list", "sg-actions-list--space-between");
        $(moderationItemParent).observe('added', 'div.moderation-item:not(.ext-buttons-added)', e => {
          createQuickDeleteButtons(e.addedNodes);
        });

        let e = await WaitForElement('div.moderation-item:not(.ext-buttons-added)', true);
        createQuickDeleteButtons(e);
      })();

      $("#toplayer").observe('added', '.moderation-toplayer', e => {
        manipulateModPanel(e.addedNodes[0])
      });
    }
  }

  /**
   * Right/Left arrow actions for toplayers
   */

  const nextObjFound = (nextObj, objContenerMod) => {
    if (nextObj) {
      //objZ.closeTicket();
      objContenerMod.elements.close.click();
      $('#toplayer, #toplayer > div.contener-center.mod').show();
      //nextObj.openToplayer();
      nextObj.elements.openToplayerButton.click();
    }
  }
  let findNext = async (k, action, objContenerMod) => {
    let currentObj = Zadanium.moderation.all.createdObjects[k];

    if (currentObj) {
      if (currentObj.data.disabled) {
        ;
        findNext(action == "previousReport" ? --k : ++k, action, objContenerMod);
      } else {
        nextObjFound(currentObj, objContenerMod);
      }
    } else {
      if (action == "next") {
        let loaderMsg = $("#moderation-all > div.content > div.loader.calm > div.loadMore").text();

        objContenerMod.elements.close.click();
        $('#toplayer, #toplayer > div.contener-center.mod').show();

        Zadanium.moderation.all.getContent();

        let _createdObject = await WaitForObject(`Zadanium.moderation.all.createdObjects[${Zadanium.moderation.all.createdObjects.length + 1}]`);

        if (_createdObject) {
          findNext(k, action, objContenerMod);

        };

        let _msgText = await WaitForObject(`
				let msgText = $("#moderation-all > div.content > div.loader.calm > div.loadMore").text();
				(msgText!= "" && msgText != "${loaderMsg}") || undefined
			`);

        if (_$_observe) {
          objContenerMod.elements.close.click();
        }
      } else {
        objContenerMod.elements.close.click();
      }
    }
  }
  let toplayer = await WaitForElement("#toplayer");
  let $toplayer = $(toplayer);

  const switchModerate = function(e) {
    if (typeof e == "string" || e.target.classList.contains("moderation")) {
      let action = "";

      if (typeof e == "string") {
        action = e;
      } else {
        let toplayerOffset = e.offsetX;
        let arrowOffset = e.target.offsetWidth;

        if (toplayerOffset > arrowOffset) {
          action = "next";
        } else if (toplayerOffset < 0) {
          action = "previousReport"
        }
      }

      if (action != "") {
        let $contenerMod = $(".contener-center.mod", toplayer);
        let objContenerMod = Zadanium.getObject($contenerMod.attr("objecthash"));

        if (action == "closePanel") {
          objContenerMod.elements.close.click();
        } else {
          let $moderationToplayer = $(".moderation-toplayer:visible", toplayer);
          let objZ = Zadanium.getObject($moderationToplayer.attr("objecthash"));
          let taskId = objZ.data.task.id;

          Zadanium.moderation.all.createdObjects.forEach((obj, i) => {
            if (obj.data.task_id == taskId) {
              findNext(action == "previousReport" ? i - 1 : i + 1, action, objContenerMod);
            }
          });
        }
      }
    }
  };

  $toplayer.on('mouseup', 'div.contener.mod.moderation', switchModerate);
  $("body").on("keyup", function(e) {
    if (
      $toplayer.is(':visible') &&
      !(
        /textarea|input/gi.exec(e.target.type)
      )
    ) {
      if (e.keyCode === 65 || e.keyCode === 37) { // A
        switchModerate("previousReport");
      } else if (e.keyCode === 68 || e.keyCode === 39) { // D
        switchModerate("next");
      } else if (e.keyCode === 27) { // ESC
        switchModerate("closePanel");
      }
    }
  });
}
