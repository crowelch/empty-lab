var cron = require('cron-scheduler');
var gpio = require('pi-gpio');
var async = require('async');
var cronstuff = require('./cron');
var utils = require('./utils');

const HIGH = 1;
const LOW = 0;

//Object containing gpio pin, current value, and open status for the rooms
var mapRoomToPin = {
	'533': {
		pin: 22,
		value: LOW,
		isOpen: false
	},
	'537': {
		pin: 18,
		value: LOW,
		isOpen: false
	},
	'548': {
		pin: 16,
		value: LOW,
		isOpen: false
	},
	'550': {
		pin: 15,
		value: LOW,
		isOpen: false
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
		//TODO: Replace with async.each?

		async.each(rooms, function(room) {
			console.log('room: ');
			console.dir(room);

			var roomData = mapRoomToPin[room.number];

			console.log('roomdata: ');
			console.dir(roomData);

			// Check status and call function to write to pins
			console.log('room status: ', room.status);
			console.log('room value: ', roomData.value);
			if(room.status && (roomData.value !==	HIGH)) {
				console.log('writing high to ' + roomData.pin);
				writeToPin(roomData.pin, HIGH);
			} else { //if(roomData.value !== LOW) {
				console.log('writing low to ' + roomData.pin);
				writeToPin(roomData.pin, LOW);
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
function writeToPin(pin, value) {
	closePinIfOpen(roomData.pin, roomData.isOpen).then(function() {
		console.log('Opening pin ' + pin);
		gpio.open(pin, 'output', function(err) {
			gpio.write(pin, value, function() {});
		});
	});
}

// Check if a pin is open, if so close it...?
function closePinIfOpen(pin, isOpen) {
	if(isOpen) {
		gpio.close(pin);
		console.log('closing pin ' + pin);
	}

	return Promise.resolve();
}

console.log('pi started!');
