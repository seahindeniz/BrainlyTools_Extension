import Brainly from "./Brainly";

export default async function GetProfilePage(id: number): Promise<string> {
  return new Brainly()
    .XReqWith()
    .P(System.createProfileLink(id, undefined, true))
    .GET();
}
