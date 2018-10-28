const {ipcRenderer} = require('electron');
const Calculator = require('../lib/Calculator');

const calculator = new Calculator();
const main = document.querySelector('.main');
const input = main.querySelector('.input');
const output = main.querySelector('.output');

const evaluate = () => {
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

input.focus();

input.addEventListener('input', evaluate);

ipcRenderer.on('willHideModal', prepareForHide);
