const {ipcRenderer} = require('electron');
const CommandBus = require('../lib/CommandBus');
const Calculator = require('../lib/Calculator');
const workspace = require('./js/Workspace');

const commandBus = new CommandBus();
const calculator = new Calculator();

workspace(commandBus, calculator);

document.documentElement.classList.add(process.platform);

ipcRenderer.on('updateReady', () => {
	document.documentElement.classList.add('update-ready');
	const button = document.createElement('button');
	const footer = document.querySelector('.footer');
	button.innerHTML = 'Update ready';
	button.classList.add('update-ready');
	button.addEventListener('click', () => ipcRenderer.send('quitAndInstall'));
	footer.appendChild(button);
});
