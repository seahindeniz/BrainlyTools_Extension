import debounce from 'lodash/debounce'
/**
 *
 * @param {HTMLInputElement} input
 * @param {HTMLElement} menuEl
 * @param {Promise} api
 * @param {function} onSelect
 * @param {number} delay
 */
let bulmahead = (input, menuEl, api, onSelect, delay = 200) => {
	menuEl.innerHTML = '<div class="dropdown-content"></div>'

	let setValue = e => {
		e.preventDefault()
		var label = e.target.text
		var value = e.target.dataset.value
		input.value = label
		menuEl.style.display = 'none'
		if (onSelect) {
			onSelect(e.target.object)
		}
		return false
	}

	let handleApi = e => {
		let value = e.target.value
		menuEl.style.display = 'none'
		menuEl.innerHTML = '<div class="dropdown-content"></div>'
		if (value.length < 2) {
			return
		}
		api(value).then(suggestions => {
			let suggestionsEl = suggestions.map((obj) => {
				let { prelabel, label, value, title } = obj;
				let a = document.createElement('a')
				a.href = '#'
				a.classList.add('dropdown-item')
				a.innerHTML = prelabel + label
				a.dataset.value = value
				a.object = obj
				if (title)
					a.title = title
				a.addEventListener('click', setValue)
				return a
			})
			suggestionsEl.map(suggEl => {
				menuEl.childNodes[0].appendChild(suggEl)
			})
			if (suggestions.length > 0) {
				menuEl.style.display = 'block'
			}
		})
	}
	input.addEventListener('input', debounce(handleApi, delay))
}

export default bulmahead
