export default (text, type = "success") => {
	let $notify = $(`<div class="notification is-${type}">${text}</div>`);
	$notify.prependTo('.notification-list');
	setTimeout(() => $notify.slideUp(), 3000);
	$notify.click(function() {
		$(this).slideUp("normal", function() { this.remove(); });
	});
	return true;
}
