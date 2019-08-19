export default () => {
  let $chat = $(`<script id="${System.data.config.marketConfig.chatango.id}" data-cfasync="false" async src="//st.chatango.com/js/gz/emb.js" style="width: 300px;height: 300px;">{"handle":"${System.data.config.marketConfig.chatango.handle}","arch":"js","styles":{"a":"4fb3f6","b":100,"c":"ffffff","d":"020a1b","k":"4fb3f6","l":"4fb3f6","m":"4fb3f6","p":"10","q":"4fb3f6","r":100,"usricon":0.95,"pos":"br","cv":1,"cvfnt":"Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif, sans-serif","cvbg":"4fb3f6","cvw":200,"cvh":28,"ticker":1,"surl":0,"cnrs":"0.16"}}</script>`).appendTo("body");
  console.log($chat);
}
