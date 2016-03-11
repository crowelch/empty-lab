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
		pin: 18,
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
		pin: 15,
		value: LOW,
		isOpen: false,
		isBusy: false
	}
};

// Settings for cron
var cronObject = {
	timezone: 'America/New_York',
	on: '*/1 * * * *',
	name: 'update-leds'
};

// Run cron job
cron(cronObject, function() {
	console.log('cron started', Date.now());

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
			if(room.status) { // && (roomData.value !==	HIGH)) {
				console.log('writing high to ' + roomData.busyPin);
				writeToPins(roomData, BUSY);
				} else { //if(roomData.value !== LOW) {
				writeToPins(roomData, FREE);
			}
		}, function(err) {
			if(err) {
				console.log('pi.js async.each error: ' + err);
			}
		});
	});

	console.log('cron finished', Date.now());
});

// Write to gpio pins
// function writeToPin(roomData, value) {
// 	closePinIfOpen(roomData, roomData.isOpen).then(function() {
// 		console.log('Opening pin ' + roomData.pin);
// 		gpio.open(roomData.pin, 'output', function(err) {
// 			roomData.isOpen = true;
// 			gpio.write(roomData.pin, value, function() {});
// 		});
// 	});
// }

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
	gpioOpen(pin)
		.then(gpioWrite(pin, HIGH));
}

// Write low to pin
function writeLow(pin) {
	gpioOpen(pin)
		.then(gpioWrite(pin, LOW));
}

function gpioOpen(pin) {
	return new Promise(function(resolve) {
		gpio.close(pin);
		gpio.open(pin, OUTPUT, function(err) {
				if(err) {
					console.log(err);
				}

				resolve();
		});
	});
}

function gpioWrite(pin, value) {
	gpio.write(pin, value, function(err) {
		if(err) {
			console.log(err);
		}
	});
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
