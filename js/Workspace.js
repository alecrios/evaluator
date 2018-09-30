class Workspace {
	constructor() {
		this.createWorkspace();
		this.rows = [];
		this.activeRow = this.addRow();
		this.activeRow.activate();
		this.addEventListeners();
	}

	createWorkspace() {
		this.workspace = document.createElement('div');
		this.workspace.classList.add('workspace');
		document.body.appendChild(this.workspace);
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
		EventBus.addEventListener('rowFocus', this.rowFocus.bind(this));
	}

	insertAfter(row) {
		let index = this.rows.indexOf(row);
		this.addRow(index + 1);
	}

	insertBefore(row) {
		let index = this.rows.indexOf(row);
		this.addRow(index);
	}

	rowFocus(row) {
		if (this.activeRow === row) return;
		if (this.activeRow !== undefined) this.activeRow.deactivate();
		this.activeRow = row;
		this.activeRow.activate();
	}

	previous(row) {
		let index = this.rows.indexOf(row);

		if (this.isFirstRow(index)) return;

		this.rows[index - 1].focus();
	}

	next(row) {
		let index = this.rows.indexOf(row);

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
		let index = this.rows.indexOf(row);

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
