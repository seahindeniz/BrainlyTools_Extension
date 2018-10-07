export default () => {
	$("body").append(`<script id="${System.data.config.marketConfig.chatango.id}" data-cfasync="false" async src="//st.chatango.com/js/gz/emb.js" style="width: 300px;height: 300px;">{"handle":"${System.data.config.marketConfig.chatango.handle}","arch":"js","styles":{"a":"57b2f8","b":100,"c":"ffffff","d":"020a1b","k":"57b2f8","l":"57b2f8","m":"57b2f8","p":"10","q":"57b2f8","r":100,"usricon":0.95,"pos":"br","cv":1,"cvfnt":"Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif, sans-serif","cvbg":"57b2f8","cvw":59,"cvh":28,"surl":0,"cnrs":"0.16"}}</script>`);

}
