const {app, BrowserWindow, globalShortcut} = require('electron');
const url = require('url');
const path = require('path');

let win = null;

const createWindow = () => {
	win = new BrowserWindow({
		show: false,
		width: 320,
		height: 480,
	});

	win.once('ready-to-show', () => {win.show()})

	win.loadFile('index.html');

	win.on('closed', () => {win = null});
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
