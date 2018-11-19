const {app, BrowserWindow, ipcMain, globalShortcut} = require('electron');
const {autoUpdater} = require('electron-updater');
const isDev = require('electron-is-dev');

let modal = null;
let modalStatus = 'hidden';

function createModal() {
	const size = {width: 384, height: 128};

	modal = new BrowserWindow({
		show: false,
		frame: false,
		backgroundColor: 'rgb(21, 22, 23)',
		skipTaskbar: true,
		alwaysOnTop: true,
		fullscreenable: false,
		maximizable: false,
		minimizable: false,
		closeable: false,
		resizable: false,
		opacity: 0,
		width: size.width,
		height: size.height,
		center: true,
	});

	function showModal() {
		modalStatus = 'visible';
		modal.show();
	}

	function hideModal() {
		modalStatus = 'hidden';
		process.platform === 'darwin' ? app.hide() : modal.hide();
	}

	function initiateShowModal() {
		if (modalStatus !== 'hidden') return;

		modalStatus = 'transitioning';
		modal.setOpacity(1);
		modal.webContents.send('willShowModal');
	}

	function initiateHideModal() {
		if (modalStatus !== 'visible') return;

		modalStatus = 'transitioning';
		modal.setOpacity(0);
		modal.webContents.send('willHideModal');
	}

	function toggleModal() {
		if (modalStatus === 'hidden') {
			initiateShowModal();
		} else if (modalStatus === 'visible') {
			initiateHideModal();
		}
	}

	ipcMain.on('readyToShowModal', showModal);

	ipcMain.on('readyToHideModal', hideModal);

	ipcMain.on('hideModal', initiateHideModal);

	function recenterModal() {
		modal.setSize(size.width, size.height);
		modal.center();
	}

	ipcMain.on('recenterModal', recenterModal);

	modal.on('blur', initiateHideModal);

	globalShortcut.register('CommandOrControl+Space', toggleModal);

	function destroyModal() {
		modal = null;
	}

	modal.on('closed', destroyModal);

	modal.loadFile('app/modal.html');

	if (isDev) modal.toggleDevTools();
}

app.on('ready', () => {
	createModal();

	if (process.platform === 'darwin') app.dock.hide();

	if (!isDev) autoUpdater.checkForUpdates();
});

autoUpdater.on('update-downloaded', () => {
	modal.webContents.send('updateReady');
});

ipcMain.on('quitAndInstall', () => {
	autoUpdater.quitAndInstall();
});

app.on('will-quit', () => {
	globalShortcut.unregisterAll();
});
