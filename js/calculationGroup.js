class CalculationGroup {
	constructor() {
		this.createCalculationGroup();
		this.calculations = [];
		this.calculationsTest = [];
		this.activeCalculation = this.addCalculation();
		this.activeCalculation.activate();
		this.addEventListeners();
	}

	createCalculationGroup() {
		this.calculationGroup = document.createElement('div');
		this.calculationGroup.classList.add('calculation-group');
		document.body.appendChild(this.calculationGroup);
	}

	addEventListeners() {
		EventBus.addEventListener('insertAfter', this.insertAfter.bind(this));
		EventBus.addEventListener('insertBefore', this.insertBefore.bind(this));
		EventBus.addEventListener('delete', this.delete.bind(this));
		EventBus.addEventListener('deleteAll', this.deleteAll.bind(this));
		EventBus.addEventListener('first', this.first.bind(this));
		EventBus.addEventListener('last', this.last.bind(this));
		EventBus.addEventListener('previous', this.previous.bind(this));
		EventBus.addEventListener('next', this.next.bind(this));
		EventBus.addEventListener('calculationFocus', this.calculationFocus.bind(this));
	}

	insertAfter(calculation) {
		let index = this.calculations.indexOf(calculation);
		this.addCalculation(index + 1);
	}

	insertBefore(calculation) {
		let index = this.calculations.indexOf(calculation);
		this.addCalculation(index);
	}

	calculationFocus(calculation) {
		if (this.activeCalculation === calculation) return;
		if (this.activeCalculation !== undefined) this.activeCalculation.deactivate();
		this.activeCalculation = calculation;
		this.activeCalculation.activate();
	}

	previous(calculation) {
		let index = this.calculations.indexOf(calculation);

		if (this.isFirstCalculation(index)) return;

		this.calculations[index - 1].focus();
	}

	next(calculation) {
		let index = this.calculations.indexOf(calculation);

		if (this.isLastCalculation(index)) {
			if (!calculation.hasValue()) return;
			this.addCalculation();
			return;
		}

		this.calculations[index + 1].focus();
	}

	first() {
		this.calculations[0].focus();
	}

	last() {
		this.calculations[this.calculations.length - 1].focus();
	}

	delete(calculation) {
		let index = this.calculations.indexOf(calculation);

		if (this.isOnlyCalculation(index)) {
			this.addCalculation();
		} else if (this.isFirstCalculation(index)) {
			this.calculations[index + 1].focus();
		} else {
			this.calculations[index - 1].focus();
		}

		this.removeCalculation(calculation, index);
	}

	deleteAll() {
		for (let index = this.calculations.length - 1; index >= 0; index--) {
			this.removeCalculation(this.calculations[index], index);
		}
		this.addCalculation();
	}

	addCalculation(index) {
		let newCalculationNode = document.createElement('div');
		newCalculationNode.classList.add('calculation');
		let newCalculation = new Calculation(newCalculationNode);
		let referenceNode = null;

		if (index !== undefined && index < this.calculations.length) {
			referenceNode = this.calculations[index].getNode();
		}

		this.calculationGroup.insertBefore(newCalculationNode, referenceNode)

		let insertLocation = null;
		if (index === undefined) {
			insertLocation = this.calculations.length;
		} else {
			insertLocation = index;
		}

		this.calculations.splice(insertLocation, 0, newCalculation);

		return newCalculation;
	}

	removeCalculation(calculation, index) {
		this.calculationGroup.removeChild(calculation.getNode());
		this.calculations.splice(index, 1);
		this.calculationsTest.splice(index, 1);
	}

	isOnlyCalculation(index) {
		return index === 0 && this.calculations.length === 1;
	}

	isFirstCalculation(index) {
		return index === 0;
	}

	isLastCalculation(index) {
		return index === this.calculations.length - 1;
	}
}

module.exports = new CalculationGroup();
