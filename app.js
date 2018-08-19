const {app, BrowserWindow, globalShortcut} = require('electron');
const Store = require('./js/Store.js');
let win = null;

const settings = new Store({
	fileName: 'settings',
	defaults: {
		windowBounds: {
			width: 800,
			height: 600,
		},
		windowPosition: {
			x: null,
			y: null,
		},
	},
});

const createWindow = () => {
	const windowBounds = settings.get('windowBounds');
	const windowPosition = settings.get('windowPosition');

	win = new BrowserWindow({
		width: windowBounds.width,
		height: windowBounds.height,
		x: windowPosition.x,
		y: windowPosition.y,
		show: false,
	});

	win.once('ready-to-show', () => win.show());

	win.on('resize', () => {
		let {width, height} = win.getBounds();
		settings.set('windowBounds', {width, height})
	});

	win.on('move', () => {
		let position = win.getPosition();
		settings.set('windowPosition', {x: position[0], y: position[1]})
	});

	win.on('closed', () => win = null);

	win.loadFile('index.html');
};

app.on('ready', () => {
	createWindow();

	globalShortcut.register('CommandOrControl+X', () => {
		win.focus();
	});
});

app.on('will-quit', () => {
	globalShortcut.unregisterAll();
});
