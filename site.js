var fs = require('fs');
var http = require('http');
var Handlebars = require('handlebars');
var cron = require('./cron');

const PORT = 3000;
const source = '<table>{{#each rooms}}<tr><td>{{number}}</td><td>{{status}}</td></tr>{{/each}}</table>';

function getRooms(cb) {
	fs.readFile('./rooms.json', 'utf-8', function(err, data) {
		if(err) {
			throw err;
		}

		getTemplate(JSON.parse(data), cb);
	});
}

function getTemplate(rooms, cb) {
	var template = Handlebars.compile(source);
	var html = template(rooms);

	cb(html);
}

function handleRequest(request, response) {
	getRooms(function(html) {
		response.write(html);
		response.end();
	});
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
    console.log("Serving lab info on: http://localhost:%s", PORT);
});
