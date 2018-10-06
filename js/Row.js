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
			CommandBus.publish('activateRow', this);
		});

		this.output.addEventListener('focus', (event) => {
			CommandBus.publish('activateRow', this);
			this.output.select();
		});

		this.row.addEventListener('keydown', (event) => {
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

					if (this.outputActive() && event.shiftKey) {
						CommandBus.publish('focusInput', this);
					} else {
						CommandBus.publish(event.shiftKey ? 'goToPreviousRow' : 'goToNextRow', this);
					}

					break;
				case 'Enter':
					event.preventDefault();

					if (!this.output.value) break;

					if (this.inputActive()) {
						CommandBus.publish('focusOutput', this);
					} else {
						CommandBus.publish('goToNextRow', this);
					}

					break;
			}
		});
	}

	inputActive() {
		return document.activeElement === this.input;
	}

	outputActive() {
		return document.activeElement === this.output;
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
