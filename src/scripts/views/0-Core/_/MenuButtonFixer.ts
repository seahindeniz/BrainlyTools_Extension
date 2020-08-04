import WaitForElement from "@/scripts/helpers/WaitForElement";

async function MenuButtonFixer() {
  const menuButton = await WaitForElement(".mint-hide-for-desktop", {
    noError: true,
  });
  const $menuButton = $(menuButton);
  const $menu = $menuButton.prev();
  // let $searchInput = $menu.prev();

  $menuButton.on("click", function () {
    if ($menu.is(".mint-hide-for-mobile")) {
      $menu.removeClass("mint-hide-for-mobile");
      // $searchInput.addClass("mint-hide-for-mobile");
    } else {
      $menu.addClass("mint-hide-for-mobile");
      // $searchInput.removeClass("mint-hide-for-mobile");
    }
  });
}

export default MenuButtonFixer;
