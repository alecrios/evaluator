const {ipcRenderer} = require('electron');
const CommandBus = require('../lib/CommandBus');
const Calculator = require('../lib/Calculator');
const Workspace = require('./js/Workspace');

const commandBus = new CommandBus();
const calculator = new Calculator();
const workspace = new Workspace();

ipcRenderer.on('updateReady', function() {
	const button = document.createElement('button');
	const footer = document.querySelector('.footer');
	button.innerHTML = 'Update ready';
	button.classList.add('update-ready');
	button.addEventListener('click', () => ipcRenderer.send('quitAndInstall'));
	footer.appendChild(button);
});
