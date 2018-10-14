const CommandBus = require('../lib/CommandBus');
const Calculator = require('../lib/calculator/Calculator');
const Row = require('./js/Row');
const Workspace = require('./js/Workspace');
const {ipcRenderer} = require('electron');

ipcRenderer.on('updateReady', function() {
	const button = document.createElement('button');
	const footer = document.querySelector('.footer');
	button.innerHTML = 'Update ready';
	button.classList.add('update-ready');
	button.addEventListener('click', () => ipcRenderer.send('quitAndInstall'));
	footer.appendChild(button);
});
