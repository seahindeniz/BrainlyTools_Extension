export default $dropdown => {
  $("body").on("click", () => {
    $dropdown.removeClass("is-active");
  });
  $dropdown
    .on("click", ".dropdown-trigger", function(e) {
      e.stopPropagation();

      $dropdown.toggleClass("is-active");
    })
    .on("click", ".dropdown-menu .dropdown-item", function(e) {
      e.preventDefault();

      let $lastActive = $(".is-active", $dropdown);
      let $trigger = $(".dropdown-trigger", $dropdown);
      let $buttonText = $("button.button > span:not(.icon)", $trigger);
      let value = this.getAttribute("value") || this.innerHTML;

      this.classList.add("is-active");
      $lastActive.removeClass("is-active");
      $buttonText.text(this.innerHTML.replace(/<.*>/, ""));
      $dropdown.val(value);
      $dropdown.change();
    });

  return $dropdown;
}
