const {app, BrowserWindow, ipcMain, globalShortcut} = require('electron');
const {autoUpdater} = require('electron-updater');
const isDev = require('electron-is-dev');
const Store = require('./lib/Store');

let modal = null;
let modalStatus = 'hidden';

const modalSettings = new Store({
	fileName: 'modalSettings',
	defaults: {
		width: 320,
		height: 160,
		x: null,
		y: null,
	},
});

function createModal() {
	const {width, height, x, y} = modalSettings.get();

	modal = new BrowserWindow({
		show: false,
		frame: false,
		backgroundColor: 'rgb(30, 31, 32)',
		skipTaskbar: true,
		alwaysOnTop: true,
		fullscreenable: false,
		maximizable: false,
		minimizable: false,
		closeable: false,
		opacity: 0,
		minWidth: 320,
		minHeight: 160,
		maxHeight: 160,
		width,
		height,
		x,
		y,
	});

	function showModal() {
		modal.show();
		modalStatus = 'visible';
	}

	function hideModal() {
		process.platform === 'darwin' ? app.hide() : modal.hide();
		modalStatus = 'hidden';
	}

	function sendShowModalCommand() {
		modalStatus = 'transitioning';
		modal.setOpacity(1);
		modal.webContents.send('willShowModal');
	}

	function sendhideModalCommand() {
		modalStatus = 'transitioning';
		modal.setOpacity(0);
		modal.webContents.send('willHideModal');
	}

	ipcMain.on('readyToShowModal', showModal);

	ipcMain.on('readyToHideModal', hideModal);

	globalShortcut.register('CommandOrControl+Space', () => {
		if (modalStatus === 'hidden') {
			sendShowModalCommand();
		} else if (modalStatus === 'visible') {
			sendhideModalCommand();
		}
	});

	ipcMain.on('hideModal', sendhideModalCommand);

	modal.on('blur', sendhideModalCommand);

	modal.on('resize', () => {
		const bounds = modal.getBounds();
		modalSettings.set('width', bounds.width);
		modalSettings.set('height', bounds.height);
	});

	modal.on('move', () => {
		const position = modal.getPosition();
		modalSettings.set('x', position[0]);
		modalSettings.set('y', position[1]);
	});

	modal.on('closed', () => {
		modal = null;
	});

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
