const {clipboard} = require('electron');
const Calculator = require('./js/calculator');

class Row {
	constructor() {
		this.calculations = document.querySelector('.calculations');

		this.calculation = document.createElement('div');
		this.calculation.classList.add('calculation');
		this.calculations.appendChild(this.calculation);

		this.input = document.createElement('textarea');
		this.input.rows = '1';
		this.input.classList.add('textarea', 'input');
		this.calculation.appendChild(this.input);

		this.output = document.createElement('textarea');
		this.output.rows = '1';
		this.output.classList.add('textarea', 'output');
		this.output.setAttribute('readonly', '');
		this.output.tabIndex = -1;
		this.calculation.appendChild(this.output);

		this.addEventListeners();

		this.calculator = new Calculator();

		this.input.focus();
	}

	updateHeight(textarea) {
		textarea.style.height = '0px';
		textarea.style.height = textarea.scrollHeight + 'px';
	}

	addEventListeners() {
		this.input.addEventListener('input', () => {
			this.updateHeight(this.input);
			this.updateHeight(this.output);
			this.evaluate();
		});

		this.input.addEventListener('keydown', (event) => {
			switch (event.key) {
				case 'Enter':
					if (event.shiftKey) return;
					event.preventDefault();
					if (!this.output.value) return;
					this.output.focus();
					break;
				case 'Tab':
					if (event.shiftKey) return;
					this.goToNextRow(event);
					break;
			}
		});

		this.output.addEventListener('keydown', (event) => {
			switch (event.key) {
				case 'Enter':
					event.preventDefault();
					clipboard.writeText(this.output.value);
					break;
				case 'Tab':
					if (event.shiftKey) return;
					this.goToNextRow(event);
					break;
			}
		});

		this.input.addEventListener('focus', () => {
			this.updateActiveStatus();
		});

		this.input.addEventListener('blur', () => {
			this.updateActiveStatus();
		});

		this.output.addEventListener('focus', () => {
			this.updateActiveStatus();
			this.output.select();
		});

		this.output.addEventListener('blur', () => {
			this.updateActiveStatus();
		});

		this.calculation.addEventListener('keydown', () => {
			switch (event.key) {
				case 'Delete':
					event.shiftKey ? this.destroyAll() : this.destroy();
					break;
			}
		});
	}

	updateActiveStatus() {
		if (document.activeElement === this.input || document.activeElement === this.output) {
			this.calculation.classList.add('active');
		} else {
			this.calculation.classList.remove('active');
		}
	}

	isFirstRow() {
		return this.calculations.firstChild === this.calculation;
	}

	isLastRow() {
		return this.calculations.lastChild === this.calculation;
	}

	goToNextRow() {
		if (!this.isLastRow()) return;
		event.preventDefault();
		if (!this.input.value) return;
		new Row();
		return;
	}

	evaluate() {
		if (!this.input.value) {
			this.output.value = '';
			return;
		}

		const result = this.calculator.calculate(this.input.value);

		if (isNaN(result)) {
			this.output.value = '';
			return;
		}

		this.output.value = result;
	}

	destroy() {
		this.calculations.removeChild(this.calculation);
	}

	destroyAll() {
		Array.from(this.calculations.childNodes).reverse().forEach((childNode) => {
			this.calculations.removeChild(childNode);
		});

		new Row();
	}
}

new Row();
