const {ipcRenderer} = require('electron');

ipcRenderer.on('updateReady', function() {
	const button = document.createElement('button');
	button.innerHTML = 'Update available';
	button.addEventListener('click', () => ipcRenderer.send('quitAndInstall'));
	document.body.appendChild(button);
});
