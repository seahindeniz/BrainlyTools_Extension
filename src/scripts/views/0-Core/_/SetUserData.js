import WaitForObject from "../../../helpers/WaitForObject";
import Storage from "../../../helpers/extStorage";

const fetchUserData = (reject, resolve) => {
	var url = "/api/28/api_users/me";
	var xhr = new XMLHttpRequest();

	xhr.open('GET', url, true)
	xhr.onload = function() {
		var json = JSON.parse(xhr.responseText);
		if (xhr.readyState == 4 && xhr.status == "200") {
			if (json.success && json.success == true) {
				//System.data.Brainly.userData = json.data;
				Storage.set({ user: json.data }, function() {
					resolve && resolve({ user: json.data });
				});
			} else {
				Console.warn("You need to sign in");
				reject();
			}
		} else {
			Console.error(json);
			reject();
		}
	}
	xhr.send(null);
}

export default function SetUserData() {
	return new Promise(async (resolve, reject) => {

		let _dataLayer = await WaitForObject("window.dataLayer");

		if (_dataLayer && _dataLayer[0] && _dataLayer[0].user && _dataLayer[0].user.isLoggedIn) {
			Storage.get(["user", "themeColor", "extendMessagesLayout"], res => {
				if (res && res.user && res.user.user && res.user.user.id && res.user.user.id == _dataLayer[0].user.id) {
					//callback && callback(res);
					resolve(res);
					fetchUserData(reject);
				} else {
					fetchUserData(reject, resolve);
				}
			});
		} else {
			Console.error("User data error. Maybe not logged in", _dataLayer);
			reject();
		}
	});
}
