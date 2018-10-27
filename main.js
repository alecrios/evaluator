const {app, BrowserWindow, ipcMain, globalShortcut} = require('electron');
const {autoUpdater} = require('electron-updater');
const isDev = require('electron-is-dev');
const Store = require('./lib/Store');

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

	globalShortcut.register('CommandOrControl+Space', () => {
		win.isFocused() ? win.blur() : win.focus();
	});

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
	createWindow();

	if (!isDev) autoUpdater.checkForUpdates();
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
