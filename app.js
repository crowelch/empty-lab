var cron = require('cron-scheduler');
var moment = require('moment');
var pasync = require('pasync');
var labSchedule = require('./labs');

var frequency = '*/5 * * * *'; // Every 5 minutes
var timezone = '';

cron({
	timezone: timezone,
	on: frequency,
	function() {

	}
});
