const Row = require('./Row.js');

module.exports = function workspace(commandBus, calculator) {
	this.init = () => {
		this.commandBus = commandBus;
		this.calculator = calculator;
		this.el = document.querySelector('.workspace');
		this.rows = [];
		this.activeRow = this.addRow();
		this.activeRow.activate();
		this.subscribeToCommands();
	};

	this.addRow = (index) => {
		const row = new Row(this.commandBus, this.calculator);

		const currentRow = index !== undefined && index < this.rows.length ? this.rows[index].el : null;
		this.el.insertBefore(row.el, currentRow);

		const insertLocation = index !== undefined ? index : this.rows.length;
		this.rows.splice(insertLocation, 0, row);

		return row;
	};

	this.removeRow = (row) => {
		this.el.removeChild(row.el);
		this.rows.splice(this.rows.indexOf(row), 1);
	};

	this.isFirstRow = (row) => this.rows.indexOf(row) === 0;

	this.isLastRow = (row) => this.rows.indexOf(row) === this.rows.length - 1;

	this.isOnlyRow = (row) => this.rows.indexOf(row) === 0 && this.rows.length === 1;

	this.getPreviousRow = (row) => this.rows[this.rows.indexOf(row) - 1];

	this.getNextRow = (row) => this.rows[this.rows.indexOf(row) + 1];

	this.subscribeToCommands = () => {
		this.commandBus.subscribe('insertRowAfter', this.insertRowAfter.bind(this));
		this.commandBus.subscribe('insertRowBefore', this.insertRowBefore.bind(this));
		this.commandBus.subscribe('deleteRow', this.deleteRow.bind(this));
		this.commandBus.subscribe('deleteAllRows', this.deleteAllRows.bind(this));
		this.commandBus.subscribe('goToFirstRow', this.goToFirstRow.bind(this));
		this.commandBus.subscribe('goToLastRow', this.goToLastRow.bind(this));
		this.commandBus.subscribe('goToPreviousRow', this.goToPreviousRow.bind(this));
		this.commandBus.subscribe('goToNextRow', this.goToNextRow.bind(this));
		this.commandBus.subscribe('activateRow', this.activateRow.bind(this));
	};

	this.insertRowAfter = (row) => {
		this.addRow(this.rows.indexOf(row) + 1);
	};

	this.insertRowBefore = (row) => {
		this.addRow(this.rows.indexOf(row));
	};

	this.deleteRow = (row) => {
		if (this.isOnlyRow(row)) {
			this.addRow();
		} else if (this.isFirstRow(row)) {
			this.getNextRow(row).focusInput();
		} else {
			this.getPreviousRow(row).focusInput();
		}

		this.removeRow(row);
	};

	this.deleteAllRows = () => {
		for (let index = this.rows.length - 1; index >= 0; index -= 1) {
			this.removeRow(this.rows[index]);
		}

		this.addRow();
	};

	this.goToFirstRow = () => {
		this.rows[0].focusInput();
	};

	this.goToLastRow = () => {
		this.rows[this.rows.length - 1].focusInput();
	};

	this.goToPreviousRow = (row) => {
		if (this.isFirstRow(row)) return;

		this.getPreviousRow(row).focusInput();
	};

	this.goToNextRow = (row) => {
		if (this.isLastRow(row)) {
			if (!row.hasValue()) return;

			this.addRow();
			return;
		}

		this.getNextRow(row).focusInput();
	};

	this.activateRow = (row) => {
		if (this.activeRow === row) return;
		if (this.activeRow !== undefined) this.activeRow.deactivate();

		this.activeRow = row;
		this.activeRow.activate();
	};

	this.init();
};
