var cron = require('cron-scheduler');
var gpio = require('pi-gpio');
var async = require('async');
var cronstuff = require('./cron');
var utils = require('./utils');

const HIGH = 1;
const LOW = 0;
const BUSY = true;
const FREE = false;
const OUTPUT = 'output';

//Object containing gpio pin, current value, and open status for the rooms
var mapRoomToPin = {
	'533': {
		openPin: 22,
		busyPin: 26,
		value: LOW,
		isOpen: false,
		isBusy: false
	},
	'537': {
		openPin: 18,
		busyPin: 24,
		value: LOW,
		isOpen: false,
		isBusy: false
	},
	'548': {
		openPin: 16,
		busyPin: 23,
		value: LOW,
		isOpen: false,
		isBusy: false
	},
	'550': {
		openPin: 15,
		busyPin: 21,
		value: LOW,
		isOpen: false,
		isBusy: false
	}
};

var pins = {
	'22': {
		isHigh: false,
		isOpen: false
	},
	'26': {
		isHigh: false,
		isOpen: false
	},
	'18': {
		isHigh: false,
		isOpen: false
	},
	'24': {
		isHigh: false,
		isOpen: false
	},
	'16': {
		isHigh: false,
		isOpen: false
	},
	'23': {
		isHigh: false,
		isOpen: false
	},
	'15': {
		isHigh: false,
		isOpen: false
	},
	'21': {
		isHigh: false,
		isOpen: false
	}
}

// Settings for cron
var cronObject = {
	timezone: 'America/New_York',
	on: '*/1 * * * *',
	name: 'update-leds'
};

// Run cron job
cron(cronObject, function() {
	// Get latest room data
	utils.getRooms().then(function(rooms) {
		console.log('rooms: ');
		console.dir(rooms);

		// Asynchronously update each room's status
		async.each(rooms, function(room) {
			console.log('room: ');
			console.dir(room);

			var roomData = mapRoomToPin[room.number];

			console.log('roomdata: ');
			console.dir(roomData);

			// Check status and call function to write to pins
			console.log('room status: ', room.status);
			console.log('room value: ', roomData.value);
			if(room.status && !pins[roomData.busyPin].isHigh) {
				console.log('writing high to ' + roomData.busyPin);
				writeToPins(roomData, BUSY);
			} else if(!pins[roomData.openPin].isHigh) {
					writeToPins(roomData, FREE);
			}
		}, function(err) {
			if(err) {
				console.log('pi.js async.each error: ' + err);
			}
		});
	});
});

// determine which pins to write to based on bust state of the room
function writeToPins(roomData, value) {
	if(value) {
		//write high to busy, low to open
		writeHigh(roomData.busyPin);
		writeLow(roomData.openPin);
	} else {
		// write high to open, low to busy
		writeHigh(roomData.openPin);
		writeLow(roomData.busyPin);
	}
}

// Write high to pin
function writeHigh(pin) {
	gpioClose(pin).then(function () {
		return gpioOpen(pin);
	}).then(function() {
		gpioWrite(pin, HIGH);
	});
}

// Write low to pin
function writeLow(pin) {
	gpioOpen(pin).then(function() {
		gpioWrite(pin, LOW);
	});
}

function gpioOpen(pin) {
	return new Promise(function(resolve) {
		gpio.open(pin, OUTPUT, function(err) {
				if(err) {
					console.log('open error:');
					console.log(err);
				}
				console.log('done opening ', pin);
				resolve();
		});
	});
}

function gpioClose(pin) {
	return new Promise(function(resolve) {
		gpio.close(pin, function(err) {
			if(err) {
				console.log('close error:');
				console.log(err);
			}

			resolve();
		});
	});
}

function gpioWrite(pin, value) {
	gpio.write(pin, value, function(err) {
		if(err) {
			console.log('write error:');
			console.log(err);
		} else {
			savePinState(pin, value);
		}
	});
}

// Save pin state
function savePinState(pin, value) {
	console.log('pin:', pin);
	console.log(typeof pin);
	console.log(typeof pins[pin]);
	console.log(pins[pin]);

	if(value === HIGH) {
		pins[pin].isHigh = true;
	} else {
		pins[pin].isHigh = false;
	}
}

// Check if a pin is open, if so close it...?
function closePinIfOpen(roomData, isOpen) {
	if(isOpen) {
		gpio.close(roomData.pin);
		roomData.isOpen = false;
		console.log('closing pin ' + roomData.pin);
	}

	return Promise.resolve();
}

console.log('pi started!');
