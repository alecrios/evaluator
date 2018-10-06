class Workspace {
	constructor() {
		this.createWorkspace();
		this.rows = [];
		this.activeRow = this.addRow();
		this.activeRow.activate();
		this.subscribeToCommands();
	}

	createWorkspace() {
		this.workspace = document.createElement('div');
		this.workspace.classList.add('workspace');
		document.body.appendChild(this.workspace);
	}

	subscribeToCommands() {
		CommandBus.subscribe('insertRowAfter', this.insertRowAfter.bind(this));
		CommandBus.subscribe('insertRowBefore', this.insertRowBefore.bind(this));
		CommandBus.subscribe('deleteRow', this.deleteRow.bind(this));
		CommandBus.subscribe('deleteAllRows', this.deleteAllRows.bind(this));
		CommandBus.subscribe('goToFirstRow', this.goToFirstRow.bind(this));
		CommandBus.subscribe('goToLastRow', this.goToLastRow.bind(this));
		CommandBus.subscribe('goToPreviousRow', this.goToPreviousRow.bind(this));
		CommandBus.subscribe('goToNextRow', this.goToNextRow.bind(this));
		CommandBus.subscribe('activateRow', this.activateRow.bind(this));
		CommandBus.subscribe('focusInput', this.focusInput.bind(this));
		CommandBus.subscribe('focusOutput', this.focusOutput.bind(this));
	}

	insertRowAfter(row) {
		const index = this.rows.indexOf(row);
		this.addRow(index + 1);
	}

	insertRowBefore(row) {
		const index = this.rows.indexOf(row);
		this.addRow(index);
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

	goToFirstRow() {
		this.rows[0].focus();
	}

	goToLastRow() {
		this.rows[this.rows.length - 1].focus();
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
		for (let index = this.rows.length - 1; index >= 0; index--) {
			this.removeRow(this.rows[index], index);
		}

		this.addRow();
	}

	addRow(index) {
		const newRowNode = document.createElement('div');
		newRowNode.classList.add('row');
		const newRow = new Row(newRowNode);

		const insertLocation = index === undefined ? this.rows.length : index;
		const referenceNode = index !== undefined && index < this.rows.length ?
			this.rows[index].getNode() : null;

		this.workspace.insertBefore(newRowNode, referenceNode)
		this.rows.splice(insertLocation, 0, newRow);

		return newRow;
	}

	removeRow(row, index) {
		this.workspace.removeChild(row.getNode());
		this.rows.splice(index, 1);
	}

	isOnlyRow(index) {
		return index === 0 && this.rows.length === 1;
	}

	isFirstRow(index) {
		return index === 0;
	}

	isLastRow(index) {
		return index === this.rows.length - 1;
	}
}

module.exports = new Workspace();
