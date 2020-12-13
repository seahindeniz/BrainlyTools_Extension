import {
  DeleteReasonContentTypeNameType,
  DeleteReasonSubCategoryType,
} from "@root/controllers/System";
import debounce from "debounce";

export type BulmaheadSuggestionType = {
  type: DeleteReasonContentTypeNameType;
  preLabel: string;
  label: string;
  reason: DeleteReasonSubCategoryType;
  value: string;
};

const bulmahead = (
  input: HTMLInputElement,
  menuEl,
  api: (value: string) => Promise<BulmaheadSuggestionType[]>,
  onSelect,
  delay = 200,
) => {
  menuEl.innerHTML = '<div class="dropdown-content"></div>';

  const setValue = e => {
    e.preventDefault();

    const label = e.target.text;

    // const { value } = e.target.dataset;
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
      const suggestionsEl = suggestions.map(suggestion => {
        const { preLabel, label, value: _value } = suggestion;
        const a = document.createElement("a");

        a.href = "#";
        a.classList.add("dropdown-item");
        a.innerHTML = preLabel + label;
        a.dataset.value = _value;
        // @ts-expect-error
        a.object = suggestion;
        // if (title) a.title = title;
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
  input.addEventListener(
    "focusout",
    (e: FocusEvent & { relatedTarget: HTMLElement }) => {
      if (
        e.relatedTarget === null ||
        !e.relatedTarget.classList.contains("dropdown-item")
      ) {
        menuEl.style.display = "none";
      }
    },
  );
  input.addEventListener("focusin", handleApi);
};

export default bulmahead;
