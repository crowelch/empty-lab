var cron = require('cron-scheduler');
var gpio = require('pi-gpio');
var _ = require('lodash');
var cronstuff = require('./cron');
var rooms = require('./rooms').rooms;

const HIGH = 1;
const LOW = 0;

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

var cronObject = {
	timezone: 'America/New_York',
	on: '*/1 * * * *',
	name: 'update-leds'
};

cron(cronObject, function() {
	console.log('cron started', Date.now());

	_.forEach(rooms, function(room) {
		var roomData = mapRoomToPin[room.number];

		console.log(roomData);

		if(room.status && (roomData.value !==	HIGH)) {
			writeToPin(roomData.pin, HIGH);
		} else if(roomData.value !== LOW) {
			writeToPin(roomData.pin, LOW);
		}
	});

	console.log('cron finished', Date.now());
});

function writeToPin(pin, value) {
	closePinIfOpen(roomData.pin, roomData.isOpen).then(function() {
		gpio.open(pin, 'output', function(err) {
			gpio.write(pin, value, function() {});
		});
	});
}

function closePinIfOpen(pin, isOpen) {
	if(isOpen) {
		gpio.close(pin);
	}

	Promise.resolve();
}

console.log('pi started!');
