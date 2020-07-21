// https://stackoverflow.com/questions/23223718#answer-45725439
import { Base64 } from "js-base64";
import cookie from "js-cookie";

// @flow strict

const notifications = [
  // en
  "Too many users meet",
  "Added rank",
  "All special ranks of the user have been deleted",
  // ru
  "Занадто багато користувачів відповідає",
  // fr
  "Trop d'utilisateurs correspondent aux",
  // tr
  "Bir çok kullanıcı bu istekle",
  "Bütün özel kullanıcı sıralamaları silindi",
  "Eklenmiş sıralama",
  // pl
  "Zbyt wielu użytkoników spełnia",
  "Użytkownikowi usunięto wszystkie rangi specjalne",
  "Ranga dodana",
  // pt
  "Muitos usuários cumprem este",
  // es
  "Demasiados usuarios cumplen este",
];

const ignoredNotificationExpression = new RegExp(notifications.join("|"), "i");

export default function RemoveJunkNotifications() {
  let infoBarBase64 = cookie.get("Zadanepl_cookie[infobar]");

  if (!infoBarBase64 || infoBarBase64 === "null") return;

  console.log(infoBarBase64);

  let infoBarStr = Base64.decode(infoBarBase64);
  let infoBar: {
    text: string,
    class: string,
    layout: string,
  }[] = JSON.parse(infoBarStr);

  if (!infoBar) return;

  if (infoBar instanceof Array)
    infoBar = infoBar
      .map(entry => {
        if (
          !entry?.text ||
          typeof entry.text !== "string" ||
          entry.text.match(ignoredNotificationExpression)
        )
          return undefined;

        return entry;
      })
      .filter(Boolean);

  infoBarStr = JSON.stringify(infoBar);
  infoBarBase64 = Base64.encode(infoBarStr);
  // cookie.set("Zadanepl_cookie[infobar]", infoBarBase64);
  document.cookie = `Zadanepl_cookie[infobar]=${infoBarBase64}; path=/`;
}
