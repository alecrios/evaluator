const {app, BrowserWindow, ipcMain, globalShortcut} = require('electron');
const {autoUpdater} = require('electron-updater');
const isDev = require('electron-is-dev');
const Store = require('./lib/Store');

let modal = null;

const modalSettings = new Store({
	fileName: 'modalSettings',
	defaults: {
		width: 320,
		height: 160,
		x: null,
		y: null,
	},
});

const createModal = () => {
	const {width, height, x, y} = modalSettings.get();

	modal = new BrowserWindow({
		show: false,
		frame: false,
		backgroundColor: 'rgb(30, 31, 32)',
		skipTaskbar: true,
		alwaysOnTop: true,
		minWidth: 200,
		minHeight: 160,
		width,
		height,
		x,
		y,
	});

	const showModal = () => {
		modal.show();
		modal.setOpacity(1);
	};

	const hideModal = () => {
		modal.setOpacity(0);
		modal.webContents.send('willHideModal');
	};

	ipcMain.on('hideModal', () => {
		hideModal();
	});

	ipcMain.on('readyToHideModal', () => {
		modal.hide();
	});

	globalShortcut.register('CommandOrControl+Space', () => {
		!modal.isVisible() ? showModal() : hideModal();
	});

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
};

let win = null;

const windowSettings = new Store({
	fileName: 'windowSettings',
	defaults: {
		width: 320,
		height: 640,
		x: null,
		y: null,
	},
});

const createWindow = () => {
	const {width, height, x, y} = windowSettings.get();

	win = new BrowserWindow({
		show: false,
		title: 'Evaluator',
		titleBarStyle: 'hiddenInset',
		minWidth: 218,
		minHeight: 109,
		width,
		height,
		x,
		y,
	});

	win.setMenu(null);

	win.once('ready-to-show', () => win.show());

	win.on('resize', () => {
		const bounds = win.getBounds();
		windowSettings.set('width', bounds.width);
		windowSettings.set('height', bounds.height);
	});

	win.on('move', () => {
		const position = win.getPosition();
		windowSettings.set('x', position[0]);
		windowSettings.set('y', position[1]);
	});

	win.on('closed', () => {
		win = null;
	});

	win.loadFile('app/index.html');

	if (isDev) win.toggleDevTools();
};

app.on('ready', () => {
	createModal();

	if (process.platform === 'darwin') app.dock.hide();

	// if (!isDev) autoUpdater.checkForUpdates();
});

autoUpdater.on('update-downloaded', () => {
	win.webContents.send('updateReady');
});

ipcMain.on('quitAndInstall', () => {
	autoUpdater.quitAndInstall();
});

app.on('will-quit', () => {
	globalShortcut.unregisterAll();
});
