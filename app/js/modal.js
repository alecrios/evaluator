const { clipboard, ipcRenderer } = require('electron');
const evaluate = require('evaluator.js');

const expression = document.getElementById('expression');
const result = document.getElementById('result');

let currentResult;

function evaluateExpression() {
	try {
		currentResult = evaluate(expression.value);
		result.value = currentResult;
	} catch (error) {
		currentResult = error;
		result.value = '';
	}

	result.setAttribute('data-is-error', currentResult instanceof Error);
}

function clear() {
	expression.value = '';
	evaluateExpression();
}

function startNewExpressionWithResult() {
	expression.value = result.value;
}

function prepareForHide() {
	clear();

	window.requestAnimationFrame(() => {
		window.requestAnimationFrame(() => {
			ipcRenderer.send('readyToHideModal');
		});
	});
}

function prepareForShow() {
	expression.focus();

	ipcRenderer.send('readyToShowModal');
}

function acceptResult() {
	clipboard.writeText(result.value);
	ipcRenderer.send('hideModal');
}

function showError() {
	result.value = currentResult;
}

function cancelEvaluation() {
	ipcRenderer.send('hideModal');
}

function recenterModal() {
	ipcRenderer.send('recenterModal');
}

function keydownHandler(event) {
	if (event.key === 'Enter') {
		if (!expression.value.length) {
			cancelEvaluation();
			return;
		}

		if (currentResult instanceof Error) {
			showError();
			return;
		}

		if (event.shiftKey) {
			startNewExpressionWithResult();
			return;
		}

		acceptResult();
	} else if (event.key === 'Escape') {
		if (event.shiftKey) {
			recenterModal();
			return;
		}

		cancelEvaluation();
	} else if (event.key === 'Backspace') {
		if (!event.shiftKey) {
			return;
		}

		clear();
	} else if (event.key === 'Tab') {
		event.preventDefault();
	}
}

expression.addEventListener('input', evaluateExpression);

document.addEventListener('keydown', keydownHandler);

ipcRenderer.on('willHideModal', prepareForHide);

ipcRenderer.on('willShowModal', prepareForShow);
