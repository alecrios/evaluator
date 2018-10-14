const electron = require('electron');
const path = require('path');
const fs = require('fs');

module.exports = class Store {
	constructor(options) {
		const userDataPath = (electron.app || electron.remote.app).getPath('userData');
		this.path = path.join(userDataPath, `${options.fileName}.json`);
		this.data = this.parse(this.path, options.defaults);
	}

	parse(filePath, defaults) {
		try {
			return JSON.parse(fs.readFileSync(filePath));
		} catch(error) {
			return defaults;
		}
	}

	get(key) {
		return key ? this.data[key] : this.data;
	}

	set(key, value) {
		this.data[key] = value;
		fs.writeFileSync(this.path, JSON.stringify(this.data));
	}
}
