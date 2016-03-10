var fs = require('fs');

var defaultRooms={"rooms":[{"number":"533","status":false},{"number":"537","status":false},{"number":"548","status":false},{"number":"550","status":false}]};

// var defaultRooms = {
// 	rooms: [{
// 		number: 533,
// 		status: false
// 	},{
// 		number: 537,
// 		status: false
// 	},{
// 		number: 548,
// 		status: false
// 	},{
// 		number: 550,
// 		status: false
// 	}]
// }

exports.getRooms = function() {
	return new Promise(function(resolve) {
		fs.readFile('./rooms.json', 'utf-8', function(err, data) {
			if(err) {
				console.log('error reading rooms.json: ' + err);
				data = JSON.parse(defaultRooms);
			}

			// Clean up the raw data by parsing it as JSON from a string, and returnjust the rooms array
			var cleanData = JSON.parse(data).rooms;

			console.log('cleanData:');
			console.dir(cleanData);

			resolve(cleanData);
		});
	});
}
