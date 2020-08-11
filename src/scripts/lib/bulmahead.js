import debounce from "debounce";

const bulmahead = (input, menuEl, api, onSelect, delay = 200) => {
  menuEl.innerHTML = '<div class="dropdown-content"></div>';

  const setValue = e => {
    e.preventDefault();
    const label = e.target.text;
    // const {value} = e.target.dataset;
    input.value = label;
    menuEl.style.display = "none";
    if (onSelect) {
      onSelect(e.target.object);
    }
    return false;
  };

  const handleApi = e => {
    const { value } = e.target;
    menuEl.style.display = "none";
    menuEl.innerHTML = '<div class="dropdown-content"></div>';
    if (value.length < 2) {
      return;
    }
    api(value).then(suggestions => {
      const suggestionsEl = suggestions.map(obj => {
        const { prelabel, label, _value, title } = obj;
        const a = document.createElement("a");
        a.href = "#";
        a.classList.add("dropdown-item");
        a.innerHTML = prelabel + label;
        a.dataset.value = _value;
        a.object = obj;
        if (title) a.title = title;
        a.addEventListener("click", setValue);
        return a;
      });
      suggestionsEl.forEach(suggEl => {
        menuEl.childNodes[0].appendChild(suggEl);
      });
      if (suggestions.length > 0) {
        menuEl.style.display = "block";
      }
    });
  };
  input.addEventListener("input", debounce(handleApi, delay));
};

export default bulmahead;
