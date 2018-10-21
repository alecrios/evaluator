const Row = require('./Row.js');

module.exports = class Workspace {
	constructor(commandBus, calculator) {
		this.commandBus = commandBus;
		this.calculator = calculator;
		this.el = document.querySelector('.workspace');
		this.rows = [];
		this.activeRow = this.addRow();
		this.activeRow.activate();
		this.subscribeToCommands();
	}

	addRow(index) {
		const row = new Row(this.commandBus, this.calculator);

		const currentRow = index !== undefined && index < this.rows.length ? this.rows[index].el : null;
		this.el.insertBefore(row.el, currentRow);

		const insertLocation = index !== undefined ? index : this.rows.length;
		this.rows.splice(insertLocation, 0, row);

		return row;
	}

	removeRow(row, index) {
		this.el.removeChild(row.el);
		this.rows.splice(index, 1);
	}

	isFirstRow(index) {
		return index === 0;
	}

	isLastRow(index) {
		return index === this.rows.length - 1;
	}

	isOnlyRow(index) {
		return index === 0 && this.rows.length === 1;
	}

	subscribeToCommands() {
		this.commandBus.subscribe('insertRowAfter', this.insertRowAfter.bind(this));
		this.commandBus.subscribe('insertRowBefore', this.insertRowBefore.bind(this));
		this.commandBus.subscribe('deleteRow', this.deleteRow.bind(this));
		this.commandBus.subscribe('deleteAllRows', this.deleteAllRows.bind(this));
		this.commandBus.subscribe('goToFirstRow', this.goToFirstRow.bind(this));
		this.commandBus.subscribe('goToLastRow', this.goToLastRow.bind(this));
		this.commandBus.subscribe('goToPreviousRow', this.goToPreviousRow.bind(this));
		this.commandBus.subscribe('goToNextRow', this.goToNextRow.bind(this));
		this.commandBus.subscribe('activateRow', this.activateRow.bind(this));
		this.commandBus.subscribe('focusInput', this.focusInput.bind(this));
		this.commandBus.subscribe('focusOutput', this.focusOutput.bind(this));
	}

	insertRowAfter(row) {
		const index = this.rows.indexOf(row);
		this.addRow(index + 1);
	}

	insertRowBefore(row) {
		const index = this.rows.indexOf(row);
		this.addRow(index);
	}

	deleteRow(row) {
		const index = this.rows.indexOf(row);

		if (this.isOnlyRow(index)) {
			this.addRow();
		} else if (this.isFirstRow(index)) {
			this.rows[index + 1].focus();
		} else {
			this.rows[index - 1].focus();
		}

		this.removeRow(row, index);
	}

	deleteAllRows() {
		for (let index = this.rows.length - 1; index >= 0; index -= 1) {
			this.removeRow(this.rows[index], index);
		}

		this.addRow();
	}

	goToFirstRow() {
		this.rows[0].focus();
	}

	goToLastRow() {
		this.rows[this.rows.length - 1].focus();
	}

	goToPreviousRow(row) {
		const index = this.rows.indexOf(row);

		if (this.isFirstRow(index)) return;

		this.rows[index - 1].focus();
	}

	goToNextRow(row) {
		const index = this.rows.indexOf(row);

		if (this.isLastRow(index)) {
			if (!row.hasValue()) return;

			this.addRow();
			return;
		}

		this.rows[index + 1].focus();
	}

	activateRow(row) {
		if (this.activeRow === row) return;
		if (this.activeRow !== undefined) this.activeRow.deactivate();

		this.activeRow = row;
		this.activeRow.activate();
	}

	focusInput(row) {
		row.input.focus();
	}

	focusOutput(row) {
		row.output.focus();
	}
};
