import { GetMe } from "@BrainlyReq";
import storage from "../../../../helpers/extStorage";
import WaitForObject from "../../../../helpers/WaitForObject";

async function PrepareUserData() {
  const resUser = await GetMe();

  if (resUser.success === false) return undefined;

  const storageData = { user: resUser.data };

  await storage("set", storageData);

  return storageData;
}

export default async function SetUserData() {
  const userLayer = await WaitForObject(() => {
    if (window.dataLayer?.length < 2) return undefined;

    return window.dataLayer?.find(layer => layer.user) ?? undefined;
  });

  if (!userLayer?.user?.isLoggedIn) {
    console.error(window.dataLayer);
    throw Error("Invalid user data. Maybe not logged in?");
  }

  System.data.meta.storageKey = `${System.data.meta.marketName}_${userLayer.user.id}`;

  let res = await storage("get", [
    "user",
    "themeColor",
    "extendMessagesLayout",
  ]);

  if (Number(res?.user?.user?.id) !== Number(userLayer.user.id))
    res = await PrepareUserData();
  else {
    PrepareUserData();
  }

  System.data.Brainly.userData = res.user;

  System.Log("SetUserData OK!");

  return res;
}
