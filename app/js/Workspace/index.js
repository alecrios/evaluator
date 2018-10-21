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

	removeRow(row) {
		this.el.removeChild(row.el);
		this.rows.splice(this.rows.indexOf(row), 1);
	}

	isFirstRow(row) {
		return this.rows.indexOf(row) === 0;
	}

	isLastRow(row) {
		return this.rows.indexOf(row) === this.rows.length - 1;
	}

	isOnlyRow(row) {
		return this.rows.indexOf(row) === 0 && this.rows.length === 1;
	}

	getPreviousRow(row) {
		return this.rows[this.rows.indexOf(row) - 1];
	}

	getNextRow(row) {
		return this.rows[this.rows.indexOf(row) + 1];
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
	}

	insertRowAfter(row) {
		this.addRow(this.rows.indexOf(row) + 1);
	}

	insertRowBefore(row) {
		this.addRow(this.rows.indexOf(row));
	}

	deleteRow(row) {
		if (this.isOnlyRow(row)) {
			this.addRow();
		} else if (this.isFirstRow(row)) {
			this.getNextRow(row).focusInput();
		} else {
			this.getPreviousRow(row).focusInput();
		}

		this.removeRow(row);
	}

	deleteAllRows() {
		for (let index = this.rows.length - 1; index >= 0; index -= 1) {
			this.removeRow(this.rows[index]);
		}

		this.addRow();
	}

	goToFirstRow() {
		this.rows[0].focusInput();
	}

	goToLastRow() {
		this.rows[this.rows.length - 1].focusInput();
	}

	goToPreviousRow(row) {
		if (this.isFirstRow(row)) return;

		this.getPreviousRow(row).focusInput();
	}

	goToNextRow(row) {
		if (this.isLastRow(row)) {
			if (!row.hasValue()) return;

			this.addRow();
			return;
		}

		this.getNextRow(row).focusInput();
	}

	activateRow(row) {
		if (this.activeRow === row) return;
		if (this.activeRow !== undefined) this.activeRow.deactivate();

		this.activeRow = row;
		this.activeRow.activate();
	}
};
