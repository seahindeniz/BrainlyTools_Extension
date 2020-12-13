export default options => {
  const $dropdown = $(`
	<div class="sg-dropdown${options.class ? ` ${options.class}` : ""}">
		<div class="sg-dropdown__icon"></div>
		<div class="sg-dropdown__hole">
			<div class="sg-dropdown__item-text">${options.label}</div>
		</div>
		<div class="sg-dropdown__items">
			<div class="sg-dropdown__item-hole sg-disabled">
				<div class="sg-dropdown__item-text${
          options.selected ? "" : " sg-dropdown__item-text--active"
        }">${options.label}</div>
			</div>
			<div class="sg-horizontal-separator"></div>
		</div>
	</div>`);

  const $items = $(".sg-dropdown__items", $dropdown);

  options.items.forEach(item =>
    $items.append(`
		<div class="sg-dropdown__item-hole">
			<div class="sg-dropdown__item-text${
        item.value === options.selected ? " sg-dropdown__item-text--active" : ""
      }" value="${item.value}">${item.text}</div>
		</div>`),
  );

  const $dropdownHole = $(".sg-dropdown__hole", $dropdown);
  const $dropdownItemHole = $(
    ".sg-dropdown__items > .sg-dropdown__item-hole",
    $dropdown,
  );

  $("body").on("click", () => {
    $dropdown.removeClass("sg-dropdown--opened");
  });
  $dropdown.on("click", e => {
    e.stopPropagation();

    $dropdown.toggleClass("sg-dropdown--opened");
  });
  $dropdownItemHole.on("click", function (e) {
    e.preventDefault();

    const $lastActive = $(".sg-dropdown__item-text--active", $dropdown);
    const $triggerText = $(".sg-dropdown__item-text", $dropdownHole);
    const $itemText = $(".sg-dropdown__item-text", this);
    const value = $itemText.attr("value") || this.innerHTML;

    $lastActive.removeClass("sg-dropdown__item-text--active");
    $itemText.addClass("sg-dropdown__item-text--active");
    $triggerText.text($itemText.html());
    $dropdown.val(value);
    $dropdown.trigger("change");
  });

  return $dropdown;
};
