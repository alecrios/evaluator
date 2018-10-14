module.exports = class Row {
	constructor(calculator) {
		this.calculator = calculator;
		this.el = this.createRow();
		this.input = this.createInput();
		this.output = this.createOutput();
		this.addEventListeners();
		this.focus();
	}

	createRow() {
		const row = document.createElement('div');
		row.classList.add('row');
		return row;
	}

	createInput() {
		const input = document.createElement('textarea');
		input.classList.add('textarea', 'input');
		this.el.appendChild(input);
		return input;
	}

	createOutput() {
		const output = document.createElement('textarea');
		output.classList.add('textarea', 'output');
		output.setAttribute('readonly', '');
		this.el.appendChild(output);
		return output;
	}

	focus() {
		window.requestAnimationFrame(() => this.input.focus());
	}

	inputFocused() {
		return document.activeElement === this.input;
	}

	outputFocused() {
		return document.activeElement === this.output;
	}

	activate() {
		this.el.classList.add('active');
	}

	deactivate() {
		this.el.classList.remove('active');
	}

	hasValue() {
		return this.input.value.length > 0;
	}

	updateHeight(textarea) {
		textarea.style.height = '0px';
		textarea.style.height = textarea.scrollHeight + 'px';
	}

	evaluate() {
		const result = this.calculator.evaluate(this.input.value);

		this.output.value = result === undefined ? '' : result;

		this.updateHeight(this.input);
		this.updateHeight(this.output);
	}

	addEventListeners() {
		this.el.addEventListener('click', (event) => {
			CommandBus.publish('focusInput', this);
		});

		this.output.addEventListener('click', (event) => {
			event.stopPropagation();
		});

		this.input.addEventListener('input', (event) => {
			this.evaluate();
		});

		this.input.addEventListener('focus', (event) => {
			CommandBus.publish('activateRow', this);
		});

		this.output.addEventListener('focus', (event) => {
			CommandBus.publish('activateRow', this);
			this.output.select();
		});

		this.el.addEventListener('keydown', (event) => {
			switch (event.key) {
				case 'Insert':
					event.preventDefault();
					CommandBus.publish(event.shiftKey ? 'insertRowBefore' : 'insertRowAfter', this);
					break;
				case 'Delete':
					event.preventDefault();
					CommandBus.publish(event.shiftKey ? 'deleteAllRows' : 'deleteRow', this);
					break;
				case 'Home':
					event.preventDefault();
					CommandBus.publish('goToFirstRow', this);
					break;
				case 'End':
					event.preventDefault();
					CommandBus.publish('goToLastRow', this);
					break;
				case 'PageUp':
					event.preventDefault();
					CommandBus.publish('goToPreviousRow', this);
					break;
				case 'PageDown':
					event.preventDefault();
					CommandBus.publish('goToNextRow', this);
					break;
				case 'Tab':
					event.preventDefault();

					if (this.outputFocused() && event.shiftKey) {
						CommandBus.publish('focusInput', this);
					} else {
						CommandBus.publish(event.shiftKey ? 'goToPreviousRow' : 'goToNextRow', this);
					}

					break;
				case 'Enter':
					event.preventDefault();

					if (!this.output.value) break;

					if (this.inputFocused()) {
						CommandBus.publish('focusOutput', this);
					} else {
						CommandBus.publish('goToNextRow', this);
					}

					break;
			}
		});
	}
}
