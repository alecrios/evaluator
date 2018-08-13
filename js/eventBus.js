class EventBus {
	constructor() {
		this.events = {};
	}

	addEventListener(event, callback) {
		this.events[event] = callback;
	}

	dispatchEvent(event, data) {
		this.events[event](data);
	}
}

module.exports = new EventBus();
