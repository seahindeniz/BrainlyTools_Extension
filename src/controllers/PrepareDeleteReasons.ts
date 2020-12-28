/* eslint-disable no-underscore-dangle */
import notification from "@components/notification2";
import ServerReq from "@ServerReq";
import storage from "../helpers/extStorage";

async function GetAndPrepareDeleteReasons() {
  const resDeleteReasons = await new ServerReq().GetDeleteReasons();
  const { data } = resDeleteReasons;

  if (data.deleteReasons.empty) {
    notification({
      type: "error",
      html: System.data.locale.core.notificationMessages.cantFetchDeleteReasons,
    });

    return Promise.reject(
      System.data.locale.core.notificationMessages.cantFetchDeleteReasons,
    );
  }

  data.deleteReasons.question = data.deleteReasons.task;
  data.deleteReasons.answer = data.deleteReasons.response;
  delete data.deleteReasons.task;
  delete data.deleteReasons.response;

  const deleteReasonsKeys = Object.keys(data.deleteReasons);

  data.deleteReasons.__withTitles = {};
  data.deleteReasons.__withIds = { __all: {}, __reason: {}, __subReason: {} };
  data.deleteReasons.__preferences = data.preferences;

  deleteReasonsKeys.forEach(reasonKey => {
    const categories = data.deleteReasons[reasonKey];

    data.deleteReasons.__withTitles[reasonKey] = {
      __categories: {},
    };
    data.deleteReasons.__withIds[reasonKey] = {
      __categories: {},
    };

    categories.forEach(category => {
      data.deleteReasons.__withTitles[reasonKey].__categories[
        category.id
      ] = category;
      data.deleteReasons.__withIds[reasonKey].__categories[
        category.id
      ] = category;

      const categoryData = {
        ...category,
      };

      data.deleteReasons.__withIds.__all[category.id] = categoryData;
      data.deleteReasons.__withIds.__reason[category.id] = categoryData;

      if (category && category.subcategories) {
        category.subcategories.forEach(subcategory => {
          subcategory.category_id = category.id;

          let title =
            subcategory.title === "" ? category.text : subcategory.title;

          title = title.trim();
          data.deleteReasons.__withTitles[reasonKey][title] = subcategory;
          data.deleteReasons.__withIds[reasonKey][subcategory.id] = subcategory;

          const subReasonData = {
            ...subcategory,
            type: reasonKey,
          };

          data.deleteReasons.__withIds.__all[subcategory.id] = subReasonData;
          data.deleteReasons.__withIds.__subReason[
            subcategory.id
          ] = subReasonData;
        });
      }
    });
  });

  storage("setL", { deleteReasons: data.deleteReasons });

  return Promise.resolve(data.deleteReasons);
}

async function PrepareDeleteButtonSettings() {
  let quickDeleteButtonsReasons = await storage(
    "get",
    "quickDeleteButtonsReasons",
  );

  if (!quickDeleteButtonsReasons) {
    quickDeleteButtonsReasons =
      System.data.config.marketConfig.quickDeleteButtonsDefaultReasons;
    // await storage("set", { quickDeleteButtonsReasons });
  }

  System.data.config.quickDeleteButtonsReasons = quickDeleteButtonsReasons;
}

export default async function prepareDeleteReasons(reload = false) {
  let deleteReasons = await storage("getL", "deleteReasons");

  if (System.data.config.extension.env === "development")
    System.Log(deleteReasons);

  if (!deleteReasons || reload) {
    deleteReasons = await GetAndPrepareDeleteReasons();
  } else {
    GetAndPrepareDeleteReasons();
  }

  await PrepareDeleteButtonSettings();

  System.data.Brainly.deleteReasons = deleteReasons;

  System.changeBadgeColor("loaded");
}
