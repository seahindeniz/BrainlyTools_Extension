"use strict";

import Storage from "../helpers/extStorage";
import Notification from "../components/Notification";
import { GetDeleteReasons } from "../controllers/ActionsOfServer"

const prepareDeleteButtonSettings = (callback) => {
	Storage.get("quickDeleteButtonsReasons", quickDeleteButtonsReasons => {
		if (quickDeleteButtonsReasons) {
			System.data.config.quickDeleteButtonsReasons = quickDeleteButtonsReasons;
			callback();
		} else {
			Storage.setL({
				quickDeleteButtonsReasons: System.data.config.marketConfig.quickDeleteButtonsDefaultReasons
			}, () => {
				System.data.config.quickDeleteButtonsReasons = System.data.config.marketConfig.quickDeleteButtonsDefaultReasons;
				callback();
			});
		}
	});
}
const prepareDeleteReasonsWithGet = (callback) => {
	GetDeleteReasons(data => {
		if (data.deleteReasons.empty) {
			Notification(System.data.locale.core.notificationMessages.cantFetchDeleteReasons, "error");
		} else {
			let deleteReasonsKeys = Object.keys(data.deleteReasons);
			data.deleteReasons.__withTitles = {};
			data.deleteReasons.__withIds = {
				__all: {}
			};
			data.deleteReasons.__preferences = data.preferences;

			deleteReasonsKeys.forEach(reasonKey => {
				let categories = data.deleteReasons[reasonKey];
				data.deleteReasons.__withTitles[reasonKey] = {
					__categories: {}
				};
				data.deleteReasons.__withIds[reasonKey] = {
					__categories: {}
				};

				categories.forEach(category => {
					data.deleteReasons.__withTitles[reasonKey].__categories[category.id] = category;
					data.deleteReasons.__withIds[reasonKey].__categories[category.id] = category;
					data.deleteReasons.__withIds.__all[category.id] = { ...category };

					if (category && category.subcategories) {
						category.subcategories.forEach(subcategory => {
							subcategory.category_id = category.id;
							let title = subcategory.title == "" ? category.text : subcategory.title;
							title = title.trim();
							data.deleteReasons.__withTitles[reasonKey][title] = subcategory;
							data.deleteReasons.__withIds[reasonKey][subcategory.id] = subcategory;
							data.deleteReasons.__withIds.__all[subcategory.id] = { ...subcategory, type: reasonKey };
						});
					}
				});
			});
			Storage.setL({ deleteReasons: data.deleteReasons }, () => {
				System.data.Brainly.deleteReasons = data.deleteReasons;
				callback && prepareDeleteButtonSettings(callback)
			});
		}
	});
};
const prepareDeleteReasons = (callback, reload = false) => {
	Storage.getL("deleteReasons", res => {
		if (res && !reload) {
			System.data.Brainly.deleteReasons = res;

			prepareDeleteButtonSettings(callback)
			prepareDeleteReasonsWithGet();
		} else {
			prepareDeleteReasonsWithGet(callback);
		}
	});
}

export default prepareDeleteReasons;
