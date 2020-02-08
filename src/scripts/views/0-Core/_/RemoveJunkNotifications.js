import { Base64 } from 'js-base64';
import cookie from "js-cookie";

export default function RemoveJunkNotifications() {
  let infoBarBase64 = cookie.get("Zadanepl_cookie[infobar]");
  let notifications = [
    "Too many users meet", // en
    "Занадто багато користувачів відповідає", // ru
    "Trop d'utilisateurs correspondent aux", // fr
    "Bir çok kullanıcı bu istekle", // tr
    "Zbyt wielu użytkoników spełnia", // pl
    "Muitos usuários cumprem este", // pt
    "Demasiados usuarios cumplen este", // es
  ];

  if (notifications.length == 0)
    return;

  if (
    infoBarBase64 !== null &&
    (
      typeof infoBarBase64 === 'string' &&
      infoBarBase64.length > 1 &&
      infoBarBase64 !== 'null'
    )
  ) {
    let infoBarStr = Base64.decode(infoBarBase64);
    /**
     * @type {{
     *  text: string
     * }[]}
     */
    let infoBar = JSON.parse(infoBarStr);

    if (infoBar) {
      let ClearNotificationData = (entry, i) => {
        notifications.forEach(notification => {
          if (
            entry &&
            entry.text &&
            typeof entry.text == "string" &&
            notification &&
            entry.text.includes(notification)
          ) {
            infoBar.splice(i, 1);
          }
        })
      };

      if (infoBar instanceof Array)
        infoBar.forEach(ClearNotificationData)

      infoBarStr = JSON.stringify(infoBar);
      infoBarBase64 = Base64.encode(infoBarStr)
      //cookie.set("Zadanepl_cookie[infobar]", infoBarBase64);
      document.cookie = `Zadanepl_cookie[infobar]=${infoBarBase64}; path=/`;

    }
  }
}
