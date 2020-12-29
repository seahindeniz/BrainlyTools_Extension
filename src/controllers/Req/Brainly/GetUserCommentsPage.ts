import Brainly from "./Brainly";

export default async function GetUserCommentsPage(
  id: number | string,
): Promise<string> {
  return new Brainly()
    .XReqWith()
    .users()
    .user_content()
    .P(id)
    .comments_tr()
    .GET();
}
