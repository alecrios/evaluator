const {ipcRenderer} = require('electron');
const CommandBus = require('../lib/CommandBus');
const Calculator = require('../lib/Calculator');
const Workspace = require('./js/Workspace');

const commandBus = new CommandBus();
const calculator = new Calculator();

new Workspace(commandBus, calculator);

ipcRenderer.on('updateReady', () => {
	const button = document.createElement('button');
	const footer = document.querySelector('.footer');
	button.innerHTML = 'Update ready';
	button.classList.add('update-ready');
	button.addEventListener('click', () => ipcRenderer.send('quitAndInstall'));
	footer.appendChild(button);
});
