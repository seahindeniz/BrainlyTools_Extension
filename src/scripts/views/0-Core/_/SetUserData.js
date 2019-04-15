import WaitForObject from "../../../helpers/WaitForObject";
import storage from "../../../helpers/extStorage";

async function fetchUserData() {
  let response = await fetch("/api/28/api_users/me");
  let data = await response.json();

  return data;
}

async function PrepareUserData() {
  let user = await fetchUserData();
  let storageData = { user: user.data };

  await storage("set", storageData);

  return storageData;
}

export default function SetUserData() {
  return new Promise(async (resolve, reject) => {

    let _dataLayer = await WaitForObject("window.dataLayer");

    if (_dataLayer && _dataLayer[0] && _dataLayer[0].user && _dataLayer[0].user.isLoggedIn) {
      System.data.meta.storageKey = System.data.meta.marketName + "_" + ((window.dataLayer && window.dataLayer.length > 0 && window.dataLayer[0].user.id));

      let res = await storage("get", ["user", "themeColor", "extendMessagesLayout"]);

      if (!(res && res.user && res.user.user && res.user.user.id && res.user.user.id == _dataLayer[0].user.id)) {
        res = await PrepareUserData();
      } else {
        PrepareUserData();
      }

      System.data.Brainly.userData = res.user;

      resolve(res);
      Console.info("SetUserData OK!");
    } else {
      Console.error("User data error. Maybe not logged in", _dataLayer);
      reject();
    }
  });
}
