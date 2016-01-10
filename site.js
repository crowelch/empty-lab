var http = require('http');
var Handlebars = require('handlebars');
var cron = require('./cron');
var rooms = require('./rooms');
const PORT = 3000;

const source = '<table>{{#each rooms}}<tr><td>{{number}}</td><td>{{status}}</td></tr>{{/each}}</table>';

var template = Handlebars.compile(source);
var html = template(rooms);

function handleRequest(request, response) {
	response.write(html);
	response.end();
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
    console.log("Serving lab info on: http://localhost:%s", PORT);
});
