"use strict";

import storage from "../helpers/extStorage";
import notification from "../components/notification";
import { GetDeleteReasons } from "../controllers/ActionsOfServer";

export default function prepareDeleteReasons(reload = false) {
	return new Promise(async (resolve, reject) => {
		try {
			let deleteReasons = await storage("getL", "deleteReasons");

			if (!deleteReasons || reload) {
				deleteReasons = await GetAndPrepareDeleteReasons();
			} else {
				GetAndPrepareDeleteReasons();
			}

			await PrepareDeleteButtonSettings();

			System.data.Brainly.deleteReasons = deleteReasons;

			System.changeBadgeColor("loaded");
			resolve();
		} catch (error) {
			reject(error);
		}
	});
}

async function GetAndPrepareDeleteReasons() {
	let resDeleteReasons = await GetDeleteReasons();
	let data = resDeleteReasons.data;

	if (data.deleteReasons.empty) {
		notification(System.data.locale.core.notificationMessages.cantFetchDeleteReasons, "error");
		return Promise.reject(System.data.locale.core.notificationMessages.cantFetchDeleteReasons);
	}

	let deleteReasonsKeys = Object.keys(data.deleteReasons);
	data.deleteReasons.__withTitles = {};
	data.deleteReasons.__withIds = { __all: {} };
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

	storage("setL", { deleteReasons: data.deleteReasons });

	return Promise.resolve(data.deleteReasons);
};

async function PrepareDeleteButtonSettings() {
	try {
		let quickDeleteButtonsReasons = await storage("get", "quickDeleteButtonsReasons");

		if (!quickDeleteButtonsReasons) {
			quickDeleteButtonsReasons = System.data.config.marketConfig.quickDeleteButtonsDefaultReasons;
			//await storage("set", { quickDeleteButtonsReasons });
		}

		System.data.config.quickDeleteButtonsReasons = quickDeleteButtonsReasons;

		return Promise.resolve();
	} catch (error) {
		console.error(error);
		return Promise.reject(error);
	}
}
