var cron = require('cron-scheduler');

var frequency = '*/5 * * * *'; // Every 5 minutes
var timezone = '';

cron({
	timezone: timezone,
	on: frequency,
	function() {

	}
});
