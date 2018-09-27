import makeToplayer from "../Toplayer"
let create_toplayer = (heading, content, actions, addAfter = "") => {
	let $toplayerContainer = $(`
	<div class="js-moderate-modal">
		<div class="sg-overlay"></div>
	</div>`);
	$(".sg-overlay", $toplayerContainer).append(makeToplayer("medium", heading, content, actions, addAfter))
	/*$(".sg-toplayer__close", $toplayerContainer).click(function () {
		$(this).parents(".js-moderate-modal").remove();
	});*/
	return $toplayerContainer;
}
export default create_toplayer;
