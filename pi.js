var cron = require('cron-scheduler');
var gpio = require('pi-gpio');
var _ = require('lodash');
var cronstuff = require('./cron');
var rooms = require('./rooms').rooms;

const HIGH = 1;
const LOW = 0;

var mapRoomToPin = {
	'533': 0,
	'537': 1,
	'548': 4,
	'550': 14
};

var cronObject = {
	timezone: 'America/New_York',
	on: '*/1 * * * *',
	name: 'update-leds'
};

cron(cronObject, function() {
	console.log('cron started', Date.now());

	_.forEach(rooms, function(room) {
		if(room.status) {
			writeToPin(mapRoomToPin[room.number], HIGH);
		} else {
			writeToPin(mapRoomToPin[room.number], LOW);
		}
	});

	console.log('cron finished', Date.now());
});

function writeToPin(pin, value) {
	gpio.open(pin, 'output', function(err) {
		gpio.write(pin, value, function() {
			gpio.close(pin);
		});
	});
}

console.log('pi started!');
