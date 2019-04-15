import { getAllFriends } from "../../../controllers/ActionsOfBrainly";

/**
 * Prepare and fetch friends for System
 */
export default function fetchFriends() {
  return new Promise(async (resolve, reject) => {
    let res = await getAllFriends();

    if (!res) {
      reject("I couldn't fetch user's friends from Brainly");

      return false;
    }

    System.friends = res;

    resolve();
  });
}
