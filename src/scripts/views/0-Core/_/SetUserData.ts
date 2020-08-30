import WaitForObject from "../../../../helpers/WaitForObject";
import storage from "../../../../helpers/extStorage";

async function fetchUserData() {
  const response = await fetch("/api/28/api_users/me");
  const data = await response.json();

  return data;
}

async function PrepareUserData() {
  const user = await fetchUserData();
  const storageData = { user: user.data };

  await storage("set", storageData);

  return storageData;
}

export default async function SetUserData() {
  const dataLayer = await WaitForObject("window.dataLayer");

  if (!dataLayer[0]?.user?.isLoggedIn) {
    console.error(dataLayer);
    throw Error("User data error. Maybe not logged in");
  }

  System.data.meta.storageKey = `${System.data.meta.marketName}_${
    window.dataLayer &&
    window.dataLayer.length > 0 &&
    window.dataLayer[0].user.id
  }`;

  let res = await storage("get", [
    "user",
    "themeColor",
    "extendMessagesLayout",
  ]);

  if (Number(res?.user?.user?.id) !== Number(dataLayer[0].user.id))
    res = await PrepareUserData();
  else {
    PrepareUserData();
  }

  System.data.Brainly.userData = res.user;

  System.Log("SetUserData OK!");
  return res;
}
