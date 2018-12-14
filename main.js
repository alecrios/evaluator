const {app, BrowserWindow, ipcMain, globalShortcut, Menu, Tray} = require('electron');
const {autoUpdater} = require('electron-updater');
const path = require('path');
const isDev = require('electron-is-dev');

let modal = null;
let modalStatus = 'hidden';

let tray = null;

function createModal() {
	const size = {width: 384, height: 128};

	modal = new BrowserWindow({
		show: false,
		frame: false,
		width: size.width,
		height: size.height,
		center: true,
		skipTaskbar: true,
		alwaysOnTop: true,
		fullscreenable: false,
		maximizable: false,
		minimizable: false,
		closeable: false,
		resizable: false,
		backgroundColor: 'rgb(18, 19, 20)',
		opacity: 0,
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

	globalShortcut.register('CmdOrCtrl+Space', toggleModal);

	app.on('activate', () => {
		initiateShowModal();
	});

	function destroyModal() {
		modal = null;
	}

	modal.on('closed', destroyModal);

	modal.loadFile('app/modal.html');

	if (!isDev) autoUpdater.checkForUpdates();

	if (app.dock) app.dock.hide();

	tray = new Tray(path.join(app.getAppPath(), 'build', 'icon.png'));

	tray.setContextMenu(Menu.buildFromTemplate([
		{
			label: 'Show Evaluator',
			accelerator: 'CmdOrCtrl+Space',
			click: () => {
				initiateShowModal();
			},
		},
		{
			label: 'Quit',
			accelerator: 'CmdOrCtrl+Q',
			click: () => {
				app.quit();
			},
		},
	]));

	tray.on('click', initiateShowModal);
}

app.on('ready', () => {
	createModal();
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
