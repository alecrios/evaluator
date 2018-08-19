const {app, BrowserWindow, globalShortcut} = require('electron');
const Store = require('./js/Store.js');
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

	win = new BrowserWindow({width, height, x, y, show: false});

	win.once('ready-to-show', () => win.show());

	win.on('resize', () => {
		let bounds = win.getBounds();
		windowSettings.set('width', bounds.width);
		windowSettings.set('height', bounds.height);
	});

	win.on('move', () => {
		let position = win.getPosition();
		windowSettings.set('x', position[0]);
		windowSettings.set('y', position[1]);
	});

	win.on('closed', () => win = null);

	win.loadFile('index.html');

	globalShortcut.register('CommandOrControl+X', () => {
		win.focus();
	});
};

app.on('ready', () => {
	createWindow();
});

app.on('will-quit', () => {
	globalShortcut.unregisterAll();
});
