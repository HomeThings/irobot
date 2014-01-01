// similar to test.js, but connects to this IP address

var irobot  = require('./index')
  , ipaddr  = '192.168.1.63'
  ;

irobot.roowifi.RooWifi({ ipaddr: ipaddr }, function(err, options) {
  if (!!err) return console.log(err);

  var robot = new irobot.Robot('tcp', options);

  robot.on('ready', function () {
    console.log('READY');
    setTimeout(function() { robot.demo(irobot.demos.Mouse); }, 1000);
  });

/*
   robot.on('sensordata', function (data) {
     console.log('SENSOR DATA', data);
   });
 */

  robot.on('bump', function (e) { console.log('BUMP', e); });
  robot.on('button', function (e) { console.log('BUTTON', e); });
  robot.on('cliff', function (e) { console.log('CLIFF', e); });
  robot.on('ir', function (e) { console.log('IR', e); });
  robot.on('mode', function (e) { console.log('MODE', e); });
  robot.on('overcurrent', function (e) { console.log('OVERCURRENT', e); });
  robot.on('virtualwall', function (e) { console.log('VIRTUALWALL', e); });
  robot.on('wall', function (e) { console.log('WALL', e); });
  robot.on('wheeldrop', function (e) { console.log('WHEELDROP', e); });
});
