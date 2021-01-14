import Brainly, { PHPTokens } from "./Brainly";

export type BanTypeType = 1 | 2 | 3 | 4 | 5 | 6;

export default async function BanUser(
  userId: number,
  /**
   * ```
   * 1 - Tutorial
   * 2 - 15 minutes
   * 3 - 60 minutes
   * 4 - 12 hours
   * 5 - 24 hours
   * 6 - 48 hours
   * ```
   */
  banType: BanTypeType,
  tokens?: PHPTokens,
) {
  const brainly = new Brainly();
  const data = await brainly.SetFormTokens(
    System.createProfileLink(userId, "a", true),
    { tokens },
  );

  data["data[UserBan][type]"] = banType;

  return brainly.bans().ban().P(userId).Form().Salt().POST(data);
}
