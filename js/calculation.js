module.exports = class Calculation {
	constructor(calculationGroup) {
		this.calculationGroup = calculationGroup;
		this.createCalculation();
		this.createInput();
		this.createOutput();
		this.addEventListeners();
		this.focus();
	}

	createCalculation() {
		this.calculation = document.createElement('div');
		this.calculation.classList.add('calculation');
		this.calculationGroup.appendChild(this.calculation);
	}

	createInput() {
		this.input = document.createElement('textarea');
		this.input.rows = '1';
		this.input.classList.add('textarea', 'input');
		this.calculation.appendChild(this.input);
	}

	createOutput() {
		this.output = document.createElement('textarea');
		this.output.rows = '1';
		this.output.classList.add('textarea', 'output');
		this.output.setAttribute('readonly', '');
		this.output.tabIndex = -1;
		this.calculation.appendChild(this.output);
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
		this.input.addEventListener('input', () => {
			this.updateHeight(this.input);
			this.updateHeight(this.output);
			this.evaluate();
		});

		this.input.addEventListener('focus', () => {
			EventBus.dispatchEvent('calculationFocus', this);
		});

		this.output.addEventListener('focus', () => {
			EventBus.dispatchEvent('calculationFocus', this);
			this.output.select();
		});

		this.calculation.addEventListener('keydown', () => {
			switch (event.key) {
				case 'Insert':
					EventBus.dispatchEvent(event.shiftKey ? 'insertBefore' : 'insertAfter', this);
					break;
				case 'Delete':
					EventBus.dispatchEvent(event.shiftKey ? 'deleteAll' : 'delete', this);
					break;
				case 'Home':
					EventBus.dispatchEvent('first', this);
					break;
				case 'End':
					EventBus.dispatchEvent('last', this);
					break;
				case 'PageUp':
					EventBus.dispatchEvent('previous', this);
					break;
				case 'PageDown':
					EventBus.dispatchEvent('next', this);
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
				case 'Tab':
					if (event.shiftKey) return;
					EventBus.dispatchEvent('next', this);
					break;
			}
		});
	}

	activate() {
		this.calculation.classList.add('active');
	}

	deactivate() {
		this.calculation.classList.remove('active');
	}

	evaluate() {
		if (!this.input.value) {
			this.output.value = '';
			return;
		}

		const result = Calculator.calculate(this.input.value);

		if (isNaN(result)) {
			this.output.value = '';
			return;
		}

		this.output.value = result;
	}

	getNode() {
		return this.calculation;
	}
}
