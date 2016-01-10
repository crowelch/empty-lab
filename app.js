var cron = require('cron-scheduler');
var moment = require('moment');
var pasync = require('pasync');
var _ = require('lodash');
var labSchedule = require('./labs');

var cronObject = {
	timezone: 'America/New_York',
	on: '*/1 * * * *',
	name: 'lab-update'
};

cron(cronObject, function() {
	pasync.each(labSchedule.labs, updateRooms);
});

function updateRooms(room) {
	if(isRoomBusy(room)) {
		console.log(room.room, 'red')
	} else {
		console.log(room.room, 'green')
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
