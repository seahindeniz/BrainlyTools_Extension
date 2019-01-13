import WaitForElement from "../../../helpers/WaitForElement";

async function MenuButtonFixer() {
	let menuButton = await WaitForElement(".mint-hide-for-desktop", true);
	let $menuButton = $(menuButton);
	let $menu = $menuButton.prev();
	//let $searchInput = $menu.prev();

	$menuButton.on("click", function() {
		if ($menu.is(".mint-hide-for-mobile")) {
			$menu.removeClass("mint-hide-for-mobile");
			//$searchInput.addClass("mint-hide-for-mobile");
		} else {
			$menu.addClass("mint-hide-for-mobile");
			//$searchInput.removeClass("mint-hide-for-mobile");
		}
	});
}

export default MenuButtonFixer;
