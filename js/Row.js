class Row {
	constructor(row) {
		this.row = row;
		this.createInput();
		this.createOutput();
		this.addEventListeners();
		this.focus();
	}

	createInput() {
		this.input = document.createElement('textarea');
		this.input.rows = '1';
		this.input.classList.add('textarea', 'input');
		this.row.appendChild(this.input);
	}

	createOutput() {
		this.output = document.createElement('textarea');
		this.output.rows = '1';
		this.output.classList.add('textarea', 'output');
		this.output.setAttribute('readonly', '');
		this.row.appendChild(this.output);
	}

	focus() {
		window.requestAnimationFrame(() => this.input.focus());
	}

	hasValue() {
		return this.input.value.length > 0;
	}

	updateHeight(textarea) {
		textarea.style.height = '0px';
		textarea.style.height = textarea.scrollHeight + 'px';
	}

	addEventListeners() {
		this.row.addEventListener('click', (event) => {
			this.input.focus();
		});

		this.output.addEventListener('click', (event) => {
			event.stopPropagation();
		});

		this.input.addEventListener('input', (event) => {
			this.evaluate();
		});

		this.input.addEventListener('focus', (event) => {
			EventBus.dispatchEvent('rowFocus', this);
		});

		this.output.addEventListener('focus', (event) => {
			EventBus.dispatchEvent('rowFocus', this);
			this.output.select();
		});

		this.row.addEventListener('keydown', (event) => {
			switch (event.key) {
				case 'Insert':
					event.preventDefault();
					EventBus.dispatchEvent(event.shiftKey ? 'insertBefore' : 'insertAfter', this);
					break;
				case 'Delete':
					event.preventDefault();
					EventBus.dispatchEvent(event.shiftKey ? 'deleteAll' : 'delete', this);
					break;
				case 'Home':
					event.preventDefault();
					EventBus.dispatchEvent('first', this);
					break;
				case 'End':
					event.preventDefault();
					EventBus.dispatchEvent('last', this);
					break;
				case 'PageUp':
					event.preventDefault();
					EventBus.dispatchEvent('previous', this);
					break;
				case 'PageDown':
					event.preventDefault();
					EventBus.dispatchEvent('next', this);
					break;
				case 'Tab':
					event.preventDefault();
					EventBus.dispatchEvent(event.shiftKey ? 'previous' : 'next', this);
					break;
				case 'Enter':
					if (document.activeElement === this.input) {
						if (event.shiftKey) return;
						event.preventDefault();
						if (!this.output.value) return;
						this.output.focus();
					} else if (document.activeElement === this.output) {
						event.preventDefault();
						EventBus.dispatchEvent('next', this);
					}
					break;
			}
		});
	}

	activate() {
		this.row.classList.add('active');
	}

	deactivate() {
		this.row.classList.remove('active');
	}

	evaluate() {
		const result = Calculator.evaluate(this.input.value);

		this.output.value = result === undefined ? '' : result;

		this.updateHeight(this.input);
		this.updateHeight(this.output);
	}

	getNode() {
		return this.row;
	}
}

module.exports = Row;
