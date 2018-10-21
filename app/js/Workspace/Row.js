module.exports = class Row {
	constructor(commandBus, calculator) {
		this.commandBus = commandBus;
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

	updateTextareaHeights() {
		this.input.style.height = '0px';
		this.input.style.height = `${this.input.scrollHeight}px`;

		this.output.style.height = '0px';
		this.output.style.height = `${this.output.scrollHeight}px`;
	}

	evaluate() {
		try {
			this.output.value = this.calculator.evaluate(this.input.value);
		} catch (error) {
			this.output.value = '';
		}

		this.updateTextareaHeights();
	}

	addEventListeners() {
		this.el.addEventListener('click', () => {
			this.commandBus.publish('focusInput', this);
		});

		this.output.addEventListener('click', (event) => {
			event.stopPropagation();
		});

		this.input.addEventListener('input', () => {
			this.evaluate();
		});

		this.input.addEventListener('focus', () => {
			this.commandBus.publish('activateRow', this);
		});

		this.output.addEventListener('focus', () => {
			this.commandBus.publish('activateRow', this);
			this.output.select();
		});

		this.el.addEventListener('keydown', (event) => {
			switch (event.key) {
			case 'Insert':
				event.preventDefault();
				this.commandBus.publish(event.shiftKey ? 'insertRowBefore' : 'insertRowAfter', this);
				break;
			case 'Delete':
				event.preventDefault();
				this.commandBus.publish(event.shiftKey ? 'deleteAllRows' : 'deleteRow', this);
				break;
			case 'Home':
				event.preventDefault();
				this.commandBus.publish('goToFirstRow', this);
				break;
			case 'End':
				event.preventDefault();
				this.commandBus.publish('goToLastRow', this);
				break;
			case 'PageUp':
				event.preventDefault();
				this.commandBus.publish('goToPreviousRow', this);
				break;
			case 'PageDown':
				event.preventDefault();
				this.commandBus.publish('goToNextRow', this);
				break;
			case 'Tab':
				event.preventDefault();

				if (this.outputFocused() && event.shiftKey) {
					this.commandBus.publish('focusInput', this);
				} else {
					this.commandBus.publish(event.shiftKey ? 'goToPreviousRow' : 'goToNextRow', this);
				}

				break;
			case 'Enter':
				event.preventDefault();

				if (!this.output.value) break;

				if (this.inputFocused()) {
					this.commandBus.publish('focusOutput', this);
				} else {
					this.commandBus.publish('goToNextRow', this);
				}

				break;
			default:
				break;
			}
		});
	}
};
