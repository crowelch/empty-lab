var cron = require('cron-scheduler');
var moment = require('moment');
var pasync = require('pasync');
var _ = require('lodash');
var fs = require('fs');
var labSchedule = require('./labs');

const RED = 'Red';
const GREEN = 'Green';

var roomObject = {
	rooms: []
};

var cronObject = {
	timezone: 'America/New_York',
	on: '*/1 * * * *',
	name: 'lab-update'
};

cron(cronObject, function() {
	pasync.each(labSchedule.labs, updateRooms).then(function() {
		writeRoomToFile();
	});
});

function writeRoomToFile() {
	fs.writeFile('rooms.json', JSON.stringify(roomObject), function(error) {
		if(error) {
			console.log(error);
		}
	});
}

function addRoom(roomNumber, status) {
	roomObject.rooms.push({
		number: roomNumber,
		status: status
	});
	console.log(roomNumber, status);
}

function updateRooms(room) {
	if(isRoomBusy(room)) {
		addRoom(room.room, RED);
		console.log(room.room, RED)
	} else {
		addRoom(room.room, GREEN);
		console.log(room.room, GREEN)
	}
}

function isRoomBusy(room) {
	return !_.isEmpty(_.filter(room.busyTimes, isClassInSession));
}

function isClassInSession(time) {
	if(isToday(time.dayOfWeek)) {
		return classHasStarted(time.start) && !classHasEnded(time.end);
	} else {
		return false;
	}
}

function isToday(day) {
	return moment().isSame(moment().day(day), 'day');
}

function classHasStarted(startTime) {
	return moment().isSameOrAfter(moment(startTime, 'HH:mm'));
}

function classHasEnded(endTime) {
	return !moment().isSameOrBefore(moment(endTime, 'HH:mm'));
}

console.log('empty-lab started!');
