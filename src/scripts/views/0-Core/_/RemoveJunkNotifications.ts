// https://stackoverflow.com/questions/23223718#answer-45725439
import cookie from "js-cookie";
import jsesc from "jsesc";

const notifications = [
  // en - hi,ro,ph,id
  "Too many users meet",
  // ru
  "Занадто багато користувачів відповідає",
  // fr
  "Trop d'utilisateurs correspondent aux",
  // tr
  "Bir çok kullanıcı bu istekle",
  // pl
  "Zbyt wielu użytkoników spełnia",
  // pt
  "Muitos usuários cumprem este",
  // es
  "Demasiados usuarios cumplen este",
];

const ignoredNotificationExpression = new RegExp(notifications.join("|"), "i");

export default function RemoveJunkNotifications() {
  let infoBarBase64 = cookie.get("Zadanepl_cookie[infobar]");

  if (!infoBarBase64 || infoBarBase64 === "null") return;

  let infoBarStr = atob(infoBarBase64);
  let infoBar: {
    text: string;
    class: string;
    layout: string;
  }[] = JSON.parse(infoBarStr);

  if (!infoBar) return;

  infoBar = infoBar.filter(
    (entry, index, self) =>
      !entry.text.match(ignoredNotificationExpression) &&
      index === self.findIndex(nextEntry => nextEntry.text === entry.text),
  );

  infoBarStr = jsesc(infoBar, {
    quotes: "double",
  });

  infoBarBase64 = btoa(infoBarStr);

  // cookie.set("Zadanepl_cookie[infobar]", infoBarBase64);
  document.cookie = `Zadanepl_cookie[infobar]=${infoBarBase64}; path=/`;
}
