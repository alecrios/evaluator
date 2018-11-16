const {clipboard, ipcRenderer} = require('electron');
const Calculator = require('../lib/Calculator');

const expression = document.getElementById('expression');
const result = document.getElementById('result');

const calculator = new Calculator();

let currentResult;

function evaluateExpression() {
	try {
		currentResult = calculator.evaluate(expression.value);
		result.value = currentResult;
	} catch (error) {
		currentResult = error;
		result.value = '';
	}
}

function clear() {
	expression.value = '';
	result.value = '';
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
	result.value = currentResult.message;
}

function cancelEvaluation() {
	ipcRenderer.send('hideModal');
}

function keydownHandler(event) {
	if (event.key === 'Enter') {
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
		cancelEvaluation();
	}
}

expression.addEventListener('input', evaluateExpression);

document.addEventListener('keydown', keydownHandler);

ipcRenderer.on('willHideModal', prepareForHide);

ipcRenderer.on('willShowModal', prepareForShow);

function createUpdateButton() {
	const button = document.createElement('button');

	button.innerHTML = 'Update';
	button.classList.add('update-button');
	button.addEventListener('click', () => ipcRenderer.send('quitAndInstall'));

	document.body.appendChild(button);
}

ipcRenderer.on('updateReady', createUpdateButton);
