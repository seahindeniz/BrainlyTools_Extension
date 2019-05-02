import Action from "../../../controllers/Req/Brainly/Action";

/**
 * Prepare and fetch friends for System
 */
export default function fetchFriends() {
  return new Promise(async (resolve, reject) => {
    let res = await new Action().AllFriends();

    if (!res) {
      reject("I couldn't fetch user's friends from Brainly");

      return false;
    }

    System.friends = res;

    resolve();
  });
}
