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
		value: 0
	}
	'537': {
		pin: 18,
		value: 0
	},
	'548': {
		pin: 16,
		value: 0
	},
	'550': {
		pin: 15,
		value: 0
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
		console.log(mapRoomToPin[room.number].pin);
		if(room.status && (mapRoomToPin[room.number].value !==	HIGH) {
			writeToPin(mapRoomToPin[room.number].pin, HIGH);
		} else if(mapRoomToPin[room.number].value !== LOW) {
			writeToPin(mapRoomToPin[room.number].pin, LOW);
		}
	});

	console.log('cron finished', Date.now());
});

function writeToPin(pin, value) {
	gpio.close(pin);
	gpio.open(pin, 'output', function(err) {
		gpio.write(pin, value, function() {
			// gpio.close(pin);
		});
	});
}

console.log('pi started!');
