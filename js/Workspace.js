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
		CommandBus.subscribe('insertAfter', this.insertAfter.bind(this));
		CommandBus.subscribe('insertBefore', this.insertBefore.bind(this));
		CommandBus.subscribe('delete', this.delete.bind(this));
		CommandBus.subscribe('deleteAll', this.deleteAll.bind(this));
		CommandBus.subscribe('first', this.first.bind(this));
		CommandBus.subscribe('last', this.last.bind(this));
		CommandBus.subscribe('previous', this.previous.bind(this));
		CommandBus.subscribe('next', this.next.bind(this));
		CommandBus.subscribe('rowFocus', this.rowFocus.bind(this));
		CommandBus.subscribe('inputFocus', this.inputFocus.bind(this));
		CommandBus.subscribe('outputFocus', this.outputFocus.bind(this));
	}

	insertAfter(row) {
		const index = this.rows.indexOf(row);
		this.addRow(index + 1);
	}

	insertBefore(row) {
		const index = this.rows.indexOf(row);
		this.addRow(index);
	}

	rowFocus(row) {
		if (this.activeRow === row) return;
		if (this.activeRow !== undefined) this.activeRow.deactivate();

		this.activeRow = row;
		this.activeRow.activate();
	}

	inputFocus(row) {
		row.input.focus();
	}

	outputFocus(row) {
		row.output.focus();
	}

	previous(row) {
		const index = this.rows.indexOf(row);

		if (this.isFirstRow(index)) return;

		this.rows[index - 1].focus();
	}

	next(row) {
		const index = this.rows.indexOf(row);

		if (this.isLastRow(index)) {
			if (!row.hasValue()) return;

			this.addRow();
			return;
		}

		this.rows[index + 1].focus();
	}

	first() {
		this.rows[0].focus();
	}

	last() {
		this.rows[this.rows.length - 1].focus();
	}

	delete(row) {
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

	deleteAll() {
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
