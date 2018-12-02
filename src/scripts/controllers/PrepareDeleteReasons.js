"use strict";

import Storage from "../helpers/extStorage";
import notification from "../components/Notification";
import { GetDeleteReasons } from "../controllers/ActionsOfServer"

function prepareDeleteButtonSettings(resolve, reject) {
	Storage.get("quickDeleteButtonsReasons", quickDeleteButtonsReasons => {
		if (quickDeleteButtonsReasons) {
			System.data.config.quickDeleteButtonsReasons = quickDeleteButtonsReasons;
			resolve();
		} else {
			try {
				Storage.set({
					quickDeleteButtonsReasons: System.data.config.marketConfig.quickDeleteButtonsDefaultReasons
				}, () => {
					System.data.config.quickDeleteButtonsReasons = System.data.config.marketConfig.quickDeleteButtonsDefaultReasons;
					resolve();
				});
			} catch (error) {
				reject(error);
			}
		}
	});
}

function prepareDeleteReasonsWithGet() {
	return new Promise(async (resolve, reject) => {
		let res = await GetDeleteReasons();
		let data = res.data;

		if (data.deleteReasons.empty) {
			notification(System.data.locale.core.notificationMessages.cantFetchDeleteReasons, "error");
			reject(System.data.locale.core.notificationMessages.cantFetchDeleteReasons);
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
				resolve(data.deleteReasons);
			});
		}
	});
};

export default function prepareDeleteReasons(reload = false) {
	return new Promise((resolve, reject) => {
		Storage.getL("deleteReasons", async res => {
			if (res && !reload) {
				System.data.Brainly.deleteReasons = res;

				prepareDeleteButtonSettings(resolve, reject);
				System.changeBadgeColor("loaded");
				prepareDeleteReasonsWithGet();
			} else {
				let deleteReasons = await prepareDeleteReasonsWithGet();
				System.data.Brainly.deleteReasons = deleteReasons;

				prepareDeleteButtonSettings(resolve, reject);
				System.changeBadgeColor("loaded");
			}
		});
	});
}
