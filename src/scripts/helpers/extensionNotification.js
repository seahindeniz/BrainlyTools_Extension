"use strict";

import ext from "../utils/ext";

let createdNotifications = {}
let findNotification = (notificationId, deleteIt) => {
  let ids = Object.keys(createdNotifications);
  let result = undefined;

  for (let i = 0, owner;
    (owner = createdNotifications[ids[i]]); i++) {

    let types = Object.keys(owner);

    for (let k = 0, type;
      (type = types[k]); k++) {
      let notification = owner[type]

      if (notificationId == notification.notificationId) {
        if (deleteIt) {
          delete createdNotifications[ids[i]][type];
          return true;
        }

        result = createdNotifications[ids[i]][type];
      }
    }
  }

  return result;
}
const notificationClosed = function(notificationId, byUser) {
  findNotification(notificationId, true);
}

ext.notifications.onClosed.addListener(notificationClosed);
ext.notifications.onButtonClicked.addListener(async (notificationId, i) => {
  let notification = findNotification(notificationId);
  console.log("notification:", notification);

  if (notification && notification.buttons && notification.buttons[i] && notification.buttons_evt[i] && (notification.buttons_evt[i].fullPath || notification.buttons_evt[i].origin)) {
    let evt = notification.buttons_evt[i];

    if (evt.fullPath) {
      /**
       * Check for if specified url.origin exist on opened tabs
       */
      let tabs = await ext.tabs.query({
        url: evt.fullPath + "*"
      });
      console.log(tabs);
      /**
       * Check for if specified url.origin+path exist on tabs
       */
      let findTargettedUrl = tabs.find(tab => tab.url == evt.fullPath);

      if (findTargettedUrl) {
        /**
         * If exist, show it to user
         */
        ext.tabs.update(findTargettedUrl.id, {
          active: true
        });
        ext.windows.update(findTargettedUrl.windowId, {
          focused: true
        });
      } else {
        /**
         * If it's not exist, create a new tab and show it to user
         */
        ext.tabs.create({
          url: evt.fullPath
        }, tab => {
          ext.windows.update(tab.windowId, {
            focused: true
          });
        });
      }
      ext.notifications.clear(notificationId);
    } else {
      /**
       * Check for if specified url.origin exist on opened tabs
       */
      let tabs = await ext.tabs.query({
        url: evt.origin + "*"
      });
      console.log(tabs);
      /**
       * Check for if specified url.origin+path exist on tabs
       */
      let findTargettedUrl = tabs.find(tab => tab.url == (evt.origin + evt.path));

      if (findTargettedUrl) {
        /**
         * If exist, show it to user
         */
        ext.tabs.update(findTargettedUrl.id, {
          active: true
        });
        ext.windows.update(findTargettedUrl.windowId, {
          focused: true
        });
      } else if (tabs.length > 0) {
        /**
         * If exist, open url the with origin+path and show it to user
         */
        let tab = tabs[0];

        ext.tabs.update(tab.id, {
          active: true,
          url: evt.origin + evt.path
        });
        ext.windows.update(tab.windowId, {
          focused: true
        });
      } else {
        /**
         * If it's not exist, create a new tab and show it to user
         */
        ext.tabs.create({
          url: evt.origin + evt.path
        }, tab => {
          ext.windows.update(tab.windowId, {
            focused: true
          });
        });
      }
      ext.notifications.clear(notificationId);
    }
  }
});
const createNotify = async (opt, options) => {
  try {
    console.log("createNotifyoptions:", options);
    console.log(chrome.notifications.create(options));
    console.log(ext.notifications.create(options));
    let notificationId = await ext.notifications.create(options);
    console.log("notificationId:", notificationId);
    let createdNotificationOwner = createdNotifications[opt.id];

    /**
     * Refactor data for storing in the createdNotifications
     */
    let notificationData = {
      nick: opt.nick,
      time: opt.time,
      title: opt.title,
      message: opt.message
    }
    let notification = {
      notificationId,
      iconUrl: opt.iconUrl,
      data: [notificationData]
    }

    if (opt.buttons) {
      notification.buttons = opt.buttons
    }

    if (opt.buttons_evt) {
      notification.buttons_evt = opt.buttons_evt
    }

    if (!createdNotificationOwner) {
      createdNotifications[opt.id] = {
        [opt.type]: notification
      };
    } else {
      let createdNotificationType = createdNotificationOwner[opt.type];

      if (!createdNotificationType) {
        createdNotificationOwner[opt.type] = notification;
      } else {
        createdNotificationType.notificationId = notificationId;

        if (createdNotificationType.data.length > 5) {
          //let temp = [...createdNotificationType.data].reverse();
          let temp = createdNotificationType.data.slice().reverse();
          createdNotificationType.data = [];

          for (let i = 0; i < 3; i++) {
            let data = temp[i];
            createdNotificationType.data.unshift(data);
          }
        }

        createdNotificationType.data.push(notificationData);
      }
    }
    console.log(createdNotifications);
  } catch (error) {
    console.error(error);
  }
}
let previousNotifications = opt => {
  let notificationsList = [];

  let createdNotificationOwner = createdNotifications[opt.id];

  if (createdNotificationOwner) {
    let createdNotificationType = createdNotificationOwner[opt.type];

    if (createdNotificationType) {
      notificationsList = createdNotificationType;
    }
  }

  return notificationsList;
}
export default async (opt) => {
  let notificationsList = previousNotifications(opt);
  let options;

  if (!opt.time) {
    opt.time = new Date().toLocaleTimeString(navigator.language, {
      hour: "numeric",
      minute: "numeric"
    }).replace(" ", "");
  }

  if (notificationsList && notificationsList.data && notificationsList.data.length > 0) {
    options = {
      type: "list",
      title: opt.title,
      iconUrl: opt.iconUrl || "../icons/icon48.png",
      message: "",
      items: []
    };

    if (opt.buttons) {
      options.buttons = opt.buttons
    }

    ext.notifications.clear(notificationsList.notificationId);

    notificationsList.data.forEach(data => {
      options.items.push({
        title: data.time,
        message: data.message
      });
    });

    options.items.push({
      title: opt.time,
      message: opt.message
    })
  } else {
    options = {
      type: "basic",
      title: opt.title,
      message: opt.message,
      iconUrl: opt.iconUrl || "../icons/icon48.png"
    };

    if (opt.buttons) {
      options.buttons = opt.buttons
    }

    notificationsList.push(opt);
  }
  options.requireInteraction = true;

  console.log(options, opt);
  if (!opt.buttons_evt) {
    createNotify(opt, options);
  } else {
    let tabs = await ext.tabs.query({
      url: (opt.buttons_evt[0].fullPath || opt.buttons_evt[0].origin + opt.buttons_evt[0].path),
      active: true
    });
    console.log("tabs:", tabs);
    if (!tabs || tabs.length == 0) {
      createNotify(opt, options);
    } else {
      tabs.forEach(async (tab) => {
        let Window = await ext.windows.get(tab.windowId);

        if (!Window.focused) {
          createNotify(opt, options);
        }
      });
    }
  }
}
