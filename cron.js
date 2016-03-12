var cron = require('cron-scheduler');
var moment = require('moment');
var async = require('async');
var _ = require('lodash');
var fs = require('fs');
var labSchedule = require('./labs');

const ROOM_FILE = 'rooms.json';
const RED = 'Red';
const GREEN = 'Green';

// Initialize roomObject
var roomObject = {
	rooms: []
};

// Settings for cron
var cronObject = {
	timezone: 'America/New_York',
	on: '*/1 * * * *',
	name: 'lab-update'
};

// Run cron job
cron(cronObject, function() {
	roomObject.rooms = [];

	// Asynchronously update each room. Order not guaranteed
	async.each(labSchedule.labs, updateRooms, function(err) {
		if(err) {
			console.log('cron async.each error: ' + err);
		}
		writeRoomToFile();
	});
});

// Write completed roomObject to rooms.json
function writeRoomToFile() {
	fs.writeFile(ROOM_FILE, JSON.stringify(roomObject), function(error) {
		if(error) {
			console.log(error);
		}
	});
}

// Add a room's data to roomObject
function addRoom(roomNumber, status) {
	console.log(roomNumber, status);
	roomObject.rooms.push({
		number: roomNumber,
		status: status
	});
}

// Handy abstraction to addRoom to call from the cron job
function updateRooms(room) {
	// console.log(room, isRoomBusy(room));
	addRoom(room.number, isRoomBusy(room));
}

// Return whether a room is busy (true) or not (false)
function isRoomBusy(room) {
	return !_.isEmpty(_.filter(room.busyTimes, isClassInSession));
}

// Check if a class is happenning now
function isClassInSession(time) {
	if(isToday(time.dayOfWeek)) {
		return classHasStarted(time.start) && !classHasEnded(time.end);
	} else {
		return false;
	}
}

// Check if a class is today
function isToday(day) {
	return moment().isSame(moment().day(day), 'day');
}

// Check if the start time of a class has passed
function classHasStarted(startTime) {
	return moment().isSameOrAfter(moment(startTime, 'HH:mm'));
}

// Check if a class end time has passed
function classHasEnded(endTime) {
	return !moment().isSameOrBefore(moment(endTime, 'HH:mm'));
}

// Alert the user the cron job is running
console.log('empty-lab cron.js has started!');
