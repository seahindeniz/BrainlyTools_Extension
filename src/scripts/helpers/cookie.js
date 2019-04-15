export default {
  set: function(key, value, time) {
    let expires;
    if (time) {
      let date = new Date();
      date.setTime(date.getTime() + (time * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
    } else
      expires = "";
    document.cookie = key + "=" + value + expires + "; path=/";
  },
  remove: function(key) {
    this.create(key, "", -1);
  },
  get: function(key) {
    let keyX = key + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(keyX) == 0) return c.substring(keyX.length, c.length);
    }
    return null;
  }
}
