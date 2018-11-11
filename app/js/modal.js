const {clipboard, ipcRenderer} = require('electron');
const Calculator = require('../lib/Calculator');

const calculator = new Calculator();
const main = document.querySelector('.main');
const expression = main.querySelector('.expression');
const result = main.querySelector('.result');

const evaluateExpression = () => {
	try {
		result.value = calculator.evaluate(expression.value);
	} catch (error) {
		result.value = '';
	}
};

const clear = () => {
	expression.value = '';
	result.value = '';
};

const prepareForHide = () => {
	clear();

	window.requestAnimationFrame(() => {
		window.requestAnimationFrame(() => {
			ipcRenderer.send('readyToHideModal');
		});
	});
};

const acceptResult = () => {
	clipboard.writeText(result.value);
	ipcRenderer.send('hideModal');
};

const cancelEvaluation = () => {
	ipcRenderer.send('hideModal');
};

const keydownHandler = (event) => {
	if (event.key === 'Enter') {
		acceptResult();
	} else if (event.key === 'Escape') {
		cancelEvaluation();
	}
};

expression.focus();

expression.addEventListener('input', evaluateExpression);

expression.addEventListener('keydown', keydownHandler);

ipcRenderer.on('willHideModal', prepareForHide);

const createUpdateButton = () => {
	const titleBar = document.querySelector('.title-bar');
	const button = document.createElement('button');

	button.innerHTML = 'Update';
	button.classList.add('update');
	button.addEventListener('click', () => ipcRenderer.send('quitAndInstall'));

	titleBar.appendChild(button);
};

ipcRenderer.on('updateReady', createUpdateButton);
