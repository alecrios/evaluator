const electron = require('electron');
const path = require('path');
const fs = require('fs');

module.exports = class Store {
	constructor(options) {
		const userDataPath = (electron.app || electron.remote.app).getPath('userData');
		this.path = path.join(userDataPath, `${options.fileName}.json`);
		this.defaults = options.defaults;
		this.data = this.parse();
	}

	parse() {
		try {
			return JSON.parse(fs.readFileSync(this.path));
		} catch (error) {
			return this.defaults;
		}
	}

	get(key) {
		return key ? this.data[key] : this.data;
	}

	set(key, value) {
		this.data[key] = value;
		fs.writeFileSync(this.path, JSON.stringify(this.data));
	}
};
