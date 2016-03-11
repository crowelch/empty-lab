var gpio = require('pi-gpio');
var async = require('async');

const gpios = [22, 26, 18, 24, 16, 23, 15, 21];

async.each(gpios, function(pin) {
  gpio.close(pin);
});
