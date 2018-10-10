const {ipcRenderer} = require('electron');

ipcRenderer.on('updateReady', function() {
	const button = document.createElement('button');
	button.innerHTML = 'Update ready';
	button.classList.add('update-ready');
	button.addEventListener('click', () => ipcRenderer.send('quitAndInstall'));
	document.body.appendChild(button);
});
