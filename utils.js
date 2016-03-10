var fs = require('fs');
var Promise = require('es6-promise').Promise;

var defaultRooms = {
	rooms: [{
		number: 533,
		status: false
	},{
		number: 537,
		status: false
	},{
		number: 548,
		status: false
	},{
		number: 550,
		status: false
	}]
}

exports.getRooms = function() {
	return new Promise(function(resolve) {
		fs.readFile('./rooms.json', 'utf-8', function(err, data) {
			if(err) {
				console.log(err);
				data = defaultRooms;
			}

			resolve(data);
		});
	});
}
