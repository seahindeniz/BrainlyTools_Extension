export default $dropdown => {
  $("body").on("click", () => {
    $dropdown.removeClass("is-active");
  });
  $dropdown
    .on("click", ".dropdown-trigger", function (e) {
      e.stopPropagation();

      $dropdown.toggleClass("is-active");
    })
    .on("click", ".dropdown-menu .dropdown-item", function (e) {
      e.preventDefault();

      const $lastActive = $(".is-active", $dropdown);
      const $trigger = $(".dropdown-trigger", $dropdown);
      const $buttonText = $("button.button > span:not(.icon)", $trigger);
      const value = this.getAttribute("value") || this.innerHTML;

      this.classList.add("is-active");
      $lastActive.removeClass("is-active");
      $buttonText.text(this.innerHTML.replace(/<.*>/, ""));
      $dropdown.val(value);
      $dropdown.change();
    });

  return $dropdown;
};
