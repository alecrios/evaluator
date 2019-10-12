const { app, BrowserWindow, ipcMain, globalShortcut, Menu, Tray } = require('electron');
const path = require('path');

let modal = null;
let modalStatus = 'hidden';
let tray = null;

function createModal() {
	const size = { width: 384, height: 128 };

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
		backgroundColor: '#1d1e21',
		opacity: 0,
		webPreferences: { nodeIntegration: true },
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

	globalShortcut.register('Alt+Space', toggleModal);

	app.on('activate', () => {
		initiateShowModal();
	});

	function destroyModal() {
		modal = null;
	}

	modal.on('closed', destroyModal);

	modal.loadFile('app/modal.html');

	if (app.dock) app.dock.hide();

	const iconFile = process.platform === 'darwin' ? 'iconTemplate.png' : 'iconTemplate.ico';
	const iconPath = path.join(app.getAppPath(), 'assets', iconFile);
	tray = new Tray(iconPath);

	tray.setToolTip('Evaluator');

	tray.setContextMenu(Menu.buildFromTemplate([
		{
			label: 'Show Evaluator',
			accelerator: 'CmdOrCtrl+Space',
			click: () => {
				initiateShowModal();
			},
		},
		{
			label: 'Quit Evaluator',
			accelerator: 'CmdOrCtrl+Q',
			click: () => {
				app.quit();
			},
		},
	]));

	tray.on('click', initiateShowModal);

	const template = [
		{
			label: 'Application',
			submenu: [
				{
					label: 'Quit Evaluator',
					accelerator: 'CmdOrCtrl+Q',
					click: () => {
						app.quit();
					},
				},
			],
		},
		{
			label: 'Edit',
			submenu: [
				{
					label: 'Undo',
					accelerator: 'CmdOrCtrl+Z',
					selector: 'undo:',
				},
				{
					label: 'Redo',
					accelerator: 'Shift+CmdOrCtrl+Z',
					selector: 'redo:',
				},
				{
					type: 'separator',
				},
				{
					label: 'Cut',
					accelerator: 'CmdOrCtrl+X',
					selector: 'cut:',
				},
				{
					label: 'Copy',
					accelerator: 'CmdOrCtrl+C',
					selector: 'copy:',
				},
				{
					label: 'Paste',
					accelerator: 'CmdOrCtrl+V',
					selector: 'paste:',
				},
				{
					label: 'Select All',
					accelerator: 'CmdOrCtrl+A',
					selector: 'selectAll:',
				},
			],
		},
	];

	Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.on('ready', () => {
	createModal();
});

app.on('will-quit', () => {
	globalShortcut.unregisterAll();
});
