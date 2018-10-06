class CommandBus {
	constructor() {
		this.commands = {};
	}

	subscribe(command, callback) {
		this.commands[command] = callback;
	}

	publish(command, data) {
		this.commands[command](data);
	}
}

module.exports = new CommandBus();
