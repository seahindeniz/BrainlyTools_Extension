import Action from "@BrainlyAction";

/**
 * Prepare and fetch friends for System
 */
export default async function fetchFriends() {
  const res = await new Action().AllFriends();

  if (!res) throw Error("I couldn't fetch user's friends from Brainly");

  System.friends = res;
}
