import debounce from "debounce";

const bulmahead = (
  input: HTMLInputElement,
  menuEl: HTMLElement,
  api: (x: string) => Promise<any>,
  onSelect: (object: any) => void,
  delay = 200,
  minLen = 2,
) => {
  menuEl.innerHTML = '<div class="dropdown-content"></div>';

  const setValue = (e: Event) => {
    e.preventDefault();

    if (!(e.target instanceof HTMLElement)) return false;

    // @ts-expect-error
    const label = e.target.text;
    // const { value } = e.target.dataset;
    input.value = label;
    menuEl.style.display = "none";

    if (onSelect) {
      // @ts-expect-error
      onSelect(e.target.object);
    }

    return false;
  };

  const handleApi = (e: Event & { target: HTMLInputElement }) => {
    menuEl.style.display = "none";
    menuEl.innerHTML = '<div class="dropdown-content"></div>';

    if (e.target.value.length < minLen) {
      return;
    }

    api(e.target.value).then((suggestions: any[]) => {
      const suggestionsEl = suggestions.map(obj => {
        const { prelabel, label, value, title } = obj;
        const a = document.createElement("a");
        a.href = "#";
        a.classList.add("dropdown-item");
        a.innerHTML = prelabel + label;
        a.dataset.value = value;
        // @ts-expect-error
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
  input.addEventListener("focusout", e => {
    if (
      e.relatedTarget === null ||
      !(e.relatedTarget as HTMLElement).classList.contains("dropdown-item")
    ) {
      menuEl.style.display = "none";
    }
  });
  input.addEventListener("focusin", handleApi);
};

export default bulmahead;
