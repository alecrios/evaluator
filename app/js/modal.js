const {clipboard, ipcRenderer} = require('electron');
const Calculator = require('../lib/Calculator');

const calculator = new Calculator();
const main = document.querySelector('.main');
const input = main.querySelector('.input');
const output = main.querySelector('.output');

const evaluateExpression = () => {
	try {
		output.value = calculator.evaluate(input.value);
	} catch (error) {
		output.value = '';
	}
};

const clear = () => {
	input.value = '';
	output.value = '';
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
	clipboard.writeText(output.value);
	ipcRenderer.send('hideModal');
};

const keydownHandler = (event) => {
	switch (event.key) {
	case 'Enter':
		acceptResult();
		break;
	default:
		break;
	}
};

input.focus();

input.addEventListener('input', evaluateExpression);

input.addEventListener('keydown', keydownHandler);

ipcRenderer.on('willHideModal', prepareForHide);
